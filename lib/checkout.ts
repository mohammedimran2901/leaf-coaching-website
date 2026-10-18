import { PRODUCTS, getProduct, type Product } from './products'
import type { PayPalCustomer, PayPalItem } from './paypal'

export interface CheckoutLine {
  product: Product
  quantity: number
}

export interface ValidatedCheckout {
  lines: CheckoutLine[]
  items: PayPalItem[]
  total: number
  requiresShipping: boolean
  customer: PayPalCustomer
}

export class CheckoutError extends Error {}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateCheckout(body: unknown): ValidatedCheckout {
  if (!body || typeof body !== 'object') {
    throw new CheckoutError('We could not read that checkout request.')
  }

  const raw = body as {
    items?: unknown
    customer?: unknown
  }

  if (!Array.isArray(raw.items) || raw.items.length === 0) {
    throw new CheckoutError('Please choose something to pay for.')
  }

  if (raw.items.length > 10) {
    throw new CheckoutError('That is more items than we can take in one order.')
  }

  const lines: CheckoutLine[] = raw.items.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      throw new CheckoutError('One of the items in your order is invalid.')
    }

    const item = entry as { id?: unknown; quantity?: unknown }
    const product = getProduct(asString(item.id))

    if (!product) {
      throw new CheckoutError('One of the items in your order is no longer available.')
    }

    const quantity = Number(item.quantity ?? 1)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      throw new CheckoutError('Please choose a quantity between 1 and 10.')
    }

    return { product, quantity }
  })

  const customerRaw =
    raw.customer && typeof raw.customer === 'object'
      ? (raw.customer as Record<string, unknown>)
      : {}

  const customer: PayPalCustomer = {
    name: asString(customerRaw.name),
    email: asString(customerRaw.email),
    phone: asString(customerRaw.phone),
    notes: asString(customerRaw.notes),
  }

  if (customer.name.length < 2 || customer.name.length > 120) {
    throw new CheckoutError('Please enter your full name.')
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email) ||
    customer.email.length > 254
  ) {
    throw new CheckoutError('Please enter a valid email address.')
  }

  if (customer.phone && customer.phone.length > 40) {
    throw new CheckoutError('Please enter a valid phone number.')
  }

  if (customer.notes && customer.notes.length > 1000) {
    throw new CheckoutError('Please keep your notes under 1,000 characters.')
  }

  const items: PayPalItem[] = lines.map(({ product, quantity }) => ({
    name: product.name,
    description: product.meta,
    quantity,
    unitAmount: product.price,
  }))

  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  )

  return {
    lines,
    items,
    total: Math.round(total * 100) / 100,
    requiresShipping: lines.some((line) => line.product.physical),
    customer,
  }
}

export function orderReference(): string {
  const stamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `LC-${stamp}-${random}`
}

export function describeLines(lines: CheckoutLine[]): string {
  return lines
    .map(({ product, quantity }) =>
      quantity > 1 ? `${quantity} × ${product.name}` : product.name
    )
    .join(', ')
}

export const CATALOGUE_IDS = PRODUCTS.map((product) => product.id)
