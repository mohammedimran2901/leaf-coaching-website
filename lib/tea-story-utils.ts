/**
 * Small helpers shared by the Tea Stories editor, public pages and storage.
 * Keep this module free of server-only imports so the admin form can use it.
 */

export function slugifyTeaStory(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '')
}

export function todayAsDateInput(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatTeaStoryDate(value: string): string {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function teaStoryReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function excerptFromBody(body: string, maxLength = 180): string {
  const firstParagraph = body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.replace(/^[#>\-\s]+/gm, '').replace(/\s+/g, ' ').trim())
    .find(Boolean)

  if (!firstParagraph) return ''
  if (firstParagraph.length <= maxLength) return firstParagraph

  const shortened = firstParagraph.slice(0, maxLength)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, lastSpace > 80 ? lastSpace : maxLength).trim()}…`
}
