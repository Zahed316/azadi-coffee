# Feature Map — Azadi Coffee

> Maps each feature to its primary files, data dependencies, UI components, tests, and known risks.
> For change impact analysis, also check [maps/impact.json](./maps/impact.json) and [maps/fragility.md](./maps/fragility.md).

---

## 1. Dual-Language RTL/LTR System

**Purpose:** Persian (FA) at `/`, English (EN) at `/en/` — explicit route files per locale, no `[locale]` dynamic segment.

**Main files:**
- `src/proxy.ts` — Middleware: reads `azadi_locale` cookie, sets `x-locale`/`x-dir` headers
- `src/lib/i18n.ts` — `Locale` type, `localePath()`, `alternateLocalePath()`
- `src/components/layout/LanguageSwitch.tsx` — FA↔EN toggle, sets locale cookie
- `src/components/layout/DocumentLocaleSync.tsx` — Syncs `<html lang>`/`<html dir>` on pathname change

**Supporting files:**
- `src/app/layout.tsx` — Reads headers, derives `lang`/`dir`/`locale`, passes to providers
- All `src/app/**/page.tsx` + `src/app/en/**/page.tsx` — Dual FA/EN route files
- All components accepting `locale` prop — `PageShell`, `Header`, `Footer`, `ProductCard`, etc.

**Key consumers (of `localePath`/`alternateLocalePath`):**
- `Header`, `Footer`, `CartButton`, `ProductCard`, `BlogCard`, `FeaturedProducts`, `HeroSection`, `LanguageSwitch`, `ActivePanel`

**Tests:** None directly — covered by Playwright E2E smoke test (language switch, route redirects)

**Risks:**
- `src/proxy.ts` is HIGH-risk — a bug breaks routing for every page
- Adding a new page requires both FA and EN variants — easy to forget

---

## 2. Homepage (Page-Stack Layout)

**Purpose:** 6-panel tabbed homepage: Home, Shop, Roastery, Blog, About, Contact. Desktop: horizontal stack with side tabs. Mobile: vertical stack.

**Main files:**
- `src/app/page.tsx` (FA) + `src/app/en/page.tsx` (EN) — Builds 6 `StackPanel[]`, passes to layout
- `src/components/page-stack/PageStackLayout.tsx` — Client state machine (`useState` for `activeId`)
- `src/components/page-stack/ActivePanel.tsx` — Renders the expanded panel content
- `src/components/page-stack/CollapsedTab.tsx` — Side tab button for switching panels
- `src/components/page-stack/PagePanel.tsx` — Panel wrapper with tone: `paper | warm | ink`
- `src/components/sections/HeroSection.tsx` — Landing hero (text, CTAs, decorative circle logo)
- `src/components/sections/FeaturedProducts.tsx` — Featured product grid (4 items)

**Data dependencies:**
- `src/data/products.ts` — `getProducts()` for featured section
- `src/data/posts.ts` — `getPosts()` for blog panel content
- `src/lib/theme-settings.ts` — `getLandingSettings()` for hero content

**Tests:** None directly — covered by E2E smoke (homepage loads, tabs visible)

**Risks:** `src/app/page.tsx` is HIGH-risk — first page every user sees

---

## 3. Shop / Products

**Purpose:** Product listing with category filter (all/espresso/filter), individual product detail pages with JSON-LD, add-to-cart panel.

**Main files:**
- `src/app/shop/page.tsx` + `src/app/en/shop/page.tsx` — Listing with `?category=` filter
- `src/app/shop/[slug]/page.tsx` + `src/app/en/shop/[slug]/page.tsx` — Product detail
- `src/components/product/ProductCard.tsx` — Product grid card
- `src/components/product/ProductBuyPanel.tsx` — Add-to-cart panel with quantity stepper (FA + EN exports)
- `src/lib/seo/schema.ts` — `productJsonLd()` generator

**Data dependencies:**
- `src/data/products.ts` — `getProducts()`, `getProductBySlug()` (4 seed products)
- `src/lib/format/currency.ts` — `formatToman()`, `formatRial()`
- `src/lib/format/persian.ts` — `inventoryLabel()`, `latin()`

**Tests:**
- `src/data/products.test.ts` — 3 tests (returns all, valid slug, invalid slug)
- E2E: product listing, product detail, category filter

**Risks:** `src/data/products.ts` is MEDIUM-risk — wrong type shape breaks every product page and component

