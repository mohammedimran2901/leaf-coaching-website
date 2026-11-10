import { SITE_EMAIL } from './site'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_FROM = 'Leaf Coaching <onboarding@resend.dev>'

export interface NotificationEmail {
  subject: string
  text: string
  html: string
  replyTo?: string
}

export function notificationEmail(): string {
  const configured = process.env.NOTIFICATION_EMAIL?.trim()
  return configured || SITE_EMAIL
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function paragraphHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

/**
 * Sends an internal notification through Resend.
 *
 * Email is best-effort: a missing key or a provider outage must never stop a
 * contact enquiry or a completed payment from being accepted. The caller keeps
 * the submission in its server logs so it can still be followed up.
 */
export async function sendNotificationEmail(
  message: NotificationEmail
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    console.warn(
      '[email] RESEND_API_KEY is not configured; notification was not sent',
      {
        to: notificationEmail(),
        subject: message.subject,
        text: message.text,
      }
    )
    return false
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM?.trim() || DEFAULT_FROM,
        to: [notificationEmail()],
        subject: message.subject,
        text: message.text,
        html: message.html,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('[email] Resend rejected the notification', {
        status: response.status,
        detail: detail.slice(0, 500),
        subject: message.subject,
      })
      return false
    }

    return true
  } catch (error) {
    console.error('[email] notification failed', {
      subject: message.subject,
      error,
    })
    return false
  }
}
