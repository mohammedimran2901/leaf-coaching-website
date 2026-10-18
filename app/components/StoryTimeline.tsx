'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const chapters = [
  {
    year: '2019',
    title: 'A leaf takes root',
    body: 'Leaf Coaching is founded as a Community Interest Company, with a simple aim: support that does not ask people to leave their faith, family or culture at the door.',
    tags: ['Founded as a CIC', 'Culturally sensitive by design'],
  },
  {
    year: '2020',
    title: 'Showing up where it matters',
    body: 'Programmes across Hackney and Tower Hamlets bring coaching, wellbeing support and advocacy to local communities — meeting people in the places they already trust.',
    tags: ['Hackney', 'Tower Hamlets', 'Mental health & advocacy'],
  },
  {
    year: '2022',
    title: 'A programme for the whole person',
    body: 'A structured self-development programme takes shape, covering resilience, positive mindset, balance, public speaking, conflict resolution, visioning, acceptance, habits and imposter syndrome.',
    tags: ['Group workshops', 'Nine core themes'],
  },
  {
    year: '2024',
    title: 'Be Melting Snow',
    body: 'Aamna Khokhar publishes her first book — eleven chapters of honest reflection on identity, expectation and the quiet work of becoming yourself.',
    tags: ['First book', '11 chapters'],
  },
  {
    year: 'Today',
    title: 'A canopy, not a single leaf',
    body: '1-2-1 coaching, workshops and consultancy now sit alongside the Halal Dinner Club, Tea Stories and Noor. More than 100 clients and 500 sessions later, the work keeps growing.',
    tags: ['100+ clients', '500+ sessions', 'Still growing'],
  },
]

export default function StoryTimeline() {
  return (
    <section
      id="story"
      className="relative overflow-hidden border-y hairline bg-sand-deep section-padding"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 hidden select-none font-serif text-[16rem] leading-none text-forest/[0.035] lg:block"
      >
        2019
      </div>

      <div className="container-site relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">Our story</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              It started with one leaf.
              <br />
              <em className="italic text-forest">Then came the canopy.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[15px] leading-relaxed text-ink-soft md:text-base">
              Leaf Coaching was founded by Aamna Khokhar in 2019. What began as
              a small CIC with a big conviction — that good support should fit
              real lives — has grown into coaching, workshops, advocacy and a
              community that keeps widening.
            </p>
          </div>
        </div>

        <ol className="mt-16 md:mt-20">
          {chapters.map((chapter, index) => (
            <motion.li
              key={chapter.year}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 md:grid-cols-12 md:gap-8"
            >
              <div className="flex items-baseline gap-3 md:col-span-2 md:block md:pt-1">
                <p className="font-serif text-2xl text-clay md:text-4xl">
                  {chapter.year}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-ink-muted md:mt-2">
                  Chapter {String(index + 1).padStart(2, '0')}
                </p>
              </div>

              <div
                className={`relative border-l pb-12 pl-8 md:col-span-10 md:pl-12 ${
                  index === chapters.length - 1
                    ? 'border-transparent'
                    : 'border-forest/15'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-forest ring-4 ring-sand-deep"
                />
                <div className="grid gap-5 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <h3 className="font-serif text-2xl text-ink md:text-3xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                      {chapter.body}
                    </p>
                  </div>
                  <ul className="flex flex-wrap content-start gap-2 lg:col-span-5 lg:justify-end">
                    {chapter.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-forest/15 bg-white/40 px-3 py-1.5 text-[11px] uppercase tracking-wide text-forest/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-forest px-7 py-10 text-sand md:ml-[16.666%] md:px-12 md:py-12"
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] grain" />
          <p className="eyebrow !text-clay-light">Our raison d&rsquo;être</p>
          <blockquote className="relative mt-5 max-w-3xl font-serif text-2xl leading-snug md:text-4xl">
            &ldquo;To provide support services and advocacy so that you can
            improve your relationship with yourself and others.&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-sand/60">
            <span>Leaf Coaching CIC · founded 2019</span>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sand/80 underline-offset-4 transition-colors hover:text-clay-light hover:underline"
            >
              More about us <ArrowUpRight className="h-4 w-4" />
            </Link>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
