# AI Workflow

## Project Purpose
Azadi Coffee is a Persian-first bilingual ecommerce storefront for a minimalist specialty coffee roastery. It is a Next.js App Router app with FA routes at `/`, EN routes under `/en`, seed product/blog content, live CSS-variable theming, localStorage cart state, PostgreSQL/Prisma order persistence, an admin dashboard, and a Zarinpal payment flow.

## Folder Structure
- `src/app` — App Router pages, FA/EN routes, API routes, metadata, sitemap, robots, global CSS.
- `src/components` — Layout, page-stack, product, cart, form, blog, settings, and UI components.
- `src/lib` — Locale helpers, theme settings, cart/order logic, formatting, SEO schema, database/auth helpers, Zarinpal client.
- `src/data` — Typed seed data for products and posts. Orders, payments, admin sessions, leads, and audit records use Prisma/PostgreSQL.
- `prisma` — Standalone ecommerce database schema and migrations.
- `tests/e2e` — Playwright smoke tests.
- `public` — Static assets. Fonts stay in `public/fonts`; default icons are in `public/assets/icons`.
- `ai` — AI knowledge base: project maps, architecture notes, domain agents, skills, validation maps, memory, and preferences.

## Key Files
- `AGENTS.md` — Short project memory and common commands.
- `ai/README.md` — AI knowledge-system index.
- `ai/architecture/project-map.md` — Full codebase map.
- `ai/architecture/architecture.md` — Core architecture and data-flow patterns.
- `ai/maps/validation.md` — Validation commands by change type.
- `ai/maps/fragility.md` — High-risk files and pre-edit checks.
- `src/proxy.ts` — Locale middleware for cookies and headers.
- `src/lib/i18n.ts` — Locale path helpers.
- `src/lib/settings/design-presets.ts` and `src/lib/theme-settings.ts` — Theme model and CSS variables.
- `src/lib/cart/*` — Cart reducer, storage, context, and types.
- `src/lib/db/prisma.ts` and `prisma/schema.prisma` — Database client and production data models.
- `src/lib/zarinpal.ts` and `src/app/actions/payment.ts` — Payment gateway integration.

## Recommended Workflow
1. Read this file, then `ai/README.md`.
2. Read the relevant domain doc in `ai/agents/` and any workflow playbook in `ai/skills/`.
3. Inspect the source before editing. Use `ai/maps/symbols.json`, `ai/maps/imports.json`, and `ai/maps/impact.json` for navigation.
4. Keep edits scoped to the requested behavior and follow existing component/data patterns.
5. After structural changes, run `npm run maps:generate`.
6. Validate with the smallest relevant commands from `ai/maps/validation.md`.

## Editing Rules
- Preserve FA/EN route pairs and language switch behavior.
- Preserve RTL for Persian and LTR for English.
- Keep product and blog content in `src/data` unless a task explicitly changes the catalog data strategy.
- Keep order/payment/customer/admin persistence in Prisma; do not reintroduce in-memory production stores.
- Use existing CSS custom properties and theme-aware classes; do not hardcode one-off colors.
- Keep cart behavior hydration-safe and localStorage-backed.
- Keep Zarinpal amount handling and callback flow intact.
- Do not move convention-discovered root config files unless the tool configuration is also updated.
- Do not commit secrets. `.env.local` is local-only; use `.env.example` for documented variables.

## Avoid Breaking The Project
- Treat `src/proxy.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `next.config.ts` as high-risk files.
- Do not introduce WordPress, WooCommerce, or external CMS assumptions.
- Do not remove seed-data function signatures; components depend on them.
- Do not break public routes, sitemap entries, metadata, or JSON-LD on product pages.
- Do not rewrite unrelated modified files in this dirty worktree.

## Validation
- Unit tests: `npx vitest`
- E2E tests: `npx playwright test`
- Lint: `npm run lint`
- Build: `npm run build`
- Prisma client: `npm run db:generate`
- Maps: `npm run maps:generate`
- Use `ai/maps/validation.md` to choose targeted checks for each change type.