---

## 4. Blog

**Purpose:** Blog listing and individual post pages. Bilingual content with body paragraph arrays.

**Main files:**
- `src/app/blog/page.tsx` + `src/app/en/blog/page.tsx` — Listing
- `src/app/blog/[slug]/page.tsx` + `src/app/en/blog/[slug]/page.tsx` — Post detail with `generateMetadata`
- `src/components/blog/BlogCard.tsx` — Listing card (thumbnail, title, excerpt, read link)

**Data dependencies:**
- `src/data/posts.ts` — `getPosts()`, `getPostBySlug()` (3 seed posts)

**Tests:**
- `src/data/posts.test.ts` — 3 tests (returns all, valid slug, invalid slug)

**Risks:** Similar to products — data shape changes cascade to all blog pages

---

## 5. Cart System

**Purpose:** Shopping cart with localStorage persistence, reducer-based state, cross-tab sync, header badge.

**Main files:**
- `src/lib/cart/types.ts` — `CartItem`, `Cart`, `CartAction`, `EMPTY_CART`
- `src/lib/cart/cart-reducer.ts` — `cartReducer()`, `getCartCount()`, `getCartTotal()`
- `src/lib/cart/cart-storage.ts` — `readCart()`, `writeCart()`, `subscribeCart()` (key: `azadi_cart_v1`)
- `src/lib/cart/cart-context.tsx` — `CartContextProvider`, `useCart()` hook
- `src/components/cart/CartProvider.tsx` — Thin wrapper, mounted in `layout.tsx`
- `src/components/cart/CartButton.tsx` — Header icon with badge count
- `src/components/cart/CartContent.tsx` — Full cart UI with items, quantities, totals
- `src/components/cart/QuantityStepper.tsx` — Standalone +/- stepper
- `src/app/cart/page.tsx` + `src/app/en/cart/page.tsx` — Cart page

**Tests:**
- `src/lib/cart/cart-reducer.test.ts` — 8 tests (add, increment, remove, update, clear, count, total)

**Risks:**
- `cart-reducer.ts` is MEDIUM-risk — wrong state transition corrupts localStorage
- `cart-storage.ts` is MEDIUM-risk — changing the key `azadi_cart_v1` loses all user carts

---

## 6. Checkout / Order Flow

**Purpose:** Checkout form → create order → order status display. In-memory order store.

**Main files:**
- `src/app/checkout/page.tsx` + `src/app/en/checkout/page.tsx` — Checkout page
- `src/components/cart/CheckoutForm.tsx` — Form (phone, address, payment method picker)
- `src/app/api/checkout/route.ts` — `POST /api/checkout` — creates order
- `src/app/order/[id]/page.tsx` + `src/app/en/order/[id]/page.tsx` — Order result page
- `src/components/cart/OrderStatus.tsx` — Renders PayButton for pending, status for others
- `src/lib/orders/store.ts` — `createOrder()`, `getOrder()`, `updateOrderStatus()`, `setOrderAuthority()`

**Data dependencies:**
- In-memory `Map<string, LocalOrder>` on `globalThis.__orders`
- Auto-incrementing `orderNumber` from 1000

**Tests:**
- `src/lib/orders/store.test.ts` — 6 tests (create, sequential numbers, get, update)

**Risks:**
- In-memory store resets on server restart — data loss for any in-flight orders
- No persistence across deploys — MVP/demo design

---

## 7. Payment Gateway (Zarinpal)

**Purpose:** Zarinpal payment integration — request payment, redirect to gateway, verify callback.

**Main files:**
- `src/lib/zarinpal.ts` — `requestPayment()`, `verifyPayment()` (sandbox + production)
- `src/app/actions/payment.ts` — `initiatePayment` server action (`useActionState`)
- `src/components/cart/PayButton.tsx` — `<form action={initiatePayment}>` button
- `src/app/api/payment/callback/route.ts` — `GET /api/payment/callback` — Zarinpal returns here

**Config:** `ZARINPAL_MERCHANT_ID`, `ZARINPAL_SANDBOX`

**Tests:** None — full manual flow only

**Risks:**
- MEDIUM-risk — broken payment causes real money loss
- Must test in sandbox before production

---

## 8. Contact Form

**Purpose:** Contact form that sends email via Resend.

