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
          'We could not confirm the PayPal payment. If you were charged, email hello@leafcoaching.com with your PayPal receipt and we will sort it straight away.',
      },
      { status: 502 }
    )
  }
}
