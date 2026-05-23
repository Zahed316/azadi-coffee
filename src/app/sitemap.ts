import type { MetadataRoute } from "next";

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
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/en" ? "daily" as const : "weekly" as const,
    priority: route === "/" || route === "/en" ? 1 : 0.8,
  }));
}
