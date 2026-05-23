import { createHmac, randomBytes } from "crypto";
import type { CoffeeProduct } from "@/data/products";
import { getProduct, products } from "@/data/products";
import type { Locale } from "./i18n";
import { apiFetch, buildApiUrl, getWordPressApiUrl } from "./api-client";

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
  return Boolean(process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET);
}

function encodeOAuthValue(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function signWooParams(path: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY!;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET!;
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_version: "1.0",
  };
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));
  const signatureParams = { ...cleanParams, ...oauthParams };
  const url = buildApiUrl(path);
  const baseUrl = `${url.origin}${url.pathname}`;
  const parameterString = Object.entries(signatureParams)
    .map(([key, value]) => [encodeOAuthValue(key), encodeOAuthValue(String(value))])
    .sort(([keyA, valueA], [keyB, valueB]) => keyA.localeCompare(keyB) || valueA.localeCompare(valueB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const signatureBase = ["GET", encodeOAuthValue(baseUrl), encodeOAuthValue(parameterString)].join("&");
  const signingKey = `${encodeOAuthValue(consumerSecret)}&`;
  const oauth_signature = createHmac("sha1", signingKey).update(signatureBase).digest("base64");

  return { ...params, ...oauthParams, oauth_signature };
}

async function wooFetch<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!hasWooCredentials()) {
    throw new Error("WooCommerce credentials are not configured.");
  }

  const requestPath = `wc/v3/${path.replace(/^\/+/, "")}`;
  const apiUrl = getWordPressApiUrl();
  if (apiUrl.startsWith("http://")) {
    return apiFetch<T>(requestPath, {
      params: signWooParams(requestPath, params),
    });
  }

  const credentials = Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString("base64");

  return apiFetch<T>(requestPath, {
    params,
    headers: { Authorization: `Basic ${credentials}` },
  });
}

function attr(product: WooProduct, name: string) {
  return product.attributes?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.options[0] || "";
}

function mapWooProduct(product: WooProduct, locale: Locale): CoffeeProduct {
  const priceToman = Number.parseInt(product.price || "0", 10) || 0;
  const fallbackName = product.name;

  return {
    slug: product.slug,
    name: locale === "fa" ? fallbackName : fallbackName,
    nameEn: locale === "en" ? fallbackName : fallbackName,
    origin: attr(product, "origin") || product.categories?.[0]?.name || "",
    originEn: attr(product, "origin_en") || attr(product, "origin") || product.categories?.[0]?.name || "",
    roast: (attr(product, "roast") as CoffeeProduct["roast"]) || "متوسط",
    roastEn: (attr(product, "roast_en") as CoffeeProduct["roastEn"]) || "Medium",
    process: attr(product, "process"),
    processEn: attr(product, "process_en") || attr(product, "process"),
    weightGram: Number.parseInt(product.weight || attr(product, "weight") || "250", 10) || 250,
    priceToman,
    tastingNotes: attr(product, "tasting_notes").split(",").map((item) => item.trim()).filter(Boolean),
    tastingNotesEn: attr(product, "tasting_notes_en").split(",").map((item) => item.trim()).filter(Boolean),
    brew: attr(product, "brew"),
    brewEn: attr(product, "brew_en") || attr(product, "brew"),
    inventory: product.stock_status === "outofstock" ? "sold-out" : product.stock_status === "onbackorder" ? "low" : "available",
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

    return wooProducts.length ? wooProducts.map((product) => mapWooProduct(product, locale)) : products;
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

    return wooProducts[0] ? mapWooProduct(wooProducts[0], locale) : getProduct(slug) || null;
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
