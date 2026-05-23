import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Checkout" };

export default function EnglishCheckoutPage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-5xl font-bold">Checkout</h1>
          <div className="mt-8">
            <CheckoutForm locale="en" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
