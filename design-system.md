# Design System

## Direction

Minimal, black-and-white, Persian-first, calm, editorial, premium, and ecommerce-focused. The design should feel like a specialty roastery, not a portfolio clone.

## Color Tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#000000` | Text, borders, primary buttons |
| `paper` | `#ffffff` | Main background |
| `warm-paper` | `#f7f5f1` | Secondary sections |
| `graphite` | `#1f1f1f` | High emphasis text |
| `stone` | `#8a8178` | Muted metadata |
| `coffee` | `#6f4e37` | Rare accent, roast notes, focus highlights |

Use accent color sparingly. The page should still read as black and white.

## Typography

- Persian UI/body: Vazirmatn, IRANSans, or Dana.
- English/Latin fallback: Inter or system sans.
- Hero/page titles: bold, controlled, not decorative.
- Body text: readable Persian line-height, no cramped paragraph blocks.
- Do not scale font size directly with viewport width.

## Layout

- Desktop: 12-column grid.
- Tablet: 8-column grid.
- Mobile: 4-column grid.
- Borders: 1-2px black.
- Radius: 0-4px maximum.
- Cards only for repeated product/blog items, not page sections.
- No shadows except subtle focus indication if needed.

## Components

### Header

- RTL nav.
- Brand mark/name prominent.
- Shop, Blog, About, Contact, Wholesale.
- Search icon, account/phone login, cart icon.
- Mobile: compact header with cart count and menu.

### Product Card

Fields:

- Product image
- Coffee name
- Origin
- Roast level
- Process
- Weight
- Price
- Quick add

### Product Detail

Sections:

- Image gallery
- Title and price
- Roast/origin/process/spec table
- Tasting notes
- Brew recommendation
- Quantity selector
- Add to cart
- Related coffees

### Cart

- Line items
- Quantity stepper
- Coupon field
- Shipping estimate
- Total in Toman/Rial display
- Checkout CTA

### Checkout

- Phone-first customer info
- Iranian address fields
- Delivery method
- Payment method
- Gateway redirect state
- Order review

### Blog

- Editorial list layout.
- Category filters: brewing, origin, roasting, news.
- Persian SEO metadata.
- Product links inside educational posts where useful.

## RTL Rules

- Set `html lang="fa" dir="rtl"`.
- Use CSS logical properties: `margin-inline`, `padding-inline`, `border-inline`.
- Mirror directional icons.
- Keep Latin coffee origin names readable with `dir="ltr"` spans where needed.
- Format currency consistently.

## Mobile Rules

- Sticky checkout/cart action where useful.
- Filters open in a sheet.
- Avoid oversized hero-only first screens.
- Keep product purchase controls visible without forcing long scroll.
