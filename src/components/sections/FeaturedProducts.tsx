import Link from "next/link";
import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";

export function FeaturedProducts({ products }: { products: CoffeeProduct[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.slice(0, 4).map((product) => (
        <Link key={product.slug} href={`/shop/${product.slug}`} className="grid border border-ink bg-paper transition hover:bg-ink hover:text-paper">
          <div className="grid aspect-[4/3] place-items-center border-b border-ink bg-warm-paper p-4">
            <div className="h-20 w-20 rounded-full border-[16px] border-ink bg-paper group-hover:border-paper" />
          </div>
          <div className="grid gap-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold">{product.name}</h3>
              <span className="text-sm">{formatToman(product.priceToman)}</span>
            </div>
            <p className="text-sm opacity-70">
              {product.origin} / {product.roast} / {product.weightGram} گرم
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
