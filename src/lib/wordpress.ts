import type { BlogPost } from "@/data/posts";
import { posts } from "@/data/posts";
import type { Locale } from "./i18n";
import { apiFetch, safeApiFetch } from "./api-client";
import { getFooterSettings, getHeaderSettings } from "./theme-settings";

type WpRendered = { rendered?: string };

type WpPost = {
  id: number;
  slug: string;
  date?: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  featured_media?: number;
  categories?: number[];
  acf?: Record<string, unknown>;
  meta?: Record<string, string>;
};

type WpPage = WpPost;

export type NavigationItem = {
  label: string;
  href: string;
};

export type ManagedPage = {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredMediaId?: number;
};

const localeSlugCandidates = (slug: string, locale: Locale) => {
  const normalized = slug.replace(/^\/+|\/+$/g, "") || "home";
  if (locale === "en") {
    return [`en-${normalized}`, `en/${normalized}`, normalized];
  }
  return [normalized];
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function metaVal(post: WpPost, key: string): string | undefined {
  const val = post.meta?.[key] ?? (post.acf?.[key] as string | undefined);
  return val || undefined;
}

function metaArr(post: WpPost, key: string): string[] | undefined {
  const raw = post.meta?.[key] ?? (post.acf?.[key] as string | string[] | undefined);
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [raw];
    }
  }
  return undefined;
}

function mapWpPost(post: WpPost): BlogPost {
  const title = stripHtml(post.title?.rendered);
  const excerpt = stripHtml(post.excerpt?.rendered);
  const content = stripHtml(post.content?.rendered);

  const body = content ? [content] : [];
  const acfCategory = post.acf?.category as string | undefined;

  return {
    slug: post.slug,
    title: metaVal(post, "title_fa") || title,
    titleEn: metaVal(post, "title_en") || title,
    category: metaVal(post, "category_fa") || acfCategory || "وبلاگ",
    categoryEn: metaVal(post, "category_en") || acfCategory || "Journal",
    date: post.date ? new Intl.DateTimeFormat("fa-IR").format(new Date(post.date)) : "",
    dateEn: post.date ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.date)) : "",
    excerpt: metaVal(post, "excerpt_fa") || excerpt,
    excerptEn: metaVal(post, "excerpt_en") || excerpt,
    body: metaArr(post, "body_fa") || body,
    bodyEn: metaArr(post, "body_en") || body,
  };
}

function mapWpPage(page: WpPage): ManagedPage {
  return {
    slug: page.slug,
    title: stripHtml(page.title?.rendered),
    content: page.content?.rendered || "",
    excerpt: stripHtml(page.excerpt?.rendered),
    featuredMediaId: page.featured_media || undefined,
  };
}

export async function getPageBySlug(slug: string, locale: Locale = "fa") {
  for (const candidate of localeSlugCandidates(slug, locale)) {
    const pages = await safeApiFetch<WpPage[]>("wp/v2/pages", [], {
      params: { slug: candidate, per_page: 1, _embed: true },
    });
    if (pages[0]) {
      return mapWpPage(pages[0]);
    }
  }

  return null;
}

export async function getPosts(locale: Locale = "fa") {
  const wpPosts = await safeApiFetch<WpPost[]>("wp/v2/posts", [], {
    params: { per_page: 20, _embed: true, lang: locale },
  });

  return wpPosts.length ? wpPosts.map((post) => mapWpPost(post)) : posts;
}

export async function getPostBySlug(slug: string, locale: Locale = "fa") {
  for (const candidate of localeSlugCandidates(slug, locale)) {
    const wpPosts = await safeApiFetch<WpPost[]>("wp/v2/posts", [], {
      params: { slug: candidate, per_page: 1, _embed: true, lang: locale },
    });
    if (wpPosts[0]) {
      return mapWpPost(wpPosts[0]);
    }
  }

  return posts.find((post) => post.slug === slug) || null;
}

export async function getMediaById(id: number) {
  return safeApiFetch<Record<string, unknown> | null>(`wp/v2/media/${id}`, null);
}

export async function getNavigation(locale: Locale = "fa"): Promise<NavigationItem[]> {
  const settings = await getHeaderSettings(locale);
  if (settings.navigation?.length) {
    return settings.navigation;
  }

  return locale === "en"
    ? [
        { label: "Shop", href: "/shop" },
        { label: "Journal", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "Roastery", href: "/roastery" },
        { label: "Wholesale", href: "/wholesale" },
      ]
    : [
        { label: "فروشگاه", href: "/shop" },
        { label: "وبلاگ", href: "/blog" },
        { label: "درباره", href: "/about" },
        { label: "برشته کاری", href: "/roastery" },
        { label: "عمده", href: "/wholesale" },
      ];
}

export async function getFooterContent(locale: Locale = "fa") {
  return getFooterSettings(locale);
}

export async function updateWordPressSetting<T>(endpoint: string, value: T) {
  return apiFetch<T>(`azadi/v1/${endpoint.replace(/^\/+/, "")}`, {
    method: "POST",
    authenticated: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
    revalidate: 0,
  });
}
