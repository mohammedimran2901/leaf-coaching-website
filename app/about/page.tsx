import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const values = [
  {
    title: 'Culturally sensitive',
    description:
      'Every service is designed with genuine understanding of the British Muslim community — no explaining required.',
  },
  {
    title: 'Person-centred',
    description:
      "You are the expert on your own life. We walk alongside you, never ahead of you.",
  },
  {
    title: 'Community first',
    description:
      'As a CIC, our purpose is people, not profit — from 1-2-1 support to community advocacy.',
  },
]

export default function AboutPage() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="container-site pb-16 md:pb-24">
        <p className="eyebrow mb-5">About us</p>
        <h1 className="text-5xl md:text-7xl font-serif text-ink leading-[1.05] max-w-3xl">
          Support rooted in <em className="italic text-forest">community</em>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
          Leaf Coaching is a Community Interest Company committed to providing
          culturally sensitive coaching and advocacy. Our raison d&rsquo;être is
          to provide support services and advocacy so that you can improve your
          relationship with yourself and others.
        </p>
      </section>

      <section className="bg-sand-deep section-padding border-y hairline">
        <div className="container-site grid md:grid-cols-3 gap-10 md:gap-8">
          {values.map((v, i) => (
            <div key={v.title} className="border-t-2 border-forest/20 pt-6">
              <span className="font-serif text-sm text-clay mr-2">
                0{i + 1}
              </span>
              <h2 className="text-2xl font-serif text-ink mb-3">{v.title}</h2>
              <p className="text-ink-soft leading-relaxed text-[15px]">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site grid md:grid-cols-3 gap-10 text-center md:text-left">
          {[
            { stat: '100+', label: 'Active clients supported' },
            { stat: '500+', label: 'Coaching sessions delivered' },
            { stat: '10+', label: 'Community events hosted' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-5xl md:text-6xl text-forest">
                {s.stat}
              </div>
              <p className="mt-3 text-ink-muted text-sm uppercase tracking-widest2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay-pale section-padding">
        <div className="container-site flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 className="text-3xl md:text-4xl font-serif text-ink max-w-xl leading-tight">
            Want to know how we can support you?
          </h2>
          <Link href="/contact" className="btn-primary shrink-0">
            Get in touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}