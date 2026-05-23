import { PageShell } from "@/components/layout/PageShell";
import { OrderStatus } from "@/components/cart/OrderStatus";

export const metadata = { title: "نتیجه سفارش" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageShell>
      <OrderStatus orderId={id} locale="fa" />
    </PageShell>
  );
}
