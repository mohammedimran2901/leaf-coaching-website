import type { Metadata } from 'next'
import TeaStoryEditor from '../../components/TeaStoryEditor'

export const metadata: Metadata = {
  title: 'New tea story | Leaf Coaching',
  robots: { index: false, follow: false },
}

export default function NewTeaStoryPage() {
  return (
    <div>
      <p className="eyebrow">New story</p>
      <h1 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">
        Begin a tea story.
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
        Add a cover image, give it a title, and write. You can save it as a draft
        and come back whenever you are ready.
      </p>
      <TeaStoryEditor />
    </div>
  )
}
