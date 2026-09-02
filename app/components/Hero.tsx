'use client'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-sand">
      {/* Organic background accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -right-40 w-[36rem] h-[36rem] rounded-full bg-clay/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] -left-40 w-[30rem] h-[30rem] rounded-full bg-forest/10 blur-3xl" />
        {/* Oversized ghost leaf */}
        <svg
          viewBox="0 0 24 24"
          className="absolute top-1/2 right-[-6rem] w-[28rem] h-[28rem] text-forest/5 -translate-y-1/2 rotate-12"
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
      </div>

      <div className="container-site relative z-10 pt-32 pb-20 md:pt-40 md:pb-28">
        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="eyebrow mb-6"
        >
          Coaching · Advocacy · Community
        </motion.p>

        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-[2.75rem] leading-[1.05] md:text-7xl md:leading-[1.02] font-serif text-ink max-w-3xl"
        >
          Grow into the person{' '}
          <em className="text-forest not-italic font-light italic">
            you were meant
          </em>{' '}
          to be.
        </motion.h1>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mt-7 max-w-xl text-lg text-ink-soft leading-relaxed"
        >
          Culturally sensitive coaching and advocacy for British Muslims.
          Leaf Coaching helps you improve your relationship with yourself
          and others — with warmth, understanding, and real support.
        </motion.p>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <a href="/contact" className="btn-primary">
            Book a free discovery call <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/services" className="btn-ghost">
            Explore our services <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Bottom meta row */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mt-16 md:mt-24 pt-8 border-t hairline flex flex-wrap gap-x-12 gap-y-4 text-sm text-ink-muted"
        >
          <span>
            <strong className="text-ink font-sans font-semibold">100+</strong>{' '}
            clients supported
          </span>
          <span>
            <strong className="text-ink font-sans font-semibold">500+</strong>{' '}
            coaching sessions
          </span>
          <span>
            <strong className="text-ink font-sans font-semibold">UK-based</strong>{' '}
            CIC, culturally sensitive
          </span>
        </motion.div>
      </div>
    </section>
  )
}