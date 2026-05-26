# Data Layer Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [architecture.md](./architecture.md) · [bilingual.md](./bilingual.md) · [pm.md](./pm.md)

## Role
You manage the standalone content layer. Product and blog content lives in `src/data/` as typed TypeScript arrays with no external CMS or API. Production commerce records — orders, payments, customers, admin sessions, leads, and audits — use Prisma/PostgreSQL.

## Data Files

| File | Type | Records | Consumers |
|------|------|---------|-----------|
| `src/data/products.ts` | `CoffeeProduct[]` | 4 products | `ProductCard`, `FeaturedProducts`, `ProductBuyPanel`, shop pages, homepage panels |
| `src/data/posts.ts` | `BlogPost[]` | 3 posts | `BlogCard`, blog pages, homepage panels |

## Product Schema

```ts
type CoffeeProduct = {
  slug: string;                    // URL-safe identifier (e.g., "kurdistan-filter")
  name: string;                    // FA product name
  nameEn: string;                  // EN product name
  origin: string;                  // FA origin description
  originEn: string;                // EN origin description
  roast: "روشن" | "متوسط" | "متوسط رو به تیره";
  roastEn: "Light" | "Medium" | "Medium-dark";
  process: string;
  processEn: string;
  weightGram: number;              // Package weight in grams
  priceToman: number;              // Price in Toman (IRR/10)
  tastingNotes: string[];          // FA tasting notes (3 items)
  tastingNotesEn: string[];        // EN tasting notes (3 items)
  brew: string;                    // FA recommended brewing methods
  brewEn: string;                  // EN recommended brewing methods
  inventory: "available" | "low" | "sold-out";
  image?: string;
  imageAlt?: string;
};
```

### Product Data Functions

```ts
getProducts(_locale?: string) → CoffeeProduct[]
getProduct(slug: string) → CoffeeProduct | undefined
getProductBySlug(slug: string, _locale?: string) → CoffeeProduct | null
```

The `_locale` parameter is accepted but unused — it exists so a future swap to an external backend (API, database, headless CMS) requires zero component changes. Just reimplement the function signatures.

## Blog Schema

```ts
type BlogPost = {
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  date: string;                    // FA formatted date (e.g., "۱۴۰۵/۰۳/۰۱")
  dateEn: string;                  // EN formatted date (e.g., "May 22, 2026")
  excerpt: string;
  excerptEn: string;
  body: string[];                  // FA paragraphs (one per array item)
  bodyEn: string[];                // EN paragraphs (same length as body[])
};
```

### Blog Data Functions

```ts
getPosts(_locale?: string) → BlogPost[]
getPost(slug: string) → BlogPost | undefined
getPostBySlug(slug: string, _locale?: string) → BlogPost | null
```

Same `_locale` pattern as products — accepted but unused, forward-compatible.

## Bilingual Pattern

Every text field has two variants: `field` (FA) and `fieldEn` (EN). Components select based on locale:

```tsx
const name = locale === "fa" ? product.name : product.nameEn;
```

Arrays like `tastingNotes` and `body` must have parallel entries in both languages — the EN array is the same length and same semantic order as FA.

## Adding a Product

1. Add a new object to the `products` array in `src/data/products.ts`
2. Fill all fields — FA and EN variants for every bilingual field
3. Choose a unique `slug`
4. The product automatically appears in shop listing, homepage featured, search, and the product detail page at `/shop/[slug]`
5. No other files need changes

## Adding a Blog Post

1. Add a new object to the `posts` array in `src/data/posts.ts`
2. Fill all fields — FA and EN variants for every bilingual field
3. Ensure `body[]` and `bodyEn[]` have the same number of paragraphs
4. The post automatically appears in blog listing and `/blog/[slug]`
5. No other files need changes

## Image Handling

- Product images use `image` and `imageAlt` fields (optional)
- Store images in `public/images/products/` and reference them as `/images/products/<slug>.jpg`
- For external images, use full URLs — the Next.js image config supports `NEXT_PUBLIC_SITE_URL` remote patterns
- Missing images should have a graceful fallback in the consuming component

## Future Catalog Backend Swap

The data functions form a stable contract. To swap to an external backend:

1. A database — pick a function signature and implement it with ORM calls:
   ```ts
   // Currently:
   export function getProducts() { return products; }
   // Future:
   export function getProducts(locale?: string) {
     const rows = await db.query("SELECT * FROM products");
     return rows;
   }
   ```

2. Headless CMS (Strapi, Sanity, Payload) — implement fetch with ISR revalidation:
   ```ts
   export function getProducts(locale?: string) {
     const res = await fetch("https://cms.example.com/api/products", {
       next: { revalidate: 3600 }
     });
     return res.json();
   }
   ```

3. SQLite via better-sqlite3 or Turso — same pattern, same signatures.

**No component or page needs to change.** They call `getProducts(locale)` and get back `CoffeeProduct[]` regardless of where the data lives.

## Inventory Rules

| Status | Display | Behavior |
|--------|---------|----------|
| `available` | Normal buy button | Can add to cart |
| `low` | Warning badge + text | Can add to cart with notice |
| `sold-out` | Greyed out button | Cannot add — shows "out of stock" |

Components check `product.inventory` to decide rendering.

## Testing

Data functions are pure and stateless — easy to test:
- `src/data/products.test.ts` — 3 tests (getAllProducts, getProductBySlug valid/invalid)
- `src/data/posts.test.ts` — 3 tests (same pattern)
- Add a test when adding products or posts to verify slug uniqueness and required fields
