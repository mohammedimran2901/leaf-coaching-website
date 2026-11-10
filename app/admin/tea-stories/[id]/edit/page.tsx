import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import TeaStoryEditor from '../../../components/TeaStoryEditor'
import { getTeaStoryById, type TeaStory } from '@/lib/tea-stories'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Edit tea story | Leaf Coaching',
  robots: { index: false, follow: false },
}

export default async function EditTeaStoryPage({
  params,
}: {
  params: { id: string }
}) {
  let story: TeaStory | null = null
  let loadError = ''

  try {
    story = await getTeaStoryById(params.id)
  } catch (error) {
    console.error('[tea-stories] editor load failed', error)
    loadError = 'This story could not be loaded. Please try again in a moment.'
  }

  if (loadError) {
    return (
      <div>
        <Link
          href="/admin/tea-stories"
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" /> All stories
        </Link>
        <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{loadError}</p>
        </div>
      </div>
    )
  }

  if (!story) notFound()

  return (
    <div>
      <p className="eyebrow">Editing</p>
      <h1 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">
        {story.title}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
        Make your changes, then save. Published stories update on the public site
        immediately.
      </p>
      <TeaStoryEditor story={story} />
    </div>
  )
}
