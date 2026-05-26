import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProductBuyPanel } from "@/components/product/ProductBuyPanel";
import { formatRial, formatToman } from "@/lib/format/currency";
import { productJsonLd } from "@/lib/seo/schema";
import { getProductBySlug, getProducts } from "@/data/products";

export async function generateStaticParams() {
  const products = await getProducts("fa");
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "fa");
  return { title: product ? product.name : "محصول" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "fa");
  if (!product) notFound();

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-square border border-ink bg-warm-paper md:col-span-2 overflow-hidden">
            {product.image ? (
              <Image src={product.image} alt={product.imageAlt || product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="grid h-full place-items-center p-5">
                <div className="h-56 w-56 rounded-full border-[34px] border-ink" />
              </div>
            )}
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold text-stone">قهوه تخصصی / {product.weightGram} گرم</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold">{formatToman(product.priceToman)}</p>
          <p className="mt-1 text-sm text-stone">{formatRial(product.priceToman)}</p>
          <dl className="mt-8 grid border-t border-ink">
            {[
              ["خاستگاه", product.origin],
              ["درجه برشته کاری", product.roast],
              ["فرآوری", product.process],
              ["پیشنهاد دم آوری", product.brew],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 border-b border-ink py-3 text-sm">
                <dt className="text-stone">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <p className="mb-3 text-sm font-bold">یادداشت طعمی</p>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotes.map((note) => <span key={note} className="border border-ink px-3 py-1 text-sm">{note}</span>)}
            </div>
          </div>
          <ProductBuyPanel product={product} />
        </aside>
      </section>
    </PageShell>
  );
}
