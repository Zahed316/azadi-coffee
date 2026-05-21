# Technical Architecture

## Final Recommendation

Use Next.js as the frontend and WooCommerce as the backend/admin/payment engine.

This is the best fit for an Iranian ecommerce site because WooCommerce already has mature admin workflows, product inventory, order management, coupons, shipping, and Iranian payment plugin support. A custom full-stack build is possible later, but it would duplicate too much risky commerce logic early.

## Option Comparison

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Next.js + Headless WooCommerce | Existing admin, inventory, order management, Iranian gateway plugins, WordPress blog | Headless checkout needs careful session and payment handling | Recommended |
| Full-stack Next.js custom ecommerce | Maximum control, clean TypeScript stack | Must build admin, payments, refunds, inventory, order state, security | Avoid for v1 |
| Next.js + Medusa/Saleor | Modern commerce APIs, strong developer experience | Iranian gateways and localized admin require custom work | Consider later |
| Next.js Commerce/Shopify | Strong storefront reference | Poor fit for Iranian payments and market constraints | Not recommended |

## Payment Strategy

Start with WooCommerce Iranian payment plugins and keep WooCommerce as the payment/order engine.

Preferred flow for v1:

1. Customer shops on Next.js.
2. Cart and checkout UI are rendered in Next.js.
3. Order/payment intent is created against WooCommerce.
4. Customer is redirected through WooCommerce payment gateway flow or a small custom Woo bridge endpoint.
5. WooCommerce receives gateway callback and owns order status.
6. Next.js displays confirmation from WooCommerce order state.

Direct Node payment is only recommended when the checkout UX must be fully custom. If that happens, start with ZarinPal because an official Node SDK exists. Keep Mellat behind WooCommerce or a dedicated backend adapter because direct integration is more cumbersome and commonly SOAP-based.

## Currency

- Store canonical values as integer IRR.
- Display Toman in the UI if that is the shop convention.
- Persist currency explicitly.
- Add tests for Rial/Toman conversion.

## Deployment

- Next.js Node server in Docker.
- Nginx reverse proxy.
- WordPress/WooCommerce near the same region or private network.
- Redis/object cache for WordPress if traffic grows.
- Stable Node routes for gateway callbacks.
- Rate limit OTP, checkout, and payment endpoints.
