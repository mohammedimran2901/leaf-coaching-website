/**
 * Signed, time-limited download links for paid digital products.
 *
 * The token is `base64url(orderId.productId.expiry).hmac`. It is only issued
 * after a verified PayPal capture, and the PDF itself lives outside /public so
 * it cannot be fetched without a valid token.
 */

import crypto from 'crypto'

export const DOWNLOAD_LINK_DAYS = 7

export interface DownloadToken {
  orderId: string
  productId: string
  expiresAt: string
  token: string
}

function signingSecret(): string | null {
  return (
    process.env.DOWNLOAD_SIGNING_SECRET ||
    process.env.PAYPAL_CLIENT_SECRET ||
    null
  )
}

export function isDownloadSigningConfigured(): boolean {
  return Boolean(signingSecret())
}

export function signDownloadToken(
  orderId: string,
  productId: string
): DownloadToken | null {
  const secret = signingSecret()
  if (!secret) return null

  const expiresAt = Date.now() + DOWNLOAD_LINK_DAYS * 24 * 60 * 60 * 1000
  const payload = `${orderId}.${productId}.${expiresAt}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')

  return {
    orderId,
    productId,
    expiresAt: new Date(expiresAt).toISOString(),
    token: `${Buffer.from(payload).toString('base64url')}.${signature}`,
  }
}

export function verifyDownloadToken(
  token: string
): { orderId: string; productId: string } | null {
  const secret = signingSecret()
  if (!secret || !token) return null

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return null

  const encodedPayload = token.slice(0, separator)
  const suppliedSignature = token.slice(separator + 1)

  let payload: string
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
  } catch {
    return null
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest()
  let supplied: Buffer
  try {
    supplied = Buffer.from(suppliedSignature, 'base64url')
  } catch {
    return null
  }

  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return null
  }

  const [orderId, productId, expiry] = payload.split('.')
  if (!orderId || !productId || !/^\d+$/.test(expiry ?? '')) return null
  if (Number(expiry) < Date.now()) return null

  return { orderId, productId }
}

/** The public origin used in download links, respecting Vercel's proxy. */
export function requestOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.replace(/\/+$/, '')
  if (configured) return configured

  const url = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || url.host
  const protocol =
    request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')

  return `${protocol}://${host}`
}
