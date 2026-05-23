import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { getPostBySlug, getPosts } from "@/lib/wordpress";

export async function generateStaticParams() {
  const posts = await getPosts("fa");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "fa");
  return { title: post ? post.title : "وبلاگ" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "fa");
  if (!post) notFound();

  return (
    <PageShell>
      <article className="container-shell max-w-3xl py-12">
        <p className="text-sm font-bold text-stone">{post.category} / {post.date}</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-8 aspect-[16/9] border border-ink bg-warm-paper" />
        <div className="mt-10 grid gap-6 text-lg leading-10 text-graphite">
          {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </PageShell>
  );
}
