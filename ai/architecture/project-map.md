# AZADI COFFEE — Complete Codebase Map

> **Knowledge system:** [index.md](./index.md) · [architecture](./architecture.md) · [deployment](./deployment.md) · [agent-corporation](./agent-corporation.md) · [mcp](./mcp.md)

## 1. PROJECT IDENTITY

**Name:** `azadi-coffee` (v0.1.0, private)  
**Purpose:** A **Persian (RTL) Next.js ecommerce storefront** for a minimalist specialty coffee roastery. Dual-language (Persian FA / English EN), standalone static seed data, live theming via CSS custom properties, and a design settings dashboard. See [architecture.md](./architecture.md) for module connectivity, [data-layer.md](./data-layer.md) for the data strategy, and [agent-corporation.md](./agent-corporation.md) for the AI agent system.  
**Core tagline:** "قهوه آزادی برای فنجان های دقیق، ساده و روزانه." — "Azadi Coffee for precise, simple, everyday cups."

---

## 2. AGENT CORPORATION

The project uses a layered intelligence system where 8 domain agents, 6 workflow skills, and 6 MCP servers collaborate. See [agent-corporation.md](./agent-corporation.md) for the complete collaboration map.

| Tier | Layer | Contents |
|---|---|---|
| **Shared Context** | Memory + Map | `AGENTS.md`, `project-map.md` |
| **Domain Agents** | 8 specialist agents | bilingual, design, payment, data-layer, seo, devops, pm, testing |
| **Workflow Skills** | 6 playbooks | new-page, new-product, new-component, debug-cart, debug-payment, deploy |
| **MCP Servers** | 6 protocol servers | filesystem, sequential-thinking, memory, brave-search, bash, open-design |

---

## 3. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 (App Router) |
| **Runtime** | React 19.2.4 + React DOM 19.2.4 |
| **Language** | TypeScript 5 (strict mode, bundler module resolution) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) with extensive CSS custom properties for live theming |
| **Font** | Vazirmatn (woff2) for Persian; Inter for English; custom font upload supported |
| **Email** | Resend v6 (contact form, wholesale form) |
| **Payment** | Zarinpal payment gateway (sandbox + production), stub support for Behpardakht Mellat & IDPay |
| **Linting** | ESLint 9 (`eslint-config-next` core-web-vitals + TypeScript) |
| **Unit/Int Testing** | Vitest 4 + `@testing-library/react` + `@testing-library/jest-dom` + jsdom |
| **E2E Testing** | Playwright v1.60 (Chrome only, fully parallel) |
| **Container** | Docker (Node 24 Alpine, multi-stage: deps → builder → runner, standalone output) |
| **Package Manager** | npm (inferred from `package-lock.json`) |

---

## 4. FULL DIRECTORY STRUCTURE

### Top-level configuration files

```
.env.example          — Env var template (Zarinpal, Resend, site URL, contact emails)
.env.local            — Local env overrides
.gitignore            — Standard Next.js+tooling ignores
Dockerfile            — Multi-stage Node 24 Alpine Docker build
README.md             — Project docs in English
cmd                   — Empty file (placeholder/sentinel)
eslint.config.mjs     — ESLint 9 flat config (Next.js core-web-vitals + TypeScript)
mcp_servers.json      — 6 MCP servers: open-design, filesystem, sequential-thinking, memory, brave-search, bash
next-env.d.ts         — Auto-generated Next.js TypeScript declarations
next.config.ts        — Next.js config (standalone output, security headers, HTTPS redirects)
package.json          — Dependencies & scripts
package-lock.json     — Lockfile
playwright.config.ts  — Playwright E2E config (Chrome, parallel, retries 2)
postcss.config.mjs    — PostCSS with @tailwindcss/postcss plugin
tsconfig.json         — TypeScript strict config with @/* path alias
vitest.config.ts      — Vitest config (jsdom, React plugin, @ alias, globals)
vitest.setup.ts       — Vitest setup (@testing-library/jest-dom matchers)
```

