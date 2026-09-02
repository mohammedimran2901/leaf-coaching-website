'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function BookingCTA() {
  return (
    <section className="bg-clay-pale section-padding">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-5">Begin today</p>
          <h2 className="text-4xl md:text-6xl font-serif text-ink leading-[1.08]">
            Your first conversation is{' '}
            <em className="italic text-forest">free</em>.
          </h2>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
            Book a free 30-minute discovery call — a relaxed, no-pressure chat
            about where you are and where you&rsquo;d like to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="/contact" className="btn-primary">
              Book your free call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/services" className="btn-ghost">
              See how we help
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}