**Main files:**
- `src/app/contact/page.tsx` + `src/app/en/contact/page.tsx` — Contact pages
- `src/components/forms/ContactForm.tsx` — Form UI with `useActionState`
- `src/app/actions/contact.ts` — `submitContact` server action → Resend

**Config:** `RESEND_API_KEY`, `CONTACT_EMAIL`

**Tests:** None

**Risks:** Low — form submits are idempotent, failed sends degrade gracefully with error messages

---

## 9. Wholesale Inquiry Form

**Purpose:** B2B wholesale inquiry form, sends email via Resend.

**Main files:**
- `src/app/wholesale/page.tsx` + `src/app/en/wholesale/page.tsx` — Wholesale pages
- `src/components/forms/WholesaleForm.tsx` — Form UI with `useActionState`
- `src/app/actions/wholesale.ts` — `submitWholesale` server action → Resend

**Config:** `RESEND_API_KEY`, `WHOLESALE_EMAIL`

**Tests:** None

**Risks:** Same as contact form — low

---

## 10. Live Design Theming

**Purpose:** Full CSS-variable-based theming system: 16 colors, typography, 6 shape values, 5 presets. Dual-delivery: SSR via `style={}` for no flash, client-side via direct DOM for live preview.

**Main files:**
- `src/lib/settings/design-presets.ts` — `DesignSettings` type, `defaultDesignSettings`, 5 presets
- `src/lib/settings/design-storage.ts` — localStorage read/write/subscribe/apply (key: `azadi.design.settings.v1`)
- `src/lib/theme-settings.ts` — `getThemeSettings()`, `themeSettingsToCssVariables()`, `getLandingSettings()`
- `src/components/settings/DesignSettingsProvider.tsx` — Context + `useSyncExternalStore`
- `src/app/layout.tsx` — SSR inline styles via `<html style={cssVars}>`
- `src/app/globals.css` — `@theme inline` mapping CSS vars to Tailwind utilities, component `data-*` styles

**Tests:** None — visual verification only

**Risks:** `src/app/globals.css` is HIGH-risk — CSS errors cascade to every component

---

## 11. Design Dashboard

**Purpose:** Full UI for customizing live theme: color pickers, font upload, sliders, 5 presets, component style variants.

**Main files:**
- `src/app/dashboard/design/page.tsx` — Design settings page (`noindex`)
- `src/components/settings/DesignDashboard.tsx` — Full dashboard UI

**Config:** Excluded from sitemap (`robots.ts`)

**Tests:** None — visual verification

**Risks:** Low — client-only, error-tolerant, `noindex`ed

---

## 12. About Page

**Purpose:** Static informational page about Azadi Coffee.

**Main files:**
- `src/app/about/page.tsx` (FA) + `src/app/en/about/page.tsx` (EN)
- Shared layout via `PageShell` (Header + Footer)

**Tests:** None

**Risks:** Low

---

## 13. Roastery Page

**Purpose:** Static informational page about the roasting process.

**Main files:**
- `src/app/roastery/page.tsx` (FA) + `src/app/en/roastery/page.tsx` (EN)
- Shared layout via `PageShell`

**Tests:** None

**Risks:** Low

---

## 14. SEO (Sitemap, Robots, JSON-LD)

**Purpose:** Bilingual SEO: sitemap XML, robots.txt, product JSON-LD structured data.

**Main files:**
- `src/app/sitemap.ts` — 18 static routes, daily/weekly change freq
- `src/app/robots.ts` — Disallows `/api/`, `/dashboard/`, `/order/`
- `src/lib/seo/schema.ts` — `productJsonLd()` for product detail pages
- Per-page `metadata` exports — title for every route

**Tests:** None — `npm run build` verifies sitemap/robots generation

**Risks:** MEDIUM — broken sitemap de-indexes site, wrong robots.txt blocks crawling

---

## 15. Error / 404 Handling

**Purpose:** Custom error boundaries and 404 pages for both FA and EN.

**Main files:**
- `src/app/error.tsx` (FA) + `src/app/en/error.tsx` (EN) — Route-level error boundaries
- `src/app/global-error.tsx` — Global error with full HTML shell
- `src/app/not-found.tsx` (FA) + `src/app/en/not-found.tsx` (EN) — 404 pages
- `src/app/loading.tsx` (FA) + `src/app/en/loading.tsx` (EN) — Loading spinners

**Tests:** E2E covers 404 rendering

**Risks:** MEDIUM — error boundaries are required by Next.js, must render valid HTML
