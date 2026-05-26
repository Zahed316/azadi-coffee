# Azadi Coffee — Agent Corporation

> Architecture patterns and module connectivity: [architecture.md](./architecture.md)  
> Full codebase map: [project-map.md](./project-map.md)  
> MCP server docs: [mcp.md](./mcp.md)

## System Overview

Azadi Coffee operates as a **layered intelligence system** where AI agents collaborate across four tiers:

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 1: Shared Context                    │
│  AGENTS.md (memory)  ·  project-map.md (codebase map)       │
├─────────────────────────────────────────────────────────────┤
│                    TIER 2: Domain Agents (8)                 │
│  bilingual  ·  design  ·  payment  ·  data-layer           │
│  seo  ·  devops  ·  pm  ·  testing                         │
├─────────────────────────────────────────────────────────────┤
│                    TIER 3: Workflow Skills (6)               │
│  new-page  ·  new-product  ·  new-component                 │
│  debug-cart  ·  debug-payment  ·  deploy                    │
├─────────────────────────────────────────────────────────────┤
│                    TIER 4: MCP Servers (6)                   │
│  filesystem  ·  sequential-thinking  ·  memory              │
│  brave-search  ·  bash  ·  open-design                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Corporation Map

### How Agents Collaborate on Every Task

When building any feature, agents collaborate in this pattern:

```
                    ┌──────────────┐
                    │  PM Agent    │  ← What to build (priorities, scope)
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────────┐
   │ Bilingual│    │  Design  │    │ Data Layer  │  ← Cross-cutting concerns
   │  Agent   │    │  Agent   │    │    Agent      │     every feature must
   └────┬─────┘    └────┬─────┘    └──────┬───────┘     satisfy ALL of these
        │               │                │
        └───────────────┼────────────────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
       ┌─────────┐ ┌─────────┐ ┌──────────┐
       │Payment  │ │  SEO    │ │ Testing  │  ← Feature-specific agents
       │ Agent   │ │  Agent  │ │  Agent   │
       └────┬────┘ └────┬────┘ └────┬─────┘
            │           │           │
            └───────────┼───────────┘
                        │
                  ┌─────┴─────┐
                  │  DevOps   │  ← Deployment gate
                  │  Agent    │
                  └───────────┘
```

### Skills Orchestrate Agents

Skills execute multi-agent workflows:

| Skill | Agents Involved | MCP Tools Used |
|---|---|---|
| **new-page** | bilingual → seo → testing → (devops) | filesystem, sequential-thinking |
| **new-product** | data-layer → bilingual → testing | filesystem |
| **new-component** | design → bilingual → testing → seo | filesystem, open-design |
| **debug-cart** | payment → bilingual → testing | filesystem, sequential-thinking, bash |
| **debug-payment** | payment → devops → testing | filesystem, sequential-thinking, bash |
| **deploy** | devops → testing → seo → pm | filesystem, bash, sequential-thinking |

---

## Domain Agent → Codebase Mapping

### 1. bilingual Agent
**Domain:** Bilingual FA/EN RTL/LTR architecture  
**Covers these files:**
- `src/proxy.ts` — middleware (locale cookie, x-locale header)
- `src/lib/i18n.ts` — localePath(), alternateLocalePath()
- `src/components/layout/LanguageSwitch.tsx`
- `src/components/layout/DocumentLocaleSync.tsx`
- `src/app/layout.tsx` — lang/dir on `<html>`
- Every page: `src/app/<route>/page.tsx` + `src/app/en/<route>/page.tsx`
- Every bilingual component (ProductCard, ProductBuyPanel, etc.)
- Data files: `src/data/products.ts`, `src/data/posts.ts`

### 2. design Agent
**Domain:** Live theming, CSS custom properties, design dashboard  
**Covers these files:**
- `src/lib/settings/design-presets.ts` — 5 presets, DesignSettings type
- `src/lib/settings/design-storage.ts` — localStorage persistence
- `src/lib/theme-settings.ts` — CSS variable generation
- `src/components/settings/DesignSettingsProvider.tsx`
- `src/components/settings/DesignDashboard.tsx`
- `src/app/globals.css` — Tailwind v4 + `:root` variables
- `src/app/dashboard/design/page.tsx`
- Every component using `bg-paper`, `text-ink`, `border-ink`, etc.
- `mcp_servers.json` → `open-design` MCP server

