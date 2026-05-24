# Azadi Coffee

Persian RTL Next.js ecommerce storefront for a minimalist specialty coffee roastery.

A self-contained Next.js App Router app with TypeScript, Tailwind CSS v4, and headless WooCommerce integration.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in WordPress/WooCommerce credentials.

## Features

- Persian (RTL) storefront with mirrored English routes under `/en`
- WordPress/WooCommerce headless data layer with seed fallbacks
- Theme presets and live design tokens (colors, typography, component styles)
- Design dashboard at `/dashboard/design`
- Playwright E2E tests

## Structure

- `src/app` — App Router routes (FA + `/en`), API routes, globals.css
- `src/components` — Layout, product, cart, blog, settings UI
- `src/lib` — WordPress/WooCommerce clients, theme settings, i18n, formatting
- `src/data` — Fallback product/blog data
- `public/fonts` — Vazirmatn woff2 files

## Fonts

Place `Vazirmatn-Regular.woff2` and `Vazirmatn-Bold.woff2` in `public/fonts/`.
