import Link from 'next/link'
import { ArrowRight, Coffee, Quote } from 'lucide-react'

const themes = ['Identity', 'Family', 'Faith', 'Boundaries']

export default function TeaStoriesSection() {
  return (
    <section className="section-padding border-y hairline bg-sand-deep">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-10">
          <div className="md:col-span-6">
            <p className="eyebrow mb-5">Tea Stories</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              Stories worth
              <br />
              <em className="italic text-forest">steeping.</em>
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-base">
              Short reflections from the coaching room — on identity, family,
              faith, boundaries and the quiet work of becoming yourself. Put the
              kettle on and stay a while.
            </p>
            <Link href="/tea-stories" className="btn-primary mt-8">
              Read the tea stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:col-span-6">
            <div className="relative mx-auto w-full max-w-lg">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rotate-2 rounded-[2.25rem] border border-clay/20 bg-clay-pale/60"
              />
              <div className="relative rounded-[2rem] border border-forest/15 bg-white/65 p-8 shadow-[0_30px_80px_-60px_rgba(20,40,25,0.6)] md:p-10">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
                    <Coffee className="h-5 w-5" />
                  </span>
                  <Quote className="h-8 w-8 text-clay/40" aria-hidden="true" />
                </div>
                <p className="mt-7 font-serif text-3xl italic leading-snug text-ink md:text-4xl">
                  Take what is useful. Leave the rest.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                  Ordinary stories, told with care. Some are ours; some are the
                  lessons that keep returning in the room.
                </p>
                <div className="mt-7 flex flex-wrap gap-2 border-t hairline pt-6">
                  {themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-forest/15 px-3 py-1.5 text-[10px] uppercase tracking-widest text-forest/75"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
