'use client'

import { useEffect, useRef, useState } from 'react'

interface PayPalButtonsProps {
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

function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.paypal) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-sdk]'
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('The PayPal script could not load.'))
      )
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=GBP&intent=capture&components=buttons`
    script.async = true
    script.dataset.paypalSdk = 'true'
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('The PayPal script could not load.'))
    document.head.appendChild(script)
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
      .then(() => {
        if (cancelled || !containerRef.current || !window.paypal) return

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

        return buttons.render(containerRef.current).then(() => {
          if (!cancelled) setStatus('ready')
        })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        console.error('[paypal] sdk load failed', error)
        setStatus('error')
        setMessage(
          'PayPal could not load. Please check your connection and refresh, or email hello@leafcoaching.com.'
        )
      })

    return () => {
      cancelled = true
      try {
        buttons?.close?.()
      } catch {
        // PayPal may already have torn down the iframe.
      }
    }
  }, [clientId, configStatus, items, customer])

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
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Payments are processed securely by PayPal. You do not need an account —
        you can pay by debit or credit card where available. Leaf Coaching never
        sees or stores your card details.
      </p>
    </div>
  )
}
