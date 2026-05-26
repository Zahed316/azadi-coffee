# Deployment Map — Azadi Coffee (Standalone)

> **Knowledge system:** [index.md](./index.md) · [project-map](./project-map.md) · [architecture](./architecture.md) · [agent-corporation](./agent-corporation.md)

## Overview

Next.js `output: "standalone"` produces a minimal, self-contained production artifact that bundles only what's traced at build time. This map shows how source code transforms into the deployed artifact.

---

## Build Pipeline

```
npm run build
  │
  ├──► next build (Turbopack)
  │     ├── Compiles src/ → .next/server/ (server-side chunks)
  │     ├── Compiles public/ + components → .next/static/ (client-side chunks)
  │     └── Generates manifest files (.next/*.json)
  │
  └──► output: "standalone" tracing
        ├── Reads .nft.json traces for every route
        ├── Copies only required node_modules into .next/standalone/
        ├── Generates server.js entry point
        └── Produces stripped package.json
```

---

## Source → Standalone Mapping

### Application Code

| Source | Standalone Output | Role |
|--------|-------------------|------|
| `src/app/page.tsx` | `.next/server/app/page.js` + chunks | `/` route handler |
| `src/app/about/page.tsx` | `.next/server/app/about/page.js` | `/about` |
| `src/app/shop/page.tsx` | `.next/server/app/shop/page.js` | `/shop` |
| `src/app/shop/[slug]/page.tsx` | `.next/server/app/shop/[slug]/page.js` | `/shop/:slug` |
| `src/app/blog/page.tsx` | `.next/server/app/blog/page.js` | `/blog` |
| `src/app/blog/[slug]/page.tsx` | `.next/server/app/blog/[slug]/page.js` | `/blog/:slug` |
| `src/app/cart/page.tsx` | `.next/server/app/cart/page.js` | `/cart` |
| `src/app/checkout/page.tsx` | `.next/server/app/checkout/page.js` | `/checkout` |
| `src/app/contact/page.tsx` | `.next/server/app/contact/page.js` | `/contact` |
| `src/app/wholesale/page.tsx` | `.next/server/app/wholesale/page.js` | `/wholesale` |
| `src/app/roastery/page.tsx` | `.next/server/app/roastery/page.js` | `/roastery` |
| `src/app/dashboard/design/page.tsx` | `.next/server/app/dashboard/design/page.js` | `/dashboard/design` |
| `src/app/order/[id]/page.tsx` | `.next/server/app/order/[id]/page.js` | `/order/:id` |
| `src/app/en/page.tsx` | `.next/server/app/en/page.js` | `/en` |
| `src/app/en/about/page.tsx` | `.next/server/app/en/about/page.js` | `/en/about` |
| `… (all en/* routes)` | `.next/server/app/en/*/page.js` | All `/en/*` routes |
| `src/app/layout.tsx` | Inlined into each route's root chunk | Shared layout |
| `src/app/api/checkout/route.ts` | `.next/server/app/api/checkout/route.js` | POST `/api/checkout` |
| `src/app/api/payment/callback/route.ts` | `.next/server/app/api/payment/callback/route.js` | GET `/api/payment/callback` |
| `src/app/actions/contact.ts` | `server/chunks/ssr/_next-internal_server_app_*_contact_page_actions_*.js` | Contact form Server Action |
| `src/app/actions/payment.ts` | `server/chunks/ssr/_next-internal_server_app_*_payment_page_actions_*.js` | Payment Server Action |
| `src/app/actions/wholesale.ts` | `server/chunks/ssr/_next-internal_server_app_*_wholesale_page_actions_*.js` | Wholesale Server Action |

### Static Assets

| Source | Standalone Output | Served As |
|--------|-------------------|-----------|
| `src/app/globals.css` | `.next/static/chunks/*.css` | `/_next/static/chunks/*.css` |
| `src/app/favicon.ico` | `.next/server/app/favicon.ico.body` | `/favicon.ico` |
| `src/app/robots.ts` | `.next/server/app/robots.txt.body` | `/robots.txt` |
| `src/app/sitemap.ts` | `.next/server/app/sitemap.xml.body` | `/sitemap.xml` |
| `public/robots.txt` | `./public/robots.txt` | `/robots.txt` |
| `public/fonts/Vazirmatn-*.woff2` | `./public/fonts/Vazirmatn-*.woff2` | `/fonts/Vazirmatn-*.woff2` |
| `public/*.svg` | `./public/*.svg` | `/*.svg` |

