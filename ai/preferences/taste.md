# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Design Philosophy
- Prefer minimal files and minimal ceremony — avoid state machines, scoring matrices, and subagent delegation unless explicitly requested. Confidence: 0.80
- Target Linux Ubuntu as the deployment platform for MVPs and game projects. Confidence: 0.60

# Project Architecture
- This is a standalone Next.js project — no WordPress, WooCommerce, external CMS, or database. All data lives in src/data/ as typed TypeScript arrays. Confidence: 0.95
- Every page needs FA (Persian) and EN variants at src/app/<route>/page.tsx and src/app/en/<route>/page.tsx. Confidence: 0.85

# Code Style
- Always check `AI_WORKFLOW.md` and `ai/` docs before exploring or changing anything — the
knowledge system is the single source of truth. Confidence: 0.95
- Use const, not let — variables in this codebase are never reassigned. Confidence: 0.70
- Use CSS custom properties from :root (e.g., var(--ink), var(--paper)) instead of hardcoding colors. Confidence: 0.70


# TypeScript
- Use strict mode — tsconfig has `"strict": true`. Confidence: 0.95

# Data Layer
- Data functions accept `_locale` params for forward-compatibility — implement the
function signature unchanged when swapping backends. Confidence: 0.85

# Deployment
- Use `output: "standalone"` in next.config.ts — the Dockerfile must copy `deps
node_modules` before the standalone overlay to catch untraced externals like `resend` .Confidence: 0.90
- Target Linux Alpine via Docker multi-stage build. Confidence: 0.80

# agent-architecture
See [agent-architecture/taste.md](agent-architecture/taste.md)

# Code Navigation
- Check `ai/maps/` before exploring or editing — symbols.json for function lookup, imports.json for dependencies, impact.json for test coverage and blast radius, fragility.md for pre-edit risk assessment, validation.md for correct command sequences. The maps layer is the first stop for any code investigation. Confidence: 0.90
- After structural changes (new files, moved exports, renamed functions), regenerate maps with `npm run maps:generate`. Confidence: 0.85

# Workflow
- Before any implementation (coding, mapping, refactoring, deployment), produce a structured plan with: Goal + SMART criteria, In/Out Scope, Constraints, Acceptance Criteria (functional/technical/UI/security/perf/compat/testing/docs), Assumptions, Success Metrics, and Failure Conditions. Do not touch code until the plan is clear. Confidence: 0.85

# Risk Management
- Check fragility.md before touching HIGH-risk files (proxy.ts, layout.tsx, page.tsx, next.config.ts) — these require reading domain docs and manual spot-testing. MEDIUM-risk files require running associated tests. Confidence: 0.80
- Follow validation.md phase sequences instead of running full test suites for every change. Match the validation scope to the change type (design-only → lint only, cart logic → unit tests + build, config → full Docker build). Confidence: 0.85
