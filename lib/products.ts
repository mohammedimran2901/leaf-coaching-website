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
  | 'how-to-make-peace-with-your-parents'

export interface DigitalDownload {
  /** Path relative to the project root. Never place paid files in /public. */
  file: string
  /** Filename shown to the customer when they save the PDF. */
  filename: string
}

export interface DigitalPreview {
  /** Public path, relative to the site root. Free samples are safe to share. */
  file: string
  /** Label shown on the preview link. */
  label: string
  /** Number of pages in the sample PDF. */
  pages: number
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
  /** Free sample of the first chapter, served from /public. */
  preview?: DigitalPreview
}

export const CURRENCY = 'GBP'

export const PRODUCTS: Product[] = [
  {
    id: 'single-session',
    name: '45–60-minute 1-2-1 life coaching session',
    price: 75,
    category: 'coaching',
    summary:
      'A confidential, culturally sensitive session of 45–60 minutes that meets you exactly where you are.',
    description:
      'One-to-one coaching with Aamna Khokhar, with each session lasting 45–60 minutes. We will arrange a time that suits you after checkout. Online or in person.',
    meta: '45–60 minutes · online or in person',
    badge: 'Most popular',
  },
  {
    id: 'three-session-bundle',
    name: '3 × 45–60-minute life coaching sessions',
    price: 210,
    category: 'coaching',
    summary:
      'Three sessions of 45–60 minutes to build real momentum — and £15 saved against paying session by session.',
    description:
      'A focused three-session coaching journey with Aamna Khokhar, with each session lasting 45–60 minutes. We will agree a rhythm together after checkout, with sessions used within three months. Online or in person.',
    meta: '3 sessions · 45–60 minutes each · save £15',
    badge: 'New',
  },
  {
    id: 'six-session-bundle',
    name: '6 × 45–60-minute life coaching sessions',
    price: 420,
    category: 'coaching',
    summary:
      'Six 45–60-minute sessions of steady, supported growth — and £30 saved against paying week by week.',
    description:
      'A six-session coaching journey with Aamna Khokhar, with each session lasting 45–60 minutes. Sessions can be used over six months; we will agree a rhythm together after checkout.',
    meta: '6 sessions · 45–60 minutes each · save £30',
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
      'A 30-page relational patterns workbook for noticing what you reach for, understanding why, and recovering choice — now £3.99 (usually £12.99).',
    description:
      'A reflective, evidence-informed workbook by Aamna Khokhar. Thirty pages across five parts: why patterns develop, the Observer position and the Drama Triangle, the five adaptive patterns, mapping your relational system, and growing beyond the role. Includes a four-week practice, quick observer sheet, research notes and space to write. Your PDF download link appears immediately after payment and stays valid for seven days.',
    meta: 'Digital PDF · 30 pages · instant download',
    badge: 'Instant download',
    digital: true,
    download: {
      file: 'private/downloads/beyond-the-role.pdf',
      filename: 'Beyond-the-Role-Relational-Patterns-Workbook.pdf',
    },
    preview: {
      file: '/downloads/beyond-the-role-chapter-1-preview.pdf',
      label: 'Read chapter one free',
      pages: 4,
    },
  },
  {
    id: 'how-to-make-peace-with-your-parents',
    name: 'How to Make Peace with Your Parents — the workbook',
    price: 4.99,
    compareAtPrice: 19.99,
    saleLabel: 'Launch offer',
    category: 'books',
    summary:
      'A six-week self-guided programme for living alongside family with greater honesty, dignity, compassion and choice — now £4.99 (usually £19.99).',
    description:
      'A reflective, faith-sensitive workbook by Aamna Khokhar for anyone who loves their parents and still finds the relationship complicated. Six weekly chapters move from honest noticing and understanding them without excusing them, to reclaiming yourself, boundaries without abandonment, finding peace in the everyday, and choosing what to carry forward. Each week includes teaching, reflection prompts, a body-based practice, an Islamic reflection and an invitation to bring the work into ordinary life. Includes further reading, support information and space to write. Your PDF download link appears immediately after payment and stays valid for seven days.',
    meta: 'Digital PDF · 34 pages · instant download',
    badge: 'Instant download',
    digital: true,
    download: {
      file: 'private/downloads/how-to-make-peace-with-your-parents.pdf',
      filename: 'How-to-Make-Peace-with-Your-Parents-Workbook.pdf',
    },
    preview: {
      file: '/downloads/how-to-make-peace-with-your-parents-chapter-1-preview.pdf',
      label: 'Read chapter one free',
      pages: 5,
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
