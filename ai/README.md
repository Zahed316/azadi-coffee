# Azadi Coffee — Knowledge System

The `ai/` directory is a visible, general-purpose knowledge system for this project. Each layer builds on the one below it.

---

## Full Map

```
ai/
│
├── README.md                  ← YOU ARE HERE — master directory
├── AGENTS.md                  — Project memory mirror for AI tools
│
├── Layer 1: Shared Context
│   └── architecture/project-map.md — Complete codebase map
│
├── Layer 2: Architecture
│   ├── architecture/architecture.md        — Architectural patterns + dependency graph
│   ├── architecture/feature-map.md         — Features mapped to files, data, tests, risks
│   ├── architecture/task-to-file-map.md    — Common AI tasks to files and validation
│   ├── architecture/deployment.md          — Standalone output map, Docker stages, routing
│   └── architecture/mcp.md                 — MCP server documentation
│
├── Layer 2.5: Navigational Maps (machine-oriented)
│   ├── maps/symbols.json      — Exported symbols: name, file, signature, callers
│   ├── maps/imports.json      — Import graph: imports, importedBy, exports
│   ├── maps/impact.json       — Change impact: tests, consumers, risk level
│   ├── maps/fragility.md      — Pre-edit risk assessment
│   ├── maps/validation.md     — Command matrix by change type
│   └── maps/generate.mjs      — Regeneration script: `npm run maps:generate`
│
├── Layer 3: Agent Corporation
│   ├── agents/agent-corporation.md — Agent collaboration map, skill orchestration, MCP mapping
│   │
│   ├── Domain Agents (knowledge files)
│   │   ├── agents/bilingual.md    — FA/EN RTL/LTR architecture
│   │   ├── agents/design.md       — Live theming, CSS custom properties, presets
│   │   ├── agents/payment.md      — Zarinpal gateway, order flow
│   │   ├── agents/data-layer.md   — Standalone seed data strategy and replacement guide
│   │   ├── agents/seo.md          — Bilingual SEO, structured data, sitemaps
│   │   ├── agents/devops.md       — Docker, CI/CD, environment config
│   │   ├── agents/pm.md           — Priorities, backlog, technical debt
│   │   └── agents/testing.md      — Vitest + Playwright test infrastructure
│   │
│   └── Workflow Skills (playbooks)
│       ├── new-page/SKILL.md      — Create FA+EN bilingual page
│       ├── new-product/SKILL.md   — Add coffee product to seed data
│       ├── new-component/SKILL.md — Theme-aware bilingual component
│       ├── debug-cart/SKILL.md    — Cart bug diagnosis
│       ├── debug-payment/SKILL.md — Payment flow debugging
│       └── deploy/SKILL.md        — Production deployment checklist
│
├── Layer 4: MCP Integration
│   └── ../mcp_servers.json    — MCP server configuration (project root)
│
├── memory/
│   └── memory.json            — MCP knowledge graph (cross-session persistence)
│
└── preferences/
    ├── taste.md
    └── agent-architecture/taste.md
```

---

## Quick Reference — Which File For What

| I need to... | Read this |
|--------------|-----------|
| Understand the entire project | `architecture/project-map.md` |
| Know how modules connect | `architecture/architecture.md` |
| Know how deployment works | `architecture/deployment.md` |
| **Look up a function/component location** | **`maps/symbols.json`** |
| **Find what imports a file** | **`maps/imports.json`** |
| **See what tests to run for a file** | **`maps/impact.json`** |
| **Check if a file is dangerous to edit** | **`maps/fragility.md`** |
| **Know what commands to run after editing** | **`maps/validation.md`** |
| **Map a feature to its files** | **`architecture/feature-map.md`** |
| **Find which files to touch for a task** | **`architecture/task-to-file-map.md`** |
| Build a new page | `skills/new-page/SKILL.md` |
| Add a product | `skills/new-product/SKILL.md` |
| Create a component | `skills/new-component/SKILL.md` |
| Fix a cart bug | `skills/debug-cart/SKILL.md` |
| Fix a payment bug | `skills/debug-payment/SKILL.md` |
| Deploy to production | `skills/deploy/SKILL.md` |
| Understand language system | `agents/bilingual.md` |
| Understand theming | `agents/design.md` |
| Understand payment flow | `agents/payment.md` |
| Understand data layer / seed data | `agents/data-layer.md` |
| Understand SEO/structured data | `agents/seo.md` |
| Understand Docker/deployment | `agents/devops.md` |
| Understand priorities/backlog | `agents/pm.md` |
| Understand testing | `agents/testing.md` |
| See how agents collaborate | `agents/agent-corporation.md` |
| See MCP servers | `architecture/mcp.md` |

---

## Data Flow

```
AGENTS.md (memory)
    │  "This is Azadi Coffee, a Persian Next.js ecommerce storefront..."
    │
    ├──► project-map.md (codebase)
    │       "src/app/ has 24+ pages, 26 components, 16 lib modules..."
    │
    ├──► architecture.md (patterns)
    │       "8 patterns: locale, theming, cart, payment, page-stack, server-actions..."
    │
    ├──► deployment.md (standalone)
    │       "src/app/page.tsx → .next/server/app/page.js, Docker 3-stage..."
    │
    ├──► agent-corporation.md (collaboration)
    │       "8 domain agents + 6 skills + 6 MCP servers, tier 1→4..."
    │
    ├──► Domain agents (specialist knowledge)
    │       "FA/EN is done via... theming uses CSS custom properties..."
    │
    ├──► Skills (playbooks)
    │       "To create a page: step 1 → step 2 → step 3..."
    │
    └──► MCP servers (tools)
            "filesystem: read/write, brave-search: web, bash: commands..."
```

---

## Typical Task Flow

```
User says "add a contact page"
          │
          ▼
    1. Read AGENTS.md          — "Okay, this is Azadi Coffee"
    2. Read project-map.md     — "Contact route exists at src/app/contact/"
    3. Read architecture.md    — "Need FA/EN, locale prop, theme-aware, metadata"
    4. Read bilingual.md       — "Persian at /contact, English at /en/contact"
    5. Read design.md          — "Use CSS custom properties, tone-aware colors"
    6. Read seo.md             — "Add metadata, structured data"
    7. Read testing.md         — "Tests: unit + E2E"
    8. Follow new-page/SKILL.md — "Step 1: create route, step 2: add component..."
    9. MCP filesystem           — Read/write files
    10. MCP sequential-thinking — Break down complex decisions
```