### 3. payment Agent
**Domain:** Zarinpal gateway, order flow, checkout  
**Covers these files:**
- `src/lib/zarinpal.ts` — requestPayment(), verifyPayment()
- `src/app/actions/payment.ts` — Server Action
- `src/app/api/checkout/route.ts` — POST order creation
- `src/app/api/payment/callback/route.ts` — GET callback
- `src/lib/orders/store.ts` — In-memory order CRUD
- `src/components/cart/CheckoutForm.tsx`
- `src/components/cart/PayButton.tsx`
- `src/components/cart/OrderStatus.tsx`
- `src/app/checkout/page.tsx` + `/en/checkout/page.tsx`
- `src/app/order/[id]/page.tsx` + `/en/order/[id]/page.tsx`

### 4. data-layer Agent
**Domain:** Standalone seed data, content management, future backend swap  
**Covers these files:**
- `src/data/products.ts` — CoffeeProduct type, 4 products, getProducts()
- `src/data/posts.ts` — BlogPost type, 3 posts, getPosts()
- `src/lib/cart/cart-reducer.ts` — CartItem references product slugs
- `src/lib/cart/cart-storage.ts` — localStorage persistence (key: `azadi_cart_v1`)
- `src/lib/orders/store.ts` — In-memory order creation (item validation)
- Product/Promo sections on homepage panels
- **Upgrade path:** `src/data/` can be swapped to an external API or database by reimplementing the same function signatures (`getProducts`, `getProduct`, `getProductBySlug`, `getPosts`, `getPost`, `getPostBySlug`) — no component changes needed

### 5. seo Agent
**Domain:** Bilingual SEO, structured data, sitemaps  
**Covers these files:**
- `src/lib/seo/schema.ts` — productJsonLd()
- `src/app/robots.ts` — robots.txt generation
- `src/app/sitemap.ts` — sitemap.xml generation
- Every page's `metadata` export
- Product detail page JSON-LD injection

### 6. devops Agent
**Domain:** Docker, CI/CD, deployment, security  
**Covers these files:**
- `Dockerfile` — multi-stage Node 24 Alpine
- `next.config.ts` — standalone output, security headers, HTTPS redirects
- `.env.example` / `.env.local` — environment config
- `package.json` — scripts
- Infrastructure: server, Docker registry, monitoring

### 7. pm Agent
**Domain:** Priorities, backlog, technical debt  
**Covers:**
- P0-P3 priority backlog
- Technical debt tracking
- Feature request triage
- No code files — pure project management

### 8. testing Agent
**Domain:** Vitest + Playwright test infrastructure  
**Covers these files:**
- `vitest.config.ts` / `vitest.setup.ts`
- `playwright.config.ts`
- `src/data/products.test.ts` (3 tests)
- `src/data/posts.test.ts` (3 tests)
- `src/lib/cart/cart-reducer.test.ts` (8 tests)
- `src/lib/format/currency.test.ts` (3 tests)
- `src/lib/orders/store.test.ts` (6 tests)
- `tests/e2e/smoke.spec.ts` (7 tests)
- Coverage gaps: no component tests, no API route tests, no middleware tests

---

## MCP Server → Agent Mapping

| MCP Server | Used By Agents | Purpose |
|---|---|---|
| `filesystem` | ALL | Read/write project files, access `ai/` |
| `sequential-thinking` | ALL | Complex multi-step reasoning |
| `memory` | ALL | Persistent knowledge across sessions |
| `open-design` | design | Theme inspection, design token management |
| `brave-search` | pm, devops, seo, data-layer | Web search for docs, APIs, best practices |
| `bash` | devops, testing, pm | Build, test, lint commands |

---

## Data Flow: Feature Implementation End-to-End

