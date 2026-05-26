import { describe, it, expect } from "vitest";
import { cartReducer, getCartCount, getCartTotal } from "./cart-reducer";

const espresso = { slug: "espresso", name: "اسپرسو", nameEn: "Espresso", priceToman: 100, weightGram: 250, quantity: 1 };
const filter = { slug: "filter", name: "فیلتر", nameEn: "Filter", priceToman: 200, weightGram: 250, quantity: 2 };

describe("cartReducer", () => {
  it("adds a new item", () => {
    const result = cartReducer({ items: [] }, { type: "ADD_ITEM", item: espresso });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe("espresso");
  });

  it("increments quantity when adding existing item", () => {
    const state = { items: [{ ...espresso, quantity: 1 }] };
    const result = cartReducer(state, { type: "ADD_ITEM", item: espresso });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(2);
  });

  it("removes an item", () => {
    const state = { items: [espresso, filter] };
    const result = cartReducer(state, { type: "REMOVE_ITEM", slug: "espresso" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe("filter");
  });

  it("updates quantity", () => {
    const state = { items: [{ ...espresso, quantity: 1 }] };
    const result = cartReducer(state, { type: "UPDATE_QUANTITY", slug: "espresso", quantity: 5 });
    expect(result.items[0].quantity).toBe(5);
  });

  it("removes item when quantity is 0", () => {
    const state = { items: [espresso] };
    const result = cartReducer(state, { type: "UPDATE_QUANTITY", slug: "espresso", quantity: 0 });
    expect(result.items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const state = { items: [espresso, filter] };
    const result = cartReducer(state, { type: "CLEAR" });
    expect(result.items).toHaveLength(0);
  });
});

describe("getCartCount", () => {
  it("returns total quantity", () => {
    expect(getCartCount([espresso, filter])).toBe(3);
  });

  it("returns 0 for empty cart", () => {
    expect(getCartCount([])).toBe(0);
  });
});

describe("getCartTotal", () => {
  it("returns total price", () => {
    expect(getCartTotal([espresso, filter])).toBe(500); // 100*1 + 200*2
  });

  it("returns 0 for empty cart", () => {
    expect(getCartTotal([])).toBe(0);
  });
});
