'use client'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate leading-tight">
            Transform Your
            <br />
            <span className="text-primary">Relationship</span>
            <br />
            With Yourself
          </h1>
          <p className="text-lg text-slate-600 mt-6 leading-relaxed">
            Culturally sensitive coaching and advocacy services. 
            We help British Muslim individuals and families thrive 
            through personalized support and community connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a href="/contact" className="btn-primary">
              Book Free Discovery Call
            </a>
            <a href="/services" className="btn-secondary">
              Explore Services
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            ✓ First session free ✓ Culturally sensitive ✓ UK-based
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-2 shadow-2xl">
            <div className="bg-cream rounded-xl p-8">
              <h3 className="text-2xl font-serif font-bold text-slate">
                Start Your Journey Today
              </h3>
              <p className="text-slate-600 mt-4">
                Connect with our certified coaches and discover 
                personalized growth pathways.
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <div className="bg-primary text-white px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">100+</span>
                  <br />
                  <span className="text-sm">Happy Clients</span>
                </div>
                <div className="bg-secondary text-slate px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">500+</span>
                  <br />
                  <span className="text-sm">Sessions</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}