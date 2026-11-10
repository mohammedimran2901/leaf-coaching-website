import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { del, list, put } from '@vercel/blob'
import {
  excerptFromBody,
  slugifyTeaStory,
  todayAsDateInput,
} from './tea-story-utils'

export interface TeaStory {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  imageUrl: string
  published: boolean
  /** Date-only value, e.g. 2026-11-10. */
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface TeaStoryInput {
  title: string
  excerpt: string
  body: string
  slug: string
  published: boolean
  publishedAt: string
}

export class TeaStoryError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'TeaStoryError'
    this.status = status
  }
}

const POST_PREFIX = 'tea-stories/posts/'
const IMAGE_PREFIX = 'tea-stories/images/'
const LOCAL_POSTS_DIR = path.join(process.cwd(), '.data', 'tea-stories', 'posts')
const LOCAL_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'tea-stories')

const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const isVercel = Boolean(process.env.VERCEL)

export const blobStorageConfigured = Boolean(blobToken)
export const teaStoryStorageMode: 'blob' | 'local' | 'unavailable' =
  blobStorageConfigured ? 'blob' : isVercel ? 'unavailable' : 'local'

const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function normaliseStory(value: unknown): TeaStory | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>

  if (
    typeof raw.id !== 'string' ||
    typeof raw.slug !== 'string' ||
    typeof raw.title !== 'string' ||
    typeof raw.body !== 'string' ||
    typeof raw.imageUrl !== 'string'
  ) {
    return null
  }

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt:
      typeof raw.excerpt === 'string' ? raw.excerpt : excerptFromBody(raw.body),
    body: raw.body,
    imageUrl: raw.imageUrl,
    published: raw.published === true,
    publishedAt:
      typeof raw.publishedAt === 'string'
        ? raw.publishedAt
        : todayAsDateInput(),
    createdAt:
      typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt:
      typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  }
}

async function readLocalStories(): Promise<TeaStory[]> {
  try {
    const files = await fs.readdir(LOCAL_POSTS_DIR)
    const stories = await Promise.all(
      files
        .filter((file) => file.endsWith('.json'))
        .map(async (file) => {
          try {
            const content = await fs.readFile(path.join(LOCAL_POSTS_DIR, file), 'utf8')
            return normaliseStory(JSON.parse(content))
          } catch {
            return null
          }
        }),
    )
    return stories.filter((story): story is TeaStory => story !== null)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function readBlobStories(): Promise<TeaStory[]> {
  if (!blobToken) return []

  const result = await list({
    prefix: POST_PREFIX,
    limit: 1000,
    token: blobToken,
  })

  const stories = await Promise.all(
    result.blobs
      .filter((blob) => blob.pathname.endsWith('.json'))
      .map(async (blob) => {
        try {
          // The cache-buster makes sure an edited post is visible immediately,
          // even if the Blob CDN had cached the previous version.
          const response = await fetch(`${blob.url}?v=${Date.now()}`, {
            cache: 'no-store',
          })
          if (!response.ok) return null
          return normaliseStory(await response.json())
        } catch {
          return null
        }
      }),
  )

  return stories.filter((story): story is TeaStory => story !== null)
}

export async function getAllTeaStories(): Promise<TeaStory[]> {
  const stories = blobStorageConfigured
    ? await readBlobStories()
    : await readLocalStories()

  return stories.sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt)
    return byDate !== 0 ? byDate : b.createdAt.localeCompare(a.createdAt)
  })
}

export async function getPublishedTeaStories(): Promise<TeaStory[]> {
  return (await getAllTeaStories()).filter((story) => story.published)
}

export async function getTeaStoryBySlug(slug: string): Promise<TeaStory | null> {
  const stories = await getAllTeaStories()
  return stories.find((story) => story.slug === slug && story.published) ?? null
}

export async function getTeaStoryById(id: string): Promise<TeaStory | null> {
  const stories = await getAllTeaStories()
  return stories.find((story) => story.id === id) ?? null
}

function ensureStorageWritable() {
  if (teaStoryStorageMode === 'unavailable') {
    throw new TeaStoryError(
      'Tea Stories storage is not configured. Connect a Vercel Blob store to this project and redeploy.',
      503,
    )
  }
}

export function uniqueTeaStorySlug(
  requestedSlug: string,
  stories: TeaStory[],
  currentId?: string,
): string {
  const base = slugifyTeaStory(requestedSlug) || 'tea-story'
  const used = new Set(
    stories.filter((story) => story.id !== currentId).map((story) => story.slug),
  )

  if (!used.has(base)) return base

  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

export function validateTeaStoryInput(input: TeaStoryInput): TeaStoryInput {
  const title = input.title.trim()
  const body = input.body.trim()
  const excerpt = input.excerpt.trim()
  const requestedSlug = input.slug.trim()

  if (title.length < 2 || title.length > 140) {
    throw new TeaStoryError('Please give the story a title between 2 and 140 characters.')
  }
  if (body.length < 20) {
    throw new TeaStoryError('Please write at least 20 characters for the story.')
  }
  if (body.length > 60_000) {
    throw new TeaStoryError('That story is too long. Please keep it under 60,000 characters.')
  }
  if (excerpt.length > 240) {
    throw new TeaStoryError('Please keep the short introduction under 240 characters.')
  }

  const publishedAt = /^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt)
    ? input.publishedAt
    : todayAsDateInput()
  if (Number.isNaN(new Date(`${publishedAt}T12:00:00`).getTime())) {
    throw new TeaStoryError('Please choose a valid story date.')
  }

  return {
    title,
    body,
    excerpt: excerpt || excerptFromBody(body),
    slug: slugifyTeaStory(requestedSlug || title) || 'tea-story',
    published: input.published,
    publishedAt,
  }
}

