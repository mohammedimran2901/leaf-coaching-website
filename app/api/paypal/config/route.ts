import { NextResponse } from 'next/server'
import { payPalClientId, payPalEnvironment } from '@/lib/paypal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Returns the public client ID used by the PayPal browser SDK.
 *
 * Client IDs are public by design — they appear in every PayPal SDK URL — so
 * this endpoint is safe to expose. Serving the value from the server keeps the
 * browser and the API routes on the same PayPal app even when the
 * NEXT_PUBLIC_PAYPAL_CLIENT_ID build-time variable is missing or stale.
 */
export async function GET() {
  const clientId = payPalClientId()

  return NextResponse.json(
    {
      clientId: clientId ?? null,
      environment: payPalEnvironment(),
    },
    {
      status: clientId ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}
