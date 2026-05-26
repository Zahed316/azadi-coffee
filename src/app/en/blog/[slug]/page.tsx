import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { getPostBySlug, getPosts } from "@/data/posts";

export async function generateStaticParams() {
  const posts = await getPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "en");
  return { title: post ? post.titleEn : "Journal" };
}

export default async function EnglishBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "en");
  if (!post) notFound();

  return (
    <PageShell locale="en">
      <article className="container-shell max-w-3xl py-12">
        <p className="text-sm font-bold text-stone">{post.categoryEn} / {post.dateEn}</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight">{post.titleEn}</h1>
        <div className="mt-8 aspect-[16/9] border border-ink bg-warm-paper" />
        <div className="mt-10 grid gap-6 text-lg leading-10 text-graphite">
          {post.bodyEn.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </PageShell>
  );
}
