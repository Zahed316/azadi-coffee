import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";

export function productJsonLd(product: CoffeeProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.origin}، برشته کاری ${product.roast}، مناسب ${product.brew}`,
    brand: {
      "@type": "Brand",
      name: "Azadi Coffee",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: product.priceToman * 10,
      availability:
        product.inventory === "sold-out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `https://azadicoffee.ir/shop/${product.slug}`,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "وزن", value: `${product.weightGram} گرم` },
      { "@type": "PropertyValue", name: "قیمت نمایشی", value: formatToman(product.priceToman) },
    ],
  };
}
