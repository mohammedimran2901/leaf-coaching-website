'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert('Thank you! We will get back to you shortly.')
        setFormData({ name: '', email: '', service: '', message: '' })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <main className="pt-24">
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-slate mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Ready to start your journey? Fill out the form below and we'll 
            schedule your free 30-minute discovery call.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate mb-2">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-slate mb-2">Interested Service</label>
              <select
                id="service"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              >
                <option value="">Select a service...</option>
                <option value="coaching">1-2-1 Life Coaching</option>
                <option value="workshop">Group Workshop</option>
                <option value="membership">Full Membership</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Request Free Discovery Call
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}