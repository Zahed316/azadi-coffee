import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders/store";

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

    const order = createOrder({
      phone,
      address,
      paymentMethod,
      items,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalToman: order.totalToman,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت سفارش. لطفا دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
