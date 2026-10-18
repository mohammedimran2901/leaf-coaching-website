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

export default function PayPalButtons({
  items,
  customer,
  onSuccess,
  onError,
}: PayPalButtonsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const successRef = useRef(onSuccess)
  const errorRef = useRef(onError)
  successRef.current = onSuccess
  errorRef.current = onError

  useEffect(() => {
    if (!clientId) {
      setStatus('error')
      return
    }

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
  }, [clientId, items, customer])

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-clay/30 bg-clay-pale/70 p-5 text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">Card payments are nearly ready.</p>
        <p>
          PayPal has not been switched on for this site yet. Email{' '}
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
