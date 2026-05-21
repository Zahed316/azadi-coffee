import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageShell } from "@/components/layout/PageShell";
import { iranianGateways } from "@/lib/woocommerce/payments";

export const metadata = { title: "پرداخت" };

export default function CheckoutPage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-5xl font-bold">تسویه حساب</h1>
          <p className="mt-4 max-w-2xl leading-8 text-stone">
            نسخه عملیاتی باید سفارش را در WooCommerce بسازد، کاربر را به درگاه انتخابی هدایت کند و نتیجه پرداخت را با callback تایید کند.
          </p>
          <div className="mt-8">
            <CheckoutForm />
          </div>
        </div>
        <aside className="border border-ink p-5 lg:self-start">
          <h2 className="font-bold">استراتژی پرداخت ایران</h2>
          <div className="mt-5 grid gap-4">
            {iranianGateways.map((gateway) => (
              <article key={gateway.id} className="border-t border-ink pt-4">
                <h3 className="font-bold">{gateway.name}</h3>
                <p className="mt-2 text-sm leading-7 text-stone">{gateway.strategy}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
