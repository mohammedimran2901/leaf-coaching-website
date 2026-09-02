export default function AboutPage() {
  return (
    <main className="pt-24">
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-slate mb-6">About Leaf Coaching</h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Leaf Coaching is a Community Interest Company (CIC) committed to providing 
            culturally sensitive coaching and advocacy services.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-slate mb-6">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our raison d'être is to provide support services and advocacy so that you can 
            improve your relationship with yourself and others. We focus on delivering 
            services that are culturally competent and respectful of the British Muslim 
            community's unique needs.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-slate-600">Active Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-slate-600">Coaching Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-slate-600">Community Events</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}