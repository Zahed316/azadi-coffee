import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/data/products";

export const metadata = { title: "Shop" };

export default async function EnglishShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allProducts = getProducts("en");

  const filtered = category
    ? category === "espresso"
      ? allProducts.filter((p) => p.brewEn.includes("Espresso") || p.roastEn === "Medium" || p.roastEn === "Medium-dark")
      : allProducts.filter((p) => p.brewEn.includes("filter") || p.roastEn === "Light")
    : allProducts;

  return (
    <PageShell locale="en">
      <section className="border-b border-ink">
        <div className="container-shell grid gap-6 py-12 md:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-bold text-stone">Shop / Fresh coffee</p>
            <h1 className="mt-3 text-5xl font-bold">Azadi Coffee shop</h1>
          </div>
          <div className="grid gap-3 border border-ink p-4 text-sm">
            <Link href="/en/shop" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-white ${!category ? "bg-ink text-white" : ""}`}>All coffees</Link>
            <Link href="/en/shop?category=espresso" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-white ${category === "espresso" ? "bg-ink text-white" : ""}`}>Espresso</Link>
            <Link href="/en/shop?category=filter" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-white ${category === "filter" ? "bg-ink text-white" : ""}`}>Filter</Link>
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product.slug} product={product} locale="en" />)}
      </section>
    </PageShell>
  );
}
