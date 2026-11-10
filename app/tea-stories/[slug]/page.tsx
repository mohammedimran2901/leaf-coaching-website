import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Leaf } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import TeaStoryBody from '../../components/TeaStoryBody'
import { getTeaStoryBySlug } from '@/lib/tea-stories'
import {
  formatTeaStoryDate,
  teaStoryReadingTime,
} from '@/lib/tea-story-utils'

export const dynamic = 'force-dynamic'

type StoryPageProps = {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  try {
    const story = await getTeaStoryBySlug(params.slug)
    if (!story) return { title: 'Tea Story | Leaf Coaching' }

    return {
      title: `${story.title} | Leaf Coaching`,
      description: story.excerpt,
      openGraph: {
        title: story.title,
        description: story.excerpt,
        type: 'article',
        publishedTime: story.publishedAt,
        images: [{ url: story.imageUrl }],
      },
    }
  } catch {
    return { title: 'Tea Story | Leaf Coaching' }
  }
}

export default async function TeaStoryPage({ params }: StoryPageProps) {
  let story = null
  try {
    story = await getTeaStoryBySlug(params.slug)
  } catch (error) {
    console.error('[tea-stories] could not load story', error)
  }

  if (!story) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.excerpt,
    image: [story.imageUrl],
    datePublished: story.publishedAt,
    author: { '@type': 'Organization', name: 'Leaf Coaching' },
    publisher: { '@type': 'Organization', name: 'Leaf Coaching' },
  }

  return (
    <main>
      <Header />

      <article className="pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <Link href="/" className="transition-colors hover:text-forest">
              Home
            </Link>
            <span aria-hidden="true" className="text-ink/25">/</span>
            <Link
              href="/tea-stories"
              className="inline-flex items-center gap-2 transition-colors hover:text-forest"
            >
              <ArrowLeft className="h-4 w-4" /> All tea stories
            </Link>
          </div>

          <header className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs uppercase tracking-widest text-ink-muted">
              <span>Tea Stories</span>
              <span aria-hidden="true">·</span>
              <span>{formatTeaStoryDate(story.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {teaStoryReadingTime(story.body)} min read
              </span>
            </p>
            <h1 className="mt-6 text-balance font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
              {story.title}
            </h1>
            {story.excerpt && (
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
                {story.excerpt}
              </p>
            )}
          </header>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[1.75rem] bg-sand-deep md:mt-14 md:rounded-[2rem]">
            <div className="aspect-[4/3] sm:aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl md:mt-16">
            <TeaStoryBody body={story.body} />

            <div className="mt-16 flex items-center gap-4 border-t border-ink/10 pt-8 text-forest">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10">
                <Leaf className="h-4 w-4" />
              </span>
              <p className="font-serif text-lg italic text-ink-soft">
                Take what is useful. Leave the rest.
              </p>
            </div>
          </div>

          <aside className="mx-auto mt-20 max-w-3xl rounded-[2rem] border border-forest/15 bg-sand px-7 py-10 text-center md:px-12 md:py-12">
            <p className="eyebrow">If something here stirred something</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
              You do not have to sit with it alone.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Coaching is a place to put the story down, look at it honestly,
              and decide what happens next. If that sounds like the season you
              are in, we would love to hear from you.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tea-stories" className="btn-outline">
                Read another story
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </main>
  )
}
