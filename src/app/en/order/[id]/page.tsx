import { PageShell } from "@/components/layout/PageShell";
import { OrderStatus } from "@/components/cart/OrderStatus";
import { getOrder } from "@/lib/orders/store";

export const metadata = { title: "Order result" };
export const dynamic = "force-dynamic";

export default async function EnglishOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id).catch(() => null);

  return (
    <PageShell locale="en">
      <OrderStatus orderId={id} locale="en" order={order} />
    </PageShell>
  );
}
