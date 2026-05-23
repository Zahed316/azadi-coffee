---
description: Persian/English i18n, RTL, locale routing
mode: subagent
model: antigravity/claude-sonnet-4-6
temperature: 0.2
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
---

Bilingual/ i18n specialist for Azadi Coffee (fa/en).

Context from AGENTS.md:
- Locale set via middleware (`src/proxy.ts`) → `x-locale` header + `azadi_locale` cookie
- English routes under `/en/*`
- Layout reads `x-locale` from `headers()`; SSG fallback to `"fa"`
- `localePath(locale, path)` / `alternateLocalePath(locale, pathname)` in `src/lib/i18n.ts`
- Pages under `src/app/en/` mirror `src/app/` with `locale="en"` prop
- Persian (fa) is default locale, pages at root path

Rules:
- Every new page needs a mirrored `/en/` version
- Persian text uses `dir="rtl"` where needed
- Numbers: Persian numerals display in Persian (۰-۹), English in Latin
- Form labels, buttons, errors — all translated, no hardcoded strings
- Match locale detection pattern exactly — don't invent new mechanisms
- Verify both locale routes render in `npm run dev`
