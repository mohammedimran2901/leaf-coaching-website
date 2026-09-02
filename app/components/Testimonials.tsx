'use client'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      'Aamna taught me so much about a subject I thought I was already an expert on — myself!',
    author: 'Life coaching client',
  },
  {
    quote:
      'Finally found coaching that truly understands my cultural context. The sessions have been transformative.',
    author: 'Workshop participant',
  },
  {
    quote:
      'The advocacy work Leaf does is incredibly important. Proud to be part of this community.',
    author: 'Halal Dinner Club member',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-forest text-sand section-padding relative overflow-hidden">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-clay/15 blur-3xl"
      />
      <div className="container-site relative">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-4 !text-clay-light"
        >
          Client stories
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-serif mb-16 md:mb-20 max-w-2xl leading-tight"
        >
          Kind words from our <em className="italic text-clay-light">community</em>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-sand/20 pt-8"
            >
              <span className="font-serif text-4xl text-clay-light leading-none block mb-4">
                &ldquo;
              </span>
              <blockquote className="text-lg leading-relaxed text-sand/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 text-sm uppercase tracking-widest2 text-sand/50">
                {t.author}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}