import Link from 'next/link'
import { ArrowRight, Download, FileText, Leaf } from 'lucide-react'
import { formatGBP, getProduct } from '@/lib/products'

export default function BooksSection() {
  const book = getProduct('be-melting-snow')
  const workbook = getProduct('beyond-the-role')

  if (!book || !workbook) return null

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="eyebrow mb-5">Books &amp; workbooks</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              Take the work
              <br />
              <em className="italic text-forest">home.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              For the days between sessions: a book for perspective, and a new
              workbook for the patterns that keep repeating. Both are written to
              meet you with warmth, not judgement.
            </p>
            <Link
              href="/books"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              Explore books &amp; workbooks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4 md:col-span-7">
            <Link
              href={`/pay?product=${book.id}`}
              className="group flex flex-col gap-5 rounded-[1.75rem] border border-ink/10 bg-white/60 p-6 transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-forest/30 hover:bg-white hover:shadow-[0_24px_60px_-40px_rgba(20,40,25,0.6)] sm:flex-row sm:items-center md:p-7"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Leaf className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-widest text-clay">
                  The book · paperback
                </span>
                <span className="mt-1 block font-serif text-2xl leading-snug text-ink">
                  {book.name}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                  Eleven chapters on forgiveness, change and finding yourself
                  again.
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <span className="font-serif text-2xl text-forest">
                  {formatGBP(book.price)}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 text-forest transition-all duration-500 group-hover:border-clay group-hover:bg-clay group-hover:text-sand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </Link>

            <Link
              href={`/pay?product=${workbook.id}`}
              className="group flex flex-col gap-5 rounded-[1.75rem] border border-forest bg-forest p-6 text-sand transition-all duration-500 ease-soft hover:-translate-y-1 hover:bg-forest-deep hover:shadow-[0_24px_60px_-30px_rgba(20,40,25,0.65)] sm:flex-row sm:items-center md:p-7"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sand/10 text-clay-light">
                <FileText className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-clay-light">
                    New · digital workbook
                  </span>
                  {workbook.saleLabel && (
                    <span className="rounded-full bg-clay px-2.5 py-1 text-[9px] uppercase tracking-widest text-sand">
                      {workbook.saleLabel}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-sand/10 px-2.5 py-1 text-[9px] uppercase tracking-widest text-sand/80">
                    <Download className="h-3 w-3" /> Instant PDF
                  </span>
                </span>
                <span className="mt-1 block font-serif text-2xl leading-snug">
                  {workbook.name}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-sand/70">
                  A gentle, practical map for the roles you learned — and the
                  choice to respond differently.
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <span className="font-serif text-2xl text-clay-light">
                  {formatGBP(workbook.price)}
                  {workbook.compareAtPrice && (
                    <span className="ml-2 font-sans text-xs font-normal text-sand/50 line-through">
                      {formatGBP(workbook.compareAtPrice)}
                    </span>
                  )}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sand/25 text-sand transition-all duration-500 group-hover:border-clay group-hover:bg-clay group-hover:text-sand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
