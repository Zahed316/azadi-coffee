import { describe, it, expect, beforeEach } from "vitest";
import { createOrder, getOrder, updateOrderStatus } from "./store";

beforeEach(() => {
  // Reset store between tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).__orders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).__orderCounter;
});

const items = [
  { slug: "espresso", name: "Espresso", nameEn: "Espresso", priceToman: 100, weightGram: 250, quantity: 2 },
];

describe("createOrder", () => {
  it("creates an order with generated id", () => {
    const order = createOrder({ phone: "0912", address: "Tehran", paymentMethod: "zarinpal", items });
    expect(order.id).toMatch(/^azadi-/);
    expect(order.status).toBe("pending");
    expect(order.totalToman).toBe(200);
    expect(order.phone).toBe("0912");
    expect(order.address).toBe("Tehran");
  });

  it("assigns sequential order numbers", () => {
    const a = createOrder({ phone: "1", address: "a", paymentMethod: "z", items });
    const b = createOrder({ phone: "2", address: "b", paymentMethod: "z", items });
    expect(b.orderNumber).toBeGreaterThan(a.orderNumber);
  });
});

describe("getOrder", () => {
  it("returns undefined for unknown id", () => {
    expect(getOrder("nonexistent")).toBeUndefined();
  });

  it("returns the order by id", () => {
    const order = createOrder({ phone: "0912", address: "Tehran", paymentMethod: "zarinpal", items });
    const found = getOrder(order.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(order.id);
  });
});

describe("updateOrderStatus", () => {
  it("updates order status", () => {
    const order = createOrder({ phone: "0912", address: "Tehran", paymentMethod: "zarinpal", items });
    updateOrderStatus(order.id, "completed", "ref123");
    const updated = getOrder(order.id);
    expect(updated!.status).toBe("completed");
    expect(updated!.zarinpalRefId).toBe("ref123");
  });
});
