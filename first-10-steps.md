# First 10 Steps

1. Open `/home/newuser/Documents/tashdidco` in VS Code.
2. Review `azadi-coffee/implementation-brief.md`.
3. Open Open Design and create or select an Azadi Coffee project.
4. Ask Open Design to use this folder as the handoff brief and the cloned WordPress folder only as a visual reference.
5. Run the Reference Site Auditor workflow to extract visual principles, not assets.
6. Run the Azadi Brand Designer workflow to create an original Persian coffee direction.
7. Run the Design System Agent workflow to produce tokens and component specs.
8. Run the Ecommerce UX Agent workflow for Home, Shop, PDP, Cart, Checkout, Blog, About, Contact, and Wholesale.
9. Run Persian/RTL, Payment/Backend, and Blog/SEO critique passes before implementation.
10. Scaffold the Next.js app after the design system is approved, then implement tokens before page components.

## First Implementation Command

When ready to scaffold the app, run from `/home/newuser/Documents/tashdidco`:

```bash
npx create-next-app@latest azadi-store --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Keep `azadi-coffee` as the planning/design handoff folder and use `azadi-store` as the actual Next.js application folder.
