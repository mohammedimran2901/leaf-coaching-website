'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'

const milestones = [
  { year: '2019', label: 'A CIC is born' },
  { year: '2022', label: 'Programme launched' },
  { year: '2024', label: 'Be Melting Snow' },
  { year: 'Now', label: '100+ lives' },
]

function Botanica() {
  return (
    <svg
      viewBox="0 0 220 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M110 312C110 240 110 150 110 26" />
      <path d="M110 250c-38-6-58-30-62-62 34 2 58 22 62 62Z" />
      <path d="M110 250c38-6 58-30 62-62-34 2-58 22-62 62Z" />
      <path d="M110 188c-30-6-46-26-49-51 27 1 46 18 49 51Z" />
      <path d="M110 188c30-6 46-26 49-51-27 1-46 18-49 51Z" />
      <path d="M110 132c-23-5-35-20-37-39 20 1 35 14 37 39Z" />
      <path d="M110 132c23-5 35-20 37-39-20 1-35 14-37 39Z" />
      <path d="M110 82c-16-4-24-14-26-27 14 1 24 10 26 27Z" />
      <path d="M110 82c16-4 24-14 26-27-14 1-24 10-26 27Z" />
      <path d="M110 44c-9-3-13-8-14-15 8 1 13 6 14 15Z" />
      <path d="M110 44c9-3 13-8 14-15-8 1-13 6-14 15Z" />
      <circle cx="110" cy="24" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function HomageHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 60])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35])

  return (
    <section ref={ref} className="relative overflow-hidden pb-14 pt-32 md:pb-24 md:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-clay-pale/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-forest/10 blur-3xl"
      />

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-forest/15 bg-white/50 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-clay" />
            <span className="text-[11px] font-medium uppercase tracking-widest2 text-forest">
              A Community Interest Company · Est. 2019
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance font-serif text-[3.15rem] leading-[0.97] text-ink sm:text-6xl md:text-[5.2rem]"
          >
            A little leaf grew into a{' '}
            <em className="italic text-forest">whole canopy</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl"
          >
            Six years of culturally sensitive coaching, advocacy and community
            for British Muslims. What began as one woman&rsquo;s idea of
            support that truly fits has become a growing movement — one
            conversation, one dinner table, one leaf at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="#story" className="btn-primary">
              Read our story <ArrowDown className="h-4 w-4" />
            </Link>
            <Link href="/pay" className="btn-ghost">
              Pay &amp; book a session <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t hairline pt-7"
          >
            {[
              ['100+', 'lives walked alongside'],
              ['500+', 'sessions & workshops'],
              ['2019', 'year it all began'],
            ].map(([figure, label]) => (
              <div key={label}>
                <dt className="font-serif text-2xl text-forest md:text-3xl">{figure}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-muted">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          style={{ y, opacity }}
          className="relative mx-auto w-full max-w-md lg:col-span-5"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rotate-3 rounded-[3rem] border border-clay/20 bg-clay-pale/50"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.6rem] bg-forest p-8 text-sand shadow-[0_40px_90px_-40px_rgba(20,40,25,0.65)]">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] grain" />
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-6 h-64 w-44 text-sand/20"
            >
              <Botanica />
            </div>

            <div className="relative flex h-full flex-col">
              <p className="text-[10px] uppercase tracking-widest2 text-sand/45">
                The Leaf story
              </p>
              <p className="mt-4 max-w-[13rem] font-serif text-4xl leading-[1.05]">
                Rooted in faith.
                <br />
                <em className="italic text-clay-light">Grown in community.</em>
              </p>

              <ul className="mt-auto space-y-3 border-t border-sand/15 pt-6">
                {milestones.map((m) => (
                  <li key={m.year} className="flex items-baseline gap-4">
                    <span className="w-12 shrink-0 font-serif text-sm text-clay-light">
                      {m.year}
                    </span>
                    <span className="text-[13px] text-sand/70">{m.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 rounded-2xl border border-ink/5 bg-sand px-5 py-3 shadow-[0_18px_40px_-24px_rgba(20,40,25,0.5)] sm:-left-8">
            <p className="font-serif text-lg text-forest">Six years of listening</p>
            <p className="text-[11px] uppercase tracking-widest text-ink-muted">
              and still learning
            </p>
          </div>

          <div className="absolute -right-3 top-8 hidden rounded-full bg-clay px-4 py-4 text-center text-sand shadow-lg sm:block">
            <p className="font-serif text-lg leading-none">100+</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest">clients</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
