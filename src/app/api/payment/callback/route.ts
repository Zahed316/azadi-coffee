import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders/store";
import { verifyPayment } from "@/lib/zarinpal";
import { sendOrderPaidNotifications } from "@/lib/notifications/email";

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
    const order = await getOrder(orderId);

    if (!order) {
      return redirectTo(`/order/${orderId}?status=error`);
    }

    if (order.status === "completed") {
      return redirectTo(`/order/${orderId}?status=success`);
    }

    if (status !== "OK" && status !== "1") {
      await updateOrderStatus(orderId, "failed");
      return redirectTo(`/order/${orderId}?status=failed`);
    }

    if (!authority) {
      await updateOrderStatus(orderId, "failed");
      return redirectTo(`/order/${orderId}?status=failed`);
    }

    if (order.zarinpalAuthority && order.zarinpalAuthority !== authority) {
      await updateOrderStatus(orderId, "failed");
      return redirectTo(`/order/${orderId}?status=failed`);
    }

    const result = await verifyPayment({ authority, amount: order.totalToman });

    if (result.success) {
      const paidOrder = await updateOrderStatus(orderId, "completed", String(result.refId));
      if (paidOrder) {
        await sendOrderPaidNotifications(paidOrder).catch((notifyError) => {
          console.error("Order notification error:", notifyError);
        });
      }
      return redirectTo(`/order/${orderId}?status=success`);
    }

    await updateOrderStatus(orderId, "failed");
    return redirectTo(`/order/${orderId}?status=failed`);
  } catch (error) {
    console.error("Payment callback error:", error);
    return redirectTo(`/order/${orderId}?status=error`);
  }
}
