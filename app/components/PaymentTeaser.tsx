import Link from 'next/link'
import { ArrowRight, Check, Lock, ShieldCheck } from 'lucide-react'
import { PRODUCTS, formatGBP } from '@/lib/products'

const featured = [
  'single-session',
  'three-session-bundle',
  'six-session-bundle',
]
  .map((id) => PRODUCTS.find((product) => product.id === id))
  .filter((product): product is (typeof PRODUCTS)[number] => Boolean(product))

export default function PaymentTeaser() {
  return (
    <section id="pay" className="border-y hairline bg-white/35 section-padding">
      <div className="container-site">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">Pay &amp; book</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              A clear next step,
              <br />
              <em className="italic text-forest">without the fuss.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Book and pay in one place. Every payment is processed securely by
              PayPal, and we will be in touch within two working days to arrange
              the details.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-forest" /> Secure · simple ·
              supported
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {featured.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col rounded-[1.75rem] border border-ink/10 bg-sand p-7 transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-forest/25 hover:shadow-[0_24px_60px_-40px_rgba(20,40,25,0.6)] md:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-widest2 text-clay">
                  {product.badge ?? 'Leaf Coaching'}
                </p>
                {product.physical && (
                  <span className="rounded-full bg-clay-pale px-3 py-1 text-[10px] uppercase tracking-widest text-clay">
                    Book
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-serif text-2xl leading-snug text-ink">
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{product.meta}</p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
                {product.summary}
              </p>
              <p className="mt-7 font-serif text-4xl text-forest">
                {formatGBP(product.price)}
              </p>
              <Link
                href={`/pay?product=${product.id}`}
                className="mt-auto inline-flex items-center justify-between gap-3 border-t hairline pt-5 text-sm font-medium text-forest transition-colors hover:text-clay"
              >
                Pay &amp; book
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 transition-all duration-500 group-hover:border-clay group-hover:bg-clay group-hover:text-sand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-forest/15 bg-white/50 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">
                Not sure yet? Start with a free 30-minute call.
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                A relaxed chat about where you are and where you would like to
                grow. No pressure, no commitment.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              Book a free call <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pay" className="btn-primary !px-5 !py-2.5">
              <Lock className="h-3.5 w-3.5" /> Go to checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
