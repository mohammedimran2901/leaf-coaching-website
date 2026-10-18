import { Leaf } from 'lucide-react'
import CountUp from './CountUp'

const stats = [
  { end: 100, suffix: '+', label: 'clients walked alongside' },
  { end: 500, suffix: '+', label: 'coaching sessions & workshops' },
  { end: 6, suffix: '', label: 'years of listening and learning' },
  { end: 2, suffix: '', label: 'boroughs rooted in community' },
]

export default function Impact() {
  return (
    <section className="relative overflow-hidden bg-forest-deep text-sand">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] grain" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-clay/10 blur-3xl"
      />
      <div className="container-site relative grid gap-8 py-14 md:grid-cols-12 md:items-center md:py-16">
        <div className="md:col-span-4">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-clay-light">
            <Leaf className="h-3.5 w-3.5" /> The canopy so far
          </p>
          <p className="mt-4 max-w-xs font-serif text-2xl leading-snug text-sand/85">
            Small, steady steps. A community that keeps growing.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-serif text-4xl text-clay-light md:text-5xl">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="mt-2 block text-[11px] uppercase leading-relaxed tracking-wide text-sand/55">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
