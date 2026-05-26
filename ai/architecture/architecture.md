# Architecture Patterns — Azadi Coffee

> **Knowledge system:** [index.md](./index.md) · [project-map](./project-map.md) · [agent-corporation](./agent-corporation.md) · [deployment](./deployment.md)

## Request Lifecycle

```
HTTP Request
  │
  ▼
proxy.ts (middleware)     — reads azadi_locale cookie → sets x-locale/x-dir headers
  │
  ▼
layout.tsx (server)       — reads x-locale header → derives lang/dir → renders providers
  │  wraps: DesignSettingsProvider > CartProvider > {children}
  ▼
page.tsx (server)         — fetches data from src/data/ → renders page-specific layout
  │
  ▼
components/*              — server components render markup, client components hydrate interactivity
```

Middleware is at `src/proxy.ts` (not `middleware.ts`) — likely imported via `next.config.ts` or custom server.

---

## Client/Server Boundary

### Server Components (no directive)
`layout.tsx`, all `page.tsx` files, `ProductCard`, `Header`, `Footer`, `PageShell`, `PagePanel`, `CollapsedTab`, `ActivePanel`, `HeroSection`, `FeaturedProducts`, `ButtonLink`

### Client Components (21 files, 23 directives)
| Domain | Files | Reason |
|--------|-------|--------|
| Cart | `cart-context`, `CartProvider`, `CartButton`, `CartContent`, `CheckoutForm`, `OrderStatus`, `PayButton`, `QuantityStepper` | `useState`, `useReducer`, `useSyncExternalStore`, `useActionState` |
| Design | `DesignSettingsProvider`, `DesignDashboard` | `useSyncExternalStore`, DOM access |
| Page Stack | `PageStackLayout` | `useState` for active panel |
| Product | `ProductBuyPanel` | `useState`, `useCart` |
| Layout | `DocumentLocaleSync`, `LanguageSwitch` | `usePathname`, `useLayoutEffect` |
| Forms | `ContactForm`, `WholesaleForm` | `useState` |
| Errors | `error.tsx` ×3 | Required by Next.js |

---

## Pattern 1: Dual-Locale RTL/LTR Architecture

### How locale flows
```
proxy.ts ──sets──► x-locale header ──read by──► layout.tsx ──derives──► lang/dir/Locale
                                                      │
                 ┌────────────────────────────────────┤
                 ▼                                    ▼
     layout passes locale                PageShell receives locale prop
     via <html lang dir>                 passes to Header, Footer
                 │                                    │
                 ▼                                    ▼
     DocumentLocaleSync reads            All nav components use
     pathname from usePathname()         localePath() / alternateLocalePath()
```

### Route structure
No `[locale]` dynamic segment. Each locale has its own `page.tsx`:
- Persian: `/` → `src/app/page.tsx`, `/shop` → `src/app/shop/page.tsx`
- English: `/en` → `src/app/en/page.tsx`, `/en/shop` → `src/app/en/shop/page.tsx`

### Locale utilities (`src/lib/i18n.ts`)
- `localePath("fa", "/shop")` → `"/shop"`, `localePath("en", "/shop")` → `"/en/shop"`
- `alternateLocalePath("fa", "/shop")` → `"/en/shop"` (for language toggle)

---

## Pattern 2: CSS Custom Property Theming (Dual-Delivery)

### Pipeline
```
design-presets.ts (5 preset objects, DesignSettings type)
       │
       ├──► theme-settings.ts (themeSettingsToCssVariables → CSSProperties)
       │       │
       │       └──► layout.tsx SSR: <html style={cssVars}>
       │
       └──► design-storage.ts (localStorage read/write/subscribe)
               │
               └──► DesignSettingsProvider.tsx
                       │  useSyncExternalStore(subscribe, read)
                       │  useEffect → documentElement.style.setProperty()
                       │
                       └──► DesignDashboard.tsx (live preview)
```

