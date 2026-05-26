# Fragility Map

> Pre-edit risk assessment. Check this before touching any file.
> Auto-generated data: [impact.json](./impact.json) | [symbols.json](./symbols.json)

## Risk Levels

| Level | Meaning | Behavior |
|-------|---------|----------|
| **HIGH** | A mistake here breaks everything | Read domain docs first, test broadly, review carefully |
| **MEDIUM** | A mistake here breaks a feature area | Run associated tests, verify affected pages |
| **LOW** | Limited blast radius | Standard edit + test cycle |

---

## HIGH — Critical Infrastructure

Changing these files can break the entire site.

### `src/proxy.ts`
**Why:** Controls locale detection and cookie setting for every incoming request. A bug here breaks routing for all 24+ pages.

**Pre-edit checklist:**
- Read [bilingual.md](../bilingual.md)
- Read [architecture.md §Pattern 1](../architecture.md#pattern-1-dual-locale-rtlltr-architecture)
- After edit, manually test: `/`, `/en/`, `/shop`, `/en/shop`, language switch
- If changing cookie behavior, clear cookies between tests
- This file has **no automated tests** — all verification is manual

**Constraints:**
- `LOCALE_COOKIE` name must match every consumer (LanguageSwitch, DocumentLocaleSync)
- `x-locale` header must be set before the request reaches any page
- Cookie max-age affects CDN caching — don't shorten it casually

### `src/app/layout.tsx`
**Why:** Root layout wraps every page. Providers (DesignSettingsProvider, CartProvider) mount here. Changing the provider order or props cascades to every route.

**Pre-edit checklist:**
- Read [architecture.md §Pattern 2](../architecture.md#pattern-2-css-custom-property-theming-dual-delivery)
- After edit, test: FA homepage, EN homepage, shop page, cart page, dashboard/design
- Verify: no white flash on theme, cart icon renders, hydration errors absent
- `npm run build` must succeed

**Constraints:**
- `lang` and `dir` must be set correctly (FA=rtl, EN=ltr)
- Provider nesting order matters: `DesignSettingsProvider` → `CartProvider` → children
- `x-locale` header must be read before provider initialization

### `src/app/page.tsx`
**Why:** Homepage — the first thing every user sees. Uses PageStackLayout with 6 panels. A compile error or JSX mismatch here brings down the whole site on load.

**Pre-edit checklist:**
- Read [design.md](../design.md) for panel themes
- If changing panel content, verify all 6 panels render in both FA and EN
- Test desktop (side tabs) and mobile (vertical stack) separately
- `npm run build` must succeed

### `next.config.ts`
**Why:** Standalone output, security headers, redirects, and image config. A typo here can prevent the Docker build from working, strip security in production, or break all images.

**Pre-edit checklist:**
- Read [devops.md](../devops.md) and [deployment.md](../deployment.md)
- After any change: `npm run build` → `docker build -t azadi-coffee .` → verify headers
- Never remove `output: "standalone"` without updating the Dockerfile
- Security headers: test with `curl -I` locally after Docker run

### `src/app/globals.css`
**Why:** Tailwind v4 `@theme inline` plus all component data-attribute styles. CSS errors cascade to every component. `:root` variables define the entire design system.

**Pre-edit checklist:**
- Read [design.md](../design.md)
- After edit: check dashboard/design, light mode, dark mode (Premium dark preset)
- Verify component styles via `data-*` attributes still match
- Test: ProductCard, BlogCard, Footer with different footer-style variants

---

## MEDIUM — Feature-Level Infrastructure

Changing these breaks a feature, not the whole site.

### `src/lib/cart/cart-reducer.ts`
**Why:** All cart logic: add, remove, update quantity, clear. A wrong state transition corrupts localStorage and shows wrong prices/quantities.

**Pre-edit checklist:**
- Run tests: `npx vitest src/lib/cart/cart-reducer.test.ts`
- After edit: test add-to-cart, quantity change, remove, checkout → ensure `cart_v1` key stays valid

**Constraints:**
- Actions (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR`) must match enum in types.ts
- State shape must remain `{ items: CartItem[] }`
- Compute `getCartCount()` and `getCartTotal()` correctly

### `src/lib/cart/cart-context.tsx`
**Why:** Bridges reducer + storage to React. Hydration-safe initialization is fragile. Breaking this breaks every cart component.

**Pre-edit checklist:**
- Read the hydration safety comment at the top of cart-context.tsx
- After edit: test SSR cart (empty on first render) + localStorage replay on hydration

### `src/lib/cart/cart-storage.ts`
**Why:** localStorage persistence + cross-tab sync. Keys must be exact. A changed key loses all user carts.

**Pre-edit checklist:**
- The storage key `azadi_cart_v1` must not change without a migration strategy
- After edit: open two tabs, add to cart in tab A, verify tab B updates

### `src/lib/i18n.ts`
**Why:** `localePath()` and `alternateLocalePath()` are used by 15+ components. A broken path generates wrong URLs everywhere.

**Pre-edit checklist:**
- After edit: test FA link → should render `/shop`. EN link → `/en/shop`. Switch button → alternates.
- Check all language switch navigation

### `src/lib/zarinpal.ts`
**Why:** Payment gateway client. A broken payment request or verification causes real money loss.

**Pre-edit checklist:**
- Read [payment.md](../payment.md)
- Test in sandbox mode first: `ZARINPAL_SANDBOX=true`
- Test: create order → pay → verify callback → check order status transition
- Never test in production mode until sandbox flow is confirmed

### `src/app/actions/payment.ts`
**Why:** Server Action connecting checkout → Zarinpal. `useActionState` form pattern. A redirect bug strands users mid-payment.

**Pre-edit checklist:**
- After edit: run full checkout flow → payment redirect → callback → order status page
- Verify: no double-charge on refresh

### `src/lib/orders/store.ts`
**Why:** In-memory order store. Resets on server restart. Data loss if errors aren't handled. The `globalThis.__orders` Map must stay type-safe.

**Pre-edit checklist:**
- Run tests: `npx vitest src/lib/orders/store.test.ts`
- After edit: create order → verify sequential order numbers → simulate callback status update

### `src/data/products.ts` and `src/data/posts.ts`
**Why:** All content comes from here. Wrong type shape, missing bilingual field, or broken slug breaks every component and page using that data.

**Pre-edit checklist:**
- Run tests: `npx vitest src/data/`
- After adding a product: verify it appears on shop listing, product detail, homepage featured section
- After adding a post: verify it appears on blog listing and blog/[slug]

### `src/components/layout/PageShell.tsx`
**Why:** Used by 22 non-homepage routes. Header + Footer composition. Breaking this breaks every page except the homepage.

**Pre-edit checklist:**
- After edit: test `/about`, `/shop`, `/blog` — all must render header/footer correctly
- Verify language switch and cart button in header still work

### `src/app/sitemap.ts` and `src/app/robots.ts`
**Why:** SEO-critical. A broken sitemap de-indexes the site from search. A wrong robots.txt blocks crawling.

**Pre-edit checklist:**
- `npm run build` must produce valid sitemap.xml
- Verify `/robots.txt` returns expected content in dev and production

---

## LOW — Safe to Edit

Everything else. Standard edit → test → build cycle. Use [impact.json](./impact.json) to find associated tests.

**Notable LOW files that may seem risky:**
- `src/lib/format/currency.ts` — has 7 consumers plus test, well-isolated, pure function
- `src/lib/theme-settings.ts` — only affects design, not functionality, tested by visual inspection
- `src/components/settings/DesignDashboard.tsx` — client-only, `/dashboard/design` is `noindex`ed, error-tolerant
- `src/components/product/ProductCard.tsx` — well-tested by E2E smoke tests, drops gracefully if data is missing

---

## Files With Zero Automated Tests (HIGH/MEDIUM)

These are fragile by test coverage gap alone:

| File | Risk | Test strategy |
|------|------|---------------|
| `src/proxy.ts` | HIGH | Manual only — test `/`, `/en/`, cookie behavior, lang switch |
| `src/app/layout.tsx` | HIGH | Manual — test 3+ routes, verify providers, hydration |
| `src/lib/cart/cart-context.tsx` | MEDIUM | Manual cart flow + indirect coverage via E2E |
| `src/lib/cart/cart-storage.ts` | MEDIUM | Manual cross-tab test |
| `src/app/actions/payment.ts` | MEDIUM | Manual full checkout flow |
| `src/lib/zarinpal.ts` | MEDIUM | Manual sandbox test |
| `src/app/api/checkout/route.ts` | MEDIUM | Manual POST test |
| `src/app/api/payment/callback/route.ts` | MEDIUM | Manual callback simulation |
| `src/lib/i18n.ts` | MEDIUM | Indirect via E2E — immediate breakage if broken |
| All `error.tsx`, `not-found.tsx` | MEDIUM | Manual — test invalid routes |
