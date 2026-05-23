import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "درباره آزادی" };

export default async function AboutPage() {
  const page = await getPageBySlug("about", "fa");

  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">{page?.title || "درباره قهوه آزادی"}</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite" dangerouslySetInnerHTML={{ __html: page?.content || "" }}>
        </div>
      </section>
    </PageShell>
  );
}
