# Azadi Coffee

Persian RTL Next.js ecommerce storefront for a minimalist specialty coffee roastery.

A self-contained Next.js App Router app with TypeScript, Tailwind CSS v4, and standalone seed data.

For AI coding assistants, start with `AI_WORKFLOW.md` and the visible knowledge base in `ai/`.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in your credentials.

## Features

- Persian (RTL) storefront with mirrored English routes under `/en`
- Standalone seed catalog/blog layer with bilingual FA/EN content and no external CMS
- PostgreSQL/Prisma order, payment, admin-session, lead, and audit models for production operations
- Theme presets and live design tokens (colors, typography, component styles)
- Design dashboard at `/dashboard/design`
- Admin dashboard at `/admin`
- Playwright E2E tests

## Structure

- `src/app` — App Router routes (FA + `/en`), API routes, globals.css
- `src/components` — Layout, product, cart, blog, settings UI
- `src/lib` — Theme settings, i18n, formatting, cart/order utilities
- `prisma` — PostgreSQL schema for standalone ecommerce backend
- `src/data` — Product and blog data (standalone, no external dependencies)
- `public/fonts` — Vazirmatn woff2 files
- `ai` — General-purpose AI workflow notes, architecture maps, domain agents, and skills

## Fonts

Place `Vazirmatn-Regular.woff2` and `Vazirmatn-Bold.woff2` in `public/fonts/`.

## Production Backend

Set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ZARINPAL_MERCHANT_ID`, and Resend variables before production deploy.

```bash
npm run db:generate
npm run db:dev
npm run build
```
