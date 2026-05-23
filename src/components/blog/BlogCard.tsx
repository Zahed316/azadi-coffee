import Link from "next/link";
import type { BlogPost } from "@/data/posts";
import { localePath, type Locale } from "@/lib/i18n";

export function BlogCard({ post, locale = "fa" }: { post: BlogPost; locale?: Locale }) {
  return (
    <article className="blog-card grid gap-5 border-t py-7 md:grid-cols-[160px_1fr_auto]">
      <div className="aspect-[4/3] border border-ink bg-warm-paper" />
      <div>
        <p className="text-sm text-stone">{locale === "en" ? `${post.categoryEn} / ${post.dateEn}` : `${post.category} / ${post.date}`}</p>
        <h2 className="mt-2 text-2xl font-bold">{locale === "en" ? post.titleEn : post.title}</h2>
        <p className="mt-3 leading-8 text-stone">{locale === "en" ? post.excerptEn : post.excerpt}</p>
      </div>
      <Link href={localePath(locale, `/blog/${post.slug}`)} className="button-secondary self-start border px-4 py-2 text-sm font-bold">
        {locale === "en" ? "Read" : "خواندن"}
      </Link>
    </article>
  );
}
