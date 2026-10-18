'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Building2,
  Compass,
  HeartHandshake,
  MessagesSquare,
  Sparkles,
  Users,
} from 'lucide-react'

const pillars = [
  {
    icon: Compass,
    title: '1-2-1 life coaching',
    text: 'Personal, unhurried sessions built around your goals, values and cultural context — with a free discovery call before you commit.',
    points: ['50-minute sessions', 'Personalised action plans', 'Between-session support'],
    href: '/services',
    cta: 'Explore coaching',
    tone: 'forest',
    span: 'md:col-span-7',
  },
  {
    icon: Users,
    title: 'Workshops & programmes',
    text: 'Group spaces that make hard things easier to talk about: resilience, mindset, balance, public speaking, conflict, visioning, acceptance, habits and imposter syndrome.',
    points: ['2-hour interactive sessions', 'Practical exercises', 'A community to return to'],
    href: '/services',
    cta: 'See the programme',
    tone: 'paper',
    span: 'md:col-span-5',
  },
  {
    icon: HeartHandshake,
    title: 'Halal Dinner Club',
    text: 'Good food, real conversation and advocacy training. A monthly table where community is built one meal at a time.',
    points: ['Monthly gatherings', 'Advocacy training', 'All coaching benefits'],
    href: '/services',
    cta: 'Pull up a chair',
    tone: 'clay',
    span: 'md:col-span-4',
  },
]

const morePillars = [
  {
    icon: Sparkles,
    title: 'Mental health & advocacy',
    text: 'Culturally competent programmes and one-to-one advocacy, shaped with and for communities in Hackney and Tower Hamlets.',
    points: ['Community programmes', 'Advocacy support', 'Local partnerships'],
    href: '/about',
    cta: 'How we work',
    tone: 'paper',
    span: 'md:col-span-4',
  },
  {
    icon: Building2,
    title: 'Consultancy & training',
    text: 'For schools, charities and services who want to support British Muslim communities with honesty, care and competence.',
    points: ['Cultural competence', 'Bespoke workshops', 'Practical frameworks'],
    href: '/contact',
    cta: 'Start a conversation',
    tone: 'forest-soft',
    span: 'md:col-span-4',
  },
  {
    icon: MessagesSquare,
    title: 'Words & stories',
    text: 'Be Melting Snow collects eleven chapters of reflection. Tea Stories and Noor carry the same warmth into quieter, everyday moments.',
    points: ['Be Melting Snow', 'Tea Stories', 'Noor'],
    href: '/pay?product=be-melting-snow',
    cta: 'Buy the book',
    tone: 'sand',
    span: 'md:col-span-4',
  },
]

const tones: Record<string, string> = {
  forest: 'bg-forest text-sand border-forest',
  'forest-soft': 'bg-forest-soft text-sand border-forest-soft',
  paper: 'bg-white/65 text-ink border-ink/10',
  clay: 'bg-clay-pale text-ink border-clay/25',
  sand: 'bg-sand-darker text-ink border-ink/10',
}

export default function Pillars() {
  const allPillars = [...pillars, ...morePillars]

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Six ways in</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              However you arrive,
              <br />
              <em className="italic text-forest">there is a place for you.</em>
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-forest"
          >
            All services
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          {allPillars.map((pillar, index) => {
            const Icon = pillar.icon
            const dark = pillar.tone === 'forest' || pillar.tone === 'forest-soft'
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.65,
                  delay: (index % 3) * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border p-7 transition-transform duration-500 ease-soft hover:-translate-y-1 md:p-8 ${pillar.span} ${tones[pillar.tone]}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      dark ? 'bg-sand/[0.12] text-clay-light' : 'bg-forest/[0.08] text-forest'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span
                    className={`font-serif text-xs ${
                      dark ? 'text-sand/40' : 'text-ink-muted'
                    }`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <h3
                  className={`mt-6 font-serif text-2xl md:text-[1.7rem] ${
                    dark ? 'text-sand' : 'text-ink'
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`mt-3 text-[14.5px] leading-relaxed ${
                    dark ? 'text-sand/70' : 'text-ink-soft'
                  }`}
                >
                  {pillar.text}
                </p>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wide ${
                        dark ? 'text-sand/55' : 'text-ink-muted'
                      }`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full ${
                          dark ? 'bg-clay-light' : 'bg-clay'
                        }`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={pillar.href}
                  className={`mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-medium transition-colors ${
                    dark
                      ? 'text-clay-light hover:text-sand'
                      : 'text-forest hover:text-clay'
                  }`}
                >
                  {pillar.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
