import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/woocommerce";

export const metadata = { title: "Shop" };

export default async function EnglishShopPage() {
  const products = await getProducts("en");

  return (
    <PageShell locale="en">
      <section className="border-b border-ink">
        <div className="container-shell grid gap-6 py-12 md:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-bold text-stone">Shop / Fresh coffee</p>
            <h1 className="mt-3 text-5xl font-bold">Azadi Coffee shop</h1>
          </div>
          <div className="grid gap-3 border border-ink p-4 text-sm">
            <button className="border border-ink bg-ink px-4 py-3 text-white">All coffees</button>
            <button className="border border-ink px-4 py-3">Espresso</button>
            <button className="border border-ink px-4 py-3">Filter</button>
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.slug} product={product} locale="en" />)}
      </section>
    </PageShell>
  );
}
