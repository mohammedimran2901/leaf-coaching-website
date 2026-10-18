# Leaf Coaching CIC — website

A Next.js 14 (App Router) site for Leaf Coaching CIC: a warm, editorial
homepage, service pages, and a PayPal checkout for sessions, workshops,
membership and the *Be Melting Snow* book.

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
| `/pay` | Two-step checkout (details → PayPal) with a sticky order summary |
| `/contact` | Contact form |

Deep links into checkout use `?product=`:

```
/pay?product=single-session
/pay?product=six-session-bundle
/pay?product=workshop-place
/pay?product=dinner-club-month
/pay?product=be-melting-snow
```

## Payments

Prices and product names live in [`lib/products.ts`](lib/products.ts) and are
the single source of truth. The browser only sends product IDs and quantities;
`app/api/paypal/create-order/route.ts` and
`app/api/paypal/capture-order/route.ts` recalculate every line and the total
server-side before talking to PayPal. If a client tampers with a price, the
server ignores it.

Flow:

1. `/pay` collects name, email, phone and notes (plus consent).
2. `PayPalButtons` calls `POST /api/paypal/create-order`.
3. PayPal's popup handles approval; `POST /api/paypal/capture-order` captures
   the payment server-side and returns a reference.
4. The page shows a receipt with a `mailto:` follow-up link.

### Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Yes (for checkout) | Public PayPal REST app client ID, used by the JS SDK |
| `PAYPAL_CLIENT_ID` | Yes (for checkout) | Server client ID (may be the same value) |
| `PAYPAL_CLIENT_SECRET` | Yes (for checkout) | Server secret — never expose publicly |
| `PAYPAL_ENV` | No | `sandbox` (default) or `live` |
| `PAYMENT_NOTIFICATION_WEBHOOK` | No | Optional JSON POST of captured orders for bookkeeping |

Without `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET`, the API routes return
`503` and checkout falls back to an `hello@leafcoaching.com` email prompt, so
the site remains usable before payments go live.

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
- The contact form posts to `app/api/contact/route.ts`.
