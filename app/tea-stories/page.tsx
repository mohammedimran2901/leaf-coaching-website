import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Coffee, Leaf } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPublishedTeaStories, type TeaStory } from '@/lib/tea-stories'
import {
  formatTeaStoryDate,
  teaStoryReadingTime,
} from '@/lib/tea-story-utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tea Stories | Leaf Coaching',
  description:
    'Short reflections from the Leaf Coaching room — honest stories about identity, family, faith, boundaries and becoming yourself, written to be read over a cup of tea.',
}

function StoryMeta({ story }: { story: TeaStory }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-widest text-ink-muted">
      <span>{formatTeaStoryDate(story.publishedAt)}</span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {teaStoryReadingTime(story.body)} min read
      </span>
    </p>
  )
}

export default async function TeaStoriesPage() {
  let stories: TeaStory[] = []
  try {
    stories = await getPublishedTeaStories()
  } catch (error) {
    console.error('[tea-stories] could not load stories', error)
  }

  const [featured, ...rest] = stories

  return (
    <main>
      <Header />

      <section className="relative overflow-hidden border-b hairline bg-sand pb-16 pt-36 md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-20 hidden h-80 w-80 rounded-full border border-forest/10 bg-forest/[0.03] lg:block"
        />
        <div className="container-site relative">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted"
              >
                <Link href="/" className="transition-colors hover:text-forest">
                  Home
                </Link>
                <span aria-hidden="true" className="text-ink/25">/</span>
                <span className="text-ink">Tea Stories</span>
              </nav>
              <p className="eyebrow mb-5">Tea Stories</p>
              <h1 className="text-balance font-serif text-5xl leading-[0.98] text-ink md:text-7xl">
                Stories worth
                <br />
                <em className="italic text-forest">steeping.</em>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
                Short reflections from the coaching room — on identity, family,
                faith, boundaries, and the quiet work of becoming yourself. Put
                the kettle on and stay a while.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="rounded-[1.5rem] border border-forest/15 bg-white/50 p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-clay">
                  <Coffee className="h-4 w-4" /> A note from Leaf
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  These are ordinary stories, told with care. Some are ours;
                  some are the lessons that keep returning in the room. Read
                  slowly, and take what is useful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          {stories.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-ink/10 bg-white/55 px-8 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Leaf className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-serif text-3xl text-ink">
                The first story is still steeping.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                We are preparing a few words for this space. In the meantime,
                the books and workbooks are always open.
              </p>
              <Link href="/books" className="btn-primary mt-7">
                Explore the books <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {featured && (
                <article className="grid gap-8 border-b border-ink/10 pb-14 md:grid-cols-12 md:items-center md:gap-12 md:pb-20">
                  <Link
                    href={`/tea-stories/${featured.slug}`}
                    className="group relative block overflow-hidden rounded-[2rem] bg-sand-deep md:col-span-7"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* User-uploaded images live on Vercel Blob or locally. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.025]"
                      />
                    </div>
                    <span className="absolute left-5 top-5 rounded-full bg-sand/90 px-3 py-1.5 text-[10px] uppercase tracking-widest text-forest backdrop-blur">
                      Latest story
                    </span>
                  </Link>

                  <div className="md:col-span-5">
                    <StoryMeta story={featured} />
                    <h2 className="mt-4 font-serif text-4xl leading-[1.08] text-ink md:text-5xl">
                      <Link
                        href={`/tea-stories/${featured.slug}`}
                        className="transition-colors hover:text-forest"
                      >
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
                      {featured.excerpt}
                    </p>
                    <Link
                      href={`/tea-stories/${featured.slug}`}
                      className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-4 hover:underline"
                    >
                      Read the story <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              )}

              {rest.length > 0 && (
                <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
                  {rest.map((story) => (
                    <article key={story.id} className="group">
                      <Link
                        href={`/tea-stories/${story.slug}`}
                        className="block overflow-hidden rounded-[1.5rem] bg-sand-deep"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={story.imageUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                          />
                        </div>
                      </Link>
                      <div className="mt-5">
                        <StoryMeta story={story} />
                        <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">
                          <Link
                            href={`/tea-stories/${story.slug}`}
                            className="transition-colors hover:text-forest"
                          >
                            {story.title}
                          </Link>
                        </h2>
                        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
                          {story.excerpt}
                        </p>
                        <Link
                          href={`/tea-stories/${story.slug}`}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest"
                        >
                          Read more <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