### Why two delivery paths?
1. **Server**: `layout.tsx` sets CSS variables via React `style={}` for initial render — no flash of unstyled content
2. **Client**: `DesignSettingsProvider` applies localStorage overrides via direct DOM manipulation — the dashboard can preview changes live

### CSS custom properties at `:root`
```
--ink, --paper, --warm-paper, --graphite, --stone, --coffee, --line
--success, --danger
--site-font-family, --site-font-family-fa, --site-font-family-en
--radius, --card-radius, --button-radius, --tab-radius
--shadow-intensity, --shadow-card, --spacing-scale
--tab-background, --tab-text, --tab-hover-background, --tab-hover-text
--button-primary-background, --button-primary-text
--button-secondary-background, --button-secondary-text
```

Tailwind v4 `@theme inline` maps these to utility classes (`bg-paper`, `text-ink`, etc.)

Component style variants use data attributes: `data-header-style`, `data-footer-style`, `data-product-card-style`, `data-blog-card-style`, `data-button-style`, `data-landing-style`

---

## Pattern 3: Cart System (Reducer + External Store)

### State flow
```
types.ts         → CartItem, CartAction, EMPTY_CART
     │
     ▼
cart-reducer.ts  → ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR
     │              getCartCount(), getCartTotal()
     ▼
cart-storage.ts  → localStorage read/write/subscribe (key: azadi_cart_v1)
     │
     ▼
cart-context.tsx → CartContextProvider (useReducer + useSyncExternalStore)
     │              exports useCart() hook
     ▼
CartProvider.tsx → thin wrapper, mounted in layout.tsx
     │
     ├──► CartButton (reads count)
     ├──► CartContent (reads items, total; calls updateQuantity/removeItem)
     ├──► CheckoutForm (reads items; calls clearCart after order)
     ├──► OrderStatus (renders PayButton for pending)
     └──► ProductBuyPanel (calls addItem)
```

### Hydration safety
On first load, if context is empty but localStorage has data, it replays `ADD_ITEM` for each stored item. This prevents hydration mismatches (SSR always renders empty cart).

---

## Pattern 4: Order + Payment Pipeline

```
CheckoutForm (client)
  │  POST /api/checkout { phone, address, items, paymentMethod }
  ▼
api/checkout/route.ts
  │  Validates → createOrder() → returns { orderId, orderNumber }
  ▼
orders/store.ts (in-memory, globalThis.__orders Map)
  │  createOrder(), getOrder(), updateOrderStatus(), setOrderAuthority()
  ▼
OrderStatus.tsx (client)
  │  Reads ?status= from URL → pending shows PayButton
  ▼
PayButton.tsx (client)
  │  <form action={initiatePayment}>  ← useActionState
  ▼
actions/payment.ts ("use server")
  │  getOrder() → requestPayment() → redirect(gatewayUrl)
  ▼
zarinpal.ts
  │  POST to sandbox/production request.json
  ▼
Zarinpal Gateway (external redirect)
  │
  ▼
api/payment/callback/route.ts (GET)
  │  verifyPayment() → updateOrderStatus() → redirect outcome
```

### Order store design
In-memory `Map<string, LocalOrder>` on `globalThis.__orders`. Auto-incrementing `orderNumber` from 1000. Resets on server restart — MVP/demo design, not production.

---

## Pattern 5: Page Stack (Client State + Server Content)

```
page.tsx (server)
  │  Builds StackPanel[] — each panel: { id, label, title, tone, children }
  ▼
PageStackLayout.tsx ("use client")
  │  useState(panels[0]?.id) → activeId
  │  Computes: activeIndex, previousTabs, nextTabs
  │
  ├──► ActivePanel (server) → PagePanel (tone: paper/warm/ink) → renders children
  └──► CollapsedTab (server) → onClick → setActiveId
```

**Split**: State machine is client-side (`useState`), panel content is server-rendered JSX passed as props. Desktop: horizontal stack with side tabs. Mobile: vertical stack, all tabs visible.

---

## Pattern 6: Server Actions for Mutations

Three server actions in `src/app/actions/`:

