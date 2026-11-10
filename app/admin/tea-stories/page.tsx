import Link from 'next/link'
import {
  AlertTriangle,
  BookOpen,
  Cloud,
  ExternalLink,
  HardDrive,
  Pencil,
  Plus,
} from 'lucide-react'
import DeleteStoryButton from '../components/DeleteStoryButton'
import {
  getAllTeaStories,
  teaStoryStorageMode,
  type TeaStory,
} from '@/lib/tea-stories'
import { formatTeaStoryDate, teaStoryReadingTime } from '@/lib/tea-story-utils'

export const dynamic = 'force-dynamic'

function updatedLabel(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default async function AdminTeaStoriesPage() {
  let stories: TeaStory[] = []
  let loadError = ''
  try {
    stories = await getAllTeaStories()
  } catch (error) {
    console.error('[tea-stories] admin list failed', error)
    loadError = 'Stories could not be loaded. Check the Vercel Blob connection.'
  }

  const published = stories.filter((story) => story.published).length
  const drafts = stories.length - published

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Tea Stories</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
            The story desk.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Write a new story, edit an existing one, or take a story down. Changes
            go live as soon as you save a published story.
          </p>
        </div>
        <Link href="/admin/tea-stories/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> New tea story
        </Link>
      </div>

      {teaStoryStorageMode === 'unavailable' && (
        <div className="mt-7 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Storage is not connected.</p>
            <p className="mt-1 leading-relaxed text-red-800/80">
              Connect a Vercel Blob store to this project and redeploy before
              uploading stories. Without it, changes cannot be saved in production.
            </p>
          </div>
        </div>
      )}

      {teaStoryStorageMode === 'local' && (
        <div className="mt-7 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <HardDrive className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Local development storage is active.</p>
            <p className="mt-1 leading-relaxed text-amber-900/80">
              Posts are saved to <code>.data/tea-stories</code> and images to{' '}
              <code>public/uploads/tea-stories</code>. Connect Vercel Blob before
              going live so staff uploads persist across deployments.
            </p>
          </div>
        </div>
      )}

      {teaStoryStorageMode === 'blob' && (
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-1.5 text-[11px] text-forest">
          <Cloud className="h-3.5 w-3.5" /> Connected to Vercel Blob
        </p>
      )}

      {loadError && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {loadError}
        </p>
      )}

      <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
        <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
          <p className="font-serif text-3xl text-ink">{stories.length}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-muted">Total</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
          <p className="font-serif text-3xl text-forest">{published}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-muted">Published</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
          <p className="font-serif text-3xl text-clay">{drafts}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-muted">Drafts</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white/55">
        {stories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
              <BookOpen className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-serif text-2xl text-ink">No stories yet.</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
              The first one is always the hardest. Start with an image and a few
              honest paragraphs.
            </p>
            <Link href="/admin/tea-stories/new" className="btn-primary mt-6">
              <Plus className="h-4 w-4" /> Write the first story
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10">
            {stories.map((story) => (
              <li key={story.id}>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-sand-deep sm:w-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                          story.published
                            ? 'bg-forest/10 text-forest'
                            : 'bg-clay/10 text-clay'
                        }`}
                      >
                        {story.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        {formatTeaStoryDate(story.publishedAt)} ·{' '}
                        {teaStoryReadingTime(story.body)} min read
                      </span>
                    </div>
                    <h2 className="mt-2 truncate font-serif text-xl text-ink">{story.title}</h2>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      /tea-stories/{story.slug}
                      {story.updatedAt && ` · updated ${updatedLabel(story.updatedAt)}`}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                    {story.published && (
                      <Link
                        href={`/tea-stories/${story.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-forest/5 hover:text-forest"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </Link>
                    )}
                    <Link
                      href={`/admin/tea-stories/${story.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 px-3 py-2 text-xs font-medium text-forest transition hover:bg-forest/10"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <DeleteStoryButton storyId={story.id} storyTitle={story.title} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
