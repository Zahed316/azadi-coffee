import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "Roastery" };

export default async function EnglishRoasteryPage() {
  const page = await getPageBySlug("roastery", "en");

  return (
    <PageShell locale="en">
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">{page?.title || "Azadi roastery"}</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["Sampling", "Roast profile", "Quality control"].map((title, index) => (
            <article key={title} className="border border-ink p-6">
              <p className="font-mono text-sm">0{index + 1}</p>
              <h2 className="mt-5 text-2xl font-bold">{title}</h2>
              <p className="mt-4 leading-8 text-stone">{page?.content || "Every batch is checked for consistency, cup clarity, and fit for the intended brewing method."}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