### Configuration

| Source | Standalone Output |
|--------|-------------------|
| `next.config.ts` | Inlined as JSON in `server.js` (`__NEXT_PRIVATE_STANDALONE_CONFIG`) |
| `env.local` | Not included — must be provided via `--env-file` at container start |

---

## Standalone Directory Structure

```
.next/standalone/
│
├── server.js                          ← Auto-generated entry point
├── package.json                       ← Stripped (next + react + react-dom only)
│
├── .next/
│   ├── BUILD_ID                       ← "ppDhthfBq2ZZtae1fj0gE"
│   ├── package.json                   ← {"type": "commonjs"}
│   ├── required-server-files.json     ← NextConfig + file list
│   ├── routes-manifest.json           ← All route definitions
│   ├── prerender-manifest.json        ← ISR/static generation config
│   ├── build-manifest.json            ← Client chunk map
│   ├── app-path-routes-manifest.json  ← App router paths
│   │
│   └── server/
│       ├── app/                       ← One subdir per route
│       │   ├── page.js                ← / handler
│       │   ├── about/page/page.js     ← /about
│       │   ├── shop/page.js           ← /shop
│       │   ├── shop/[slug]/page.js    ← /shop/:slug
│       │   ├── api/checkout/route.js  ← POST /api/checkout
│       │   ├── api/payment/callback/route.js  ← GET /api/payment/callback
│       │   ├── favicon.ico/           ← .body + .meta
│       │   ├── robots.txt/            ← .body + .meta
│       │   ├── sitemap.xml/           ← .body + .meta
│       │   └── ... (all routes)
│       │
│       ├── chunks/
│       │   ├── [turbopack]_runtime.js
│       │   ├── [externals]__*.js
│       │   ├── [root-of-the-server]__*.js  (7 shared bundles)
│       │   ├── _next-internal_server_app_*_actions_*.js  (6 action bundles)
│       │   └── ssr/  (30 chunks)
│       │
│       ├── middleware.js              ← 6-line stub (no custom middleware)
│       └── pages/                     ← Empty (App Router only)
│
├── node_modules/                      ← 10 traced packages
│   ├── next/                          ← Framework
│   ├── react/                         ← Runtime
│   ├── react-dom/                     ← Runtime
│   ├── @next/env/                     ← Env config
│   ├── @swc/helpers/                  ← SWC runtime
│   ├── styled-jsx/                    ← CSS-in-JS runtime
│   ├── sharp/                         ← Image optimization
│   ├── @img/sharp-linux-x64/          ← Native image binary
│   ├── @img/sharp-libvips-linux-x64/  ← Native image library
│   ├── @img/colour/                   ← Color processing
│   ├── client-only/                   ← Client/server boundary guard
│   └── detect-libc/                   ← glibc/musl detection
│
└── .next/static/                      ← Client-side assets (separate COPY target)
    ├── chunks/
    │   ├── *.js  (20 client chunks)
    │   └── *.css (1 merged CSS chunk)
    └── media/
        └── favicon.*.ico
```

---

## Docker Stage Map

```
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 1: deps                                                     │
│   npm ci --omit=dev                                               │
│   → /app/node_modules/                                            │
│    (next, react, react-dom, resend)                               │
├──────────────────────────────────────────────────────────────────┤
│ STAGE 2: builder                                                  │
│   npm ci  (full)  →  npm run build                               │
│   → /app/.next/standalone/   (server.js + .next/ + node_modules/)│
│   → /app/.next/static/       (client bundles)                    │
│   → /app/public/             (static assets)                     │
├──────────────────────────────────────────────────────────────────┤
│ STAGE 3: runner   (Node 24 Alpine, user=nextjs:1001)             │
│                                                                    │
│   COPY --from=deps /app/node_modules → ./node_modules             │
│        ↓ provides resend (not in standalone node_modules)         │
│                                                                    │
│   COPY --from=builder /app/public → ./public                      │
│        ↓ fonts, svgs, robots.txt                                  │
│                                                                    │
│   COPY --from=builder /app/.next/standalone → ./                  │
│        ↓ server.js, .next/, standalone node_modules/              │
│        (overwrites any duplicate files from deps node_modules)    │
│                                                                    │
│   COPY --from=builder /app/.next/static → ./.next/static          │
│        ↓ client JS/CSS served at /_next/static/*                  │
│                                                                    │
│   CMD ["node", "server.js"]                                       │
│   EXPOSE 3000                                                     │
└──────────────────────────────────────────────────────────────────┘
```

