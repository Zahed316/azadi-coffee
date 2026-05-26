import { describe, it, expect } from "vitest";
import { getProducts, getProductBySlug } from "./products";

describe("getProducts", () => {
  it("returns all products", () => {
    const products = getProducts();
    expect(products.length).toBeGreaterThanOrEqual(4);
    expect(products[0]).toHaveProperty("slug");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("priceToman");
  });
});

describe("getProductBySlug", () => {
  it("returns product for valid slug", () => {
    const product = getProductBySlug("kurdistan-filter");
    expect(product).not.toBeNull();
    expect(product!.slug).toBe("kurdistan-filter");
  });

  it("returns null for invalid slug", () => {
    expect(getProductBySlug("nonexistent")).toBeNull();
  });
});
