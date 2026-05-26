# Task-to-File Map — Azadi Coffee

> For each common AI coding task, this map lists which files to inspect first, the relevant domain docs, and the correct validation sequence.
> Also check [maps/validation.md](./maps/validation.md) for the full validation matrix and [maps/fragility.md](./maps/fragility.md) for pre-edit risk assessment.

---

## Task: Change homepage UI

**Inspect first:**
- `src/app/page.tsx` + `src/app/en/page.tsx` — Homepage page files (build StackPanel array)
- `src/components/page-stack/PageStackLayout.tsx` — Layout state machine
- `src/components/sections/HeroSection.tsx` — Hero content
- `src/components/sections/FeaturedProducts.tsx` — Featured product grid
- `src/components/page-stack/ActivePanel.tsx` — Active panel renderer
- `src/components/page-stack/PagePanel.tsx` — Panel wrapper (tone: paper/warm/ink)
- `src/components/page-stack/CollapsedTab.tsx` — Side tab buttons
- `src/app/globals.css` — CSS variables and component style variants
- [design.md](./design.md) — Theming docs

**Validation:**
- Phase 1: `npm run lint`
- Phase 2: `npm run build`
- Phase 3: Visual — `/`, `/en/`, check all 6 panels, mobile vs desktop

---

## Task: Modify header/footer

**Inspect first:**
- `src/components/layout/Header.tsx` — Navigation, brand, cart button, language switch
- `src/components/layout/Footer.tsx` — Footer content
- `src/components/layout/PageShell.tsx` — Composition (wraps Header + Footer)
- `src/components/layout/LanguageSwitch.tsx` — Language toggle
- `src/components/cart/CartButton.tsx` — Header cart icon
- `src/lib/i18n.ts` — `localePath()` used by all nav links
- [design.md](./design.md) — Header/footer style variants

**Validation:**
- Phase 1: `npm run build`
- Phase 2: `npx playwright test --grep "smoke"` — E2E covers navigation
- Phase 3: Visual — check header/footer on `/`, `/shop`, `/about` in both FA and EN

---

## Task: Add a new page

**Playbook:** [skills/new-page/SKILL.md](./skills/new-page/SKILL.md)

**Inspect first:**
- `ai/skills/new-page/SKILL.md` — Step-by-step playbook
- Existing page similar to your target (e.g., `src/app/about/page.tsx` for static, `src/app/contact/page.tsx` for form)
- `src/components/layout/PageShell.tsx` — Wrapper for non-homepage routes
- `src/lib/i18n.ts` — Locale utilities
- `src/app/sitemap.ts` — Add new route to sitemap
- [bilingual.md](./bilingual.md) — Locale architecture

**Validation:**
- Phase 1: `npm run lint`
- Phase 2: `npm run build`
- Phase 3: `npx playwright test --grep "smoke"` — verify existing tests still pass
- Phase 4: Visit FA + EN pages manually, check `<title>`, meta tags

---

## Task: Change language behavior

**Inspect first:**
- `src/proxy.ts` — Middleware: locale cookie, x-locale header (HIGH-risk)
- `src/lib/i18n.ts` — `localePath()`, `alternateLocalePath()`, `Locale` type
- `src/components/layout/LanguageSwitch.tsx` — FA↔EN toggle
- `src/components/layout/DocumentLocaleSync.tsx` — Client-side lang/dir sync
- `src/app/layout.tsx` — Derives lang/dir from headers (HIGH-risk)
- [bilingual.md](./bilingual.md) — Full locale architecture

**Validation:**
- Phase 1: `npm run lint`
- Phase 2: `npm run build`
- Phase 3: `npx playwright test` — Full E2E suite (7 tests)
- Phase 4: Manual — test `/`, `/en/`, `/shop`, `/en/shop`, language switch, cookie behavior, 404 for nonexistent routes

---

## Task: Fix routing issues

