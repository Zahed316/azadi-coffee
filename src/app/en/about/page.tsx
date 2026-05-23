import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "About Azadi" };

export default async function EnglishAboutPage() {
  const page = await getPageBySlug("about", "en");

  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">{page?.title || "About Azadi Coffee"}</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite" dangerouslySetInnerHTML={{ __html: page?.content || "" }}>
        </div>
      </section>
    </PageShell>
  );
}
