# Leaf Coaching CIC — website

A Next.js 14 (App Router) site for Leaf Coaching CIC: a warm, editorial
homepage, service pages, and a PayPal checkout for sessions, bundles,
workshops, membership, the *Be Melting Snow* book and the *Beyond the Role*
digital workbook.

## Quick start

```bash
npm install
cp .env.example .env.local   # add PayPal credentials (optional for browsing)
npm run dev                  # http://localhost:3000
```

Useful commands:

```bash
npx tsc --noEmit   # type-check
npm run build      # production build
npm run start      # serve the production build
npm run lint       # next lint
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage — homage hero, marquee, story timeline, six pillars, impact, payment teaser, testimonials, booking CTA |
| `/about` | Story, values and approach |
| `/services` | Services and catalogue prices with direct **Pay & book** links |
| `/books` | Books and workbooks, including the digital workbook and how delivery works |
| `/pay` | Two-step checkout (details → PayPal) with a sticky order summary |
| `/contact` | Contact form |

Deep links into checkout use `?product=`:

```
/pay?product=single-session
/pay?product=three-session-bundle
/pay?product=six-session-bundle
/pay?product=workshop-place
/pay?product=dinner-club-month
/pay?product=be-melting-snow
/pay?product=beyond-the-role
```

## Payments

Prices and product names live in [`lib/products.ts`](lib/products.ts) and are
the single source of truth. `price` is always the amount actually charged;
`compareAtPrice` and `saleLabel` are display-only fields for showing a sale.
The browser only sends product IDs and quantities;
`app/api/paypal/create-order/route.ts` and
`app/api/paypal/capture-order/route.ts` recalculate every line and the total
server-side before talking to PayPal. If a client tampers with a price, the
server ignores it.

Flow:

1. `/pay` collects name, email, phone and notes (plus consent).
2. `PayPalButtons` calls `POST /api/paypal/create-order`. The route writes a
   compact basket fingerprint into the order's `custom_id`.
3. PayPal's popup handles approval; `POST /api/paypal/capture-order` captures
   the payment server-side, re-reads the basket from `custom_id`, and checks the
   captured amount against catalogue prices before fulfilling.
4. The page shows a receipt with a `mailto:` follow-up link — and, for digital
   products, a signed download link.

### Digital downloads

The workbook PDF lives at `private/downloads/beyond-the-role.pdf` — deliberately
outside `public/`, so it cannot be fetched by guessing a URL. After a verified
capture, `capture-order` issues an HMAC-signed link valid for **7 days**:

```
/api/download?token=<signed-token>
```

The token contains the PayPal order ID, product ID and expiry; changing any part
of it invalidates the signature. The route streams the PDF with
`Content-Disposition: attachment` and `no-store` caching.

- `next.config.js` uses `outputFileTracingIncludes` so the PDF is bundled with
  the `/api/download` function on Vercel. If you add another paid file, add it
  under `private/` and register it in the product's `download` field.
- `SITE_URL` is optional but recommended in production (e.g.
  `https://www.leafcoaching.com`) so links are built with the canonical host.
- If a customer loses the link, re-issue it from the PayPal order — or email
  them the PDF from `private/`. Set `DOWNLOAD_SIGNING_SECRET` explicitly in
  production; rotating it invalidates all existing links.

### Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | No | Optional build-time copy of the public client ID. The checkout also fetches it at runtime from `/api/paypal/config`, so `PAYPAL_CLIENT_ID` is the source of truth |
| `PAYPAL_CLIENT_ID` | Yes (for checkout) | Public client ID used by the server and served to the browser by `/api/paypal/config` |
| `PAYPAL_CLIENT_SECRET` | Yes (for checkout) | Server secret — never expose publicly |
| `PAYPAL_ENV` | No | `sandbox` (default) or `live` |
| `PAYMENT_NOTIFICATION_WEBHOOK` | No | Optional JSON POST of captured orders for bookkeeping (includes issued download links) |
| `DOWNLOAD_SIGNING_SECRET` | No | Signs download links. Falls back to `PAYPAL_CLIENT_SECRET`; set explicitly in production |
| `SITE_URL` | No | Canonical public origin for download links. Defaults to the request host |

The browser resolves the client ID from `/api/paypal/config`, which reads
`PAYPAL_CLIENT_ID` at runtime. A missing or stale `NEXT_PUBLIC_*` build variable
therefore cannot silently disable the PayPal buttons. Without
`PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET`, the API routes return `503` and
checkout shows an `hello@leafcoaching.com` contact prompt, so the site remains
usable before payments go live.

### Going live

1. Create a REST app at <https://developer.paypal.com/dashboard/applications>.
2. Test end-to-end with **sandbox** credentials and a sandbox personal account.
3. Swap in the live client ID/secret, set `PAYPAL_ENV=live`, and redeploy.
4. Confirm the business account can receive GBP and that the return experience
   works on mobile.

Never commit `.env.local`; it is ignored by git.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom forest/clay/sand tokens
- **Animation**: Framer Motion (respects `prefers-reduced-motion`)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Payments**: PayPal Orders v2 REST API (no SDK dependency server-side)
- **Hosting**: Vercel (or any Node host)

## Project notes

- Components live in `app/components/`; design tokens are in
  `tailwind.config.js` and utility classes in `app/globals.css`.
- PayPal callbacks are held in refs inside `PayPalButtons` so SDK re-renders
  never clear the button container.
- The checkout picker is grouped by `PRODUCT_GROUPS` from `lib/products.ts`
  (Coaching / Community / Books & workbooks).
- The contact form posts to `app/api/contact/route.ts`.
- Paid files belong in `private/downloads/`, never in `public/`.
