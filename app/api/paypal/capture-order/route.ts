import { NextResponse } from 'next/server'
import { CheckoutError, validateCheckout } from '@/lib/checkout'
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

  const payload = body as { orderID?: unknown; items?: unknown; customer?: unknown }
  const orderID = typeof payload.orderID === 'string' ? payload.orderID : ''

  if (!/^[A-Z0-9]{6,32}$/i.test(orderID)) {
    return NextResponse.json(
      { error: 'That PayPal order reference is not valid.' },
      { status: 400 }
    )
  }

  try {
    const order = await capturePayPalOrder(orderID)
    const capture = order.purchase_units?.[0]?.payments?.captures?.[0]

    if (order.status !== 'COMPLETED' || capture?.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error:
            'PayPal did not complete the payment. Nothing has been taken — please try again.',
        },
        { status: 402 }
      )
    }

    const reference = order.purchase_units?.[0]?.custom_id || orderID
    const amount = capture.amount?.value ?? '0.00'
    const currency = capture.amount?.currency_code ?? 'GBP'

    // Re-validate the basket for the fulfilment notification. The capture has
    // already succeeded at this point, so a validation failure must never be
    // reported to the customer as a failed payment.
    let summary = ''
    let customer: unknown = null
    try {
      const checkout = validateCheckout({
        items: payload.items,
        customer: payload.customer,
      })
      summary = checkout.lines
        .map(({ product, quantity }) =>
          quantity > 1 ? `${quantity} x ${product.name}` : product.name
        )
        .join(', ')
      customer = checkout.customer
    } catch (error) {
      if (!(error instanceof CheckoutError)) throw error
      console.warn('[paypal] capture could not be matched to a catalogue item', {
        orderID,
        reason: error.message,
      })
    }

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
    })

    return NextResponse.json({
      id: order.id,
      status: order.status,
      reference,
      amount,
      currency,
      payerEmail: order.payer?.email_address ?? null,
      summary,
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
