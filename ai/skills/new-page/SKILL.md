# skill: new-page

## Label
New page (bilingual)

## When to Use
When asked to add a new page/route to Azadi Coffee.

## Steps

### 1. Choose the Route
Decide on the URL path. If it's a dynamic route, use `[param]` syntax. All pages need both FA and EN variants.

### 2. Create the FA Page
Create `src/app/<route>/page.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "عنوان فارسی" };

export default function PageNamePage() {
  return (
    <PageShell>
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">عنوان صفحه</h1>
        {/* page content */}
      </section>
    </PageShell>
  );
}
```

### 3. Create the EN Page
Create `src/app/en/<route>/page.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "English title" };

export default function PageNamePage() {
  return (
    <PageShell locale="en">
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">Page title</h1>
        {/* page content */}
      </section>
    </PageShell>
  );
}
```

### 4. Server Components vs Client Components
- Static pages (About, Roastery, Blog listing) → Server Components (default, no `"use client"`)
- Interactive pages (forms, cart, checkout, dashboard) → Client Components (`"use client"` required)
- Use `PageShell` wrapper on all pages — it provides Header + Footer + `<main>`

### 5. Bilingual Content Pattern
If the page has bilingual data (from seed data or future API):
```tsx
import type { Locale } from "@/lib/i18n";

export default function PageNamePage({ locale = "fa" }: { locale?: Locale }) {
  const title = locale === "en" ? "English" : "فارسی";
  // ...
}
```

### 6. Update Sitemap
Add the new route to `src/app/sitemap.ts` with appropriate `changeFrequency` and `priority`.

### 7. Add to Language Switch
Ensure `Header` or `LanguageSwitch` links work for the new route. If the page is listed in the nav, update `Header.tsx`.

### 8. Update Project Map
Add the new route to `ai/architecture/project-map.md` in the Pages/Routes section.

### 9. Add E2E Smoke Test (if public page)
Add a basic test to `tests/e2e/smoke.spec.ts`:
```ts
test("new page loads", async ({ page }) => {
  await page.goto("/new-route");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

## Files to Touch
- `src/app/<route>/page.tsx` — create
- `src/app/en/<route>/page.tsx` — create
- `src/app/sitemap.ts` — update
- `src/components/layout/Header.tsx` — update if nav links change
- `ai/architecture/project-map.md` — update
- `tests/e2e/smoke.spec.ts` — update (optional)
