'use client'

import { useEffect, useRef, useState } from 'react'

interface PayPalButtonsProps {
  productId: string
  items: Array<{ id: string; quantity: number }>
  customer: {
    name: string
    email: string
    phone: string
    notes: string
  }
  onSuccess: (receipt: {
    id: string
    status: string
    reference: string
    amount: string
    currency: string
    payerEmail: string | null
    summary: string
    downloads?: Array<{
      productId: string
      name: string
      url: string
      expiresAt: string
    }>
  }) => void
  onError: (message: string) => void
}

interface PayPalButtonConfig {
  style?: Record<string, string | number | boolean>
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onCancel?: () => void
  onError?: (error: unknown) => void
}

interface PayPalButtonInstance {
  render: (element: HTMLElement) => Promise<void>
  close?: () => void
}

interface PayPalNamespace {
  Buttons: (config: PayPalButtonConfig) => PayPalButtonInstance
}

declare global {
  interface Window {
    paypal?: PayPalNamespace
  }
}

let sdkPromise: Promise<void> | null = null

const SDK_TIMEOUT_MS = 12_000
const RENDER_TIMEOUT_MS = 12_000

function withTimeout<T>(
  promise: Promise<T>,
  milliseconds: number,
  message: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), milliseconds)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.paypal?.Buttons) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  const promise = new Promise<void>((resolve, reject) => {
    let settled = false
    let timer: number | undefined

    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      if (timer) window.clearTimeout(timer)
      if (error) reject(error)
      else resolve()
    }

    timer = window.setTimeout(
      () =>
        finish(
          new Error(
            'PayPal took too long to load. An ad blocker or privacy setting may be stopping it.'
          )
        ),
      SDK_TIMEOUT_MS
    )

    // A previous attempt may have left a broken or blocked script behind.
    document
      .querySelectorAll<HTMLScriptElement>('script[data-paypal-sdk]')
      .forEach((script) => script.remove())

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=GBP&intent=capture&components=buttons`
    script.async = true
    script.dataset.paypalSdk = 'true'
    script.addEventListener('load', () => {
      if (window.paypal?.Buttons) {
        finish()
      } else {
        finish(
          new Error(
            'PayPal loaded but did not start. An ad blocker or privacy setting may be stopping it.'
          )
        )
      }
    })
    script.addEventListener('error', () =>
      finish(
        new Error(
          'The PayPal script could not load. An ad blocker or privacy setting may be stopping it.'
        )
      )
    )
    document.head.appendChild(script)
  })

  sdkPromise = promise.catch((error) => {
    // Let a retry create a fresh script rather than reuse a failed attempt.
    sdkPromise = null
    throw error
  })

  return sdkPromise
}

async function fetchClientIdFromServer(): Promise<string | null> {
  try {
    const response = await fetch('/api/paypal/config', { cache: 'no-store' })
    if (!response.ok) return null

    const data = (await response.json()) as { clientId?: string | null }
    return data.clientId || null
  } catch (error) {
    console.error('[paypal] could not load configuration', error)
    return null
  }
}

export default function PayPalButtons({
  productId,
  items,
  customer,
  onSuccess,
  onError,
}: PayPalButtonsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const buildTimeClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const [clientId, setClientId] = useState('')
  const [configStatus, setConfigStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading')
  const [attempt, setAttempt] = useState(0)
  const [redirectStatus, setRedirectStatus] = useState<
    'idle' | 'starting' | 'error'
  >('idle')
  const [redirectError, setRedirectError] = useState('')
  const successRef = useRef(onSuccess)
  const errorRef = useRef(onError)
  successRef.current = onSuccess
  errorRef.current = onError

  useEffect(() => {
    let cancelled = false

    fetchClientIdFromServer().then((serverClientId) => {
      if (cancelled) return

      // The server value is authoritative because it is the ID paired with
      // PAYPAL_CLIENT_SECRET. Only fall back to the build-time value when the
      // endpoint cannot provide one.
      const resolved = serverClientId || buildTimeClientId || ''
      setClientId(resolved)
      setConfigStatus(resolved ? 'ready' : 'error')
    })

    return () => {
      cancelled = true
    }
  }, [buildTimeClientId])

  useEffect(() => {
    if (configStatus !== 'ready' || !clientId) return

    let cancelled = false
    let buttons: PayPalButtonInstance | null = null

    loadPayPalSdk(clientId)
      .then(async () => {
        if (cancelled) return

        if (!containerRef.current) {
          throw new Error('The payment area is not ready. Please refresh the page.')
        }

        if (!window.paypal?.Buttons) {
          throw new Error(
            'PayPal loaded but did not start. An ad blocker or privacy setting may be stopping it.'
          )
        }

        containerRef.current.innerHTML = ''
        buttons = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'paypal',
            height: 48,
            tagline: false,
          },
          createOrder: async () => {
            setMessage('')
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items, customer }),
            })
            const data = (await response.json()) as {
              id?: string
              error?: string
            }
            if (!response.ok || !data.id) {
              const error = new Error(
                data.error || 'We could not start the PayPal payment.'
              )
              setMessage(error.message)
              throw error
            }
            return data.id
          },
          onApprove: async ({ orderID }) => {
            setStatus('loading')
            try {
              const response = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID, items, customer }),
              })
              const data = (await response.json()) as {
                error?: string
                id?: string
                status?: string
                reference?: string
                amount?: string
                currency?: string
                payerEmail?: string | null
                summary?: string
                downloads?: Array<{
                  productId: string
                  name: string
                  url: string
                  expiresAt: string
                }>
              }

              if (!response.ok || data.status !== 'COMPLETED') {
                throw new Error(
                  data.error || 'PayPal could not confirm the payment.'
                )
              }

              successRef.current({
                id: data.id || orderID,
                status: data.status,
                reference: data.reference || orderID,
                amount: data.amount || '0.00',
                currency: data.currency || 'GBP',
                payerEmail: data.payerEmail ?? null,
                summary: data.summary || '',
                downloads: data.downloads || [],
              })
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'PayPal could not confirm the payment.'
              setMessage(errorMessage)
              errorRef.current(errorMessage)
              setStatus('ready')
            }
          },
          onCancel: () => {
            setMessage('Payment cancelled — nothing has been taken.')
          },
          onError: (error) => {
            console.error('[paypal] buttons error', error)
            setMessage(
              'PayPal hit a problem. Please try again, or email hello@leafcoaching.com and we will help.'
            )
          },
        })

        await withTimeout(
          buttons.render(containerRef.current),
          RENDER_TIMEOUT_MS,
          'PayPal did not finish setting up. Please refresh the page.'
        )

        if (!cancelled) setStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        console.error('[paypal] sdk load failed', error)
        setStatus('error')
        setMessage('')
      })

    return () => {
      cancelled = true
      try {
        buttons?.close?.()
      } catch {
        // PayPal may already have torn down the iframe.
      }
    }
  }, [clientId, configStatus, items, customer, attempt])

  const retry = () => {
    setStatus('loading')
    setMessage('')
    setRedirectStatus('idle')
    setRedirectError('')
    setAttempt((current) => current + 1)
  }

  const startRedirectCheckout = async () => {
    setRedirectStatus('starting')
    setRedirectError('')

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer, redirect: true }),
      })
      const data = (await response.json()) as {
        id?: string
        approveUrl?: string
        error?: string
      }

      if (!response.ok || !data.id || !data.approveUrl) {
        throw new Error(
          data.error || 'We could not open PayPal. Please try again.'
        )
      }

      const approveUrl = new URL(data.approveUrl)
      if (
        approveUrl.protocol !== 'https:' ||
        !/(^|\.)paypal\.com$/i.test(approveUrl.hostname)
      ) {
        throw new Error('PayPal returned an unexpected payment link.')
      }

      try {
        sessionStorage.setItem(
          `leaf-checkout:${data.id}`,
          JSON.stringify({ items, customer, productId })
        )
      } catch {
        // The payment can still complete; support can match it using the order ID.
      }

      window.location.assign(approveUrl.toString())
    } catch (error) {
      setRedirectStatus('error')
      setRedirectError(
        error instanceof Error
          ? error.message
          : 'We could not open PayPal. Please try again.'
      )
    }
  }

  if (!clientId) {
    if (configStatus === 'loading') {
      return (
        <div className="rounded-2xl border border-clay/30 bg-clay-pale/70 p-5 text-sm text-ink-soft">
          <p className="font-medium text-ink mb-1">Preparing secure payment…</p>
          <p>This only takes a moment.</p>
        </div>
      )
    }

    return (
      <div className="rounded-2xl border border-clay/30 bg-clay-pale/70 p-5 text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">
          Secure payment is temporarily unavailable.
        </p>
        <p>
          Please refresh the page and try again. If it keeps happening, email{' '}
          <a
            className="text-forest underline underline-offset-4"
            href="mailto:hello@leafcoaching.com?subject=Payment%20for%20Leaf%20Coaching"
          >
            hello@leafcoaching.com
          </a>{' '}
          and we will arrange your payment and booking directly.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div ref={containerRef} aria-live="polite" />
      {status === 'loading' && (
        <p className="mt-3 text-sm text-ink-muted">Preparing PayPal…</p>
      )}
      {message && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {message}
        </p>
      )}
      {status === 'error' && (
        <div className="mt-4 rounded-2xl border border-clay/30 bg-clay-pale/70 p-5 text-sm text-ink-soft">
          <p className="mb-1 font-medium text-ink">
            PayPal didn’t load in this browser.
          </p>
          <p>
            This is usually an ad blocker or privacy setting. Try again,
            continue straight to PayPal’s secure checkout, or email{' '}
            <a
              className="text-forest underline underline-offset-4"
              href="mailto:hello@leafcoaching.com?subject=Payment%20for%20Leaf%20Coaching"
            >
              hello@leafcoaching.com
            </a>{' '}
            and we’ll arrange payment.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retry}
              className="btn-primary !px-5 !py-3"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={startRedirectCheckout}
              disabled={redirectStatus === 'starting'}
              className="btn-ghost !px-5 !py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redirectStatus === 'starting'
                ? 'Opening PayPal…'
                : 'Continue to PayPal'}
            </button>
          </div>
          {redirectError && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-red-800"
            >
              {redirectError}
            </p>
          )}
        </div>
      )}
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Payments are processed securely by PayPal. You do not need an account —
        you can pay by debit or credit card where available. Leaf Coaching never
        sees or stores your card details.
      </p>
    </div>
  )
}
