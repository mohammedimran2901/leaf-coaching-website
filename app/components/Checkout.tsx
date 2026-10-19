'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Leaf,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import {
  PRODUCT_GROUPS,
  PRODUCTS,
  formatGBP,
  getProduct,
  productsInCategory,
} from '@/lib/products'
import PayPalButtons from './PayPalButtons'

interface ReceiptDownload {
  productId: string
  name: string
  url: string
  expiresAt: string
}

interface Receipt {
  id: string
  status: string
  reference: string
  amount: string
  currency: string
  payerEmail: string | null
  summary: string
  downloads?: ReceiptDownload[]
}

const inputClasses =
  'w-full rounded-2xl border border-ink/15 bg-white/80 px-5 py-3.5 text-ink outline-none transition-all placeholder:text-ink-muted focus:border-clay focus:ring-2 focus:ring-clay/40'

export default function Checkout({
  initialProductId,
}: {
  initialProductId: string
}) {
  const [productId, setProductId] = useState(
    getProduct(initialProductId)?.id ?? 'single-session'
  )
  const product = getProduct(productId) ?? PRODUCTS[0]
  const [step, setStep] = useState<'details' | 'pay'>('details')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    consent: false,
  })

  const items = useMemo(
    () => [{ id: product.id, quantity: 1 }],
    [product.id]
  )

  const customer = useMemo(
    () => ({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    }),
    [form.name, form.email, form.phone, form.notes]
  )

  const handleContinue = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      setError('Please tell us your name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!form.consent) {
      setError('Please confirm you have read how we will use your details.')
      return
    }
    setError('')
    setStep('pay')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 180, behavior: 'smooth' })
    }
  }

  const handleSuccess = useCallback((next: Receipt) => {
    setReceipt(next)
    setError('')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }, [])

  const handlePaymentError = useCallback((message: string) => {
    setError(message)
  }, [])

  if (receipt) {
    const mailBody = [
      `Hello Leaf Coaching,`,
      ``,
      `I have paid ${formatGBP(Number(receipt.amount))} by PayPal.`,
      `Reference: ${receipt.reference}`,
      `PayPal order: ${receipt.id}`,
      receipt.summary ? `Item: ${receipt.summary}` : '',
      ...(receipt.downloads?.map((download) => `Download: ${download.url}`) ?? []),
      ``,
      `Please let me know the next steps.`,
      ``,
      form.name,
      form.email,
    ]
      .filter((line) => line !== '')
      .join('\n')

    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[2rem] border hairline bg-white/80 shadow-[0_30px_80px_-50px_rgba(20,50,35,0.5)]">
          <div className="bg-forest px-8 py-10 text-sand">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/15">
              <Check className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs uppercase tracking-widest2 text-sand/60">
              Payment received
            </p>
            <h2 className="mt-2 font-serif text-4xl">Thank you, {form.name.split(' ')[0]}.</h2>
            <p className="mt-3 max-w-md text-sand/75">
              {receipt.downloads && receipt.downloads.length > 0
                ? 'Your payment has gone through and your download is ready below. A PayPal receipt is on its way to your inbox.'
                : 'Your payment has gone through and a receipt is on its way from PayPal. We will be in touch within 2 working days to arrange the next step.'}
            </p>
          </div>
          <dl className="space-y-4 px-8 py-8 text-sm">
            <div className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
              <dt className="text-ink-muted">Paid</dt>
              <dd className="font-serif text-2xl text-ink">
                {formatGBP(Number(receipt.amount))}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
              <dt className="text-ink-muted">Reference</dt>
              <dd className="font-mono text-ink">{receipt.reference}</dd>
            </div>
            {receipt.summary && (
              <div className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
                <dt className="text-ink-muted">For</dt>
                <dd className="text-right text-ink">{receipt.summary}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-muted">PayPal order</dt>
              <dd className="font-mono text-xs text-ink-soft">{receipt.id}</dd>
            </div>
          </dl>

          {receipt.downloads && receipt.downloads.length > 0 && (
            <div className="border-t hairline bg-clay-pale/45 px-8 py-8">
              <p className="text-xs uppercase tracking-widest text-clay">
                Your digital download
              </p>
              <div className="mt-4 space-y-4">
                {receipt.downloads.map((download) => (
                  <div
                    key={download.productId}
                    className="flex flex-col gap-4 rounded-2xl border border-clay/25 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-serif text-xl text-ink">
                        {download.name}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        PDF · link valid until{' '}
                        {new Date(download.expiresAt).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'long', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <a
                      href={download.url}
                      className="btn-primary shrink-0"
                      download
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                Please save the PDF to your device now. The link works for seven
                days. If it expires, email hello@leafcoaching.com with your
                PayPal receipt and we will send it again.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="btn-primary flex-1 justify-center"
            href={`mailto:hello@leafcoaching.com?subject=${encodeURIComponent(
              `Paid booking ${receipt.reference}`
            )}&body=${encodeURIComponent(mailBody)}`}
          >
            <Mail className="h-4 w-4" />{' '}
            {receipt.downloads && receipt.downloads.length > 0
              ? 'Email us about your order'
              : 'Send us your booking details'}
          </a>
          <Link
            href={
              receipt.downloads && receipt.downloads.length > 0 ? '/books' : '/'
            }
            className="btn-ghost flex-1 justify-center"
          >
            {receipt.downloads && receipt.downloads.length > 0
              ? 'Browse books & workbooks'
              : 'Back to home'}
          </Link>
        </div>
        <p className="mt-5 text-center text-xs text-ink-muted">
          Keep your PayPal receipt — it is your proof of payment. If anything
          looks wrong, email hello@leafcoaching.com.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        {step === 'details' ? (
          <form onSubmit={handleContinue} noValidate className="space-y-8">
            <fieldset>
              <legend className="eyebrow mb-4">1. Choose what to pay for</legend>
              <div className="space-y-7">
                {PRODUCT_GROUPS.map((group) => {
                  const options = productsInCategory(group.id)
                  if (options.length === 0) return null
                  return (
                    <div key={group.id}>
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b hairline pb-2">
                        <h3 className="font-serif text-xl text-ink">
                          {group.label}
                        </h3>
                        <p className="text-xs text-ink-muted">{group.blurb}</p>
                      </div>
                      <div className="space-y-3">
                        {options.map((option) => {
                          const selected = option.id === product.id
                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                                selected
                                  ? 'border-forest bg-white shadow-[0_18px_45px_-32px_rgba(20,50,35,0.55)]'
                                  : 'border-ink/10 bg-white/45 hover:border-forest/40 hover:bg-white/70'
                              }`}
                            >
                              <input
                                type="radio"
                                name="product"
                                value={option.id}
                                checked={selected}
                                onChange={() => {
                                  setProductId(option.id)
                                  setError('')
                                }}
                                className="sr-only"
                              />
                              <span
                                aria-hidden="true"
                                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  selected
                                    ? 'border-forest bg-forest text-sand'
                                    : 'border-ink/25 bg-transparent'
                                }`}
                              >
                                {selected && <Check className="h-3 w-3" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="font-serif text-lg text-ink">
                                    {option.name}
                                  </span>
                                  {option.badge && (
                                    <span className="rounded-full bg-clay-pale px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-clay">
                                      {option.badge}
                                    </span>
                                  )}
                                </span>
                                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                                  {option.summary}
                                </span>
                                <span className="mt-2 block text-[11px] uppercase tracking-widest text-ink-muted">
                                  {option.meta}
                                </span>
                              </span>
                              <span className="shrink-0 font-serif text-xl text-forest">
                                {formatGBP(option.price)}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </fieldset>


            <div className="space-y-5 rounded-3xl border hairline bg-white/55 p-6 md:p-8">
              <div>
                <p className="eyebrow mb-2">2. Your details</p>
                <h2 className="font-serif text-2xl text-ink">
                  So we know who to welcome
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="checkout-name" className="mb-2 block text-sm font-medium text-ink">
                    Full name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClasses}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="checkout-email" className="mb-2 block text-sm font-medium text-ink">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClasses}
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="checkout-phone" className="mb-2 block text-sm font-medium text-ink">
                    Phone <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="07…"
                    className={inputClasses}
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="checkout-notes" className="mb-2 block text-sm font-medium text-ink">
                    Anything we should know?{' '}
                    <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={4}
                    placeholder="Preferred days, accessibility needs, or a little about what you're hoping for…"
                    className={inputClasses}
                    value={form.notes}
                    onChange={(event) =>
                      setForm({ ...form, notes: event.target.value })
                    }
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(event) =>
                    setForm({ ...form, consent: event.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-ink/30 text-forest focus:ring-clay"
                />
                <span>
                  I agree that Leaf Coaching can use these details to arrange my
                  booking and contact me about it. We never sell your data.
                </span>
              </label>
            </div>


            {error && (
              <p role="alert" className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">
              <Lock className="h-4 w-4" />
              Continue to secure payment
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-ink-muted">
              Payment is taken on the next step. Nothing is charged until you
              approve it with PayPal.
            </p>
          </form>
        ) : (
          <div className="rounded-3xl border hairline bg-white/70 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b hairline pb-6">
              <div>
                <p className="eyebrow mb-2">3. Pay securely</p>
                <h2 className="font-serif text-3xl text-ink">One last step</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  Check your details, then choose PayPal or pay by card. You
                  will be returned here once the payment is confirmed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('details')
                  setError('')
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-4 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Edit details
              </button>
            </div>

            <dl className="grid gap-4 py-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-widest text-ink-muted">Paying for</dt>
                <dd className="mt-1 font-medium text-ink">{product.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ink-muted">Name</dt>
                <dd className="mt-1 text-ink">{form.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ink-muted">Email</dt>
                <dd className="mt-1 break-all text-ink">{form.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ink-muted">Total</dt>
                <dd className="mt-1 font-serif text-xl text-forest">
                  {formatGBP(product.price)}
                </dd>
              </div>
            </dl>

            {error && (
              <p role="alert" className="mb-4 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-800">
                {error}
              </p>
            )}

            <PayPalButtons
              items={items}
              customer={customer}
              onSuccess={handleSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}
      </div>


      <aside className="lg:col-span-5">
        <div className="sticky top-32 space-y-4">
          <div className="overflow-hidden rounded-[2rem] border hairline bg-forest text-sand">
            <div className="p-7 md:p-8">
              <p className="text-xs uppercase tracking-widest2 text-sand/55">Your order</p>
              <h2 className="mt-3 font-serif text-2xl leading-snug">{product.name}</h2>
              <p className="mt-2 text-sm text-sand/65">{product.meta}</p>
              <div className="mt-6 flex items-baseline justify-between border-t border-sand/15 pt-5">
                <span className="text-sm text-sand/65">Total today</span>
                <span className="font-serif text-3xl">{formatGBP(product.price)}</span>
              </div>
            </div>
            <div className="bg-forest-deep/60 p-7 text-sm text-sand/75 md:p-8">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-clay-light" />
                  Secure payment handled entirely by PayPal
                </li>
                <li className="flex gap-3">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-clay-light" />
                  Every payment supports a community-interest company
                </li>
                <li className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-clay-light" />
                  {product.digital
                    ? 'Your download link appears instantly after payment'
                    : 'We reply within 2 working days to arrange your booking'}
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-clay/25 bg-clay-pale/60 p-5 text-sm leading-relaxed text-ink-soft">
            {product.physical ? (
              <p>
                This is a physical book. After payment we will email you to
                arrange collection or delivery.
              </p>
            ) : product.digital ? (
              <p>
                This is a digital workbook. Your PDF download link appears on the
                confirmation screen straight after payment and stays valid for
                seven days.
              </p>
            ) : (
              <p>
                Not sure this is the right fit? Book a free 30-minute discovery
                call first — email{' '}
                <a
                  href="mailto:hello@leafcoaching.com"
                  className="font-medium text-forest underline underline-offset-4"
                >
                  hello@leafcoaching.com
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

