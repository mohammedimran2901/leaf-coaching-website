import { Leaf } from 'lucide-react'

const items = [
  '1-2-1 coaching',
  'Group workshops',
  'Halal Dinner Club',
  'Community advocacy',
  'Be Melting Snow',
  'Tea Stories',
  'Noor',
  'Cultural consultancy',
]

export default function Marquee() {
  return (
    <section
      aria-label="What Leaf Coaching offers"
      className="relative overflow-hidden border-y border-sand/10 bg-forest-deep py-5 text-sand"
    >
      <p className="sr-only">
        Leaf Coaching offers 1-2-1 coaching, group workshops, the Halal Dinner
        Club, community advocacy, the book Be Melting Snow, Tea Stories, Noor
        and cultural consultancy.
      </p>
      <div aria-hidden="true" className="marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-10 whitespace-nowrap font-serif text-lg text-sand/80"
              >
                {item}
                <Leaf className="h-3.5 w-3.5 shrink-0 text-clay-light/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-forest-deep to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-forest-deep to-transparent"
      />
    </section>
  )
}
