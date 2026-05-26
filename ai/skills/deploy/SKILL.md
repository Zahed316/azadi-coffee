# skill: deploy

## Label
Deploy to production

## When to Use
When deploying Azadi Coffee to production.

## Prerequisites

- [ ] `.env.local` configured with production values
- [ ] All tests passing: `npx vitest` and `npx playwright test`
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Git working tree clean (or intentional)

## Step 1: Production Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://azadicoffee.ir
ZARINPAL_MERCHANT_ID=production-merchant-id
ZARINPAL_SANDBOX=false          # ← Must be "false" for production
RESEND_API_KEY=re_xxx
CONTACT_EMAIL=hello@azadicoffee.ir
WHOLESALE_EMAIL=wholesale@azadicoffee.ir
```

## Step 2: Verify Build
```bash
npm run build
# Should output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
```

Warnings to watch for:
- "`<img>` must have `alt` prop" — missing alt text
- Unused variables/exports
- Large page dependencies (check bundle size)

## Step 3: Docker Build
```bash
docker build -t azadi-coffee:latest .
```

Verify layers:
```bash
docker history azadi-coffee:latest
```

Test the image locally:
```bash
docker run --rm -p 3000:3000 --env-file .env.local azadi-coffee:latest
# In another terminal:
curl -I http://localhost:3000
# Should return 200 with security headers
```

## Step 4: Security Headers Verification
```bash
curl -I https://azadicoffee.ir | grep -iE "x-frame|x-content|referrer|hsts|permissions"
```
Expected:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

## Step 5: Smoke Test
Test these URLs in production:
- `/` — Persian homepage, page stack tabs visible
- `/en` — English homepage
- `/shop` — Products listed
- `/shop/kurdistan-filter` — Product detail with JSON-LD
- `/blog` — Blog posts listed
- `/cart` — Empty cart message
- `/en/cart` — English empty cart
- `/robots.txt` — Returns correctly
- `/sitemap.xml` — All routes listed
- `/dashboard/design` — Design dashboard loads (noindex)
- `/api/checkout` (POST) — Returns error or creates order

## Step 6: Zarinpal Production Test
1. Add item to cart → checkout → fill form
2. Click "Proceed to payment"
3. Should redirect to `https://www.zarinpal.com/pg/StartPay/xxx`
4. Complete test payment with real card
5. Verify order shows as "completed" after callback

## Step 7: Post-Deploy
- [ ] Monitor server logs for errors
- [ ] Check Resend email delivery works (contact form, wholesale form)
- [ ] Verify SSL certificate is valid
- [ ] Check Lighthouse score (Performance, Accessibility, SEO)
- [ ] Verify Persian font (Vazirmatn) loads correctly
- [ ] Test on mobile (responsive layout, page stack vertical mode)
- [ ] Test language switch (FA ↔ EN)
- [ ] Test RTL layout on Persian pages

## Rollback Plan
If deployment fails:
```bash
# Redeploy previous Docker image
docker pull azadi-coffee:previous-tag
docker stop azadi-coffee
docker run -d -p 3000:3000 --env-file .env.local azadi-coffee:previous-tag
```

Or if using orchestration:
```bash
# Revert to previous commit
git checkout <previous-commit>
npm run build
# Redeploy
```

## Known Production Risks
- **In-memory order store:** Server restart loses all pending orders
- **No database:** No persistent storage for any data
- **No backup:** Seed data in source code is the only data
- **No monitoring:** No error tracking (Sentry), no uptime monitoring
- **No rate limiting:** Checkout API can be spammed
- **No CSRF protection:** Checkout endpoint doesn't validate origin
