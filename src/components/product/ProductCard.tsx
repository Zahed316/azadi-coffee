import Link from "next/link";
import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";
import { inventoryLabel, latin } from "@/lib/format/persian";

export function ProductCard({ product }: { product: CoffeeProduct }) {
  return (
    <article className="group grid border border-ink bg-paper">
      <Link href={`/shop/${product.slug}`} className="aspect-square border-b border-ink bg-warm-paper p-4">
        <div className="grid h-full place-items-center border border-ink bg-paper transition group-hover:scale-[0.98]">
          <div className="h-24 w-24 rounded-full border-[18px] border-ink bg-paper" />
        </div>
      </Link>
      <div className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold">{product.name}</h2>
            <p className={latin(product.origin) ? "ltr mt-1 text-right text-sm text-stone" : "mt-1 text-sm text-stone"}>
              {product.origin}
            </p>
          </div>
          <span className="border border-ink px-2 py-1 text-xs">{inventoryLabel(product.inventory)}</span>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-xs text-stone">
          <div>
            <dt>برشت</dt>
            <dd className="mt-1 text-ink">{product.roast}</dd>
          </div>
          <div>
            <dt>فرآوری</dt>
            <dd className="mt-1 text-ink">{product.process}</dd>
          </div>
          <div>
            <dt>وزن</dt>
            <dd className="mt-1 text-ink">{product.weightGram} گرم</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-ink pt-4">
          <strong>{formatToman(product.priceToman)}</strong>
          <Link href={`/shop/${product.slug}`} className="text-sm font-bold underline underline-offset-4">
            مشاهده
          </Link>
        </div>
      </div>
    </article>
  );
}
