import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "About Azadi" };

export default function EnglishAboutPage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">About Azadi Coffee</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite">
          <p>Azadi is a Persian specialty coffee brand focused on clear buying, precise roasting, and a simple commerce experience.</p>
          <p>The visual identity takes cues from a minimal black-and-white rhythm, while the product, content, and voice are designed for coffee and Iranian customers.</p>
        </div>
      </section>
    </PageShell>
  );
}
