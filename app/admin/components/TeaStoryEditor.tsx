'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'
import type { TeaStory } from '@/lib/tea-stories'
import { slugifyTeaStory, todayAsDateInput } from '@/lib/tea-story-utils'

const MAX_INPUT_BYTES = 20 * 1024 * 1024
const MAX_UPLOAD_BYTES = 3.6 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
}

/**
 * Resize oversized phone/camera images in the browser so the upload fits
 * comfortably inside Vercel's serverless request-body limit.
 */
async function optimiseImage(file: File): Promise<File> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Please choose a JPG, PNG, WebP or AVIF image.')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('That image is over 20 MB. Please choose a smaller file.')
  }
  if (file.size <= 3.2 * 1024 * 1024) return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(
      'This image could not be read by your browser. Please try exporting it as a JPG or PNG.',
    )
  }

  try {
    let smallest: Blob | null = null

    for (const attempt of [
      { maxDimension: 1800, quality: 0.82 },
      { maxDimension: 1400, quality: 0.74 },
      { maxDimension: 1100, quality: 0.66 },
    ]) {
      const scale = Math.min(
        1,
        attempt.maxDimension / Math.max(bitmap.width, bitmap.height),
      )
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))

      const context = canvas.getContext('2d')
      if (!context) continue
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      const blob = await canvasBlob(canvas, attempt.quality)
      if (blob && (!smallest || blob.size < smallest.size)) smallest = blob
      if (blob && blob.size <= MAX_UPLOAD_BYTES) break
    }

    if (!smallest) throw new Error('The image could not be prepared for upload.')
    if (smallest.size > 4 * 1024 * 1024) {
      throw new Error('The image is still too large after resizing. Please choose a smaller one.')
    }

    const type = smallest.type || 'image/jpeg'
    const extension = type === 'image/webp' ? 'webp' : type === 'image/png' ? 'png' : 'jpg'
    const base = file.name.replace(/\.[^.]+$/, '') || 'tea-story'
    return new File([smallest], `${base}.${extension}`, { type })
  } finally {
    bitmap.close()
  }
}