### `public/`
```
fonts/
  Vazirmatn-Regular.woff2
  Vazirmatn-Bold.woff2
assets/icons/file.svg, assets/icons/globe.svg, assets/icons/next.svg, assets/icons/vercel.svg, assets/icons/window.svg — Boilerplate Next.js assets
robots.txt                                                — Standard robots exclusion
```

### `src/` — Source Code

```
src/
├── proxy.ts                          — Next.js middleware (locale detection, cookie management)
├── app/                              — Next.js App Router
│   ├── layout.tsx                    — Root layout (locale, theme, providers)
│   ├── page.tsx                      — Persian homepage (PageStackLayout with 6 panels)
│   ├── globals.css                   — Tailwind v4 + CSS custom properties + component styles
│   ├── loading.tsx                   — Persian loading spinner
│   ├── error.tsx                     — Persian error boundary
│   ├── global-error.tsx              — Global error (full HTML shell)
│   ├── not-found.tsx                 — Persian 404
│   ├── robots.ts                     — robots.txt generation
│   ├── sitemap.ts                    — sitemap.xml generation
│   ├── favicon.ico                   — Favicon
│   ├── actions/
│   │   ├── contact.ts                — Server Action: contact form → Resend email
│   │   ├── payment.ts                — Server Action: initiate Zarinpal payment
│   │   └── wholesale.ts              — Server Action: wholesale form → Resend email
│   ├── api/
│   │   ├── checkout/route.ts         — POST /api/checkout (create order)
│   │   └── payment/callback/route.ts — GET /api/payment/callback (Zarinpal verify)
│   ├── about/page.tsx                — About page (FA)
│   ├── blog/
│   │   ├── page.tsx                  — Blog listing (FA)
│   │   └── [slug]/page.tsx           — Blog post detail (FA)
│   ├── cart/page.tsx                 — Cart page (FA)
│   ├── checkout/page.tsx             — Checkout page (FA)
│   ├── contact/page.tsx              — Contact page (FA)
│   ├── dashboard/design/page.tsx     — Design settings dashboard (noindex)
│   ├── order/[id]/page.tsx           — Order result page (FA)
│   ├── roastery/page.tsx             — Roastery page (FA)
│   ├── shop/
│   │   ├── page.tsx                  — Shop listing with category filter (FA)
│   │   └── [slug]/page.tsx           — Product detail with JSON-LD (FA)
│   ├── wholesale/page.tsx            — Wholesale page (FA)
│   └── en/                           — English mirror of all routes
│       ├── page.tsx                  — English homepage
│       ├── loading.tsx               — English loading
│       ├── error.tsx                 — English error
│       ├── not-found.tsx             — English 404
│       ├── about/page.tsx
│       ├── blog/page.tsx
│       ├── blog/[slug]/page.tsx
│       ├── cart/page.tsx
│       ├── checkout/page.tsx
│       ├── contact/page.tsx
│       ├── order/[id]/page.tsx
│       ├── roastery/page.tsx
│       ├── shop/page.tsx
│       ├── shop/[slug]/page.tsx
│       └── wholesale/page.tsx
├── components/
│   ├── layout/
│   │   ├── PageShell.tsx             — Header + Footer + main wrapper
│   │   ├── Header.tsx                — Sticky header (nav, cart, language switch, brand)
│   │   ├── Footer.tsx                — Configurable footer (brand, nav, contact)
│   │   ├── LanguageSwitch.tsx        — FA↔EN toggle with cookie
│   │   └── DocumentLocaleSync.tsx    — Client-side lang/dir sync on pathname change
│   ├── cart/
│   │   ├── CartProvider.tsx          — Thin wrapper around CartContextProvider
│   │   ├── CartContent.tsx           — Full cart UI (items, quantities, summary)
│   │   ├── CartButton.tsx            — Header cart icon with badge count
│   │   ├── CheckoutForm.tsx          — Checkout form (phone, address, gateway picker)
│   │   ├── OrderStatus.tsx           — Post-payment order status display
│   │   ├── PayButton.tsx             — "Proceed to payment" button (useActionState)
│   │   └── QuantityStepper.tsx       — Standalone +/- stepper (unused directly)
│   ├── product/
│   │   ├── ProductCard.tsx           — Product grid card (image, name, roast, process, price)
│   │   └── ProductBuyPanel.tsx       — Add-to-cart panel with quantity stepper (FA + EN variants)
│   ├── sections/
│   │   ├── HeroSection.tsx           — Landing hero (text + CTAs + decorative circle logo)
│   │   └── FeaturedProducts.tsx      — Featured product grid (4 items, simplified cards)
│   ├── blog/
│   │   └── BlogCard.tsx              — Blog listing card (thumbnail, title, excerpt, read link)
│   ├── forms/
│   │   ├── ContactForm.tsx           — Contact form (useActionState with Resend)
│   │   └── WholesaleForm.tsx         — Wholesale inquiry form (useActionState with Resend)
│   ├── settings/
│   │   ├── DesignSettingsProvider.tsx — React Context + useSyncExternalStore for theme
│   │   └── DesignDashboard.tsx       — Full design settings UI (colors, fonts, shapes, presets)
│   ├── page-stack/
│   │   ├── PageStackLayout.tsx       — "Adjacent pages" layout (active panel + collapsed tabs)
│   │   ├── PagePanel.tsx             — Individual panel container (paper/warm/ink tones)
│   │   ├── ActivePanel.tsx           — The currently expanded panel
│   │   └── CollapsedTab.tsx          — Tab for switching between collapsed pages
│   └── ui/
│       └── ButtonLink.tsx            — Reusable primary/secondary button link
├── data/
│   ├── products.ts                   — 4 seed coffee products (bilingual)
│   ├── products.test.ts              — Vitest tests for product data
│   ├── posts.ts                      — 3 seed blog posts (bilingual)
│   └── posts.test.ts                 — Vitest tests for post data
└── lib/
    ├── i18n.ts                       — Locale type, localePath(), alternateLocalePath()
    ├── theme-settings.ts             — getThemeSettings(), getLandingSettings(), CSS var generation
    ├── zarinpal.ts                   — Zarinpal payment gateway client (sandbox + production)
    ├── cart/
    │   ├── types.ts                  — CartItem, Cart, CartAction types, EMPTY_CART constant
    │   ├── cart-reducer.ts           — cartReducer (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR)
    │   ├── cart-reducer.test.ts      — Vitest tests for cart reducer
    │   ├── cart-storage.ts           — localStorage persistence with subscription
    │   └── cart-context.tsx          — CartContextProvider + useCart hook
    ├── orders/
    │   ├── store.ts                  — In-memory order store (create, get, update, setAuthority)
    │   └── store.test.ts             — Vitest tests for order store
    ├── format/
    │   ├── currency.ts               — formatToman(), formatRial() (FA-IR / EN-US formatting)
    │   ├── currency.test.ts          — Vitest tests for currency formatting
    │   └── persian.ts                — inventoryLabel(), latin() detection
    ├── settings/
    │   ├── design-presets.ts         — 5 design presets + DesignSettings type + base settings
    │   └── design-storage.ts         — localStorage read/persist/subscribe/apply for design settings
    └── seo/
        └── schema.ts                 — Product JSON-LD structured data generator
```

