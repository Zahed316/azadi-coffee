import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { products } from "@/data/products";
import { formatToman } from "@/lib/format/currency";

export const metadata = { title: "Cart" };

export default function EnglishCartPage() {
  const item = products[1];

  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-5xl font-bold">Cart</h1>
          <article className="mt-8 grid gap-5 border border-ink p-5 md:grid-cols-[120px_1fr_auto]">
            <div className="aspect-square border border-ink bg-warm-paper" />
            <div>
              <h2 className="text-xl font-bold">{item.nameEn}</h2>
              <p className="mt-2 text-stone">{item.originEn} / {item.weightGram} g</p>
              <p className="mt-4 font-bold">{formatToman(item.priceToman, "en")}</p>
            </div>
            <QuantityStepper initial={2} />
          </article>
        </div>
        <aside className="border border-ink p-5 lg:self-start">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-5 grid gap-3 border-t border-ink pt-5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatToman(item.priceToman * 2, "en")}</strong></div>
            <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
          </div>
          <div className="mt-6">
            <ButtonLink href="/en/checkout">Continue to checkout</ButtonLink>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
