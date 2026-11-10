import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  adminCookieOptions,
  createAdminSessionToken,
  isSameOriginRequest,
  passwordMatches,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 6
const attempts = new Map<string, { count: number; resetAt: number }>()

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: 'Staff login is not configured yet.' },
      { status: 503 },
    )
  }

  const key = clientKey(request)
  const now = Date.now()
  const record = attempts.get(key)
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429 },
    )
  }

  let password = ''
  try {
    const body = (await request.json()) as { password?: unknown }
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Please enter the staff password.' }, { status: 400 })
  }

  if (!passwordMatches(password)) {
    const current = record && record.resetAt > now ? record : { count: 0, resetAt: now + WINDOW_MS }
    attempts.set(key, { count: current.count + 1, resetAt: current.resetAt })
    return NextResponse.json({ error: 'That password is not correct.' }, { status: 401 })
  }

  attempts.delete(key)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), adminCookieOptions())
  return response
}
