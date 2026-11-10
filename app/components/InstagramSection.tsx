import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  Coffee,
  Instagram,
  MessageCircle,
} from 'lucide-react'
import { getInstagramPosts, type InstagramPost } from '@/lib/instagram'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_EMAIL } from '@/lib/site'

const notes = [
  {
    icon: Coffee,
    title: 'Notes from the room',
    body: 'Small reflections on identity, faith, boundaries and becoming.',
    className: 'bg-clay-pale/70',
  },
  {
    icon: CalendarDays,
    title: 'Dates & workshops',
    body: 'New circles, dinner clubs and workshops are shared here first.',
    className: 'bg-sand-deep/70',
  },
  {
    icon: MessageCircle,
    title: 'Say hello',
    body: `Send a DM, or email ${SITE_EMAIL}.`,
    className: 'bg-white/70',
  },
]

function PostCard({ post }: { post: InstagramPost }) {
  const caption = post.caption.replace(/\s+/g, ' ').trim()

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-forest-deep"
      aria-label={caption ? `View on Instagram: ${caption.slice(0, 80)}` : 'View this post on Instagram'}
    >
      <img
        src={post.image}
        alt={caption ? caption.slice(0, 140) : 'A post from Leaf Coaching on Instagram'}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/10 to-transparent opacity-80 transition group-hover:opacity-95" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-sand">
        <span className="line-clamp-2 text-sm leading-snug">
          {caption || `@${INSTAGRAM_HANDLE}`}
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand/15 backdrop-blur transition group-hover:bg-sand group-hover:text-forest-deep">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </a>
  )
}

export default async function InstagramSection() {
  const posts = await getInstagramPosts(4)

  return (
    <section className="section-padding bg-sand">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">On Instagram</p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              A little more of <em className="italic text-clay">the everyday</em>.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Gentle reminders, behind-the-scenes moments and first news of new
              circles. Come and say salaam at{' '}
              <span className="whitespace-nowrap font-medium text-ink">
                @{INSTAGRAM_HANDLE}
              </span>
              .
            </p>
          </div>

          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
          >
            <Instagram className="h-4 w-4" />
            Follow along
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-12">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-forest-deep p-8 text-sand md:col-span-7 md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-sand/15" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-sand/10" />

              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sand/70">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </span>
                <span className="text-sm text-sand/70">@{INSTAGRAM_HANDLE}</span>
              </div>

              <div className="relative mt-16 max-w-md">
                <p className="font-serif text-3xl leading-tight md:text-4xl">
                  The feed is where the quieter work lives.
                </p>
                <p className="mt-4 text-sand/75">
                  Follow for reflections, workshop dates and the occasional
                  reminder that you are allowed to take up space.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-sand px-6 py-3 text-sm font-medium text-forest-deep transition group-hover:gap-3">
                  Visit @{INSTAGRAM_HANDLE}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-3 md:col-span-5 md:grid-cols-1">
              {notes.map((note) => (
                <div
                  key={note.title}
                  className={`rounded-[1.5rem] border border-ink/5 p-6 ${note.className}`}
                >
                  <note.icon className="h-5 w-5 text-clay" />
                  <p className="mt-4 font-serif text-xl text-ink">{note.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {note.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
