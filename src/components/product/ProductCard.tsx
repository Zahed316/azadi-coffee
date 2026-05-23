import Image from "next/image";
import Link from "next/link";
import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";
import { localePath, type Locale } from "@/lib/i18n";
import { inventoryLabel, latin } from "@/lib/format/persian";

export function ProductCard({ product, locale = "fa" }: { product: CoffeeProduct; locale?: Locale }) {
  const origin = locale === "en" ? product.originEn : product.origin;

  return (
    <article className="product-card group grid border bg-paper">
      <Link href={localePath(locale, `/shop/${product.slug}`)} className="relative aspect-square border-b border-ink bg-warm-paper overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.imageAlt || product.name} fill className="object-cover transition group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="grid h-full place-items-center p-4">
            <div className="h-24 w-24 rounded-full border-[18px] border-ink bg-paper transition group-hover:scale-[0.98]" />
          </div>
        )}
      </Link>
      <div className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold">{locale === "en" ? product.nameEn : product.name}</h2>
            <p className={latin(origin) ? "ltr mt-1 text-sm text-stone" : "mt-1 text-sm text-stone"}>
              {origin}
            </p>
          </div>
          <span className="border border-ink px-2 py-1 text-xs">{inventoryLabel(product.inventory, locale)}</span>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-xs text-stone">
          <div>
            <dt>{locale === "en" ? "Roast" : "برشت"}</dt>
            <dd className="mt-1 text-ink">{locale === "en" ? product.roastEn : product.roast}</dd>
          </div>
          <div>
            <dt>{locale === "en" ? "Process" : "فرآوری"}</dt>
            <dd className="mt-1 text-ink">{locale === "en" ? product.processEn : product.process}</dd>
          </div>
          <div>
            <dt>{locale === "en" ? "Weight" : "وزن"}</dt>
            <dd className="mt-1 text-ink">{locale === "en" ? `${product.weightGram} g` : `${product.weightGram} گرم`}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-ink pt-4">
          <strong>{formatToman(product.priceToman, locale)}</strong>
          <Link href={localePath(locale, `/shop/${product.slug}`)} className="text-sm font-bold underline underline-offset-4">
            {locale === "en" ? "View" : "مشاهده"}
          </Link>
        </div>
      </div>
    </article>
  );
}
