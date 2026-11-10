import 'server-only'

import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'leaf_admin_session'
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60

type AdminSessionPayload = {
  v: 1
  iat: number
  exp: number
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function adminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret())
}

export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false

  const candidateHash = createHash('sha256').update(candidate).digest()
  const expectedHash = createHash('sha256').update(expected).digest()
  return timingSafeEqual(candidateHash, expectedHash)
}

function sign(value: string): string {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url')
}

export function createAdminSessionToken(): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSessionPayload = {
    v: 1,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !sessionSecret()) return false

  const [encoded, signature, extra] = token.split('.')
  if (!encoded || !signature || extra) return false

  const expected = sign(encoded)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length) return false
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return false

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as Partial<AdminSessionPayload>
    return (
      payload.v === 1 &&
      typeof payload.exp === 'number' &&
      payload.exp > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}

export function isAdminAuthenticated(): boolean {
  if (!adminAuthConfigured()) return false
  return verifyAdminSessionToken(cookies().get(ADMIN_COOKIE)?.value)
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  }
}

/**
 * Browsers send Origin on state-changing requests. Reject anything that did not
 * originate from this site; non-browser clients (curl, server jobs) have no
 * Origin header and are allowed through if they already hold the session.
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
