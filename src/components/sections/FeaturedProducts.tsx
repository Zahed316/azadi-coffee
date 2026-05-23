import Link from "next/link";
import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";
import { localePath, type Locale } from "@/lib/i18n";

export function FeaturedProducts({ products, locale = "fa" }: { products: CoffeeProduct[]; locale?: Locale }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.slice(0, 4).map((product) => (
        <Link key={product.slug} href={localePath(locale, `/shop/${product.slug}`)} className="grid border border-ink bg-paper transition hover:bg-ink hover:text-white">
          <div className="grid aspect-[4/3] place-items-center border-b border-ink bg-warm-paper p-4">
            <div className="h-20 w-20 rounded-full border-[16px] border-ink bg-paper group-hover:border-paper" />
          </div>
          <div className="grid gap-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold">{locale === "en" ? product.nameEn : product.name}</h3>
              <span className="text-sm">{formatToman(product.priceToman, locale)}</span>
            </div>
            <p className="text-sm opacity-70">
              {locale === "en"
                ? `${product.originEn} / ${product.roastEn} / ${product.weightGram} g`
                : `${product.origin} / ${product.roast} / ${product.weightGram} گرم`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
