'use client'
import { motion } from 'framer-motion'

export default function BookingCTA() {
  return (
    <section className="section-padding bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your free 30-minute discovery call and find out how we can help you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cream">
              Book Free Call
            </a>
            <a href="/services" className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10">
              View Membership Plans
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}