import { PageShell } from "@/components/layout/PageShell";
import { OrderStatus } from "@/components/cart/OrderStatus";

export const metadata = { title: "Order result" };

export default async function EnglishOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageShell locale="en">
      <OrderStatus orderId={id} locale="en" />
    </PageShell>
  );
}
