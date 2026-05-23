import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "پرداخت" };

export default function CheckoutPage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-5xl font-bold">تسویه حساب</h1>
          <div className="mt-8">
            <CheckoutForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