**Inspect first:**
- `src/proxy.ts` — Middleware matcher and redirect logic
- `next.config.ts` — Route handling, headers, redirects
- `src/lib/i18n.ts` — All path construction utilities
- The specific route file that's broken

**Validation:**
- Phase 1: `npm run lint`
- Phase 2: `npm run build`
- Phase 3: `npx playwright test` — All E2E tests
- Phase 4: Manual — all 12+ routes in both FA and EN

---

## Task: Modify products (add, edit, remove)

**Playbook:** [skills/new-product/SKILL.md](./skills/new-product/SKILL.md)

**Inspect first:**
- `src/data/products.ts` — Product type, seed data array, accessor functions
- `src/components/product/ProductCard.tsx` — Shop listing card
- `src/components/product/ProductBuyPanel.tsx` — Add-to-cart panel
- `src/app/shop/page.tsx` + `src/app/en/shop/page.tsx` — Shop listing
- `src/app/shop/[slug]/page.tsx` + `src/app/en/shop/[slug]/page.tsx` — Product detail
- `src/app/page.tsx` + `src/app/en/page.tsx` — Featured products on homepage
- [data-layer.md](./data-layer.md) — Data strategy

**Validation:**
- Phase 1: `npx vitest src/data/` — 6 product+post tests
- Phase 2: `npm run build`
- Phase 3: Visit — shop listing (FA+EN), product detail (FA+EN), homepage featured section

---

## Task: Modify blog posts (add, edit, remove)

**Inspect first:**
- `src/data/posts.ts` — BlogPost type, seed data, accessor functions
- `src/components/blog/BlogCard.tsx` — Blog listing card
- `src/app/blog/page.tsx` + `src/app/en/blog/page.tsx` — Blog listing
- `src/app/blog/[slug]/page.tsx` + `src/app/en/blog/[slug]/page.tsx` — Post detail
- [data-layer.md](./data-layer.md) — Data strategy

**Validation:**
- Phase 1: `npx vitest src/data/` — 6 tests
- Phase 2: `npm run build`
- Phase 3: Visit — blog listing (FA+EN), post detail (FA+EN)

---

## Task: Change cart/checkout logic

**Playbooks:** [skills/debug-cart/SKILL.md](./skills/debug-cart/SKILL.md), [skills/debug-payment/SKILL.md](./skills/debug-payment/SKILL.md)

**Inspect first:**
- `src/lib/cart/types.ts` — Types and action enum
- `src/lib/cart/cart-reducer.ts` — All state transitions
- `src/lib/cart/cart-storage.ts` — localStorage persistence (key: `azadi_cart_v1`)
- `src/lib/cart/cart-context.tsx` — React context + hydration safety
- `src/components/cart/CartContent.tsx` — Cart UI
- `src/components/cart/CheckoutForm.tsx` — Checkout form
- `src/app/api/checkout/route.ts` — Order creation API
- [payment.md](./payment.md) — Payment domain docs

**Validation:**
- Phase 1: `npx vitest src/lib/cart/cart-reducer.test.ts` — 8 reducer tests
- Phase 2: `npm run build`
- Phase 3: Manual cart flow — add, update quantity, remove, checkout
- Phase 4: Check localStorage key `azadi_cart_v1` for validity

---

## Task: Change payment flow

**Playbook:** [skills/debug-payment/SKILL.md](./skills/debug-payment/SKILL.md)

**Inspect first:**
- `src/lib/zarinpal.ts` — Payment API client
- `src/lib/orders/store.ts` — In-memory order store
- `src/app/actions/payment.ts` — `initiatePayment` server action
- `src/app/api/payment/callback/route.ts` — Zarinpal callback handler
- `src/components/cart/PayButton.tsx` — Payment button
- `src/components/cart/OrderStatus.tsx` — Order result display
- [payment.md](./payment.md) — Full payment architecture

**Validation:**
- Phase 1: `npx vitest src/lib/orders/store.test.ts` — 6 order store tests
- Phase 2: `npm run build`
- Phase 3: Manual — full checkout flow in sandbox mode (`ZARINPAL_SANDBOX=true`)

