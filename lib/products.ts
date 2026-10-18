/**
 * The Leaf Coaching catalogue.
 *
 * Prices live here — never in the browser — so the PayPal API routes can
 * recalculate every order from a trusted source before it is submitted.
 */

export type ProductId =
  | 'single-session'
  | 'six-session-bundle'
  | 'workshop-place'
  | 'dinner-club-month'
  | 'be-melting-snow'

export interface Product {
  id: ProductId
  name: string
  /** Price in GBP, as a number of pounds and pence. */
  price: number
  summary: string
  description: string
  meta: string
  badge?: string
  /** Physical items need a delivery address collecting in PayPal. */
  physical?: boolean
}

export const CURRENCY = 'GBP'

export const PRODUCTS: Product[] = [
  {
    id: 'single-session',
    name: '60-minute 1-2-1 life coaching session',
    price: 75,
    summary:
      'A confidential, culturally sensitive hour that meets you exactly where you are.',
    description:
      'One-to-one coaching with Aamna Khokhar. We will arrange a time that suits you after checkout. Online or in person.',
    meta: '60 minutes · online or in person',
    badge: 'Most popular',
  },
  {
    id: 'six-session-bundle',
    name: '6 x 60-minute life coaching sessions',
    price: 420,
    summary:
      'Six sessions of steady, supported growth — and £30 saved against paying week by week.',
    description:
      'A six-session coaching journey with Aamna Khokhar. Sessions can be used over six months; we will agree a rhythm together after checkout.',
    meta: '6 sessions · save £30',
    badge: 'Best value',
  },
  {
    id: 'workshop-place',
    name: 'Group workshop place',
    price: 49.95,
    summary:
      'A two-hour workshop of practical tools, honest conversation and community.',
    description:
      'A place on one of our group workshops — from resilience and positive mindset to balance, boundaries and imposter syndrome. We will confirm the next date with you.',
    meta: '2 hours · small group',
  },
  {
    id: 'dinner-club-month',
    name: 'Halal Dinner Club — one month',
    price: 129.95,
    summary:
      'Good food, real conversation and a community that has your back.',
    description:
      'One month of Halal Dinner Club membership, including event access and advocacy training. We will send your welcome pack after checkout.',
    meta: 'One month · events included',
  },
  {
    id: 'be-melting-snow',
    name: 'Be Melting Snow — the book',
    price: 8.99,
    summary:
      'Aamna’s eleven-chapter companion for forgiveness, new beginnings and finding yourself again.',
    description:
      'Inspired by Rumi and rooted in Aamna’s coaching practice. We will be in touch after checkout to arrange collection or delivery.',
    meta: 'Paperback · 11 chapters',
    physical: true,
  },
]

export function getProduct(id: string | null | undefined): Product | undefined {
  if (!id) return undefined
  return PRODUCTS.find((product) => product.id === id)
}

export function isProductId(id: string): id is ProductId {
  return PRODUCTS.some((product) => product.id === id)
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: CURRENCY,
  }).format(amount)
}