export default function TeaStoryEditor({ story }: { story?: TeaStory }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  const [title, setTitle] = useState(story?.title ?? '')
  const [slug, setSlug] = useState(story?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(story))
  const [excerpt, setExcerpt] = useState(story?.excerpt ?? '')
  const [body, setBody] = useState(story?.body ?? '')
  const [publishedAt, setPublishedAt] = useState(
    story?.publishedAt ?? todayAsDateInput(),
  )
  const [published, setPublished] = useState(story?.published ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(story?.imageUrl ?? '')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  const isEditing = Boolean(story)

  useEffect(() => {
    if (!slugEdited) setSlug(slugifyTeaStory(title))
  }, [title, slugEdited])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Please choose a JPG, PNG, WebP or AVIF image.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError('That image is over 20 MB. Please choose a smaller file.')
      event.target.value = ''
      return
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextPreview = URL.createObjectURL(file)
    previewUrlRef.current = nextPreview
    setImageFile(file)
    setPreviewUrl(nextPreview)
    setError('')
  }

  function clearSelectedImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setImageFile(null)
    setPreviewUrl(story?.imageUrl ?? '')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    if (!isEditing && !imageFile) {
      setError('Please add a cover image for the story.')
      return
    }

    setPending(true)
    setError('')

    try {
      const upload = imageFile ? await optimiseImage(imageFile) : null
      setStatus(upload ? 'Uploading image and saving…' : 'Saving changes…')

      const form = new FormData()
      form.set('title', title)
      form.set('slug', slug)
      form.set('excerpt', excerpt)
      form.set('body', body)
      form.set('publishedAt', publishedAt)
      form.set('published', published ? 'true' : 'false')
      if (upload) form.set('image', upload, upload.name)

      const endpoint = isEditing
        ? `/api/admin/tea-stories/${story?.id}`
        : '/api/admin/tea-stories'
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        body: form,
      })
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
        story?: TeaStory
      }

      if (response.status === 401) {
        router.replace('/admin/login')
        return
      }
      if (!response.ok || !data.story) {
        setError(data.error || 'The story could not be saved. Please try again.')
        setPending(false)
        setStatus('')
        return
      }

      router.push('/admin/tea-stories')
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'The story could not be saved. Please try again.',
      )
      setPending(false)
      setStatus('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/tea-stories"
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" /> All stories
        </Link>
        <div className="flex items-center gap-3">
          <span aria-live="polite" className="hidden text-xs text-ink-muted sm:block">
            {status}
          </span>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {pending ? 'Saving…' : isEditing ? 'Save changes' : 'Create story'}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Cover image</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              A warm, quiet photograph works best. It appears on the story page
              and the Tea Stories index.
            </p>

            <input
              ref={inputRef}
              id="story-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={chooseImage}
              className="sr-only"
            />

            {previewUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-ink/10">
                <div className="aspect-[16/9] bg-sand-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-2.5">
                  <p className="min-w-0 truncate text-xs text-ink-soft">
                    {imageFile
                      ? `${imageFile.name} · ${formatBytes(imageFile.size)}`
                      : 'Current cover image'}
                  </p>
                  <div className="flex items-center gap-1">
                    <label
                      htmlFor="story-image"
                      className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium text-forest transition hover:bg-forest/5"
                    >
                      {imageFile ? 'Choose another' : 'Replace'}
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={clearSelectedImage}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-ink-muted transition hover:bg-ink/5 hover:text-ink"
                      >
                        <Trash2 className="h-3 w-3" /> Undo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <label
                htmlFor="story-image"
                className="mt-4 flex aspect-[16/9] max-h-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 bg-sand/60 text-center transition hover:border-forest/40 hover:bg-forest/[0.03]"
              >
                <ImagePlus className="h-7 w-7 text-forest/60" />
                <span className="text-sm font-medium text-ink">Add a cover image</span>
                <span className="text-[11px] text-ink-muted">
                  JPG, PNG, WebP or AVIF · up to 20 MB
                </span>
              </label>
            )}

            <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
              Large photos are resized in your browser before upload. Landscape
              images at least 1200px wide look best.
            </p>
          </section>


          <section className="rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-ink">The story</h2>
              <span className="text-[11px] text-ink-muted">
                {body.length.toLocaleString()} / 60,000
              </span>
            </div>

            <div className="mt-5">
              <label
                htmlFor="story-title"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
              >
                Title
              </label>
              <input
                id="story-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={140}
                placeholder="The tea that tasted like home"
                className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-serif text-2xl leading-snug text-ink outline-none transition placeholder:text-ink/30 focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="story-slug"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
              >
                Web address
              </label>
              <div className="mt-2 flex overflow-hidden rounded-xl border border-ink/15 bg-white focus-within:border-forest/50 focus-within:ring-2 focus-within:ring-forest/10">
                <span className="flex items-center border-r border-ink/10 bg-sand/70 px-3 text-xs text-ink-muted">
                  /tea-stories/
                </span>
                <input
                  id="story-slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugEdited(true)
                    setSlug(event.target.value)
                  }}
                  placeholder="the-tea-that-tasted-like-home"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-ink/30"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-ink-muted">
                Created from the title. You can change it, but old links will stop working.
              </p>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="story-excerpt"
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
                >
                  Short introduction <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <span className="text-[11px] text-ink-muted">{excerpt.length} / 240</span>
              </div>
              <textarea
                id="story-excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                maxLength={240}
                rows={3}
                placeholder="A sentence or two that invites someone in. If left blank, we'll take the opening of the story."
                className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-ink/30 focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="story-body"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
              >
                Story
              </label>
              <textarea
                id="story-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={60_000}
                rows={18}
                placeholder={'Start writing…\n\nLeave a blank line between paragraphs.'}
                className="mt-2 min-h-[26rem] w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] leading-7 text-ink outline-none transition placeholder:text-ink/30 focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                Blank lines separate paragraphs. You can also use{' '}
                <code className="rounded bg-ink/5 px-1">## A heading</code>,{' '}
                <code className="rounded bg-ink/5 px-1">&gt; a quote</code>,{' '}
                <code className="rounded bg-ink/5 px-1">- a list</code>,{' '}
                <code className="rounded bg-ink/5 px-1">**bold**</code> and{' '}
                <code className="rounded bg-ink/5 px-1">*italic*</code>.
              </p>
            </div>
          </section>
        </div>


        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-[1.5rem] border border-ink/10 bg-white/70 p-5">
            <h2 className="font-serif text-xl text-ink">Publishing</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              Choose whether this story is visible on the public site.
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-forest/15 bg-forest/[0.04] p-3.5">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2f4a3c]"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  {published && <Check className="h-3.5 w-3.5 text-forest" />}
                  {published ? 'Published' : 'Save as a draft'}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-ink-muted">
                  {published
                    ? 'This story will appear on /tea-stories as soon as you save.'
                    : 'Only signed-in staff can see a draft.'}
                </span>
              </span>
            </label>

            <div className="mt-4">
              <label
                htmlFor="story-date"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
              >
                Story date
              </label>
              <input
                id="story-date"
                type="date"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
                className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
              />
              <p className="mt-1.5 text-[11px] text-ink-muted">
                Shown on the story and used to order the index.
              </p>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {pending ? 'Saving…' : isEditing ? 'Save changes' : 'Create story'}
            </button>
            <p aria-live="polite" className="mt-2 min-h-4 text-center text-[11px] text-ink-muted">
              {status}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-ink/10 bg-sand/60 p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg text-ink">
              <Sparkles className="h-4 w-4 text-clay" /> A few notes
            </h2>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink-soft">
              <li>Write the way you would tell it to a friend across the table.</li>
              <li>Short paragraphs are easier to read on a phone.</li>
              <li>You can save a draft now and publish it when it feels ready.</li>
              <li>Once published, the story is live immediately.</li>
            </ul>
          </section>
        </aside>
      </div>
    </form>
  )
}

