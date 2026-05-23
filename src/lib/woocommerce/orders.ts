import { wooFetch, wooPost } from "@/lib/woocommerce";
import type { CartItem } from "@/lib/cart/types";

export type WooOrderStatus =
  | "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed"
  | "checkout-draft";

export type WooOrder = {
  id: number;
  number: string;
  status: WooOrderStatus;
  total: string;
  currency: string;
  payment_method: string;
  payment_method_title: string;
  date_created: string;
  date_paid?: string;
  billing: {
    first_name: string;
    last_name: string;
    phone: string;
    address_1: string;
  };
  shipping: {
    address_1: string;
  };
  line_items: Array<{
    name: string;
    product_id: number;
    quantity: number;
    total: string;
  }>;
};

export type CreateOrderInput = {
  phone: string;
  address: string;
  paymentMethod: string;
  paymentMethodTitle: string;
  items: CartItem[];
  customerNote?: string;
};

export async function createWooOrder(input: CreateOrderInput): Promise<WooOrder> {
  return wooPost<WooOrder>("orders", {
    payment_method: input.paymentMethod,
    payment_method_title: input.paymentMethodTitle,
    set_paid: false,
    billing: {
      first_name: "",
      last_name: "",
      phone: input.phone,
      address_1: input.address,
      country: "IR",
    },
    shipping: {
      address_1: input.address,
      country: "IR",
    },
    line_items: input.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      total: String(item.priceToman * item.quantity),
    })),
    customer_note: input.customerNote || "",
    status: "pending",
    currency: "IRR",
  });
}

export async function getWooOrder(orderId: number): Promise<WooOrder | null> {
  try {
    return await wooFetch<WooOrder>(`orders/${orderId}`);
  } catch {
    return null;
  }
}

export async function updateWooOrderStatus(orderId: number, status: WooOrderStatus): Promise<WooOrder> {
  return wooPost<WooOrder>(`orders/${orderId}`, { status });
}
