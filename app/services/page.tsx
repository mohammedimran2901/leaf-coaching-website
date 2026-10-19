import Link from 'next/link'
import { ArrowRight, BookOpen, Check, Download } from 'lucide-react'
import FAQ from '../components/FAQ'
import { formatGBP, getProduct } from '@/lib/products'

const services = [
  {
    productId: 'single-session',
    title: '1-2-1 Life Coaching',
    description:
      'Personalised coaching sessions tailored to your unique goals, values and cultural background.',
    per: 'per 60-minute session',
    features: [
      'A confidential, unhurried hour',
      'Personalised action plans',
      'Between-session support',
    ],
  },
  {
    productId: 'three-session-bundle',
    title: '3-Session Journey',
    description:
      'Three sessions with room to build momentum, join the dots and practise a different way forward.',
    per: 'for three 60-minute sessions',
    features: [
      'Three 60-minute sessions',
      'A plan across the whole journey',
      'Save £15 against single sessions',
    ],
  },
  {
    productId: 'workshop-place',
    title: 'Group Workshops',
    description:
      'Learn and grow alongside others in a supportive community environment.',
    per: 'per workshop place',
    features: ['2-hour interactive sessions', 'Practical exercises', 'Community access'],
  },
  {
    productId: 'dinner-club-month',
    title: 'Halal Dinner Club',
    description:
      'Community, advocacy and connection — good food, real conversation, shared growth.',
    per: 'per month',
    features: ['All coaching benefits', 'Event access', 'Advocacy training'],
  },
]

const book = getProduct('be-melting-snow')
const workbook = getProduct('beyond-the-role')

function priceFor(productId: string) {
  const product = getProduct(productId)
  return product ? formatGBP(product.price) : ''
}

export default function ServicesPage() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="container-site pb-16 md:pb-20">
        <p className="eyebrow mb-5">Our services</p>
        <h1 className="text-5xl md:text-7xl font-serif text-ink leading-[1.05] max-w-3xl">
          Choose your <em className="italic text-forest">pathway</em>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
          All services are culturally sensitive and designed with the British
          Muslim community at heart. Every journey starts with a free
          discovery call.
        </p>
      </section>

      <section className="container-site pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`flex flex-col rounded-3xl p-8 md:p-10 border transition-all duration-500 ease-soft hover:-translate-y-1 ${
                i === 0
                  ? 'bg-forest text-sand border-forest shadow-[0_24px_60px_-24px_rgba(20,40,25,0.4)]'
                  : 'bg-white/60 border-ink/10 hover:bg-white'
              }`}
            >
              <h2
                className={`text-2xl font-serif mb-3 ${
                  i === 0 ? 'text-sand' : 'text-ink'
                }`}
              >
                {service.title}
              </h2>
              <p
                className={`leading-relaxed text-[15px] ${
                  i === 0 ? 'text-sand/75' : 'text-ink-soft'
                }`}
              >
                {service.description}
              </p>
              <p className="mt-6 mb-8">
                <span
                  className={`font-serif text-4xl ${
                    i === 0 ? 'text-clay-light' : 'text-forest'
                  }`}
                >
                  {priceFor(service.productId)}
                </span>{' '}
                <span
                  className={`text-sm ${i === 0 ? 'text-sand/60' : 'text-ink-muted'}`}
                >
                  {service.per}
                </span>
              </p>
              <ul className="space-y-3 mb-10 text-[15px]">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        i === 0 ? 'text-clay-light' : 'text-clay'
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-3">
                <Link
                  href={`/pay?product=${service.productId}`}
                  className={`${i === 0 ? 'btn-light' : 'btn-primary'} w-full`}
                >
                  Pay &amp; book <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className={`block text-center text-sm underline-offset-4 hover:underline ${
                    i === 0 ? 'text-sand/60' : 'text-ink-muted'
                  }`}
                >
                  Or ask a question first
                </Link>
              </div>
            </div>
          ))}
        </div>

        {book && workbook && (
          <div className="mt-6 grid gap-6 rounded-3xl border border-clay/25 bg-clay-pale/60 p-8 md:grid-cols-12 md:items-center md:p-10">
            <div className="flex items-start gap-4 md:col-span-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-sand">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-clay">
                  Books &amp; workbooks
                </p>
                <h2 className="mt-1 font-serif text-2xl text-ink md:text-3xl">
                  Words to take home
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                  {book.name} for perspective — and {workbook.name}, a 29-page
                  relational patterns workbook, for the patterns underneath.
                  {workbook.digital
                    ? ' The workbook arrives as an instant PDF download.'
                    : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:col-span-5">
              <Link
                href={`/pay?product=${workbook.id}`}
                className="btn-primary w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Workbook ·{' '}
                  {formatGBP(workbook.price)}
                  {workbook.compareAtPrice && (
                    <span className="text-xs font-normal text-sand/60 line-through">
                      was {formatGBP(workbook.compareAtPrice)}
                    </span>
                  )}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/books"
                className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-forest/20 px-5 py-3 text-sm font-medium text-forest transition-colors hover:border-forest"
              >
                Browse books &amp; workbooks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <FAQ />
    </main>
  )
}