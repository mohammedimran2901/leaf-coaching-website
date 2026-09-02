'use client'
import { motion } from 'framer-motion'

const testimonials = [
  {
    text: "Aamna taught me so much about a subject I thought I was already an expert on myself!",
    author: "Life Coaching Client",
    role: "Personal Growth",
  },
  {
    text: "Finally found coaching that truly understands my cultural context. The sessions have been transformative.",
    author: "Sarah M.",
    role: "Workshop Participant",
  },
  {
    text: "The advocacy work Leaf does is incredibly important. Proud to be part of this community.",
    author: "Ahmed K.",
    role: "Halal Dinner Club Member",
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate">Client Stories</h2>
          <p className="text-slate-600 mt-4">
            Real experiences from our community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-8 shadow-sm"
            >
              <p className="text-slate-600 italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.author[0]}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-slate">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}