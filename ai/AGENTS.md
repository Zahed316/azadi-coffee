# Memory

> **AI workflow:** Start with `../AI_WORKFLOW.md`, then use `README.md` and the relevant AI knowledge files.
> **Agent Corporation:** See [agent-corporation.md](./agents/agent-corporation.md) for the complete agent collaboration map, skill orchestration, and MCP server integration.

## Project Overview
Azadi Coffee — Persian (RTL) Next.js ecommerce storefront for a minimalist specialty coffee roastery. Dual-language (FA/EN), standalone static seed data, live theming via CSS custom properties, and a design dashboard. A full project map is in [project-map.md](./architecture/project-map.md). Architecture patterns and module connectivity are in [architecture.md](./architecture/architecture.md).

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in your credentials.

## Code Style Guidelines
- Use descriptive variable names
- Follow existing patterns in the codebase
- Extract complex conditions into meaningful boolean variables

## Architecture Notes
- **Dual-language RTL/LTR:** Persian default at `/`, English under `/en/`. Middleware (`src/proxy.ts`) sets `azadi_locale` cookie and `x-locale` header. `localePath()` and `alternateLocalePath()` utilities in `src/lib/i18n.ts`.
- **Page-stack homepage:** 6 tabbed panels (Home, Shop, Roastery, Blog, About, Contact) via `PageStackLayout` — horizontal stack on desktop, vertical on mobile.
- **Live theming:** `DesignSettingsProvider` (useSyncExternalStore + localStorage), full dashboard at `/dashboard/design` with 5 presets, color pickers, font upload, sliders. Storage key: `azadi.design.settings.v1`.
- **Cart system:** localStorage-backed reducer (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR`), React Context with hydration-safe SSR. Storage key: `azadi_cart_v1`.
- **Order flow:** Cart → `/checkout` → `POST /api/checkout` → Prisma order/payment records → PayButton (Server Action) → Zarinpal redirect → `/api/payment/callback` verify → order result.
- **Standalone data split:** Product/blog content comes from `src/data/` TypeScript arrays; orders, payments, admin sessions, leads, and audits persist through Prisma/PostgreSQL. No WordPress, WooCommerce, or external CMS.
- **Data layer:** `src/data/products.ts` and `src/data/posts.ts` provide typed data with bilingual FA/EN fields. See [data-layer.md](./agents/data-layer.md) for the update workflow and how to swap to an external backend later.

## Skills (Workflow Playbooks)
Workflow skills are in `ai/skills/<name>/SKILL.md`:
- **new-page** — Create a bilingual (FA+EN) page
- **new-product** — Add a coffee product to seed data
- **new-component** — Create a theme-aware bilingual component
- **debug-cart** — Diagnose cart bugs
- **debug-payment** — Diagnose payment flow issues
- **deploy** — Production deployment checklist

## Domain Agents
Domain-specific knowledge files are in `ai/agents/`:
- `bilingual.md` — FA/EN RTL/LTR architecture
- `data-layer.md` — Standalone seed data strategy and replacement guide
- `seo.md` — Bilingual SEO, structured data, sitemaps
- `devops.md` — Docker, CI/CD, environment config
- `pm.md` — Priorities, backlog, technical debt
- `design.md` — Live theming, CSS custom properties, presets
- `payment.md` — Zarinpal gateway, order flow
- `testing.md` — Vitest + Playwright test infrastructure

## Common Workflows
- **Run dev server:** `npm run dev`
- **Run unit tests:** `npx vitest` (25 tests in `src/data/` and `src/lib/`)
- **Run E2E tests:** `npx playwright test` (7 smoke tests in `tests/e2e/`)
- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **Docker build:** `docker build -t azadi-coffee .` (multi-stage, Node 24 Alpine, exposes port 3000)
