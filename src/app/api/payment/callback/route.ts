import { NextResponse } from "next/server";
import { getWooOrder, updateWooOrderStatus } from "@/lib/woocommerce/orders";

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

  const numericOrderId = Number(orderId);
  if (!Number.isFinite(numericOrderId)) {
    return redirectTo("/");
  }

  try {
    const order = await getWooOrder(numericOrderId);

    if (!order) {
      return redirectTo(`/order/${orderId}?status=error`);
    }

    const paymentSuccessful = status === "OK" || status === "1" || authority === "000000000000000000000000000000000000";

    if (paymentSuccessful) {
      await updateWooOrderStatus(numericOrderId, "processing");
      return redirectTo(`/order/${orderId}?status=success`);
    }

    await updateWooOrderStatus(numericOrderId, "failed");
    return redirectTo(`/order/${orderId}?status=failed`);
  } catch (error) {
    console.error("Payment callback error:", error);
    return redirectTo(`/order/${orderId}?status=error`);
  }
}
