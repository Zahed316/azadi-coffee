import { NextResponse } from "next/server";
import { createWooOrder } from "@/lib/woocommerce/orders";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "درخواست نامعتبر است." },
        { status: 400 },
      );
    }

    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : "zarinpal";
    const paymentMethodTitle = typeof body.paymentMethodTitle === "string" ? body.paymentMethodTitle : "زرین پال";

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "حداقل یک محصول برای ثبت سفارش الزامی است." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "شماره تماس الزامی است." },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: "آدرس ارسال الزامی است." },
        { status: 400 },
      );
    }

    const items = body.items.map((item: Record<string, unknown>) => ({
      slug: String(item.slug || ""),
      name: String(item.name || ""),
      nameEn: String(item.nameEn || ""),
      priceToman: Number(item.priceToman) || 0,
      weightGram: Number(item.weightGram) || 250,
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const order = await createWooOrder({
      phone,
      address,
      paymentMethod,
      paymentMethodTitle,
      items,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      redirectUrl: `${siteUrl}/order/${order.id}?status=pending`,
      callbackUrl: `${siteUrl}/api/payment/callback?order_id=${order.id}`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت سفارش. لطفا دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
