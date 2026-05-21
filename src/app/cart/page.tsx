import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { products } from "@/data/products";
import { formatToman } from "@/lib/format/currency";

export const metadata = { title: "سبد خرید" };

export default function CartPage() {
  const item = products[1];

  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-5xl font-bold">سبد خرید</h1>
          <article className="mt-8 grid gap-5 border border-ink p-5 md:grid-cols-[120px_1fr_auto]">
            <div className="aspect-square border border-ink bg-warm-paper" />
            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="mt-2 text-stone">{item.origin} / {item.weightGram} گرم</p>
              <p className="mt-4 font-bold">{formatToman(item.priceToman)}</p>
            </div>
            <QuantityStepper initial={2} />
          </article>
        </div>
        <aside className="border border-ink p-5 lg:self-start">
          <h2 className="text-xl font-bold">خلاصه سفارش</h2>
          <div className="mt-5 grid gap-3 border-t border-ink pt-5 text-sm">
            <div className="flex justify-between"><span>جمع جزء</span><strong>{formatToman(item.priceToman * 2)}</strong></div>
            <div className="flex justify-between"><span>ارسال</span><span>محاسبه در پرداخت</span></div>
          </div>
          <div className="mt-6">
            <ButtonLink href="/checkout">ادامه پرداخت</ButtonLink>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