### `tests/`
```
e2e/
  smoke.spec.ts   — Playwright E2E: homepage (FA/EN), tabs, shop, PDP, category filter, lang switch, 404
```

---

## 5. PAGES / ROUTES

### Persian (FA) — RTL, root `/`

| Route | Page | Type |
|---|---|---|
| `/` | Home (page-stack with 6 panels) | Server |
| `/shop` | Shop listing (category filter: all/espresso/filter) | Server |
| `/shop/[slug]` | Product detail (JSON-LD) | Server (static params) |
| `/blog` | Blog listing | Server |
| `/blog/[slug]` | Blog post | Server (static params) |
| `/cart` | Shopping cart | Client |
| `/checkout` | Checkout form | Client |
| `/order/[id]` | Order result (status from query param) | Client |
| `/about` | About Azadi | Server |
| `/roastery` | Roastery process | Server |
| `/contact` | Contact form | Client |
| `/wholesale` | Wholesale inquiry form | Client |
| `/dashboard/design` | Design settings dashboard | Client |

### English (EN) — LTR, `/en` prefix

All 12 routes mirrored under `/en/...` with English content.

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/checkout` | POST | Create order from cart items |
| `/api/payment/callback` | GET | Zarinpal payment callback (verify + status update) |

### Special

- `robots.ts` → `/robots.txt` (disallows `/api/`, `/dashboard/`, `/order/`)
- `sitemap.ts` → `/sitemap.xml` (18 static routes, daily/weekly change freq)
- `proxy.ts` → Middleware (locale cookie, `x-locale` header, redirect `/` → `/en` if cookie is `en`)

---

## 6. KEY ARCHITECTURAL PATTERNS

### 1. Dual-Language Architecture
- Persian (FA) is the default/primary language, English is secondary under `/en`
- The middleware (`src/proxy.ts`) sets `x-locale` header and a `azadi_locale` cookie
- `RootLayout` reads the header to determine `lang`, `dir`, and passes `locale` to children
- `localePath()` and `alternateLocalePath()` utilities handle path construction

### 2. Page-Stack Layout (Homepage)
- Unique UX pattern: 6 "panels" (Home, Shop, Roastery, Blog, About, Contact) displayed as side-by-side tabs
- On desktop: horizontal stack with collapsed tabs on the sides + one active panel
- On mobile: vertical stack, all tabs visible
- `PageStackLayout` manages `activeId` state client-side

### 3. Live Design Theming System
- All visual properties defined as CSS custom properties in `:root`
- `DesignSettingsProvider` uses `useSyncExternalStore` with localStorage subscription
- `DesignDashboard` at `/dashboard/design` provides full UI: 5 presets, color pickers, font upload, shape/spacing sliders, component style variants
- Themes apply instantly across both FA and EN routes via CSS variables on `<html>`

### 4. Cart System
- Cart stored in localStorage with `useSyncExternalStore` for cross-tab sync
- Reducer-based state management (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR`)
- React Context + Provider pattern
- Hydration-safe: initial server render uses empty cart

