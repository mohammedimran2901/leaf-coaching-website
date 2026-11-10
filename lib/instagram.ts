export interface InstagramPost {
  id: string
  caption: string
  image: string
  permalink: string
  mediaType: string
  timestamp: string
}

interface InstagramMedia {
  id?: unknown
  caption?: unknown
  media_type?: unknown
  media_url?: unknown
  thumbnail_url?: unknown
  permalink?: unknown
  timestamp?: unknown
}

const API_VERSION = process.env.INSTAGRAM_API_VERSION?.trim() || 'v23.0'

export function isInstagramConfigured(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim())
}

/**
 * Reads the latest media for the Leaf Coaching Instagram account.
 *
 * Uses the official Instagram API, so it needs a long-lived access token. With
 * Instagram Login, request `instagram_business_basic`; with a Facebook
 * Page-linked professional account, request `instagram_basic` and
 * `pages_read_engagement`. Without a token the homepage shows its designed
 * "follow us" panel instead of an empty grid.
 */
export async function getInstagramPosts(limit = 4): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim()
  if (!accessToken) return []

  const userId = process.env.INSTAGRAM_USER_ID?.trim()
  const endpoint = userId
    ? `https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(userId)}/media`
    : `https://graph.instagram.com/${API_VERSION}/me/media`

  const url = new URL(endpoint)
  url.searchParams.set(
    'fields',
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  )
  url.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 12)))
  url.searchParams.set('access_token', accessToken)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      console.warn('[instagram] media request failed', {
        status: response.status,
        detail: (await response.text().catch(() => '')).slice(0, 300),
      })
      return []
    }

    const payload = (await response.json()) as { data?: unknown }
    const items = Array.isArray(payload.data) ? payload.data : []

    return items
      .map((item): InstagramPost | null => {
        if (!item || typeof item !== 'object') return null
        const media = item as InstagramMedia
        const mediaType = typeof media.media_type === 'string' ? media.media_type : 'IMAGE'
        const image =
          mediaType === 'VIDEO'
            ? typeof media.thumbnail_url === 'string'
              ? media.thumbnail_url
              : ''
            : typeof media.media_url === 'string'
              ? media.media_url
              : typeof media.thumbnail_url === 'string'
                ? media.thumbnail_url
                : ''

        if (
          typeof media.id !== 'string' ||
          typeof media.permalink !== 'string' ||
          !image
        ) {
          return null
        }

        return {
          id: media.id,
          caption: typeof media.caption === 'string' ? media.caption.trim() : '',
          image,
          permalink: media.permalink,
          mediaType,
          timestamp: typeof media.timestamp === 'string' ? media.timestamp : '',
        }
      })
      .filter((post): post is InstagramPost => post !== null)
      .slice(0, limit)
  } catch (error) {
    console.warn('[instagram] media request threw', error)
    return []
  }
}