| Action | File | Pattern |
|--------|------|---------|
| `initiatePayment` | `payment.ts` | `useActionState` in PayButton → form submits → validates → redirects |
| `sendContact` | `contact.ts` | `useActionState` in ContactForm → sends via Resend |
| `sendWholesale` | `wholesale.ts` | `useActionState` in WholesaleForm → sends via Resend |

All follow: form → `useActionState(action, initialState)` → server validates → returns `{ success/message }` or `redirect()`

---

## Pattern 7: External Store (useSyncExternalStore)

Both cart and design settings use the same pattern:

```
storage module
  ├── subscribe(callback): Set<()=>void> listener registry
  ├── read(): returns current value (from localStorage or default)
  └── write(value): persist to localStorage → notify listeners

React provider
  └── useSyncExternalStore(subscribe, read, getServerSnapshot)
```

Cross-tab sync: `window.addEventListener("storage", ...)` fires on other tabs when localStorage changes.

---

## Pattern 8: Static Seed Data (No Database)

No database. All data from TypeScript arrays:

| File | Exports | Consumers |
|------|---------|-----------|
| `data/products.ts` | `getProducts()`, `getProduct()`, `getProductBySlug()` | pages, ProductCard, FeaturedProducts |
| `data/posts.ts` | `getPosts()`, `getPost()` | pages, BlogCard |

Standalone static data: data layer is pure TypeScript arrays. See [data-layer.md](./data-layer.md) for the update workflow and how to swap to an external backend without changing component signatures.

---

## Full Dependency Graph

```
data/products.ts ──► ProductCard, FeaturedProducts, ProductBuyPanel, shop/page, page.tsx
data/posts.ts    ──► page.tsx, en/page.tsx

lib/i18n.ts      ──► Header, Footer, LanguageSwitch, CartButton, PayButton,
                     ProductCard, FeaturedProducts, HeroSection, CartContent,
                     CheckoutForm, OrderStatus, PageStackLayout, PagePanel,
                     ActivePanel, DocumentLocaleSync, PageShell

lib/format/currency.ts ──► CartContent, ProductCard, FeaturedProducts
lib/format/persian.ts  ──► ProductCard

lib/cart/types.ts       ──► cart-reducer, cart-storage, cart-context, orders/store
lib/cart/cart-reducer.ts ──► cart-context
lib/cart/cart-storage.ts ──► cart-context
lib/cart/cart-context.ts ──► CartProvider ──► CartButton, CartContent,
                             CheckoutForm, OrderStatus, ProductBuyPanel

lib/settings/design-presets.ts ──► design-storage, theme-settings,
                                   DesignSettingsProvider, DesignDashboard
lib/settings/design-storage.ts ──► DesignSettingsProvider, DesignDashboard
lib/theme-settings.ts          ──► layout, page, en/page

lib/orders/store.ts ──► api/checkout, actions/payment, api/payment/callback
lib/zarinpal.ts     ──► actions/payment, api/payment/callback

components/page-stack/PageStackLayout ──► page.tsx, en/page.tsx
components/layout/PageShell           ──► all non-home pages
components/layout/Header              ──► PageShell
components/layout/Footer              ──► PageShell
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No `[locale]` dynamic route | Simpler static generation, explicit FA/EN separation, no route param threading |
| `locale` as prop drilling | Explicit data flow — no context needed for server components |
| Prisma/PostgreSQL order store | Persistent standalone ecommerce records without WordPress, WooCommerce, or a CMS |
| Reducer-based cart | Testable pure functions, predictable state transitions |
| CSS variables for theming | Framework-agnostic, works with Tailwind v4 `@theme inline`, zero JS for initial render |
| `useSyncExternalStore` for persistence | React 19 official pattern for external stores, cross-tab sync |
| Server Actions for mutations | No API route boilerplate for simple POSTs, progressive enhancement, type safety |
| Seed data as TS arrays | Zero dependencies, type-safe, trivial to test, swappable via function signatures |
| Page stack state on client | Interactive tabs don't need server roundtrips, but content stays server-rendered |
