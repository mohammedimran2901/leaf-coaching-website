import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import Checkout from '../components/Checkout'

export const metadata: Metadata = {
  title: 'Pay & book | Leaf Coaching',
  description:
    'Pay securely by PayPal or card for 1-2-1 coaching, coaching bundles, workshops, the Halal Dinner Club, Be Melting Snow and the Beyond the Role workbook.',
}

export default function PayPage({
  searchParams,
}: {
  searchParams: { product?: string | string[] }
}) {
  const requested = Array.isArray(searchParams.product)
    ? searchParams.product[0]
    : searchParams.product

  return (
    <main className="pt-32 md:pt-40">
      <section className="container-site pb-12 md:pb-16">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" /> All services
        </Link>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-5">Pay &amp; book</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
              Invest in yourself,{' '}
              <em className="italic text-forest">securely</em>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Choose a coaching session or bundle, a workshop, the Dinner Club,
              the book or the digital workbook. Payment is handled by PayPal.
              Digital downloads arrive straight away; everything else is
              arranged with you within two working days.
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-3xl border hairline bg-white/55 p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <ShieldCheck className="h-4 w-4 text-forest" /> Secure checkout
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Payments are processed by PayPal. You can pay with a PayPal
                account or a debit/credit card where available.
              </p>
              <p className="mt-4 flex items-center gap-2 border-t hairline pt-4 text-xs uppercase tracking-widest text-ink-muted">
                <Lock className="h-3.5 w-3.5" /> 256-bit encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pb-24 md:pb-32">
        <Checkout initialProductId={requested ?? 'single-session'} />
      </section>
    </main>
  )
}
