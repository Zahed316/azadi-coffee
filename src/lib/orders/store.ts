import type { CartItem } from "@/lib/cart/types";

export type LocalOrder = {
  id: string;
  orderNumber: number;
  status: "pending" | "processing" | "completed" | "failed";
  phone: string;
  address: string;
  items: Array<{ slug: string; name: string; quantity: number; priceToman: number }>;
  totalToman: number;
  paymentMethod: string;
  zarinpalAuthority?: string;
  zarinpalRefId?: string;
  createdAt: string;
};

export type CreateOrderInput = {
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
};

declare global {
  // eslint-disable-next-line no-var
  var __orders: Map<string, LocalOrder>;
  // eslint-disable-next-line no-var
  var __orderCounter: number;
}

function getOrderStore(): Map<string, LocalOrder> {
  if (!globalThis.__orders) {
    globalThis.__orders = new Map();
  }
  return globalThis.__orders;
}

function getNextOrderNumber(): number {
  if (!globalThis.__orderCounter) {
    globalThis.__orderCounter = 1000;
  }
  return ++globalThis.__orderCounter;
}

function generateId(): string {
  return `azadi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createOrder(input: CreateOrderInput): LocalOrder {
  const store = getOrderStore();
  const totalToman = input.items.reduce((sum, item) => sum + item.priceToman * item.quantity, 0);

  const order: LocalOrder = {
    id: generateId(),
    orderNumber: getNextOrderNumber(),
    status: "pending",
    phone: input.phone,
    address: input.address,
    items: input.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      quantity: item.quantity,
      priceToman: item.priceToman,
    })),
    totalToman,
    paymentMethod: input.paymentMethod,
    createdAt: new Date().toISOString(),
  };

  store.set(order.id, order);
  return order;
}

export function getOrder(id: string): LocalOrder | undefined {
  return getOrderStore().get(id);
}

export function updateOrderStatus(
  id: string,
  status: LocalOrder["status"],
  zarinpalRefId?: string,
): LocalOrder | undefined {
  const order = getOrderStore().get(id);
  if (!order) return undefined;

  order.status = status;
  if (zarinpalRefId) order.zarinpalRefId = zarinpalRefId;

  getOrderStore().set(id, order);
  return order;
}

export function setOrderAuthority(id: string, authority: string): LocalOrder | undefined {
  const order = getOrderStore().get(id);
  if (!order) return undefined;

  order.zarinpalAuthority = authority;
  getOrderStore().set(id, order);
  return order;
}
