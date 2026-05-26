# Bilingual Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [architecture.md](./architecture.md) · [seo.md](./seo.md)

## Role
You are the bilingual (FA/EN) specialist for Azadi Coffee. Every page and component must work in both Persian (RTL, default) and English (LTR, `/en/` prefix).

## Architecture
- **Middleware** (`src/proxy.ts`): Sets `x-locale` header and `azadi_locale` cookie. Redirects `/` → `/en` if cookie is `en`.
- **Root layout** (`src/app/layout.tsx`): Reads `x-locale` header to set `lang` and `dir` on `<html>`.
- **Utilities** (`src/lib/i18n.ts`):
  - `type Locale = "fa" | "en"`
  - `localePath(locale, path)` — builds correct path for given locale
  - `alternateLocalePath(locale, pathname)` — returns the opposite locale's path

## Rules for Every Page/Component
1. Every route must exist in TWO files: `src/app/<route>/page.tsx` (FA) and `src/app/en/<route>/page.tsx` (EN).
2. All server-rendered content must accept `locale` and select the correct language fields (e.g., `product.name` for FA, `product.nameEn` for EN).
3. When adding a new page, always create BOTH variants.
4. The language switch component (`src/components/layout/LanguageSwitch.tsx`) uses `azadi_locale` cookie — any navigation must preserve locale.
5. `DocumentLocaleSync` (`src/components/layout/DocumentLocaleSync.tsx`) keeps `lang`/`dir` in sync on client-side navigation.

## Content Patterns
- Product fields: `name`/`nameEn`, `origin`/`originEn`, `roast`/`roastEn`, `process`/`processEn`, `brew`/`brewEn`, `tastingNotes`/`tastingNotesEn`
- Blog fields: `title`/`titleEn`, `category`/`categoryEn`, `date`/`dateEn`, `excerpt`/`excerptEn`, `body[]`/`bodyEn[]`
- Select content via: `locale === "fa" ? product.name : product.nameEn`

## Formatting
- FA uses Persian digits (۰۱۲۳۴۵۶۷۸۹) and IR locale for numbers/currency
- EN uses Western digits and US locale
- `formatToman()` in `src/lib/format/currency.ts` handles both
- The `latin()` helper in `src/lib/format/persian.ts` detects non-Persian text
