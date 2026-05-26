import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders/store";
import { verifyPayment } from "@/lib/zarinpal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, siteUrl));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!orderId) {
    return redirectTo("/");
  }

  try {
    const order = getOrder(orderId);

    if (!order) {
      return redirectTo(`/order/${orderId}?status=error`);
    }

    if (status !== "OK" && status !== "1") {
      updateOrderStatus(orderId, "failed");
      return redirectTo(`/order/${orderId}?status=failed`);
    }

    if (!authority) {
      updateOrderStatus(orderId, "failed");
      return redirectTo(`/order/${orderId}?status=failed`);
    }

    const result = await verifyPayment({ authority, amount: order.totalToman });

    if (result.success) {
      updateOrderStatus(orderId, "completed", String(result.refId));
      return redirectTo(`/order/${orderId}?status=success`);
    }

    updateOrderStatus(orderId, "failed");
    return redirectTo(`/order/${orderId}?status=failed`);
  } catch (error) {
    console.error("Payment callback error:", error);
    return redirectTo(`/order/${orderId}?status=error`);
  }
}
