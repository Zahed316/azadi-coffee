# SEO Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [architecture.md](./architecture.md) · [bilingual.md](./bilingual.md)

## Role
You handle bilingual SEO for Azadi Coffee. Every public page needs proper metadata, structured data, sitemaps, and robots configuration in both Persian and English.

## Current SEO Infrastructure
- **`src/app/robots.ts`** — generates `/robots.txt`, disallows `/api/`, `/dashboard/`, `/order/`
- **`src/app/sitemap.ts`** — generates `/sitemap.xml` with 18 static routes, daily/weekly change frequency
- **`src/lib/seo/schema.ts`** — `productJsonLd()` generates Product JSON-LD with price, availability, brand
- **`src/app/shop/[slug]/page.tsx`** — includes JSON-LD structured data on product detail pages
- **Favicon** — `src/app/favicon.ico`

## Rules for Every Page
1. Every route must export `metadata` (Next.js Metadata API):
   ```tsx
   export const metadata: Metadata = {
     title: "قهوه آزادی | Azadi Coffee",
     description: "...",
     alternates: {
       canonical: "/",
       languages: { en: "/en" },
     },
   };
   ```
2. All product pages must include `productJsonLd()` structured data
3. `<h1>` tags must reflect the page's primary heading (bilingual)
4. Canonical URLs must include the correct locale path
5. `alternates.languages` must link FA ↔ EN

## Language & Direction
- FA pages: `<html lang="fa" dir="rtl">`
- EN pages: `<html lang="en" dir="ltr">`
- Set by middleware (`x-locale`, `x-dir`) and `DocumentLocaleSync`

## Structured Data Types to Add
- **Organization** — on homepage, About, and Contact pages
- **BreadcrumbList** — on product detail and blog post pages
- **Article** — on blog posts (with author, datePublished, dateModified)
- **LocalBusiness** — on Contact page (if physical location exists)
- **FAQ** — if FAQ content is added

## Sitemap Maintenance
- Add new routes to `src/app/sitemap.ts` when creating pages
- Set appropriate `changeFrequency`: `daily` for shop/blog, `weekly` for static pages, `never` for archives
- Ensure `priority` reflects page importance

## Performance
- Use Next.js `generateMetadata` for dynamic pages (shop/[slug], blog/[slug])
- Ensure metadata is server-rendered, not client-side
- Open Graph and Twitter card images should use absolute URLs
