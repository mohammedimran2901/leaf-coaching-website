/**
 * The Leaf Coaching catalogue.
 *
 * Prices live here — never in the browser — so the PayPal API routes can
 * recalculate every order from a trusted source before it is submitted.
 */

export type ProductCategory = 'coaching' | 'community' | 'books'

export type ProductId =
  | 'single-session'
  | 'three-session-bundle'
  | 'six-session-bundle'
  | 'workshop-place'
  | 'dinner-club-month'
  | 'be-melting-snow'
  | 'beyond-the-role'

export interface DigitalDownload {
  /** Path relative to the project root. Never place paid files in /public. */
  file: string
  /** Filename shown to the customer when they save the PDF. */
  filename: string
}

export interface Product {
  id: ProductId
  name: string
  /** Price in GBP, as a number of pounds and pence. */
  price: number
  /** Original price in GBP when the product is on sale. */
  compareAtPrice?: number
  /** Short label shown next to a sale price. */
  saleLabel?: string
  category: ProductCategory
  summary: string
  description: string
  meta: string
  badge?: string
  /** Physical items need a delivery address collecting in PayPal. */
  physical?: boolean
  /** Digital items are delivered by signed download link after payment. */
  digital?: boolean
  download?: DigitalDownload
}

export const CURRENCY = 'GBP'

export const PRODUCTS: Product[] = [
  {
    id: 'single-session',
    name: '60-minute 1-2-1 life coaching session',
    price: 75,
    category: 'coaching',
    summary:
      'A confidential, culturally sensitive hour that meets you exactly where you are.',
    description:
      'One-to-one coaching with Aamna Khokhar. We will arrange a time that suits you after checkout. Online or in person.',
    meta: '60 minutes · online or in person',
    badge: 'Most popular',
  },
  {
    id: 'three-session-bundle',
    name: '3 × 60-minute life coaching sessions',
    price: 210,
    category: 'coaching',
    summary:
      'Three sessions to build real momentum — and £15 saved against paying session by session.',
    description:
      'A focused three-session coaching journey with Aamna Khokhar. We will agree a rhythm together after checkout, with sessions used within three months. Online or in person.',
    meta: '3 sessions · save £15',
    badge: 'New',
  },
  {
    id: 'six-session-bundle',
    name: '6 × 60-minute life coaching sessions',
    price: 420,
    category: 'coaching',
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
    category: 'community',
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
    category: 'community',
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
    category: 'books',
    summary:
      'Aamna’s eleven-chapter companion for forgiveness, new beginnings and finding yourself again.',
    description:
      'Inspired by Rumi and rooted in Aamna’s coaching practice. We will be in touch after checkout to arrange collection or delivery.',
    meta: 'Paperback · 11 chapters',
    physical: true,
  },
  {
    id: 'beyond-the-role',
    name: 'Beyond the Role — the workbook',
    price: 3.99,
    compareAtPrice: 12.99,
    saleLabel: 'Launch offer',
    category: 'books',
    summary:
      'A 29-page relational patterns workbook for noticing what you reach for, understanding why, and recovering choice — now £3.99 (usually £12.99).',
    description:
      'A reflective, evidence-informed workbook by Aamna Khokhar. Five parts, practical prompts and space to write. Your PDF download link appears immediately after payment and stays valid for seven days.',
    meta: 'Digital PDF · 29 pages · instant download',
    badge: 'Instant download',
    digital: true,
    download: {
      file: 'private/downloads/beyond-the-role.pdf',
      filename: 'Beyond-the-Role-Relational-Patterns-Workbook.pdf',
    },
  },
]

export const PRODUCT_GROUPS: Array<{
  id: ProductCategory
  label: string
  blurb: string
}> = [
  {
    id: 'coaching',
    label: 'Coaching',
    blurb: 'One-to-one sessions and longer journeys',
  },
  {
    id: 'community',
    label: 'Community',
    blurb: 'Workshops and the Halal Dinner Club',
  },
  {
    id: 'books',
    label: 'Books & workbooks',
    blurb: 'Paperback and instant PDF downloads',
  },
]

export function productsInCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((product) => product.category === category)
}

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
