'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'What happens in a discovery call?',
    a: 'It\'s a relaxed 30-minute conversation — no forms, no pressure. We talk about where you are, what you\'d like to change, and whether we\'re the right fit to help you get there.',
  },
  {
    q: 'Do I need to prepare anything before coaching?',
    a: 'Not at all. Just come as you are. Your coach will guide the conversation and help you uncover what matters most — that\'s exactly what coaching is for.',
  },
  {
    q: 'Is everything confidential?',
    a: 'Yes. Everything you share stays between you and your coach, in line with our full privacy policy. Many clients value having a space that is entirely their own.',
  },
  {
    q: 'Are your services only for British Muslims?',
    a: 'Everyone is welcome. Our services are simply designed with genuine cultural understanding of the British Muslim community, so you never have to explain your context.',
  },
  {
    q: 'Can I switch or cancel my plan?',
    a: 'Of course. There are no long-term contracts — you can pause, switch between services, or cancel at any time. Growth should never feel like a trap.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="container-site pb-24 md:pb-32">
      <p className="eyebrow mb-4">Common questions</p>
      <h2 className="text-3xl md:text-5xl font-serif text-ink leading-tight max-w-xl mb-12">
        Everything you might be <em className="italic text-forest">wondering</em>
      </h2>

      <div className="max-w-3xl">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b hairline">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span
                  className={`font-serif text-lg md:text-xl transition-colors duration-300 ${
                    isOpen ? 'text-forest' : 'text-ink group-hover:text-forest'
                  }`}
                >
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                    isOpen
                      ? 'bg-forest border-forest text-sand'
                      : 'border-ink/15 text-ink-soft group-hover:border-forest group-hover:text-forest'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-ink-soft leading-relaxed max-w-2xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}