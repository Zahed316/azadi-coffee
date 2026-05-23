# Azadi Coffee

Persian RTL Next.js ecommerce storefront for a minimalist specialty coffee roastery.

This repository now contains both the planning docs and the first working Next.js App Router implementation. The cloned WordPress site is only a reference for visual principles, not a source for copied assets, text, logo, layout, or brand identity.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when the WooCommerce backend is ready.

## Contents

- `implementation-brief.md`: integrated product, design, Open Design, and technical plan.
- `agents.md`: main manager agent and specialist workflow definitions.
- `architecture.md`: recommended Next.js/WooCommerce/Iranian payment architecture.
- `design-system.md`: Azadi visual tokens, layout rules, RTL rules, and ecommerce component specs.
- `sitemap.md`: page map and route structure.
- `first-10-steps.md`: immediate VS Code and Open Design workflow.
- `src/app`: Persian RTL storefront routes.
- `src/components`: layout, product, cart, blog, and UI components.
- `src/lib`: formatting, SEO schema, WooCommerce client, and payment gateway notes.
- `docs/architecture-decision.md`: implementation architecture decision.

## Decision

Build the customer-facing site in Next.js App Router with TypeScript and Tailwind CSS. Keep WordPress/WooCommerce as the backend for product admin, inventory, orders, payment plugins, and blog content.
