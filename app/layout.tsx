import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leaf Coaching | Transform Your Relationship with Yourself & Others',
  description: 'Culturally sensitive life coaching, advocacy, and support for personal growth. Based in the UK, serving the British Muslim community.',
  keywords: 'life coaching, UK coaching, muslim coaching, advocacy, personal development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}