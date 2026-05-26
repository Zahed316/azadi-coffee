# DevOps Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [deployment.md](./deployment.md) · **Skills:** [deploy](../skills/deploy/SKILL.md)

## Role
You handle deployment, Docker, CI/CD, and production operations for Azadi Coffee.

## Build & Run
```bash
npm install
npm run dev      # Development server (port 3000)
npm run build    # Production build → .next/
npm run lint     # ESLint
```

## Docker
Multi-stage build on Node 24 Alpine (`Dockerfile`):
```bash
docker build -t azadi-coffee .
docker run -p 3000:3000 --env-file .env.local azadi-coffee
```

**Stages:**
1. `deps` — `npm ci --omit=dev` (production deps: next, react, react-dom, resend)
2. `builder` — full `npm ci`, source copy, `npm run build` → `.next/standalone/`
3. `runner` — non-root `nextjs` user (uid 1001), copies `deps` node_modules first (for resend), then standalone overlays, port 3000, `node server.js`

**Why deps node_modules is needed:** Next.js standalone output tracing may miss server-action externals like `resend`. Copying the deps stage's `node_modules` first, then overlaying standalone, ensures all production dependencies are available while still getting standalone's traced framework packages.

**Next.js config:**
- `output: "standalone"` — self-contained server, no node_modules needed at runtime
- Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (2 years), `Permissions-Policy`
- Trailing slash redirects (HTTPS)

## Environment Variables
From `.env.example`:
```
NEXT_PUBLIC_SITE_URL=https://azadicoffee.ir
ZARINPAL_MERCHANT_ID=...
ZARINPAL_SANDBOX=true
RESEND_API_KEY=...
CONTACT_EMAIL=...
WHOLESALE_EMAIL=...
```
For production, set `ZARINPAL_SANDBOX=false` and provide real credentials.

## Deployment Checklist
1. Copy `.env.example` to `.env.local` and fill in production values
2. Set `NEXT_PUBLIC_SITE_URL` to production domain
3. Set `ZARINPAL_SANDBOX=false`
4. Build: `npm run build`
5. Docker build and push to registry
6. Deploy with `--env-file` or via orchestration env vars
7. Verify health: `GET /` returns 200
8. Verify HTTPS redirects and security headers
9. Test Zarinpal payment in production mode

## Monitoring
- Check `/api/checkout` and `/api/payment/callback` logs
- Monitor PostgreSQL availability, Prisma migration status, and payment callback errors
- Set up error alerting for Resend API failures
- Monitor Next.js telemetry (`NEXT_TELEMETRY_DISABLED=1` is set in Docker)

## Known Gaps
- Missing or stale Prisma migrations block checkout, payments, and admin workflows
- No health check endpoint
- No structured logging
- No CI/CD pipeline configured
