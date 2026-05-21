# First 10 Implementation Actions

Run these from `azadi-coffee/app`.

1. Fill `.env.local` from `.env.example` with the WordPress/WooCommerce test backend.
2. Replace seed products in `src/data/products.ts` with WooCommerce product fetches once credentials are ready.
3. Add product custom attributes in WooCommerce: origin, roast, process, altitude, tasting notes, brew method, weight.
4. Configure one sandbox payment gateway plugin in WooCommerce, starting with ZarinPal.
5. Implement WooCommerce cart/session handling instead of the static cart screen.
6. Wire checkout to create a WooCommerce order and redirect to the selected gateway.
7. Add webhook revalidation for product, inventory, and blog updates.
8. Replace geometric image placeholders with original Azadi Coffee photography.
9. Add Persian SEO metadata, JSON-LD, sitemap, and Open Graph images per route.
10. Run RTL/mobile QA at 360, 390, 430, 768, 1024, 1366, and 1920 px before launch.
