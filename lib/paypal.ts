/**
 * Minimal, dependency-free PayPal REST client.
 *
 * Uses the Orders v2 API (create + capture) with the client-credentials flow.
 * All amounts are recalculated server-side in `app/api/paypal/create-order`.
 */

const SANDBOX_API = 'https://api-m.sandbox.paypal.com'
const LIVE_API = 'https://api-m.paypal.com'

export interface PayPalItem {
  name: string
  description: string
  sku?: string
  quantity: number
  unitAmount: number
}

export interface PayPalCustomer {
  name: string
  email: string
  phone?: string
  notes?: string
}

export interface PayPalOrder {
  id: string
  status: string
  payer?: {
    email_address?: string
    name?: { given_name?: string; surname?: string }
  }
  purchase_units?: Array<{
    reference_id?: string
    custom_id?: string
    payments?: {
      captures?: Array<{
        id: string
        status: string
        amount?: { currency_code: string; value: string }
      }>
    }
  }>
  links?: Array<{ href: string; rel: string; method: string }>
}

export function payPalEnvironment(): 'sandbox' | 'live' {
  return process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox'
}

export function payPalClientId(): string | undefined {
  // Prefer the server credential: it is the ID paired with
  // PAYPAL_CLIENT_SECRET. The public build-time value is only a fallback, so a
  // missing or stale NEXT_PUBLIC_* value cannot pair the browser with a
  // different PayPal app than the one used to create and capture orders.
  return (
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  )
}

export function isPayPalConfigured(): boolean {
  return Boolean(payPalClientId() && process.env.PAYPAL_CLIENT_SECRET)
}

function apiBase(): string {
  return payPalEnvironment() === 'live' ? LIVE_API : SANDBOX_API
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value
  }

  const clientId = payPalClientId()
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal is not configured')
  }

  const response = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`PayPal authentication failed (${response.status}): ${detail}`)
  }

  const data = (await response.json()) as {
    access_token: string
    expires_in: number
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}

async function payPalFetch<T>(path: string, init: RequestInit): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    const message =
      (data as { message?: string; details?: Array<{ description?: string }> })
        .message ||
      (data as { details?: Array<{ description?: string }> }).details?.[0]
        ?.description ||
      'PayPal request failed'
    throw new Error(`PayPal ${response.status}: ${message}`)
  }

  return data as T
}

export interface CreatePayPalOrderInput {
  items: PayPalItem[]
  total: number
  reference: string
  /** Reference + compact basket, stored on the order for fulfilment. */
  customId?: string
  customer: PayPalCustomer
  requiresShipping: boolean
  /** Set for the SDK-free redirect flow. */
  returnUrl?: string
  cancelUrl?: string
}

export async function createPayPalOrder(
  input: CreatePayPalOrderInput
): Promise<PayPalOrder> {
  const itemTotal = input.items.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0
  )

  // PayPal requires item totals to match the amount exactly. We send the
  // server-calculated total and a breakdown built from the same numbers.
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: input.reference,
        custom_id: (input.customId || input.reference).slice(0, 127),
        description: 'Leaf Coaching CIC — coaching, community and books'
          .slice(0, 127),
        amount: {
          currency_code: 'GBP',
          value: input.total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'GBP',
              value: itemTotal.toFixed(2),
            },
          },
        },
        items: input.items.map((item) => ({
          name: item.name.slice(0, 127),
          description: item.description.slice(0, 127),
          sku: item.sku?.slice(0, 127),
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: 'GBP',
            value: item.unitAmount.toFixed(2),
          },
        })),
      },
    ],
    application_context: {
      brand_name: 'Leaf Coaching CIC',
      locale: 'en-GB',
      landing_page: 'NO_PREFERENCE',
      shipping_preference: input.requiresShipping ? 'GET_FROM_FILE' : 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      ...(input.returnUrl ? { return_url: input.returnUrl } : {}),
      ...(input.cancelUrl ? { cancel_url: input.cancelUrl } : {}),
    },
  }

  return payPalFetch<PayPalOrder>('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalOrder> {
  return payPalFetch<PayPalOrder>(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',
      body: '{}',
    }
  )
}
