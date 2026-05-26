# Validation Matrix

> What to run after each type of change. Matches change category → correct validation sequence.
> This prevents both over-testing (slow) and under-testing (dangerous).

---

## How to use

Find your change type in the table below. Run Phase 1 first. If it passes, run Phase 2. Phase 3 is manual spot-checking.

If **anything fails**, fix it before proceeding to the next phase. If a test file doesn't exist for your change, Phase 1 is `npm run lint`.

---

## Quick Reference

| I changed... | Run |
|-------------|-----|
| A single component | `npm run build` |
| A shared lib function | `npx vitest` (that file's test) + `npm run build` |
| A product/post in data/ | `npx vitest src/data/` + `npm run build` |
| CSS/design | `npm run lint` + visual check |
| Cart/payment logic | `npx vitest` (relevant test) + checkout flow |
| Layout/routing | `npm run build` + `npm run lint` + manual spot checks |
| Config (Docker, next.config, env) | `npm run build` + `docker build -t azadi-coffee .` |
| A new page | `npm run build` + `npx playwright test --grep "smoke"` |

---

## Full Matrix

### Design / CSS only

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run lint` | Catch syntax errors, missing Tailwind classes |
| 2 | `npm run build` | Verify CSS compiles without errors |
| 3 | Visual: check `/dashboard/design`, verify presets switch correctly, check light + dark mode | CSS issues often only visible at runtime |

**Skip these:** `npx vitest`, `npx playwright test`, `docker build` — CSS changes don't affect logic.

### Component change (add/edit/delete a component)

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run build` | Catch import errors, TS errors, cyclic deps |
| 2 | `npx playwright test --grep "smoke"` | E2E smoke covers most pages that render components |
| 3 | Spot-check: visit affected page(s) in dev server | Visual verification of the changed component |

**Also run:** `npx vitest` specific test if the component imports from a tested module (see [impact.json](./impact.json)).

### Data change (products.ts, posts.ts)

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npx vitest src/data/` | 6 tests — all product/post retrieval + slug uniqueness |
| 2 | `npm run build` | Static params generation, shop/blog pages |
| 3 | Visit: `/shop`, `/shop/[slug]`, `/blog`, `/blog/[slug]` for BOTH FA and EN | Verify bilingual content renders |

### Cart logic (cart-reducer, cart-context, cart-storage, types)

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npx vitest src/lib/cart/` | 8 reducer tests — all actions, count, total |
| 2 | `npm run build` | Verify no compile errors propagated to cart components |
| 3 | Manual: add to cart, change quantity, remove, verify cart count, verify `localStorage` key `azadi_cart_v1` | Cart state is localStorage-dependent |

### Payment / checkout

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npx vitest src/lib/orders/` | 6 order store tests |
| 2 | `npm run build` | Verify server actions compile |
| 3 | Manual full flow: `/shop` → add → `/checkout` → submit → pay → callback → `/order/[id]` | Payment sandbox only (`ZARINPAL_SANDBOX=true`) |
| 4 | Verify order status transitions: pending → processing → completed | Check in-memory store state |

### Middleware / routing (proxy.ts, any route file)

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run build` | Catch broken imports, missing routes |
| 2 | `npm run lint` | Catch edge cases |
| 3 | `npx playwright test` | Full E2E suite (7 tests) — language switch, routing, 404 |
| 4 | Manual: `/`, `/en/`, `/shop`, `/en/shop`, `/shop/nonexistent`, `/en/nonexistent` | Verify cookie behavior, redirects, 404 pages |

### Config change (next.config.ts, Dockerfile, .env, tsconfig, eslint, postcss, tailwind)

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run build` | Full build — catches config errors immediately |
| 2 | `docker build -t azadi-coffee .` | Verify Docker multi-stage still works |
| 3 | `docker run -p 3000:3000 --env-file .env.local azadi-coffee` | Verify standalone server starts |
| 4 | `curl -I http://localhost:3000/` | Check security headers: X-Frame-Options, HSTS, etc. |
| 5 | `curl -I http://localhost:3000/en/` | Check English route works under Docker |

### New page creation

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run lint` | Syntax errors |
| 2 | `npm run build` | Route registration, imports, metadata |
| 3 | `npx playwright test --grep "smoke"` | Existing smoke tests still pass |
| 4 | Manual: visit new FA page + new EN page | Verify bilingual content |
| 5 | Manual: check `<title>`, `<meta description>`, JSON-LD (if applicable) | SEO completeness |

### New product or blog post

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npx vitest src/data/` | Verify slug uniqueness, data integrity |
| 2 | `npm run build` | Static params generation |
| 3 | Visit: new product/post on both FA + EN | Visual verification |

### Font / image / static asset

| Phase | Command | Why |
|-------|---------|-----|
| 1 | `npm run build` | Asset resolution |
| 2 | Docker build (if using standalone) | Verify assets are copied to standalone output |
| 3 | Visual: check font renders, images load | Manual only |

---

## When to run the full suite

Only run everything (`npx vitest && npx playwright test && npm run build && docker build`) when:
- Changing `next.config.ts` or `Dockerfile`
- Changing `src/proxy.ts` (middleware)
- Changing `src/app/layout.tsx`
- Upgrading a core dependency (next, react, react-dom)
- Before deploying to production

Otherwise, use the phase-specific approach above — it's 3-5x faster.

---

## Commands reference

```bash
# Unit/integration tests (fast, ~2s)
npx vitest                           # All 25 tests
npx vitest src/data/                 # Product + post tests (6)
npx vitest src/lib/cart/             # Cart reducer tests (8)
npx vitest src/lib/format/           # Currency tests (3)
npx vitest src/lib/orders/           # Order store tests (6)

# Build (medium, ~15s)
npm run build                        # Full Next.js build + typecheck

# Lint (fast, ~3s)
npm run lint                         # ESLint 9 flat config

# E2E (slow, ~30s)
npx playwright test                  # All 7 smoke tests
npx playwright test --grep "smoke"   # Same — only smoke file exists

# Docker (slow, ~90s)
docker build -t azadi-coffee .       # Full multi-stage build
docker run -p 3000:3000 --env-file .env.local azadi-coffee  # Run
```

---

## Auto-generated impact

For any file, check [impact.json](./impact.json) to find:
- Which tests cover this file
- Which files import it (direct)
- What the transitive blast radius is

This matrix covers the common change patterns. Use `impact.json` for edge cases not listed here.
