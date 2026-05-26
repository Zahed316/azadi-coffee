# skill: debug-cart

## Label
Debug cart issues

## When to Use
When the cart is broken — items not adding, quantities wrong, total miscalculated, persistence lost, or hydration mismatches.

## Diagnostic Steps

### 1. Check Cart State in the Browser
Open DevTools → Application → Local Storage → `azadi_cart_v1`
```json
{"items": [
  {"slug": "kurdistan-filter", "name": "آزادی کردستان فیلتر", "nameEn": "Azadi Kurdistan Filter",
   "priceToman": 420000, "weightGram": 250, "quantity": 2}
]}
```

### 2. Verify the Reducer Logic
File: `src/lib/cart/cart-reducer.ts`

Common bugs:
- **Wrong field in dispatch:** `dispatch({ type: "ADD_ITEM", item: {...} })` — must include all `CartItem` fields: `slug`, `name`, `nameEn`, `priceToman`, `weightGram`, `quantity`
- **Quantity ≤ 0:** `UPDATE_QUANTITY` with `quantity <= 0` removes the item. If you want to keep items with zero quantity, change the condition.
- **ADD_ITEM with existing slug:** Increments quantity instead of duplicating. If you want duplicates as separate line items, remove the `existing` check.

### 3. Verify Storage Persistence
File: `src/lib/cart/cart-storage.ts`

- Cart should persist across page reloads (localStorage)
- Cart should sync across browser tabs (`useSyncExternalStore` with `window.addEventListener("storage", ...)`)
- If cart resets on reload, check:
  - Is `localStorage` available? (SSR doesn't have it — hydration-safe pattern uses empty initial cart)
  - Is the storage key correct? (`azadi_cart_v1`)
  - Is `CartContextProvider` wrapping the app? (in `src/app/layout.tsx`)

### 4. Check the Context Provider
File: `src/lib/cart/cart-context.tsx`

- `CartProvider` must wrap the app (it does, in root layout)
- `useCart()` must be called inside `CartProvider`
- If `useCart()` throws "must be used within CartProvider", the component is rendered outside the provider tree

### 5. Hydration Mismatch Pattern
```tsx
// If you see "hydration mismatch" errors in console:
// The server renders with empty cart (items: []), client hydrates with stored cart
// This is expected — the suppressHydrationWarning on <html> and <body> handles it
```

If you get actual mismatches:
- Don't read from localStorage during SSR
- Use `useSyncExternalStore` correctly (it returns the server snapshot during SSR)
- Initial render should use `EMPTY_CART` until client hydration

### 6. Total Calculation
File: `src/lib/cart/cart-reducer.ts`, function `getCartTotal()`

```
total = sum of (priceToman × quantity) for all items
```

If total is wrong:
- Check if `priceToman` is correct in each cart item
- Check if `quantity` is a number (not string)
- Verify the reducer returns the right items array

### 7. Cart Count
File: `src/lib/cart/cart-reducer.ts`, function `getCartCount()`

```
count = sum of all item quantities
```

If the header badge shows wrong count, check `CartButton` → it uses `useCart().count`.

### 8. Known Edge Cases
- **Removing the last item** → Should show empty cart UI, not crash
- **Adding sold-out product** → Cart doesn't block this (validation missing)
- **Negative quantities** → UPDATE_QUANTITY with negative removes the item
- **Very large cart** → No pagination/virtualization, could be slow with 100+ items

## Files Involved
- `src/lib/cart/cart-reducer.ts` — state logic
- `src/lib/cart/cart-storage.ts` — persistence
- `src/lib/cart/cart-context.tsx` — React context
- `src/lib/cart/types.ts` — type definitions
- `src/components/cart/CartProvider.tsx` — provider wrapper
- `src/components/cart/CartContent.tsx` — cart display
- `src/components/cart/CartButton.tsx` — header badge
- `src/components/product/ProductBuyPanel.tsx` — add-to-cart UI
