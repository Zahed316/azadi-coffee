import { BlogCard } from "@/components/blog/BlogCard";
import { PageShell } from "@/components/layout/PageShell";
import { getPosts } from "@/lib/wordpress";

export const metadata = { title: "وبلاگ" };

export default async function BlogPage() {
  const posts = await getPosts("fa");

  return (
    <PageShell>
      <section className="container-shell py-12">
        <p className="text-sm font-bold text-stone">Journal / آموزش و برشته کاری</p>
        <h1 className="mt-3 text-5xl font-bold">وبلاگ قهوه آزادی</h1>
        <div className="mt-8">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      </section>
    </PageShell>
  );
}
