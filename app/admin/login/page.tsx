import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Leaf, ShieldCheck } from 'lucide-react'
import { adminAuthConfigured, isAdminAuthenticated } from '@/lib/admin-auth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Staff login | Leaf Coaching',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) redirect('/admin/tea-stories')
  const configured = adminAuthConfigured()

  return (
    <main className="relative min-h-screen overflow-hidden bg-forest px-4 py-10 text-sand sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-sand/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-sand/[0.04]"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-sand/15 bg-sand shadow-2xl md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-forest p-10 text-sand md:flex lg:p-12">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/10">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl">Leaf Coaching</span>
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sand/50">
                Staff room
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.08] lg:text-5xl">
                A quiet place to
                <br />
                <em className="italic text-sand/75">tell the stories.</em>
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/65">
                Sign in to write, publish and edit Tea Stories for the Leaf
                Coaching website.
              </p>
            </div>
            <p className="flex items-center gap-2 text-xs text-sand/45">
              <ShieldCheck className="h-4 w-4" /> Private staff access
            </p>
          </div>

          <div className="bg-sand p-7 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-forest">
                <Leaf className="h-5 w-5" />
                <span className="font-serif text-lg">Leaf Coaching</span>
              </Link>
            </div>

            <p className="eyebrow">Tea Stories admin</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              This area is for Leaf staff. Enter the shared staff password to
              manage the Tea Stories journal.
            </p>

            {configured ? (
              <LoginForm />
            ) : (
              <div className="mt-7 rounded-2xl border border-amber-300/70 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
                <p className="font-medium">Login is not configured yet.</p>
                <p className="mt-2">
                  Add <code className="rounded bg-amber-100 px-1.5 py-0.5">ADMIN_PASSWORD</code>{' '}
                  and <code className="rounded bg-amber-100 px-1.5 py-0.5">ADMIN_SESSION_SECRET</code>{' '}
                  to the environment, then restart or redeploy the site.
                </p>
              </div>
            )}

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-forest"
            >
              <ArrowLeft className="h-4 w-4" /> Back to the website
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
