import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders/store";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

const checkoutSchema = z.object({
  phone: z.string().trim().min(6).max(32),
  address: z.string().trim().min(8).max(1000),
  paymentMethod: z.literal("zarinpal").default("zarinpal"),
  items: z.array(z.object({
    slug: z.string().min(1).max(120),
    name: z.string().optional().default(""),
    nameEn: z.string().optional().default(""),
    priceToman: z.number().optional().default(0),
    weightGram: z.number().optional().default(250),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(25),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`checkout:${ip}`, 8, 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "درخواست های شما زیاد است. لطفا کمی بعد دوباره تلاش کنید." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات سفارش معتبر نیست." },
        { status: 400 },
      );
    }

    const order = await createOrder(parsed.data);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalToman: order.totalToman,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: "خطا در ثبت سفارش. لطفا دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
