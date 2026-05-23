# Azadi Coffee — AGENTS.md

## Commands

```sh
npm run dev              # Next.js dev server (webpack, no Turbopack)
npm run build            # production build (standalone output)
npm run lint             # ESLint (Next.js core-web-vitals + TS config)
npx tsc --noEmit         # TypeScript check (strict mode)
```

## Architecture

- **Next.js 16** App Router, output `standalone` (Docker-ready).
- **Bilingual** (`fa`/`en`): middleware (`src/proxy.ts`) sets `x-locale` header and `azadi_locale` cookie. English routes under `/en/*`. Layout reads `x-locale` from `headers()`.
- **Headless WP/WooCommerce backend**: all API calls go through `src/lib/api-client.ts` which reads `WORDPRESS_API_URL`. Two auth paths: WooCommerce Consumer Key/Secret OR WordPress Application Password (Basic Auth).
- **Fallback data**: `src/data/products.ts` and `src/data/posts.ts` are used when WP/Woo are unreachable (`safeApiFetch`/`hasWooCredentials` pattern). Never edit these as primary source — they are offline defaults.
- **Price**: WooCommerce stores in IRR; `mapWooProduct` divides by 10 for Toman display.
- **Bilingual content**: WordPress custom post meta (`title_fa`, `title_en`, `body_fa`, `body_en`, etc.) registered in `wp-content/themes/azadi-headless/functions.php`. Mapped via `metaVal`/`metaArr` helpers in `src/lib/wordpress.ts`.
- **Design tokens**: fetched from WP `azadi/v1/theme-settings`, applied as CSS custom properties on `<html>`. `src/lib/theme-settings.ts`.

## Key patterns

- `localePath(locale, path)` / `alternateLocalePath(locale, pathname)` in `src/lib/i18n.ts` for route generation.
- Pages under `src/app/en/` mirror `src/app/` with `locale="en"` prop.
- `getProducts("fa")` returns `CoffeeProduct[]` from WooCommerce or static fallback.
- `getPageBySlug(slug, locale)` fetches WP pages with slug candidates (`en-slug`, `en/slug`, `slug`).
- `safeApiFetch(path, fallback)` never throws — returns `fallback` on error or missing API URL.

## Caveats

- **No test framework installed.** No Jest, Playwright, or Vitest config.
- **Tailwind CSS v4** via `@tailwindcss/postcss` (not the v3 Tailwind CLI / `tailwind.config.js` approach).
- `getLandingSettings` is an alias for `getLandingPageSettings` (both defined in `theme-settings.ts`).
- `src/proxy.ts` must stay as a `.ts` file (not middleware.ts) — Next.js 16 convention.
- Cart state via `CartProvider` React context (`src/components/cart/CartProvider.tsx`).
- Layout reads `x-locale` header from middleware; during SSG `headers()` throws, caught and falls back to `"fa"`.
