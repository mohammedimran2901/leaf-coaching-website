'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Users, BookOpen } from 'lucide-react'

const offerings = [
  {
    icon: HeartHandshake,
    title: '1-2-1 Support',
    description:
      'Personal coaching that meets you where you are — culturally understood, entirely confidential, wholly yours.',
    href: '/services',
  },
  {
    icon: Users,
    title: 'Community & Workshops',
    description:
      'Group programmes and community events — from resilience workshops to the Halal Dinner Club.',
    href: '/services',
  },
  {
    icon: BookOpen,
    title: 'Publishing',
    description:
      'Books and resources on personality, wellbeing and growth, written with and for our community.',
    href: '/services',
  },
]

export default function Features() {
  return (
    <section className="bg-sand section-padding">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="eyebrow mb-4"
            >
              What we do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-serif text-ink leading-tight"
            >
              Support that understands{' '}
              <em className="italic text-forest">you</em>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/services" className="btn-ghost">
              All services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {offerings.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                className="group flex flex-col h-full bg-white/60 border hairline rounded-3xl p-8 md:p-10 transition-all duration-500 ease-soft hover:bg-white hover:shadow-[0_24px_60px_-24px_rgba(43,38,34,0.18)] hover:-translate-y-1"
              >
                <span className="w-11 h-11 rounded-full bg-clay-pale text-clay flex items-center justify-center mb-8 transition-transform duration-500 ease-soft group-hover:scale-110">
                  <item.icon className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-serif text-ink mb-3">{item.title}</h3>
                <p className="text-ink-soft leading-relaxed text-[15px]">{item.description}</p>
                <span className="mt-auto pt-8 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-soft group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}