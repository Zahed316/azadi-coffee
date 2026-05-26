import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/data/products";

export const metadata = { title: "فروشگاه" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allProducts = getProducts("fa");

  const filtered = category
    ? category === "espresso"
      ? allProducts.filter((p) => p.brew.includes("اسپرسو") || p.roast === "متوسط" || p.roast === "متوسط رو به تیره")
      : allProducts.filter((p) => p.brew.includes("فیلتر") || p.roast === "روشن")
    : allProducts;

  return (
    <PageShell>
      <section className="border-b border-ink">
        <div className="container-shell grid gap-6 py-12 md:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-bold text-stone">Shop / قهوه تازه</p>
            <h1 className="mt-3 text-5xl font-bold">فروشگاه قهوه آزادی</h1>
          </div>
          <div className="grid gap-3 border border-ink p-4 text-sm">
            <Link href="/shop" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-paper ${!category ? "bg-ink text-paper" : ""}`}>همه قهوه ها</Link>
            <Link href="/shop?category=espresso" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-paper ${category === "espresso" ? "bg-ink text-paper" : ""}`}>اسپرسو</Link>
            <Link href="/shop?category=filter" className={`border border-ink px-4 py-3 text-center transition hover:bg-ink hover:text-paper ${category === "filter" ? "bg-ink text-paper" : ""}`}>فیلتر</Link>
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
      </section>
    </PageShell>
  );
}
