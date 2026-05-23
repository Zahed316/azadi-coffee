import { BlogCard } from "@/components/blog/BlogCard";
import { PageShell } from "@/components/layout/PageShell";
import { getPosts } from "@/lib/wordpress";

export const metadata = { title: "Journal" };

export default async function EnglishBlogPage() {
  const posts = await getPosts("en");

  return (
    <PageShell locale="en">
      <section className="container-shell py-12">
        <p className="text-sm font-bold text-stone">Journal / Education and roasting</p>
        <h1 className="mt-3 text-5xl font-bold">Azadi Coffee journal</h1>
        <div className="mt-8">
          {posts.map((post) => <BlogCard key={post.slug} post={post} locale="en" />)}
        </div>
      </section>
    </PageShell>
  );
}
