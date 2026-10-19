import type { Metadata } from 'next'
import Link from 'next/link'
import Checkout from '../../components/Checkout'

export const metadata: Metadata = {
  title: 'Confirming payment | Leaf Coaching',
  robots: { index: false, follow: false },
}

export default function PayReturnPage({
  searchParams,
}: {
  searchParams: { token?: string | string[] }
}) {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token

  return (
    <main className="pt-32 md:pt-40">
      <section className="container-site pb-24 md:pb-32">
        {token ? (
          <Checkout
            initialProductId="single-session"
            returnedOrderId={token}
          />
        ) : (
          <div className="mx-auto max-w-2xl rounded-[2rem] border hairline bg-white/80 p-8 text-center shadow-[0_30px_80px_-50px_rgba(20,50,35,0.5)] md:p-12">
            <p className="eyebrow mb-4">Payment update</p>
            <h1 className="font-serif text-4xl text-ink">
              We could not find that payment
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-ink-soft">
              Please return to checkout and try again, or email{' '}
              <a
                className="text-forest underline underline-offset-4"
                href="mailto:hello@leafcoaching.com?subject=Payment%20confirmation"
              >
                hello@leafcoaching.com
              </a>{' '}
              if you have already paid.
            </p>
            <Link href="/pay" className="btn-primary mt-8 inline-flex">
              Back to checkout
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