---

## Task: Update styling/theme

**Inspect first:**
- `src/app/globals.css` — `@theme inline`, CSS variables at `:root`, component `data-*` styles
- `src/lib/settings/design-presets.ts` — 5 presets + `DesignSettings` type
- `src/lib/theme-settings.ts` — CSS variable generation
- `src/components/settings/DesignSettingsProvider.tsx` — Theme context
- [design.md](./design.md) — Full theming docs

**Validation:**
- Phase 1: `npm run lint`
- Phase 2: `npm run build`
- Phase 3: Visual — `/dashboard/design`, test all 5 presets, light + dark mode, check component variants

---

## Task: Change deployment config

**Inspect first:**
- `next.config.ts` — Standalone output, headers, redirects, images (HIGH-risk)
- `Dockerfile` — Multi-stage build
- `.env.example` — Env var template
- [devops.md](./devops.md) — Docker and CI/CD docs
- [deployment.md](./deployment.md) — Standalone output and request routing

**Validation:**
- Phase 1: `npm run build`
- Phase 2: `docker build -t azadi-coffee .`
- Phase 3: `docker run -p 3000:3000 --env-file .env.local azadi-coffee`
- Phase 4: `curl -I http://localhost:3000/` — verify security headers

---

## Task: Fix build errors

**Inspect first:**
- Read the build error output — follow the file path and line number
- If import error: check [maps/imports.json](./maps/imports.json) for the importing file
- If type error: check the type definition in `src/lib/cart/types.ts`, `src/data/products.ts`, or `src/lib/settings/design-presets.ts`
- If module resolution error: check `tsconfig.json` paths (`@/*` → `./src/*`)
- `next.config.ts` — ensure `output: "standalone"` and middleware config are correct

**Validation:**
- Phase 1: `npm run build` — must pass

---

## Task: Create a new component

**Playbook:** [skills/new-component/SKILL.md](./skills/new-component/SKILL.md)

**Inspect first:**
- Similar existing components in the right category (e.g., `src/components/product/` for product components)
- `src/lib/i18n.ts` — If component needs locale awareness
- `src/app/globals.css` — If component needs theme variant styles
- [design.md](./design.md) — Theme-aware patterns

**Validation:**
- Phase 1: `npm run build` — must pass
- Phase 2: `npx playwright test --grep "smoke"` — existing E2E still passes
- Phase 3: Visual — visit pages using the new component

---

## Task: Modify i18n utilities

**Inspect first:**
- `src/lib/i18n.ts` — `localePath()`, `alternateLocalePath()`, `Locale` type
- All 15+ consumers of i18n (use [maps/imports.json](./maps/imports.json) to find them)
- [bilingual.md](./bilingual.md) — Full locale architecture

**Validation:**
- Phase 1: `npm run build` — `localePath`/`alternateLocalePath` are used by 15+ components
- Phase 2: `npx playwright test` — Language switch E2E test
- Phase 3: Manual — all nav links in both FA and EN, language switch button

---

## Task: Add/modify API route

**Inspect first:**
- Existing API routes: `src/app/api/checkout/route.ts`, `src/app/api/payment/callback/route.ts`
- `src/lib/orders/store.ts` — If order-related
- `src/lib/zarinpal.ts` — If payment-related
- `src/app/robots.ts` — Add to disallow if needed

**Validation:**
- Phase 1: `npm run build`
- Phase 2: Manual — `curl` or Postman test the endpoint
- Phase 3: Update robots.txt if route should be disallowed

---

## Task: Regenerate machine-readable maps

**Command:**
```bash
npm run maps:generate
```

**When to run:**
- After adding, removing, or renaming files
- After changing exports in any module
- After adding new imports to any file
- After structural changes (new directories, moved files)

**Output:**
- `ai/maps/symbols.json` — exported symbols
- `ai/maps/imports.json` — tracked imports
- `ai/maps/impact.json` — risk and validation data
