import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
})

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Leaf Coaching | Empower Your Journey Today',
  description:
    'Culturally sensitive life coaching, advocacy, and support for personal growth and community engagement. A UK-based CIC serving the British Muslim community.',
  keywords: 'life coaching, UK coaching, muslim coaching, advocacy, personal development',
  metadataBase: new URL('https://leafcoaching.com'),
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Leaf Coaching | Empower Your Journey Today',
    description:
      'Culturally sensitive life coaching, advocacy, and support for personal growth and community engagement.',
    url: 'https://leafcoaching.com',
    siteName: 'Leaf Coaching',
    type: 'website',
    locale: 'en_GB',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}