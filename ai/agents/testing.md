# Testing Agent — Azadi Coffee

> **Agent corporation:** [agent-corporation.md](./agent-corporation.md) · **Related:** [devops.md](./devops.md) · [pm.md](./pm.md)

## Role
You handle testing strategy, test infrastructure, and quality assurance for Azadi Coffee.

## Test Infrastructure

### Unit/Integration Tests (Vitest)
- **Config:** `vitest.config.ts` — jsdom, React plugin, `@/*` alias, globals
- **Setup:** `vitest.setup.ts` — `@testing-library/jest-dom/vitest`
- **Run:** `npx vitest`

### E2E Tests (Playwright)
- **Config:** `playwright.config.ts` — Chrome, parallel, 2 retries, trace on first retry
- **Run:** `npx playwright test`
- **Web server:** Auto-starts `npm run dev` on port 3000

## Existing Tests (25 unit + 7 E2E)

### Unit Tests
| File | Tests | Coverage |
|---|---|---|
| `src/data/products.test.ts` | 3 tests | getAllProducts, getProductBySlug (valid), getProductBySlug (invalid) |
| `src/data/posts.test.ts` | 3 tests | getAllPosts, getPostBySlug (valid), getPostBySlug (invalid) |
| `src/lib/cart/cart-reducer.test.ts` | 8 tests | add item, increment quantity, add different item, remove item, update quantity, clear cart, item count, total price |
| `src/lib/format/currency.test.ts` | 3 tests | FA format, EN format, default locale |
| `src/lib/orders/store.test.ts` | 6 tests | create order, sequential numbers, get unknown, get known, update status |

### E2E Tests
`tests/e2e/smoke.spec.ts` — 7 tests:
- FA homepage loads with title
- EN homepage loads with title
- Homepage has stack tabs
- Shop page shows products
- Product detail page loads
- Category filter works
- 404 page renders

## When to Add Tests

### Must Test
- New lib functions (utilities, formatters, validation)
- Cart operations
- Order operations
- Data transformations
- API routes (checkout, payment callback)

### Should Test
- Server Actions (contact, wholesale, payment)
- Middleware behavior (locale detection, redirects)
- Component rendering (critical components: CartContent, CheckoutForm, Header)
- Product data (when adding new products)

### Optional
- Visual regression (could add Percy or Chromatic)
- Accessibility (axe-core integration)
- Performance (Lighthouse CI)

## Test Patterns
```tsx
// Unit test pattern
import { describe, it, expect } from "vitest";
import { myFunction } from "@/lib/my-module";

describe("myFunction", () => {
  it("returns expected result", () => {
    expect(myFunction("input")).toBe("expected");
  });
});

// Component test pattern
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/MyComponent";

it("renders the component", () => {
  render(<MyComponent locale="fa" />);
  expect(screen.getByText("...")).toBeInTheDocument();
});
```

## Running Tests
```bash
npx vitest                    # Run all unit tests
npx vitest --watch            # Watch mode
npx vitest --coverage         # With coverage
npx playwright test           # Run all E2E tests
npx playwright test --ui      # Interactive UI mode
npx playwright test --debug   # Debug mode
```

## Known Gaps
- No component tests (all components untested)
- No API route tests
- No middleware tests
- No payment flow integration tests
- Coverage reports not configured
- CI test running not set up
