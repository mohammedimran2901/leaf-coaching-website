# Leaf Coaching CIC — website

A Next.js 14 (App Router) site for Leaf Coaching CIC: a warm, editorial
homepage, service pages, and a PayPal checkout for sessions, bundles,
workshops, membership, and three digital editions: *Be Melting Snow*,
*Beyond the Role* and *How to Make Peace with Your Parents*.

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
| `/books` | Books and workbooks, including all three digital editions and how delivery works |
| `/tea-stories` | Tea Stories — an editorial index of featured and published stories |
| `/tea-stories/[slug]` | A single Tea Story with image, body and related stories |
| `/admin/login` | Staff sign-in (no public link) |
| `/admin/tea-stories` | Staff dashboard for creating, editing, publishing and deleting stories |
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
/pay?product=how-to-make-peace-with-your-parents
```

## Tea Stories & staff admin

`/tea-stories` is a public index of published stories, and each story has its
own page at `/tea-stories/[slug]`. Stories are written and managed at
`/admin/tea-stories` behind a password-protected staff area.

Set these in `.env.local` (see [Environment variables](#environment-variables)):

```bash
ADMIN_PASSWORD="a long, unique password"
ADMIN_SESSION_SECRET="$(openssl rand -base64 32)"
```

Locally, without `BLOB_READ_WRITE_TOKEN`, stories are written to
`.data/tea-stories/` and images to `public/uploads/tea-stories/`. Both are
git-ignored. In production, connect a **Vercel Blob** store to the project so
uploads and story JSON persist across deployments; without it the admin returns
a `503` instead of silently losing data.

Staff can:

- create a story with a title, web address, short introduction, body and cover
  image;
- save it as a draft or publish it immediately;
- replace the image or edit any field later;
- delete a story and its image.

Cover images may be JPG, PNG, WebP or AVIF. Large photos (over about 3.2 MB) are
resized in the browser before upload; the server accepts up to 4 MB. Story
bodies support a small Markdown subset: blank lines for paragraphs, `##`
headings, `>` quotes, `-` lists, `**bold**` and `*italic*`.

Sessions are signed with HMAC-SHA256, last 8 hours, and use an `httpOnly`,
`sameSite=lax` cookie that is `secure` in production. Login attempts are rate
limited in memory (6 per IP per 10 minutes). Set `ADMIN_SESSION_SECRET`
explicitly so changing the password does not invalidate every session.

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

If the PayPal SDK is blocked by an ad blocker or privacy setting, the checkout
times out after 12 seconds and offers **Continue to PayPal**. That creates the
same order through the REST API and redirects to PayPal's hosted checkout; the
`/pay/return` page captures the order and shows the same receipt and download.

### Digital downloads

The paid PDFs live under `private/downloads/` — deliberately outside
`public/`, so they cannot be fetched by guessing a URL:

- `be-melting-snow.pdf`
- `beyond-the-role.pdf`
- `how-to-make-peace-with-your-parents.pdf`

After a verified capture, `capture-order` issues an HMAC-signed link valid for
**7 days**:

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

### Free chapter previews

The first chapter of each title is also available as a free, public sample:

- `public/downloads/be-melting-snow-chapter-1-preview.pdf` — cover, title,
  copyright, contents and Chapter One (11 pages)
- `public/downloads/beyond-the-role-chapter-1-preview.pdf` — cover, contents
  and Part I (4 pages)
- `public/downloads/how-to-make-peace-with-your-parents-chapter-1-preview.pdf`
  — cover, contents and Week One (5 pages)

These files are intentionally public and are linked from `/books` through each
product's `preview` field in `lib/products.ts`. Unlike the paid PDFs, they live
under `public/`. If a title is revised, regenerate both the paid file and its
preview so the sample stays in step.

### Cover images

The shop covers are exported from page 1 of each paid PDF and saved as
1200 × 1600 WebP files under `public/images/`:

- `be-melting-snow-cover.webp`
- `beyond-the-role-cover.webp`
- `how-to-make-peace-with-your-parents-cover.webp`

They are referenced by the optional `image` field on each product in
`lib/products.ts` and shown on `/books`, the homepage and the checkout summary.
If a PDF cover changes, re-export its WebP so the shop artwork stays current.

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
| `ADMIN_PASSWORD` | Yes (for staff admin) | Password for `/admin`; keep it long and unique |
| `ADMIN_SESSION_SECRET` | Recommended | Signs the 8-hour staff session cookie. Generate with `openssl rand -base64 32`; falls back to `ADMIN_PASSWORD` |
| `BLOB_READ_WRITE_TOKEN` | Yes (in production) | Vercel Blob token for Tea Stories and images. Omitted locally uses `.data/` + `public/uploads/tea-stories/`; on Vercel, omission disables saving |

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
- **Storage**: Vercel Blob for Tea Stories (local filesystem fallback in development)
- **Hosting**: Vercel (or any Node host)

## Project notes

- Components live in `app/components/`; design tokens are in
  `tailwind.config.js` and utility classes in `app/globals.css`.
- PayPal callbacks are held in refs inside `PayPalButtons` so SDK re-renders
  never clear the button container.
- The checkout picker is grouped by `PRODUCT_GROUPS` from `lib/products.ts`
  (Coaching / Community / Books & workbooks).
- The contact form posts to `app/api/contact/route.ts`.
- Paid files belong in `private/downloads/`, never in `public/`. Free chapter
  previews are the exception and live in `public/downloads/`.
