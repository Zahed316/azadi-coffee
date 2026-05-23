import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { formatRial, formatToman } from "@/lib/format/currency";
import { productJsonLd } from "@/lib/seo/schema";
import { getProductBySlug, getProducts } from "@/lib/woocommerce";

export async function generateStaticParams() {
  const products = await getProducts("en");
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "en");
  return { title: product ? product.nameEn : "Product" };
}

export default async function EnglishProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "en");
  if (!product) notFound();

  return (
    <PageShell locale="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="aspect-square border border-ink bg-warm-paper p-5 md:col-span-2">
            <div className="grid h-full place-items-center border border-ink bg-paper">
              <div className="h-56 w-56 rounded-full border-[34px] border-ink" />
            </div>
          </div>
          <div className="aspect-square border border-ink bg-warm-paper" />
          <div className="aspect-square border border-ink bg-warm-paper" />
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold text-stone">Specialty coffee / {product.weightGram} g</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">{product.nameEn}</h1>
          <p className="mt-4 text-2xl font-bold">{formatToman(product.priceToman, "en")}</p>
          <p className="mt-1 text-sm text-stone">{formatRial(product.priceToman, "en")}</p>
          <dl className="mt-8 grid border-t border-ink">
            {[
              ["Origin", product.originEn],
              ["Roast level", product.roastEn],
              ["Process", product.processEn],
              ["Brew recommendation", product.brewEn],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 border-b border-ink py-3 text-sm">
                <dt className="text-stone">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <p className="mb-3 text-sm font-bold">Tasting notes</p>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotesEn.map((note) => <span key={note} className="border border-ink px-3 py-1 text-sm">{note}</span>)}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <QuantityStepper />
            <button className="min-h-11 flex-1 border border-ink bg-ink px-5 font-bold text-white hover:bg-paper hover:text-ink">
              Add to cart
            </button>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
