import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Order result" };

export default async function EnglishOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageShell locale="en">
      <section className="container-shell py-12">
        <div className="max-w-2xl border border-ink p-6">
          <p className="text-sm font-bold text-stone">Order / Payment result</p>
          <h1 className="mt-3 text-4xl font-bold">Your order has been placed</h1>
          <p className="mt-5 leading-8 text-stone">
            Order number <span className="font-mono text-ink">{id}</span> is used to show payment and shipping status. In the connected version, this page reads the gateway callback result from WooCommerce.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