export async function saveTeaStory(story: TeaStory): Promise<TeaStory> {
  ensureStorageWritable()

  if (blobStorageConfigured && blobToken) {
    await put(`${POST_PREFIX}${story.id}.json`, JSON.stringify(story, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
      token: blobToken,
    })
    return story
  }

  await fs.mkdir(LOCAL_POSTS_DIR, { recursive: true })
  await fs.writeFile(
    path.join(LOCAL_POSTS_DIR, `${story.id}.json`),
    JSON.stringify(story, null, 2),
    'utf8',
  )
  return story
}

export async function createTeaStory(
  input: TeaStoryInput,
  image: File,
): Promise<TeaStory> {
  ensureStorageWritable()

  const stories = await getAllTeaStories()
  const validated = validateTeaStoryInput(input)
  const id = randomUUID()
  const slug = uniqueTeaStorySlug(validated.slug, stories)
  const now = new Date().toISOString()
  const imageUrl = await saveTeaStoryImage(image, id)

  const story: TeaStory = {
    id,
    slug,
    title: validated.title,
    excerpt: validated.excerpt,
    body: validated.body,
    imageUrl,
    published: validated.published,
    publishedAt: validated.publishedAt,
    createdAt: now,
    updatedAt: now,
  }

  try {
    return await saveTeaStory(story)
  } catch (error) {
    await deleteTeaStoryImage(imageUrl)
    throw error
  }
}

export async function updateTeaStory(
  existing: TeaStory,
  input: TeaStoryInput,
  image?: File | null,
): Promise<TeaStory> {
  ensureStorageWritable()

  const stories = await getAllTeaStories()
  const validated = validateTeaStoryInput(input)
  const slug = uniqueTeaStorySlug(validated.slug, stories, existing.id)
  let imageUrl = existing.imageUrl

  if (image) {
    imageUrl = await saveTeaStoryImage(image, existing.id)
  }

  const updated: TeaStory = {
    ...existing,
    slug,
    title: validated.title,
    excerpt: validated.excerpt,
    body: validated.body,
    imageUrl,
    published: validated.published,
    publishedAt: validated.publishedAt,
    updatedAt: new Date().toISOString(),
  }

  try {
    const saved = await saveTeaStory(updated)
    if (image && existing.imageUrl !== imageUrl) {
      await deleteTeaStoryImage(existing.imageUrl)
    }
    return saved
  } catch (error) {
    if (image) await deleteTeaStoryImage(imageUrl)
    throw error
  }
}

export async function deleteTeaStory(story: TeaStory): Promise<void> {
  ensureStorageWritable()

  if (blobStorageConfigured && blobToken) {
    await del(`${POST_PREFIX}${story.id}.json`, { token: blobToken })
  } else {
    await fs.rm(path.join(LOCAL_POSTS_DIR, `${story.id}.json`), { force: true })
  }

  await deleteTeaStoryImage(story.imageUrl)
}




export async function saveTeaStoryImage(file: File, storyId: string): Promise<string> {
  ensureStorageWritable()

  const extension = IMAGE_TYPES[file.type]
  if (!extension) {
    throw new TeaStoryError(
      'Please upload a JPG, PNG, WebP or AVIF image.',
      415,
    )
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new TeaStoryError(
      'That image is larger than 4 MB. Please choose a smaller image.',
      413,
    )
  }

  const filename = `${storyId}-${Date.now()}.${extension}`
  const bytes = Buffer.from(await file.arrayBuffer())

  if (blobStorageConfigured && blobToken) {
    const blob = await put(`${IMAGE_PREFIX}${filename}`, bytes, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
      cacheControlMaxAge: 31_536_000,
      token: blobToken,
    })
    return blob.url
  }

  await fs.mkdir(LOCAL_IMAGES_DIR, { recursive: true })
  await fs.writeFile(path.join(LOCAL_IMAGES_DIR, filename), bytes)
  return `/uploads/tea-stories/${filename}`
}

export async function deleteTeaStoryImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return

  if (imageUrl.startsWith('/uploads/tea-stories/')) {
    const filename = path.basename(imageUrl)
    await fs.rm(path.join(LOCAL_IMAGES_DIR, filename), { force: true })
    return
  }

  if (blobStorageConfigured && blobToken) {
    try {
      const hostname = new URL(imageUrl).hostname
      if (hostname.endsWith('.public.blob.vercel-storage.com')) {
        await del(imageUrl, { token: blobToken })
      }
    } catch {
      // A missing or malformed old image should never block deleting the post.
    }
  }
}
