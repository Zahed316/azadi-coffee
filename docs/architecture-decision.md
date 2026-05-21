# Azadi Coffee Architecture Decision

## Decision

Use Next.js App Router as the Persian RTL storefront and keep WooCommerce as the ecommerce backend for v1.

## Why

- Iranian payment gateways and WooCommerce plugins are mature compared with custom Next.js integrations.
- WooCommerce already owns admin, products, variations, inventory, orders, coupons, shipping, refunds, and merchant workflows.
- Next.js can own the storefront quality: RTL layout, Persian SEO, fast rendering, clean component architecture, and a strict black-and-white visual system.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS v4.
- Styling: local Vazirmatn, CSS logical layout, monochrome tokens with rare coffee accent.
- Commerce backend: WooCommerce REST API and Store API.
- Blog/CMS: WordPress posts through REST or WPGraphQL.
- Payments: WooCommerce gateway plugins first: ZarinPal, Behpardakht Mellat, IDPay after maintenance/security review.
- Deployment: Docker or Node process for Next.js plus WordPress/WooCommerce behind Nginx. Prefer hosting with good latency for Iranian users and stable access to payment callbacks.

## What Not To Do In V1

- Do not build a custom ecommerce backend before proving checkout and operations.
- Do not move payments into a fully custom Next.js flow unless WooCommerce plugins cannot satisfy the gateway contract.
- Do not copy the reference theme assets, brand, product taxonomy, or exact interaction patterns.

## Integration Notes

- WooCommerce remains source of truth for prices, inventory, orders, payment status, and coupons.
- Next.js can cache product/category content but must revalidate when WooCommerce webhooks fire.
- Checkout should create or update a WooCommerce order before redirecting to the selected gateway.
- Payment callbacks should verify with the gateway, update/read WooCommerce order state, then land on `/order/[id]`.
