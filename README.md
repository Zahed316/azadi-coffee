# Azadi Coffee

Persian RTL Next.js ecommerce storefront for a minimalist specialty coffee roastery.

This repository now contains both the planning docs and the first working Next.js App Router implementation. The cloned WordPress site is only a reference for visual principles, not a source for copied assets, text, logo, layout, or brand identity.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in WordPress/WooCommerce credentials when the backend is ready.

## Features

- Persian (RTL) storefront with mirrored English routes under `/en`
- WordPress/WooCommerce headless data layer with seed fallbacks
- Theme presets and live design tokens (colors, typography, component styles)
- Design dashboard at `/dashboard/design` (preview + localStorage; WordPress sync when API credentials are set)
- WordPress plugin + theme in `wp-content/` for REST theme settings

## Contents

- `implementation-brief.md`: integrated product, design, Open Design, and technical plan.
- `agents.md`: main manager agent and specialist workflow definitions.
- `architecture.md`: recommended Next.js/WooCommerce/Iranian payment architecture.
- `design-system.md`: Azadi visual tokens, layout rules, RTL rules, and ecommerce component specs.
- `sitemap.md`: page map and route structure.
- `first-10-steps.md`: immediate VS Code and Open Design workflow.
- `src/app`: storefront routes (fa + `/en`)
- `src/components`: layout, product, cart, blog, settings UI
- `src/lib`: WordPress/WooCommerce clients, theme settings, i18n, formatting
- `wp-content/`: `azadi-headless` theme and settings plugin for WordPress admin
- `docs/architecture-decision.md`: implementation architecture decision.

## Fonts

Place `Vazirmatn-Regular.woff2` and `Vazirmatn-Bold.woff2` in `public/fonts/` (referenced by `globals.css`).

## Decision

Build the customer-facing site in Next.js App Router with TypeScript and Tailwind CSS. Keep WordPress/WooCommerce as the backend for product admin, inventory, orders, payment plugins, and blog content.
