'use client'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

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

const AUTOPLAY_MS = 6000

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length),
    []
  )

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, go])

  const t = testimonials[index]

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
          className="text-4xl md:text-5xl font-serif mb-14 md:mb-16 max-w-2xl leading-tight"
        >
          Kind words from our <em className="italic text-clay-light">community</em>
        </motion.h2>

        <div
          className="max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Quote */}
          <div className="relative min-h-[12rem] md:min-h-[10rem]">
            <Quote
              className="absolute -top-2 -left-2 w-10 h-10 text-clay/30"
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="pt-10"
              >
                <blockquote className="font-serif text-2xl md:text-4xl leading-snug text-sand">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm uppercase tracking-widest2 text-sand/50">
                  — {t.author}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-sand/15 pt-6">
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="group py-2"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-500 ease-soft ${
                      i === index
                        ? 'w-10 bg-clay-light'
                        : 'w-4 bg-sand/25 group-hover:bg-sand/50'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="w-11 h-11 rounded-full border border-sand/25 flex items-center justify-center text-sand/70 transition-all duration-500 ease-soft hover:border-clay-light hover:text-clay-light hover:-translate-x-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="w-11 h-11 rounded-full border border-sand/25 flex items-center justify-center text-sand/70 transition-all duration-500 ease-soft hover:border-clay-light hover:text-clay-light hover:translate-x-0.5"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}