import { describe, expect, it } from "vitest";
import { priceCartItems } from "./store";

describe("priceCartItems", () => {
  it("prices checkout items from the server-side product catalog", () => {
    const items = priceCartItems([
      {
        slug: "kurdistan-filter",
        name: "Client supplied",
        nameEn: "Client supplied",
        priceToman: 1,
        weightGram: 250,
        quantity: 2,
      },
    ]);

    expect(items[0].name).toBe("آزادی کردستان فیلتر");
    expect(items[0].priceToman).toBe(420000);
    expect(items[0].lineTotalToman).toBe(840000);
  });

  it("rejects unknown products", () => {
    expect(() => priceCartItems([
      {
        slug: "unknown",
        name: "Unknown",
        nameEn: "Unknown",
        priceToman: 100,
        weightGram: 250,
        quantity: 1,
      },
    ])).toThrow(/Product not found/);
  });

  it("caps item quantity for checkout safety", () => {
    const items = priceCartItems([
      {
        slug: "espresso-house-blend",
        name: "Espresso",
        nameEn: "Espresso",
        priceToman: 780000,
        weightGram: 500,
        quantity: 99,
      },
    ]);

    expect(items[0].quantity).toBe(20);
  });
});
