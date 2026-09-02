import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import FAQ from '../components/FAQ'

const services = [
  {
    title: '1-2-1 Life Coaching',
    description:
      'Personalised coaching sessions tailored to your unique goals, values and cultural background.',
    price: '£69.95',
    per: 'per month',
    features: [
      'Weekly 50-minute sessions',
      'Personalised action plans',
      'Between-session support',
    ],
  },
  {
    title: 'Group Workshops',
    description:
      'Learn and grow alongside others in a supportive community environment.',
    price: '£49.95',
    per: 'per session',
    features: ['2-hour interactive sessions', 'Practical exercises', 'Community access'],
  },
  {
    title: 'Halal Dinner Club',
    description:
      'Community, advocacy and connection — good food, real conversation, shared growth.',
    price: '£129.95',
    per: 'per month',
    features: ['All coaching benefits', 'Event access', 'Advocacy training'],
  },
]

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
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
                  {service.price}
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
              <Link
                href="/contact"
                className={`mt-auto ${i === 0 ? 'btn-light' : 'btn-primary'} w-full`}
              >
                Book now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <FAQ />
    </main>
  )
}