### 5. Order Flow
1. Cart → `/checkout` → POST `/api/checkout` (creates order in in-memory store)
2. Redirect to `/order/[id]?status=pending`
3. PayButton → Server Action `initiatePayment` → Zarinpal redirect
4. Zarinpal returns to `/api/payment/callback` → verify → update order status
5. Redirect back to `/order/[id]?status=success|failed|error`

---

## 7. EXTERNAL INTEGRATIONS

| Service | Purpose | Configuration |
|---|---|---|
| **Resend** | Email delivery (contact + wholesale forms) | `RESEND_API_KEY`, `CONTACT_EMAIL`, `WHOLESALE_EMAIL` |
| **Zarinpal** | Payment gateway (sandbox by default) | `ZARINPAL_MERCHANT_ID`, `ZARINPAL_SANDBOX` |
| **Vazirmatn** | Persian font (self-hosted woff2 in `public/fonts/`) | No external CDN |
| **Open Design** | External MCP tooling (design daemon) | `mcp_servers.json` |

Data layer uses standalone seed data from `src/data/`. Functions accept optional `_locale` params for future external backend swap without changing call sites. See [data-layer.md](./data-layer.md).

---

## 8. TESTING SETUP

### Unit/Integration Tests (Vitest)
- **Config:** `vitest.config.ts` — jsdom environment, React plugin, `@/*` alias, globals enabled
- **Setup:** `vitest.setup.ts` — imports `@testing-library/jest-dom/vitest`
- **Excludes:** `tests/e2e/**`, `node_modules/**`
- **Test files:**
  - `src/data/products.test.ts` — 3 tests (returns all, valid slug, invalid slug)
  - `src/data/posts.test.ts` — 3 tests (returns all, valid slug, invalid slug)
  - `src/lib/cart/cart-reducer.test.ts` — 8 tests (add, increment, remove, update, clear, count, total)
  - `src/lib/format/currency.test.ts` — 3 tests (FA format, EN format, default)
  - `src/lib/orders/store.test.ts` — 6 tests (create, sequential numbers, get unknown, get known, update status)

