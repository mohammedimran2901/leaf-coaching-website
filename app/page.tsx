import Header from './components/Header'
import HomageHero from './components/HomageHero'
import Marquee from './components/Marquee'
import StoryTimeline from './components/StoryTimeline'
import Pillars from './components/Pillars'
import Impact from './components/Impact'
import PaymentTeaser from './components/PaymentTeaser'
import BooksSection from './components/BooksSection'
import TeaStoriesSection from './components/TeaStoriesSection'
import InstagramSection from './components/InstagramSection'
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
      <BooksSection />
      <TeaStoriesSection />
      <InstagramSection />
      <Testimonials />
      <BookingCTA />
      <Footer />
    </main>
  )
}
