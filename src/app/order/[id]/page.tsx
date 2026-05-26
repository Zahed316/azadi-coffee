import { PageShell } from "@/components/layout/PageShell";
import { OrderStatus } from "@/components/cart/OrderStatus";
import { getOrder } from "@/lib/orders/store";

export const metadata = { title: "نتیجه سفارش" };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id).catch(() => null);

  return (
    <PageShell>
      <OrderStatus orderId={id} locale="fa" order={order} />
    </PageShell>
  );
}
