import type { CoffeeProduct } from "@/data/products";
import { getProduct, products } from "@/data/products";
import type { Locale } from "./i18n";
import { apiFetch } from "./api-client";

type WooProduct = {
  id: number;
  slug: string;
  name: string;
  price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  weight?: string;
  short_description?: string;
  description?: string;
  categories?: Array<{ name: string; slug: string }>;
  images?: Array<{ id: number; src: string; alt?: string }>;
  attributes?: Array<{ name: string; options: string[] }>;
};

function hasWooCredentials() {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (key && secret) return true;

  const appUser = process.env.WORDPRESS_APPLICATION_USERNAME;
  const appPass = process.env.WORDPRESS_APPLICATION_PASSWORD;
  return Boolean(appUser && appPass);
}

function wooBasicAuth() {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (key && secret) {
    return Buffer.from(`${key}:${secret}`).toString("base64");
  }
  return Buffer.from(`${process.env.WORDPRESS_APPLICATION_USERNAME}:${process.env.WORDPRESS_APPLICATION_PASSWORD}`).toString("base64");
}

export async function wooFetch<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!hasWooCredentials()) {
    throw new Error("WooCommerce credentials are not configured.");
  }

  const requestPath = `wc/v3/${path.replace(/^\/+/, "")}`;
  const credentials = wooBasicAuth();

  return apiFetch<T>(requestPath, {
    params,
    headers: { Authorization: `Basic ${credentials}` },
  });
}

export async function wooPost<T>(path: string, data: Record<string, unknown>) {
  if (!hasWooCredentials()) {
    throw new Error("WooCommerce credentials are not configured.");
  }

  const requestPath = `wc/v3/${path.replace(/^\/+/, "")}`;
  const credentials = wooBasicAuth();

  return apiFetch<T>(requestPath, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
    revalidate: 0,
  });
}

function attr(product: WooProduct, name: string) {
  return product.attributes?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.options[0] || "";
}

const WOO_PRICE_DIVISOR = 10; // WooCommerce stores in IRR; app uses Toman (1 Toman = 10 IRR)

function mapWooProduct(product: WooProduct): CoffeeProduct {
  const priceToman = Math.round((Number.parseInt(product.price || "0", 10) || 0) / WOO_PRICE_DIVISOR);
  const fallbackName = product.name;

  return {
    slug: product.slug,
    name: attr(product, "name_fa") || fallbackName,
    nameEn: attr(product, "name_en") || fallbackName,
    origin: attr(product, "origin_fa") || attr(product, "origin") || product.categories?.[0]?.name || "",
    originEn: attr(product, "origin_en") || attr(product, "origin") || product.categories?.[0]?.name || "",
    roast: (attr(product, "roast_fa") || attr(product, "roast") || "متوسط") as CoffeeProduct["roast"],
    roastEn: (attr(product, "roast_en") || "Medium") as CoffeeProduct["roastEn"],
    process: attr(product, "process_fa") || attr(product, "process"),
    processEn: attr(product, "process_en") || attr(product, "process"),
    weightGram: Number.parseInt(product.weight || attr(product, "weight") || "250", 10) || 250,
    priceToman,
    tastingNotes: (attr(product, "tasting_notes_fa") || attr(product, "tasting_notes")).split(",").map((item) => item.trim()).filter(Boolean),
    tastingNotesEn: attr(product, "tasting_notes_en").split(",").map((item) => item.trim()).filter(Boolean),
    brew: attr(product, "brew_fa") || attr(product, "brew"),
    brewEn: attr(product, "brew_en") || attr(product, "brew"),
    inventory: product.stock_status === "outofstock" ? "sold-out" : product.stock_status === "onbackorder" ? "low" : "available",
    image: product.images?.[0]?.src,
    imageAlt: product.images?.[0]?.alt || product.name,
  };
}

export async function getProducts(locale: Locale = "fa") {
  if (!hasWooCredentials()) {
    return products;
  }

  try {
    const wooProducts = await wooFetch<WooProduct[]>("products", {
      per_page: 30,
      status: "publish",
      lang: locale,
    });

    return wooProducts.length ? wooProducts.map((product) => mapWooProduct(product)) : products;
  } catch {
    return products;
  }
}

export async function getProductBySlug(slug: string, locale: Locale = "fa") {
  if (!hasWooCredentials()) {
    return getProduct(slug) || null;
  }

  try {
    const wooProducts = await wooFetch<WooProduct[]>("products", {
      slug,
      per_page: 1,
      lang: locale,
    });

    return wooProducts[0] ? mapWooProduct(wooProducts[0]) : getProduct(slug) || null;
  } catch {
    return getProduct(slug) || null;
  }
}

export async function getProductCategories() {
  if (!hasWooCredentials()) {
    return [];
  }

  return wooFetch<Array<{ id: number; name: string; slug: string }>>("products/categories", { per_page: 50 });
}
