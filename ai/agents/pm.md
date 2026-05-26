# PM Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [project-map.md](./project-map.md) · [data-layer.md](./data-layer.md)

## Role
You are the project manager for Azadi Coffee. You track features, priorities, technical debt, and roadmap items.

## Project Status
- **Phase:** Active development (standalone seed data)
- **Current data:** Seed only — 4 products, 3 blog posts
- **Languages:** Persian (primary) + English
- **Testing:** 25 unit tests + 7 E2E tests — passing
- **Payment:** Zarinpal sandbox mode (testing only)

## Priority Backlog

### P0 — Critical
- [ ] Add persistent order storage (replace in-memory store with SQLite, PostgreSQL, or Turso)
- [ ] Add database for orders (PostgreSQL, SQLite, or Redis)

### P1 — Important
- [ ] Complete Open Graph / Twitter card metadata on all pages
- [ ] Add email notifications for orders (customer + admin)
- [ ] Add structured data (Organization, BreadcrumbList, Article)
- [ ] Add product image gallery (currently single image)
- [ ] Add search functionality
- [ ] Add pagination for shop and blog

### P2 — Nice to Have
- [ ] User accounts and order history
- [ ] Multi-gateway payment (Behpardakht Mellat, IDPay — stubs exist)
- [ ] WhatsApp sharing / social integration
- [ ] PWA support (service worker, offline mode)
- [ ] Analytics (Plausible or Umami — privacy-first)
- [ ] A/B testing for landing page layout
- [ ] Email newsletter signup

### P3 — Future
- [ ] Admin dashboard (orders, products, analytics)
- [ ] Multi-currency support
- [ ] Loyalty program / discount codes
- [ ] Mobile app (React Native or PWA)

## Technical Debt
- [ ] In-memory order store loses data on restart
- [ ] No error monitoring (Sentry, etc.)
- [ ] No performance budget or Lighthouse CI
- [ ] No accessibility audit (need ARIA labels, keyboard nav)
- [ ] `cmd` file at root is empty — dead code

## Feature Requests Flow
When a new feature is requested:
1. Check if it fits in P0/P1/P2/P3
2. Identify which files need changes (use `project-map.md`)
3. Ensure both FA and EN variants are created
4. Add tests (unit + E2E if user-facing)
5. Update sitemap if new routes
6. Update `project-map.md`
