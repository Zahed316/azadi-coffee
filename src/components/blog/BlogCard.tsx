import Link from "next/link";
import type { BlogPost } from "@/data/posts";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="grid gap-5 border-t border-ink py-7 md:grid-cols-[160px_1fr_auto]">
      <div className="aspect-[4/3] border border-ink bg-warm-paper" />
      <div>
        <p className="text-sm text-stone">{post.category} / {post.date}</p>
        <h2 className="mt-2 text-2xl font-bold">{post.title}</h2>
        <p className="mt-3 leading-8 text-stone">{post.excerpt}</p>
      </div>
      <Link href={`/blog/${post.slug}`} className="self-start border border-ink px-4 py-2 text-sm font-bold hover:bg-ink hover:text-paper">
        خواندن
      </Link>
    </article>
  );
}
