import Link from 'next/link'

const services = [
  {
    title: '1-2-1 Life Coaching',
    description: 'Personalized coaching sessions tailored to your unique goals.',
    price: '£69.95/month',
    features: ['Weekly 50-min sessions', 'Personalized action plans', 'Between-session support'],
  },
  {
    title: 'Group Workshops',
    description: 'Learn with others in a supportive community environment.',
    price: '£49.95/session',
    features: ['2-hour sessions', 'Interactive exercises', 'Community access'],
  },
  {
    title: 'Halal Dinner Club',
    description: 'Advocacy platform for community awareness and connection.',
    price: '£129.95/month',
    features: ['All coaching benefits', 'Event access', 'Advocacy training'],
  },
]

export default function ServicesPage() {
  return (
    <main className="pt-24">
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-slate mb-6">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Choose the pathway that best fits your needs. All services are culturally sensitive 
            and designed for the British Muslim community.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="border border-cream rounded-xl p-8 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">{service.title}</h2>
                <p className="text-slate-600 mb-6">{service.description}</p>
                <p className="text-3xl font-bold text-slate mb-6">{service.price}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="text-primary mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary block text-center">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}