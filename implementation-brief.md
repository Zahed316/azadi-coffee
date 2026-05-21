# Azadi Coffee Next.js Ecommerce Implementation Brief

## Goal

Design and implement a minimalist black-and-white Persian RTL ecommerce website for Azadi Coffee, inspired by the cloned WordPress site's visual discipline but rebuilt as an original coffee roastery brand.

Do not copy the cloned site's logo, assets, icons, text, project names, photography, accordion concept, or exact page treatments. Extract only broad design principles: monochrome restraint, strong grid, square borders, editorial typography, sparse navigation, image-led product pages, and precise product specifications.

## Recommendation

Use a hybrid headless WooCommerce architecture:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- Commerce/backend: WordPress + WooCommerce.
- Storefront APIs: WooCommerce Store API for cart/customer-facing flows where possible.
- Server APIs: WooCommerce REST API for privileged operations.
- Blog/CMS: WordPress REST API or WPGraphQL.
- Payment: WooCommerce Iranian gateway plugins first.
- Direct payment fallback: ZarinPal Node SDK if a fully custom checkout is later required.
- Currency: canonical integer IRR, display Toman in UI if desired.
- Deployment: Dockerized Next.js Node server behind Nginx, close to Iranian users.

## Clone Diagnosis

Preserve as design principles:

- Mostly black and white visual system.
- Editorial grid with strong dividing lines.
- Square edges, minimal decoration, no soft card-heavy SaaS look.
- Large confident type paired with small utility labels.
- Image-led product detail pages.
- Tight ecommerce actions: product, quantity, add to cart, specs.

Change for Azadi:

- Use Persian-first typography and RTL layout.
- Replace industrial/product-studio language with coffee language: roast, origin, processing, altitude, tasting notes, brew method, weight.
- Use a calmer hospitality ecommerce navigation model.
- Use original product photography or generated placeholder assets for coffee, not cloned assets.

Do not copy:

- Tashdid identity, text, uploaded images, SVG icons, exact accordion labels, side rail treatment, product categories, or project structure.

## Final Stack

| Area | Choice |
|---|---|
| Frontend | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI direction | Persian RTL |
| Commerce | WooCommerce headless |
| CMS | WordPress blog |
| Payment | WooCommerce Iranian gateway plugins |
| Optional custom gateway | ZarinPal Node SDK |
| Auth | Optional SMS/OTP |
| Deployment | Docker + Nginx |

## Build Phases

1. Audit and design extraction.
2. Azadi Coffee design system.
3. Next.js frontend setup.
4. WooCommerce/payment backend decision.
5. Product and blog pages.
6. Cart and checkout.
7. SEO, performance, and deployment.