**Layering rationale:** `deps node_modules` is copied first, then standalone overlays. This ensures:
- `resend` is available (standalone tracing misses server-action externals)
- Standalone's traced `node_modules` wins for framework packages (ensuring correct versions)
- The result is the union of both with standalone having precedence

---

## Request Routing at Runtime

```
Browser Request
  │
  ▼
docker run -p 3000:3000
  │
  ▼
node server.js
  │  process.chdir(__dirname)
  │  Reads __NEXT_PRIVATE_STANDALONE_CONFIG
  │  Calls startServer({ dir, port: 3000, isDev: false })
  ▼
Next.js Server (next/dist/server/lib/start-server)
  │
  ├──► Static files: /_next/static/* → .next/static/*
  ├──► Public files: /* → public/*
  ├──► API routes: /api/* → .next/server/app/api/*/route.js
  ├──► Pages: /* → .next/server/app/*/page.js
  ├──► Server Actions: POST → action chunks
  ├──► Metadata: /favicon.ico, /robots.txt, /sitemap.xml → .body files
  │
  └──► Middleware: .next/server/middleware.js (stub — no custom logic)
```

### Security Headers (from next.config.ts)

All responses get:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

---

## Environment Variable Map

| Variable | Used By | Required For |
|----------|---------|--------------|
| `NEXT_PUBLIC_SITE_URL` | `next.config.ts` (image patterns) | Image optimization, canonical URLs |
| `ZARINPAL_MERCHANT_ID` | `src/lib/zarinpal.ts` | Payment gateway |
| `ZARINPAL_SANDBOX` | `src/lib/zarinpal.ts` | Sandbox vs production mode |
| `RESEND_API_KEY` | `src/app/actions/contact.ts`, `wholesale.ts` | Contact + wholesale email forms |
| `CONTACT_EMAIL` | `src/app/actions/contact.ts` | Contact form recipient |
| `WHOLESALE_EMAIL` | `src/app/actions/wholesale.ts` | Wholesale form recipient |
| `PORT` | `server.js` (default 3000) | Container port |
| `HOSTNAME` | `server.js` (default 0.0.0.0) | Bind address |
| `NODE_ENV` | Dockerfile (set to production) | Next.js production mode |
| Braze API key | `mcp_servers.json` → `brave-search` | MCP web search (dev only) |

Not included in standalone:
- Not included in standalone: none — all env vars needed by the app are accounted for above.

---

## File Size & Composition

The standalone output strips everything unnecessary:

| Component | Source (dev) | Standalone |
|-----------|-------------|------------|
| `node_modules/` | ~200 packages | 10 packages (5%) |
| Application code | ~26 components + 16 lib modules | Compiled chunks (~30 SSR bundles) |
| Client bundles | — | 20 JS chunks + 1 CSS chunk |
| Static assets | `public/` | Copied verbatim |
| Package.json | 40 lines (all deps) | 20 lines (next+react only) |

---

## Deployment Checklist

See [deploy skill](../skills/deploy/SKILL.md) for step-by-step instructions.

Quick reference:
```bash
npm run build
docker build -t azadi-coffee .
docker run -p 3000:3000 --env-file .env.production azadi-coffee
```

Then verify:
- `curl -I https://domain.com` → 200 + security headers
- `curl -I https://domain.com/en` → 200
- `curl https://domain.com/api/checkout -X POST -d '{"phone":"09123456789","address":"Test","items":[]}'` → valid JSON
- Test Zarinpal sandbox payment
- Test contact/wholesale form submission via Resend
