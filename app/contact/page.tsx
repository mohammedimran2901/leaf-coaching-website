'use client'
import { useState } from 'react'
import { ArrowRight, Mail, Instagram } from 'lucide-react'

const inputClasses =
  'w-full px-5 py-3.5 bg-white/70 border border-ink/15 rounded-2xl focus:ring-2 focus:ring-clay/50 focus:border-clay outline-none transition-all text-ink placeholder:text-ink-muted'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', service: '', message: '' })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="pt-36 md:pt-44">
      <section className="container-site pb-14 md:pb-16">
        <p className="eyebrow mb-5">Contact</p>
        <h1 className="text-5xl md:text-7xl font-serif text-ink leading-[1.05] max-w-3xl">
          Let&rsquo;s start a <em className="italic text-forest">conversation</em>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
          Ready to begin? Fill in the form below and we&rsquo;ll arrange your
          free 30-minute discovery call. No pressure, no jargon — just a
          friendly chat.
        </p>
      </section>

      <section className="container-site pb-24 md:pb-32">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white/70 border hairline rounded-3xl p-10 text-center">
                <p className="font-serif text-3xl text-forest mb-3">Thank you.</p>
                <p className="text-ink-soft">
                  Your message has been received. We&rsquo;ll be in touch
                  shortly to arrange your discovery call.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">Name</label>
                    <input type="text" id="name" required placeholder="Your name" className={inputClasses}
                      value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">Email</label>
                    <input type="email" id="email" required placeholder="you@example.com" className={inputClasses}
                      value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-ink mb-2">Interested service</label>
                  <select id="service" className={inputClasses}
                    value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })}>
                    <option value="">Select a service…</option>
                    <option value="coaching">1-2-1 Life Coaching</option>
                    <option value="workshop">Group Workshop</option>
                    <option value="dinnerclub">Halal Dinner Club</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">Message</label>
                  <textarea id="message" rows={5} placeholder="Tell us a little about what you're looking for…" className={inputClasses}
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
                  {isSubmitting ? 'Sending…' : 'Request your free call'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-forest text-sand rounded-3xl p-8">
              <h2 className="font-serif text-2xl mb-6">Prefer to reach out directly?</h2>
              <ul className="space-y-5 text-[15px]">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-clay-light shrink-0" />
                  <a href="mailto:hello@leafcoaching.com" className="hover:text-clay-light transition-colors">
                    hello@leafcoaching.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-clay-light shrink-0" />
                  <a href="https://instagram.com/leaf_coaching" target="_blank" rel="noopener noreferrer"
                    className="hover:text-clay-light transition-colors">
                    @leaf_coaching
                  </a>
                </li>
              </ul>
              <p className="mt-8 pt-6 border-t border-sand/15 text-sand/60 text-sm leading-relaxed">
                We aim to respond within 2 working days. Everything you share
                is treated with full confidence.
              </p>
            </div>
            <div className="bg-clay-pale rounded-3xl p-8">
              <p className="font-serif text-xl text-ink mb-2">Free 30-minute discovery call</p>
              <p className="text-ink-soft text-[15px] leading-relaxed">
                A relaxed, no-obligation conversation about where you are and
                where you&rsquo;d like to grow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}