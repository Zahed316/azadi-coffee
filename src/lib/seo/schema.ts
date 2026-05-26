import type { CoffeeProduct } from "@/data/products";
import { formatToman } from "@/lib/format/currency";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function productJsonLd(product: CoffeeProduct, locale: "fa" | "en" = "fa") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: locale === "en" ? product.nameEn : product.name,
    description: locale === "en"
      ? `${product.originEn}, ${product.roastEn} roast, suitable for ${product.brewEn}`
      : `${product.origin}، برشته کاری ${product.roast}، مناسب ${product.brew}`,
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
      url: `${siteUrl}${locale === "en" ? "/en" : ""}/shop/${product.slug}`,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "وزن", value: `${product.weightGram} گرم` },
      { "@type": "PropertyValue", name: "قیمت نمایشی", value: formatToman(product.priceToman) },
    ],
  };
}
