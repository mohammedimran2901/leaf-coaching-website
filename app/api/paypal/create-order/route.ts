import { NextResponse } from 'next/server'
import {
  CheckoutError,
  describeLines,
  orderReference,
  validateCheckout,
} from '@/lib/checkout'
import {
  createPayPalOrder,
  isPayPalConfigured,
  payPalEnvironment,
} from '@/lib/paypal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NOT_CONFIGURED =
  'Card payments are not switched on yet. Email hello@leafcoaching.com and we will arrange payment directly.'

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'We could not read that checkout request.' },
      { status: 400 }
    )
  }

  try {
    const checkout = validateCheckout(body)
    const reference = orderReference()

    const order = await createPayPalOrder({
      items: checkout.items,
      total: checkout.total,
      reference,
      customer: checkout.customer,
      requiresShipping: checkout.requiresShipping,
    })

    console.info('[paypal] order created', {
      orderId: order.id,
      reference,
      environment: payPalEnvironment(),
      items: describeLines(checkout.lines),
      total: checkout.total.toFixed(2),
    })

    return NextResponse.json({
      id: order.id,
      reference,
      total: checkout.total,
    })
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('[paypal] create order failed', error)
    return NextResponse.json(
      {
        error:
          'We could not start the PayPal payment. Please try again, or email hello@leafcoaching.com.',
      },
      { status: 502 }
    )
  }
}
