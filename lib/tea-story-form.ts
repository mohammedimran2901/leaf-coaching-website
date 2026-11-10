import 'server-only'

import { TeaStoryError, type TeaStoryInput } from './tea-stories'

function text(form: FormData, key: string): string {
  const value = form.get(key)
  return typeof value === 'string' ? value : ''
}

export function teaStoryInputFromFormData(form: FormData): TeaStoryInput {
  return {
    title: text(form, 'title'),
    excerpt: text(form, 'excerpt'),
    body: text(form, 'body'),
    slug: text(form, 'slug'),
    published: text(form, 'published') === 'true',
    publishedAt: text(form, 'publishedAt'),
  }
}

export function imageFromFormData(form: FormData): File | null {
  const value = form.get('image')
  if (!value || typeof value === 'string') return null
  if (!('arrayBuffer' in value) || !('size' in value)) return null
  return value.size > 0 ? value : null
}

export function teaStoryApiError(error: unknown): {
  message: string
  status: number
} {
  if (error instanceof TeaStoryError) {
    return { message: error.message, status: error.status }
  }

  console.error('[tea-stories]', error)
  return {
    message: 'Something went wrong while saving the story. Please try again.',
    status: 500,
  }
}