### E2E Tests (Playwright)
- **Config:** Chrome only, fully parallel, 2 retries, trace on first retry
- **Test file:** `tests/e2e/smoke.spec.ts` — 7 tests:
  - Homepage: FA loads with title, EN loads with title, page stack tabs visible
  - Shop: products visible, product detail loads, category filter works
  - Navigation: language switch redirects, 404 page renders

---

## 9. DOCKER SETUP

**Multi-stage build on `node:24-alpine`:**

| Stage | Purpose |
|---|---|
| `base` | Sets `NEXT_TELEMETRY_DISABLED=1` |
| `deps` | `npm ci --omit=dev` (production dependencies only) |
| `builder` | Full `npm ci`, copies source, runs `npm run build` |
| `runner` | Production image: non-root `nextjs` user (uid 1001), copies standalone output + static files, exposes port 3000, `node server.js` |

The Next.js config sets `output: "standalone"` which generates the self-contained server.

---

## 10. COMPONENT INVENTORY

**26 components** across 9 directories:

| Category | Components |
|---|---|
| `layout/` | PageShell, Header, Footer, LanguageSwitch, DocumentLocaleSync |
| `cart/` | CartProvider, CartContent, CartButton, CheckoutForm, OrderStatus, PayButton, QuantityStepper |
| `product/` | ProductCard, ProductBuyPanel (+ ProductBuyPanelEn export) |
| `sections/` | HeroSection, FeaturedProducts |
| `blog/` | BlogCard |
| `forms/` | ContactForm, WholesaleForm |
| `settings/` | DesignSettingsProvider, DesignDashboard |
| `page-stack/` | PageStackLayout, PagePanel, ActivePanel, CollapsedTab |
| `ui/` | ButtonLink |

**16 library modules** across 5 domains:

| Domain | Modules |
|---|---|
| `cart/` | types, cart-reducer, cart-storage, cart-context |
| `orders/` | store |
| `format/` | currency, persian |
| `settings/` | design-presets, design-storage |
| `seo/` | schema |
| Top-level lib | i18n, theme-settings, zarinpal |

---

## 11. DATA MODEL

### CoffeeProduct (4 seed products)
- Bilingual fields: name/nameEn, origin/originEn, roast/roastEn, process/processEn, brew/brewEn, tastingNotes/tastingNotesEn
- Price in Toman (IRR/10), weight in grams
- Inventory status: `available`, `low`, `sold-out`
- Optional image URL + alt text

### BlogPost (3 seed posts)
- Bilingual: title/titleEn, category/categoryEn, date/dateEn, excerpt/excerptEn, body[]/bodyEn[]
- Slug-based routing

### Cart
- `CartItem`: slug, name, nameEn, priceToman, weightGram, quantity
- `Cart`: `{ items: CartItem[] }`
- Persisted in localStorage key `azadi_cart_v1`

### Order (LocalOrder)
- In-memory store (not persisted across server restarts)
- Fields: id, orderNumber, status, phone, address, items, totalToman, paymentMethod, zarinpalAuthority, zarinpalRefId, createdAt
- Statuses: `pending` → `processing` → `completed` | `failed`

### DesignSettings
- 16 colors, typography (font family + custom font upload), 6 shape values, 6 component style variants
- 5 built-in presets: Minimal light (default), Premium dark, Coffee warm, Modern editorial, High-contrast commercial
- Persisted in localStorage key `azadi.design.settings.v1`
