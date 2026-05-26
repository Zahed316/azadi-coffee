# skill: new-product

## Label
Add coffee product

## When to Use
When asked to add a new coffee product to the seed data.

## Steps

### 1. Add the Product Object
Open `src/data/products.ts`. Add a new `CoffeeProduct` object to the `products` array:

```ts
{
  slug: "product-slug",
  name: "نام فارسی محصول",
  nameEn: "English product name",
  origin: "ایران / استان",
  originEn: "Country / Region",
  roast: "روشن",              // or "متوسط" or "متوسط رو به تیره"
  roastEn: "Light",            // or "Medium" or "Medium-dark"
  process: "شسته",             // or "طبیعی" or "Sugarcane Decaf"
  processEn: "Washed",         // or "Natural" or "Sugarcane decaf"
  weightGram: 250,
  priceToman: 420000,
  tastingNotes: ["نت اول", "نت دوم", "نت سوم"],
  tastingNotesEn: ["Note one", "Note two", "Note three"],
  brew: "روش های دم آوری",
  brewEn: "Brewing methods",
  inventory: "available",      // or "low" or "sold-out"
  image: "",                   // optional — URL or empty string
  imageAlt: "",                // optional
}
```

### 2. Rules for Slug
- Lowercase, hyphens only, no spaces
- Descriptive: `kurdistan-filter`, `espresso-house-blend`, `ethiopia-natural`
- Must be unique

### 3. Rules for Price
- In **Toman** (IRR/10), not Rial
- Zarinpal expects Rial, so the conversion happens in `src/lib/zarinpal.ts` (`amount * 10`)

### 4. Rules for Inventory
- `"available"` → Green indicator, full ordering
- `"low"` → Amber indicator, ordering still allowed
- `"sold-out"` → Red indicator, "Out of stock" shown, JSON-LD marks `OutOfStock`

### 5. Rules for Roast Levels
Must use exact values:
- FA: `"روشن"`, `"متوسط"`, `"متوسط رو به تیره"`
- EN: `"Light"`, `"Medium"`, `"Medium-dark"`

### 6. Update the `totalProducts` Count
If the `src/data/products.ts` exports a count (or any page uses `products.length`), verify it's correct. Currently `getProducts()` returns all products — no count export needed.

### 7. Category Filter Compatibility
The shop page (`src/app/shop/page.tsx`) filters by `category=espresso` or `category=filter`. The filter logic checks `p.brew.includes("اسپرسو")` or `p.brewEn.includes("Espresso")`. Make sure the `brew` and `brewEn` fields include the right keywords:
- Espresso products: `brew` should include `"اسپرسو"`, `brewEn` should include `"Espresso"`
- Filter products: `brew` should include `"فیلتر"`, `brewEn` should include `"filter"`

### 8. Add Tests
Add to `src/data/products.test.ts`:
```ts
it("returns the new product by slug", () => {
  const product = getProductBySlug("product-slug");
  expect(product).toBeDefined();
  expect(product?.name).toBe("نام فارسی محصول");
});

it("getAllProducts includes the new product", () => {
  const all = getProducts();
  expect(all.some(p => p.slug === "product-slug")).toBe(true);
});
```

### 9. Update Project Map
Add the new product to `ai/architecture/project-map.md` in the Data Model section.

## Files to Touch
- `src/data/products.ts` — add product object
- `src/data/products.test.ts` — add test
- `ai/architecture/project-map.md` — update product count
