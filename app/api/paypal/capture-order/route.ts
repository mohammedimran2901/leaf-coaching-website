import { NextResponse } from 'next/server'
import {
  CheckoutError,
  decodeBasket,
  describeLines,
  validateCheckout,
  type CheckoutLine,
} from '@/lib/checkout'
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal'
import {
  DOWNLOAD_LINK_DAYS,
  requestOrigin,
  signDownloadToken,
} from '@/lib/downloads'
import { escapeHtml, paragraphHtml, sendNotificationEmail } from '@/lib/email'
import { CURRENCY } from '@/lib/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface IssuedDownload {
  productId: string
  name: string
  url: string
  expiresAt: string
}

function issueDownloads(
  request: Request,
  orderId: string,
  lines: CheckoutLine[]
): IssuedDownload[] {
  const origin = requestOrigin(request)
  const seen = new Set<string>()
  const downloads: IssuedDownload[] = []

  for (const { product } of lines) {
    if (!product.digital || !product.download || seen.has(product.id)) continue
    seen.add(product.id)

    const signed = signDownloadToken(orderId, product.id)
    if (!signed) {
      console.error('[downloads] signing secret is not configured', {
        productId: product.id,
      })
      continue
    }

    downloads.push({
      productId: product.id,
      name: product.name,
      url: `${origin}/api/download?token=${encodeURIComponent(signed.token)}`,
      expiresAt: signed.expiresAt,
    })
  }

  return downloads
}

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: 'Payments are not configured on this site yet.' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'We could not read that payment.' },
      { status: 400 }
    )
  }

  const payload = body as {
    orderID?: unknown
    items?: unknown
    customer?: unknown
  }
  const orderID = typeof payload.orderID === 'string' ? payload.orderID : ''

  if (!/^[A-Z0-9]{6,32}$/i.test(orderID)) {
    return NextResponse.json(
      { error: 'That PayPal order reference is not valid.' },
      { status: 400 }
    )
  }

  try {
    const order = await capturePayPalOrder(orderID)
    const purchaseUnit = order.purchase_units?.[0]
    const capture = purchaseUnit?.payments?.captures?.[0]

    if (order.status !== 'COMPLETED' || capture?.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error:
            'PayPal did not complete the payment. Nothing has been taken — please try again.',
        },
        { status: 402 }
      )
    }

    // The basket was written onto the order at creation time. Prefer it over
    // anything the browser sends now, so downloads cannot be claimed for a
    // cheaper purchase.
    const customId = purchaseUnit?.custom_id || ''
    const [referencePart, basketPart] = customId.split('|')
    const orderLines = decodeBasket(basketPart)
    const reference = referencePart || orderID

    const amount = capture.amount?.value ?? '0.00'
    const currency = capture.amount?.currency_code ?? 'GBP'

    let checkout: ReturnType<typeof validateCheckout> | null = null
    let summary = ''
    let customer: unknown = null

    try {
      checkout = validateCheckout({
        items: orderLines
          ? orderLines.map(({ product, quantity }) => ({
              id: product.id,
              quantity,
            }))
          : payload.items,
        customer: payload.customer,
      })
      summary = describeLines(checkout.lines)
      customer = checkout.customer
    } catch (error) {
      if (!(error instanceof CheckoutError)) throw error
      console.warn('[paypal] capture could not be matched to a catalogue item', {
        orderID,
        customId,
        reason: error.message,
      })
    }

    // Never issue a download unless the money taken matches the catalogue
    // price for the basket recorded on the order.
    const paid = Number(amount)
    const amountVerified =
      checkout !== null &&
      currency === CURRENCY &&
      Number.isFinite(paid) &&
      Math.abs(paid - checkout.total) < 0.005

    if (!amountVerified) {
      console.warn('[paypal] captured amount did not match the basket', {
        orderID,
        customId,
        expected: checkout?.total ?? null,
        paid: amount,
        currency,
      })
    }

    const downloads =
      amountVerified && checkout
        ? issueDownloads(request, order.id, checkout.lines)
        : []

    const customerDetails =
      customer && typeof customer === 'object'
        ? (customer as Record<string, unknown>)
        : {}
    const customerName =
      typeof customerDetails.name === 'string' ? customerDetails.name : ''
    const customerEmail =
      typeof customerDetails.email === 'string' ? customerDetails.email : ''
    const customerPhone =
      typeof customerDetails.phone === 'string' ? customerDetails.phone : ''
    const customerNotes =
      typeof customerDetails.notes === 'string' ? customerDetails.notes : ''
    const payerEmail = order.payer?.email_address ?? ''

    const paymentRows: Array<[string, string]> = [
      ['Reference', reference || orderID],
      ['PayPal order', order.id],
      ['Amount', `${currency} ${amount}`],
      ['Items', summary || 'Could not match the order to the catalogue'],
      ['Name', customerName || '(Not supplied)'],
      ['Email', customerEmail || '(Not supplied)'],
      ['Phone', customerPhone || '(Not supplied)'],
      ['Notes', customerNotes || '(None)'],
      ['PayPal payer email', payerEmail || '(Not supplied)'],
      [
        'Downloads issued',
        downloads.length > 0
          ? downloads.map((download) => download.name).join(', ')
          : 'None',
      ],
    ]

    const paymentText = [
      'New payment received',
      '',
      ...paymentRows.map(([label, value]) => `${label}: ${value}`),
      '',
      ...downloads.map((download) => `${download.name}: ${download.url}`),
    ].join('\n')

    const paymentHtml = `
      <div style="font-family:Arial,sans-serif;color:#2B2622;line-height:1.6;max-width:720px">
        <h1 style="font-size:22px;margin:0 0 6px">New payment received</h1>
        <p style="margin:0 0 20px;color:#5C554D">A PayPal payment has been captured on the website.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
          ${paymentRows
            .map(
              ([label, value]) => `
                <tr>
                  <th align="left" valign="top" style="padding:10px 16px 10px 0;border-bottom:1px solid #e7dfd2;white-space:nowrap">${escapeHtml(label)}</th>
                  <td style="padding:10px 0;border-bottom:1px solid #e7dfd2">${paragraphHtml(value)}</td>
                </tr>`
            )
            .join('')}
        </table>
        ${
          downloads.length > 0
            ? `<p style="margin:20px 0 8px;font-weight:bold">Download links</p>
               <ul style="margin:0;padding-left:20px">
                 ${downloads
                   .map(
                     (download) =>
                       `<li><a href="${escapeHtml(download.url)}">${escapeHtml(download.name)}</a> (expires ${escapeHtml(download.expiresAt)})</li>`
                   )
                   .join('')}
               </ul>`
            : ''
        }
      </div>
    `

    const notificationSent = await sendNotificationEmail({
      subject: `New payment received — ${reference || orderID}`,
      text: paymentText,
      html: paymentHtml,
      replyTo: customerEmail || undefined,
    })

    const webhook = process.env.PAYMENT_NOTIFICATION_WEBHOOK
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'leaf-coaching-website',
            type: 'paypal.capture.completed',
            orderID,
            reference,
            amount,
            currency,
            summary,
            customer,
            downloads,
            capturedAt: new Date().toISOString(),
          }),
        })
      } catch (error) {
        // The payment succeeded; log the failed notification for follow-up.
        console.error('[paypal] fulfilment webhook failed', { orderID, error })
      }
    }

    console.info('[paypal] payment captured', {
      orderID,
      reference,
      amount,
      currency,
      summary,
      downloads: downloads.map((download) => download.productId),
      amountVerified,
      notificationSent,
    })

    return NextResponse.json({
      id: order.id,
      status: order.status,
      reference,
      amount,
      currency,
      payerEmail: order.payer?.email_address ?? null,
      summary,
      downloads,
      downloadLinkDays: DOWNLOAD_LINK_DAYS,
    })
  } catch (error) {
    console.error('[paypal] capture failed', { orderID, error })
    return NextResponse.json(
      {
        error:
          'We could not confirm the PayPal payment. If you were charged, email leafcoachingcic@gmail.com with your PayPal receipt and we will sort it straight away.',
      },
      { status: 502 }
    )
  }
}
