"use server";

import { redirect } from "next/navigation";
import { getOrder, setOrderAuthority } from "@/lib/orders/store";
import { requestPayment } from "@/lib/zarinpal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function initiatePayment(_prevState: unknown, formData: FormData) {
  const orderId = formData.get("orderId") as string;

  if (!orderId) {
    return { error: "Order ID is required." };
  }

  const order = getOrder(orderId);
  if (!order) {
    return { error: "Order not found." };
  }

  if (order.status !== "pending") {
    return { error: "Order is not in pending state." };
  }

  const amount = order.totalToman;
  const description = `Order #${order.orderNumber}`;
  const callbackUrl = `${siteUrl}/api/payment/callback?order_id=${orderId}`;

  const result = await requestPayment({ amount, description, callbackUrl });

  if (result.success) {
    setOrderAuthority(orderId, result.authority);
    redirect(result.gatewayUrl);
  }

  return { error: result.message };
}
