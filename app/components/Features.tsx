'use client'
import { motion } from 'framer-motion'
import { Heart, Users, Sparkles } from 'lucide-react'

const features = [
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: '1-2-1 Life Coaching',
    description: 'Personalized sessions tailored to your unique goals and cultural background.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Group Workshops',
    description: 'Learn with others in a supportive community environment.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'Halal Dinner Club',
    description: 'Advocacy platform raising awareness for the British Muslim community.',
  },
]

export default function Features() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate">How We Support You</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            We offer multiple pathways for personal growth and community connection.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-cream rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate mb-4">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/services" className="btn-primary">
            View All Services
          </a>
        </div>
      </div>
    </section>
  )
}