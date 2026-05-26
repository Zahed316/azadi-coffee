# Design Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [architecture.md](./architecture.md) · [bilingual.md](./bilingual.md)

## Role
You handle the live design theming system, CSS custom properties, design dashboard, and visual consistency across Azadi Coffee.

## Theming Architecture
- **Provider:** `src/components/settings/DesignSettingsProvider.tsx` — `useSyncExternalStore` with localStorage subscription
- **Storage:** `src/lib/settings/design-storage.ts` — read/persist/subscribe/apply
- **Presets:** `src/lib/settings/design-presets.ts` — 5 presets with full settings
- **Dashboard:** `src/components/settings/DesignDashboard.tsx` — full UI at `/dashboard/design`
- **CSS:** `src/app/globals.css` — Tailwind v4 + CSS custom properties on `:root`

## 5 Built-in Presets
1. **Minimal light** (default) — Sharp black-and-white, strict editorial spacing
2. **Premium dark** — Dark canvas, graphite cards, soft contrast, pill buttons
3. **Coffee warm** — Cream surfaces, brown ink, tactile cards, softer controls
4. **Modern editorial** — Magazine-like, pale surfaces, serif fonts, generous space
5. **High-contrast commercial** — Retail-forward, compact spacing, strong CTAs

## DesignSettings Type Structure
```ts
{
  presetId: string
  colors: { ink, paper, warmPaper, graphite, stone, coffee, line,
            success, danger, tabBackground, tabText, tabHoverBackground,
            tabHoverText, buttonPrimaryBackground, buttonPrimaryText,
            buttonSecondaryBackground, buttonSecondaryText }
  typography: { fontFamily, persianFont?, englishFont?,
                customFontName, customFontDataUrl, customFontFormat }
  shape: { radius, cardRadius, buttonRadius, tabRadius,
           shadowIntensity, spacingScale }
  styles: { header, footer, landing, productCard, blogCard, button }
}
```

## Font System
- Default: Vazirmatn (Persian, woff2 in `public/fonts/`) + Inter (English)
- Custom fonts: Upload via Dashboard → base64 data URL stored in localStorage
- Font family string is applied to `:root { --az-font-family }`
- CSS `@font-face` is dynamically injected for custom fonts

## Adding a New Theme-Aware Component
1. Use CSS custom properties, not hardcoded colors:
   ```css
   color: var(--az-ink);
   background: var(--az-paper);
   border-radius: var(--az-radius);
   ```
2. The DesignSettingsProvider makes all variables available
3. Test with all 5 presets to ensure readability
4. If adding a new variable, update:
   - `DesignSettings` type
   - All 5 presets with appropriate values
   - DesignDashboard UI (color picker or slider)
   - `globals.css` `:root` block

## Component Style Variants
Components can switch appearance via `styles`:
- **header:** `minimal` | `bordered` | `floating`
- **footer:** `dark` | `light` | `bordered`
- **landing:** `stacked` | `gallery` | `editorial`
- **productCard:** `bordered` | `soft` | `commercial`
- **blogCard:** `line` | `card` | `editorial`
- **button:** `square` | `soft` | `pill`

## Dashboard
- Route: `/dashboard/design` (noindex, client-only)
- Features: preset selector, 16 color pickers, font upload, 6 shape sliders, 6 style radio groups
- Changes apply immediately via `useSyncExternalStore`
- Storage key: `azadi.design.settings.v1`
