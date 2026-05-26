import type { MetadataRoute } from "next";
import { getPosts } from "@/data/posts";
import { getProducts } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticRoutes = [
  "/",
  "/en",
  "/shop",
  "/en/shop",
  "/cart",
  "/en/cart",
  "/checkout",
  "/en/checkout",
  "/blog",
  "/en/blog",
  "/about",
  "/en/about",
  "/contact",
  "/en/contact",
  "/roastery",
  "/en/roastery",
  "/wholesale",
  "/en/wholesale",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = getProducts().flatMap((product) => [
    `/shop/${product.slug}`,
    `/en/shop/${product.slug}`,
  ]);
  const postRoutes = getPosts().flatMap((post) => [
    `/blog/${post.slug}`,
    `/en/blog/${post.slug}`,
  ]);

  return [...staticRoutes, ...productRoutes, ...postRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/en" ? "daily" as const : "weekly" as const,
    priority: route === "/" || route === "/en" ? 1 : 0.8,
  }));
}
