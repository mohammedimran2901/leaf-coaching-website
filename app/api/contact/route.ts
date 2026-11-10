import { NextResponse } from 'next/server'
import { escapeHtml, paragraphHtml, sendNotificationEmail } from '@/lib/email'

export const runtime = 'nodejs'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SERVICES: Record<string, string> = {
  coaching: '1-2-1 Life Coaching',
  workshop: 'Group Workshop',
  dinnerclub: 'Halal Dinner Club',
  other: 'Something else',
}

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'We could not read that message. Please try again.' },
      { status: 400 }
    )
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'We could not read that message. Please try again.' },
      { status: 400 }
    )
  }

  const payload = body as Record<string, unknown>
  const name = clean(payload.name, 120)
  const email = clean(payload.email, 254)
  const service = clean(payload.service, 80)
  const message = clean(payload.message, 4000)

  // A hidden field real visitors never fill in. Pretend the submission worked
  // so bots do not learn that they were filtered out.
  if (clean(payload.website, 200)) {
    return NextResponse.json({ success: true })
  }

  if (!name || !email || !service) {
    return NextResponse.json(
      { error: 'Name, email, and service are required' },
      { status: 400 }
    )
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  const serviceLabel = SERVICES[service] ?? service
  const submittedAt = new Date().toISOString()
  const subject = `New website enquiry: ${serviceLabel} — ${name}`
  const text = [
    'New website enquiry',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Interested in: ${serviceLabel}`,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    message || '(No message supplied)',
  ].join('\n')

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Interested in', serviceLabel],
    ['Submitted', submittedAt],
    ['Message', message || '(No message supplied)'],
  ]

  const html = `
    <div style="font-family:Arial,sans-serif;color:#2B2622;line-height:1.6;max-width:640px">
      <h1 style="font-size:22px;margin:0 0 20px">New website enquiry</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" valign="top" style="padding:10px 16px 10px 0;border-bottom:1px solid #e7dfd2;white-space:nowrap">${escapeHtml(label)}</th>
                <td style="padding:10px 0;border-bottom:1px solid #e7dfd2">${paragraphHtml(value)}</td>
              </tr>`
          )
          .join('')}
      </table>
      <p style="margin:20px 0 0;color:#5C554D;font-size:13px">
        Reply directly to this email to answer ${escapeHtml(name)}.
      </p>
    </div>
  `

  console.info('[contact] enquiry received', {
    name,
    email,
    service: serviceLabel,
    submittedAt,
  })

  const notified = await sendNotificationEmail({
    subject,
    text,
    html,
    replyTo: email,
  })

  return NextResponse.json({ success: true, notified })
}