```
USER REQUEST
    │
    ▼
┌─────────────────────────────────────────────┐
│ PM Agent triages → P0/P1/P2/P3              │
│ Decides scope, identifies affected files    │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Data    │ │Bilingual│ │Design     │  ← Cross-cutting constraints
│Layer   │ │Agent    │ │Agent      │     "Every page must be bilingual,
│Agent   │ │         │ │           │      theme-aware, and data-compatible"
└───┬────┘ └────┬────┘ └─────┬─────┘
    │           │             │
    └───────────┼─────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Payment │ │  SEO   │ │ Testing  │  ← Feature-specific concerns
│Agent   │ │ Agent  │ │ Agent    │     "If it's a checkout page: payment flow"
│        │ │        │ │          │     "Every page: metadata, schema, sitemap"
└───┬────┘ └───┬────┘ └────┬─────┘     "Every change: unit + E2E test"
    │          │           │
    └──────────┼───────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Skill:  │ │Skill:  │ │Skill:    │  ← Workflow execution
│new-page│ │new-    │ │new-      │
│        │ │product │ │component │
└───┬────┘ └───┬────┘ └────┬─────┘
    │          │           │
    └──────────┼───────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│MCP:    │ │MCP:    │ │MCP:      │  ← Tool layer
│filesys │ │bash    │ │seq-think │
└───┬────┘ └───┬────┘ └────┬─────┘
    │          │           │
    └──────────┼───────────┘
               │
               ▼
         CODE IS WRITTEN
               │
               ▼
┌─────────────────────────────────────────────┐
│ Testing Agent verifies:                     │
│  npx vitest → 25+ tests pass                │
│  npx playwright test → 7+ tests pass        │
│  npm run lint → clean                       │
│  npm run build → succeeds                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ DevOps Agent deploys:                       │
│  docker build → docker push → deploy        │
│  Verify headers, smoke test, Zarinpal test  │
└─────────────────────────────────────────────┘
```

---

## Agent Communication Protocol

Agents don't communicate directly — they operate through shared context:

1. **AGENTS.md** — Every agent reads this first (project overview, architecture, conventions)
2. **project-map.md** — Every agent references this (file locations, component inventory)
3. **Domain agents (`ai/agents/*.md`)** — Specialist knowledge loaded when needed
4. **Skills (`ai/skills/*/SKILL.md`)** — Step-by-step playbooks that orchestrate multiple agents
5. **MCP memory server** — Persistent cross-session knowledge graph (`ai/memory/memory.json`)
6. **The codebase itself** — Source of truth; agents read/write via MCP filesystem

---

## Complete File Inventory

```
azadi-coffee/
│
├── AGENTS.md                          ← SHARED MEMORY (Tier 1)
│
├── ai/
│   ├── AGENTS.md                      ← AI project memory mirror
│   ├── README.md                      ← AI knowledge index
│   ├── architecture/project-map.md    ← CODEBASE MAP (Tier 1)
│   ├── architecture/mcp.md            ← MCP server documentation
│   │
│   ├── agents/bilingual.md            ← AGENT: Bilingual
│   ├── agents/design.md               ← AGENT: Design
│   ├── agents/payment.md              ← AGENT: Payment
│   ├── agents/data-layer.md           ← AGENT: Data Layer
│   ├── agents/seo.md                  ← AGENT: SEO
│   ├── agents/devops.md               ← AGENT: DevOps
│   ├── agents/pm.md                   ← AGENT: PM
│   ├── agents/testing.md              ← AGENT: Testing
│   │
│   ├── skills/
│   │   ├── new-page/SKILL.md          ← SKILL: Create FA+EN page
│   │   ├── new-product/SKILL.md       ← SKILL: Add coffee product
│   │   ├── new-component/SKILL.md     ← SKILL: Theme-aware component
│   │   ├── debug-cart/SKILL.md        ← SKILL: Diagnose cart bugs
│   │   ├── debug-payment/SKILL.md     ← SKILL: Diagnose payment bugs
│   │   └── deploy/SKILL.md            ← SKILL: Production deployment
│   │
│   ├── memory/
│   │   └── memory.json                ← MCP memory knowledge graph
│   │
│   └── taste/
│       └── taste.md                   ← Learned preferences (empty)
│
├── mcp_servers.json                   ← MCP CONFIG (Tier 4)
│
├── src/                               ← APPLICATION CODE
│   ├── proxy.ts
│   ├── app/  (layout, pages, API, actions)
│   ├── components/  (26 components)
│   ├── data/  (products, posts)
│   └── lib/  (16 modules)
│
├── tests/
│   └── e2e/smoke.spec.ts
│
├── Dockerfile
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── .env.local / .env.example
```

---

## Quick Reference: Which Agent Handles What

| When you need to... | Talk to this agent |
|---|---|
| Add Persian/English content | `bilingual` |
| Change colors, fonts, or layout style | `design` |
| Fix checkout or payment bugs | `payment` |
| Add/update products or blog posts | `data-layer` |
| Add metadata, structured data, sitemaps | `seo` |
| Build Docker image or deploy | `devops` |
| Prioritize features or check backlog | `pm` |
| Write or run tests | `testing` |
| Create a new page | `new-page` skill |
| Add a coffee product | `new-product` skill |
| Build a new component | `new-component` skill |
| Diagnose cart issues | `debug-cart` skill |
| Diagnose payment issues | `debug-payment` skill |
| Deploy to production | `deploy` skill |
