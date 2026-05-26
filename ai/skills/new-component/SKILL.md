# skill: new-component

## Label
New theme-aware component

## When to Use
When asked to create a new React component that must work with the live theming system and both languages.

## Steps

### 1. Choose Component Location
Place it in the right directory:
- `src/components/layout/` — Header, Footer, PageShell, navigation
- `src/components/cart/` — Cart-related UI
- `src/components/product/` — Product display
- `src/components/sections/` — Homepage sections
- `src/components/blog/` — Blog display
- `src/components/forms/` — Forms
- `src/components/settings/` — Design dashboard
- `src/components/ui/` — Generic reusable components

### 2. Accept `locale` Prop (if bilingual)
```tsx
import type { Locale } from "@/lib/i18n";

interface MyComponentProps {
  locale?: Locale;
  // other props
}

export function MyComponent({ locale = "fa" }: MyComponentProps) {
  // ...
}
```

### 3. Use CSS Custom Properties, Not Hardcoded Colors
```tsx
// ✅ Good — uses theme variables
<div className="border-ink bg-paper text-ink rounded-[var(--az-radius)]">
  <h2 className="text-coffee">{title}</h2>
</div>

// ❌ Bad — hardcoded
<div className="border-black bg-white text-black rounded-none">
```

Tailwind classes mapped to CSS variables (from `globals.css`):
- `text-ink` → `var(--az-ink)`
- `bg-paper` → `var(--az-paper)`
- `bg-warm-paper` → `var(--az-warm-paper)`
- `border-ink` → `var(--az-ink)`
- `text-stone` → `var(--az-stone)`
- `text-coffee` → `var(--az-coffee)`
- `text-graphite` → `var(--az-graphite)`

For shape values, use inline styles or CSS variables:
```tsx
style={{ "--az-radius": "var(--az-card-radius)" } as React.CSSProperties}
```

### 4. Style Variant Support (if applicable)
If the component type has style variants (like product cards: `bordered`, `soft`, `commercial`), use Tailwind's `data-*` attribute selectors:
```tsx
<div className="product-card group border bg-paper data-[product-card-style=soft]:rounded-2xl data-[product-card-style=soft]:shadow-lg">
```
The styles are set via `data-product-card-style` on `<html>` from the root layout.

### 5. Bilingual Text Pattern
```tsx
const label = locale === "en" ? "English label" : "متن فارسی";
const data = locale === "en" ? product.nameEn : product.name;

// Conditional dir for mixed content
<p className={latin(text) ? "ltr" : ""}>{text}</p>
```

### 6. Client vs Server Component
- Add `"use client"` only if the component uses hooks (`useState`, `useEffect`, `useContext`, event handlers)
- Server Components: prefer for static content, avoid `"use client"` unless needed
- All cart components, form components, and design dashboard are client components

### 7. Accessibility
- Add `aria-label` for icon-only buttons, in both languages
- Use semantic HTML: `<article>`, `<section>`, `<nav>`, `<h1>`-`<h6>`
- Ensure keyboard navigation works (buttons, links)

### 8. Add Unit Test (if interactive)
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders with FA locale", () => {
    render(<MyComponent locale="fa" />);
    expect(screen.getByText("متن فارسی")).toBeInTheDocument();
  });

  it("renders with EN locale", () => {
    render(<MyComponent locale="en" />);
    expect(screen.getByText("English text")).toBeInTheDocument();
  });
});
```

## Files to Touch
- `src/components/<category>/<Name>.tsx` — create
- `src/components/<category>/<Name>.test.tsx` — create (if interactive)
- Update any parent that imports the new component
