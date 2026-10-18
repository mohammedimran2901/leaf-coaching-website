import Header from './components/Header'
import HomageHero from './components/HomageHero'
import Marquee from './components/Marquee'
import StoryTimeline from './components/StoryTimeline'
import Pillars from './components/Pillars'
import Impact from './components/Impact'
import PaymentTeaser from './components/PaymentTeaser'
import Testimonials from './components/Testimonials'
import BookingCTA from './components/BookingCTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <HomageHero />
      <Marquee />
      <StoryTimeline />
      <Pillars />
      <Impact />
      <PaymentTeaser />
      <Testimonials />
      <BookingCTA />
      <Footer />
    </main>
  )
}
