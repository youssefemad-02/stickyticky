# Sticky Ticky — custom storefront starter

A bilingual (English/Arabic) Next.js + TypeScript storefront starter for Sticky Ticky. It includes a responsive landing page, category browsing, demo catalog, client-side cart, checkout preview, WhatsApp order handoff, and a starter Supabase schema.

## Important: demo, not production-ready

- Product names, descriptions, artwork, and sizes in `src/lib/products.ts` are clearly marked as demo content.
- Prices are `null` by design. No real product prices have been invented.
- Cart data is in browser memory and is not persisted.
- Checkout only prepares a preview; it does **not** create a real order or take payment.
- Supabase schema is provided, but database queries, admin authentication, server-side order creation, and payment/shipping integrations still need implementation.
- The WhatsApp button requires a configured business number.

## Requirements

- Node.js 20.9+
- A Supabase project (optional for the visual demo)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

To enable WhatsApp, set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the international number with digits only (for example `2010XXXXXXXX`, without `+` or spaces).

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the project URL and anon/publishable key into `.env.local`.
4. Replace the demo data layer with queries for active categories/products/variants.
5. Add admin authentication and server-side APIs for catalog management and order creation before accepting real orders.

Never put the Supabase `service_role` key in a `NEXT_PUBLIC_*` variable or client-side code.

## Before launch checklist

- [ ] Replace placeholders with the actual logo and approved product photos.
- [ ] Confirm Arabic/English copy and RTL layout with real brand assets.
- [ ] Enter verified product variants, prices, stock, and delivery fees.
- [ ] Implement server-side checkout validation and order persistence.
- [ ] Implement admin sign-in and secure admin-only policies.
- [ ] Connect the chosen Egyptian payment provider, if online payments are needed.
- [ ] Confirm shipping provider, coverage, rates, and return policy.
- [ ] Add privacy, terms, delivery, refund, and contact pages.
- [ ] Test accessibility, responsive layout, SEO, and production build.
