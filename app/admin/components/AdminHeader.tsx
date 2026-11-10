import Link from 'next/link'
import { BookOpen, ExternalLink, Leaf, Plus } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur-xl">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/tea-stories" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="leading-none">
              <span className="block font-serif text-lg text-ink">Leaf</span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                Staff room
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Staff navigation">
            <Link
              href="/admin/tea-stories"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-forest/5 hover:text-forest"
            >
              <BookOpen className="h-3.5 w-3.5" /> Tea Stories
            </Link>
            <Link
              href="/admin/tea-stories/new"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-forest/5 hover:text-forest"
            >
              <Plus className="h-3.5 w-3.5" /> New story
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tea-stories"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-ink-muted transition hover:text-forest"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">View site</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
