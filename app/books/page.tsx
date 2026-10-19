import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  FileText,
  Leaf,
  ShieldCheck,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatGBP, getProduct } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Books & workbooks | Leaf Coaching',
  description:
    'Be Melting Snow, the book by Aamna Khokhar, and Beyond the Role — a 29-page relational patterns workbook available as an instant PDF download. Launch offer: £3.99, usually £12.99.',
}

const inside = [
  'Five parts and 29 pages of prompts, frameworks and space to write',
  'The five adaptive pattern families — and the gifts and costs of each',
  'The Drama Triangle, triggers and glimmers, and family mapping',
  'Boundaries, receiving and repair: practising a different response',
  'Appendices and further reading to keep going at your own pace',
]

export default function BooksPage() {
  const book = getProduct('be-melting-snow')
  const workbook = getProduct('beyond-the-role')

  return (
    <main>
      <Header />

      <section className="relative overflow-hidden border-b hairline bg-sand section-padding">
        <div className="container-site">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-5">Books &amp; workbooks</p>
              <h1 className="text-balance font-serif text-5xl leading-[0.98] text-ink md:text-7xl">
                Words to keep
                <br />
                <em className="italic text-forest">close.</em>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
                The ideas from our coaching room, made portable. A book for the
                moments that ask for perspective — and a workbook for the
                patterns that ask for honesty.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="rounded-[1.5rem] border border-forest/15 bg-white/50 p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-clay">
                  <Download className="h-4 w-4" /> Digital delivery
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  The workbook arrives as a PDF the moment your payment clears.
                  No waiting, no postage — just a link you can save and return
                  to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b hairline bg-white/35 section-padding">
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-2">
            {book && (
              <article className="flex flex-col rounded-[2rem] border border-ink/10 bg-sand p-7 md:p-9">
                <div className="flex flex-col gap-7 sm:flex-row">
                  <div className="relative flex aspect-[3/4] w-full max-w-[11.5rem] shrink-0 flex-col justify-between overflow-hidden rounded-l-sm rounded-r-xl bg-forest p-5 text-sand shadow-[0_30px_60px_-38px_rgba(20,40,25,0.9)]">
                    <span className="absolute inset-y-0 left-0 w-2.5 bg-black/20" />
                    <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest2 text-sand/70">
                      <Leaf className="h-3 w-3" /> Leaf Coaching
                    </p>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-clay-light">
                        Aamna Khokhar
                      </p>
                      <p className="mt-2 font-serif text-[2rem] leading-[0.95]">
                        Be Melting
                        <br />
                        <em className="italic text-clay-light">Snow</em>
                      </p>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-sand/60">
                      Paperback
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <p className="text-[11px] uppercase tracking-widest text-clay">
                      The book
                    </p>
                    <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">
                      {book.name}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                      Eleven chapters for anyone standing at the edge of a new
                      beginning. Inspired by Rumi and rooted in Aamna’s coaching
                      practice, it is a warm, honest companion for forgiveness,
                      change and finding your way back to yourself.
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        Eleven short chapters, written to be read slowly
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        Paperback, collection or delivery arranged after payment
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t hairline pt-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                      {book.meta}
                    </p>
                    <p className="mt-1 font-serif text-4xl text-forest">
                      {formatGBP(book.price)}
                    </p>
                  </div>
                  <Link
                    href={`/pay?product=${book.id}`}
                    className="btn-primary"
                  >
                    Buy the book <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )}

            {workbook && (
              <article className="flex flex-col rounded-[2rem] border border-clay/30 bg-clay-pale/55 p-7 md:p-9">
                <div className="flex flex-col gap-7 sm:flex-row">
                  <div className="relative flex aspect-[3/4] w-full max-w-[11.5rem] shrink-0 flex-col justify-between overflow-hidden rounded-l-sm rounded-r-xl border border-forest/15 bg-[#EFE7D8] p-5 text-forest shadow-[0_30px_60px_-42px_rgba(20,40,25,0.8)]">
                    <span className="absolute inset-y-0 left-0 w-2.5 bg-clay/30" />
                    <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest2 text-clay">
                      <FileText className="h-3 w-3" /> Workbook
                    </p>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-clay">
                        Aamna Khokhar
                      </p>
                      <p className="mt-2 font-serif text-[1.85rem] leading-[0.95]">
                        Beyond
                        <br />
                        the Role
                      </p>
                      <p className="mt-3 text-[9px] uppercase tracking-widest text-ink-muted">
                        A relational patterns workbook
                      </p>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-ink-muted">
                      29 pages · PDF
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] uppercase tracking-widest text-clay">
                        New workbook
                      </p>
                      {workbook.saleLabel && (
                        <span className="rounded-full bg-clay px-2.5 py-1 text-[9px] uppercase tracking-widest text-sand">
                          {workbook.saleLabel}
                        </span>
                      )}
                      <span className="rounded-full bg-forest px-2.5 py-1 text-[9px] uppercase tracking-widest text-sand">
                        Instant download
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">
                      {workbook.name}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                      You were never “too much” or “not enough”. You learned a
                      role — and roles can be outgrown. A gentle, practical map
                      for noticing the patterns you reach for, understanding what
                      they protected, and choosing something different.
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        Twenty-nine pages, five parts, space to write
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        Read on any device or print at home
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-clay/25 pt-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                      {workbook.meta}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-serif text-4xl text-forest">
                        {formatGBP(workbook.price)}
                      </span>
                      {workbook.compareAtPrice && (
                        <span className="font-sans text-base text-ink-muted line-through">
                          {formatGBP(workbook.compareAtPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/pay?product=${workbook.id}`}
                    className="btn-primary"
                  >
                    <Download className="h-4 w-4" /> Buy the workbook
                  </Link>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow mb-5">Beyond the Role</p>
              <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
                A map,
                <br />
                <em className="italic text-forest">not a label.</em>
              </h2>
              <div className="mt-8 rounded-[1.5rem] border border-forest/15 bg-forest p-7 text-sand">
                <BookOpen className="h-5 w-5 text-clay-light" />
                <p className="mt-4 font-serif text-2xl leading-snug">
                  “You do not have to fix yourself. You only have to get
                  curious.”
                </p>
                <p className="mt-4 text-xs uppercase tracking-widest text-sand/60">
                  Aamna Khokhar
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="space-y-5 text-[15.5px] leading-relaxed text-ink-soft">
                <p className="text-lg leading-relaxed text-ink">
                  Most of us learned how to be in relationships long before we
                  had language for it. The capable one. The peacemaker. The one
                  who holds everything together — or the one who quietly
                  disappears.
                </p>
                <p>
                  Those patterns were not flaws. They were adaptations: clever,
                  necessary ways of staying safe, keeping the peace or earning
                  belonging. The trouble starts when a role that once protected
                  you becomes the only role you know how to play.
                </p>
                <p>
                  <em>Beyond the Role</em> is a reflective workbook for anyone
                  ready to look at those patterns with curiosity rather than
                  shame. Across five parts it walks you gently through the role
                  you reach for, the purpose it has served, the price it can
                  carry, and the possibility of responding — rather than
                  reacting — in your closest relationships.
                </p>
                <p>
                  This is not a personality test, and it will not put you in a
                  box. It is a practical map: the five adaptive pattern
                  families, the Drama Triangle, triggers and glimmers, family
                  mapping, boundaries, receiving and repair — with space to
                  write honestly. Work through it in order, dip in where
                  something aches, or use it alongside coaching.
                </p>
              </div>

              <div className="mt-9 rounded-[1.75rem] border border-ink/10 bg-white/55 p-7 md:p-8">
                <p className="text-xs uppercase tracking-widest text-clay">
                  What’s inside
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {inside.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {item}
                    </li>
                  ))}
                </ul>
                {workbook && (
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-6">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-serif text-2xl text-forest">
                      <span>{formatGBP(workbook.price)}</span>
                      {workbook.compareAtPrice && (
                        <span className="font-sans text-sm font-normal text-ink-muted line-through">
                          {formatGBP(workbook.compareAtPrice)}
                        </span>
                      )}
                      <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
                        PDF · instant download
                      </span>
                    </p>
                    <Link
                      href={`/pay?product=${workbook.id}`}
                      className="btn-primary"
                    >
                      Get the workbook <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y hairline bg-white/35 py-16 md:py-20">
        <div className="container-site">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Pay securely',
                body: 'Checkout is handled by PayPal. You do not need a PayPal account to pay by card.',
              },
              {
                title: 'Download straight away',
                body: 'Your PDF link appears on the confirmation screen as soon as payment clears.',
              },
              {
                title: 'Keep it for good',
                body: 'Save the PDF to your device. The link stays live for seven days, and it is yours to keep.',
              },
            ].map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 font-serif text-lg text-forest">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-forest/15 bg-sand px-6 py-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-3 text-sm text-ink-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-forest" />
              Secure PayPal checkout · PDF delivered instantly · support if
              anything goes wrong
            </p>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              Ask a question <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
