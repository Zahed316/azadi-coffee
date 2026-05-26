import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "About Azadi" };

export default function EnglishAboutPage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">About Azadi Coffee</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite">
          <p>Azadi uses a black-and-white visual rhythm, precise spacing, and adjacent page panels to create a calm shopping experience. The content, product, and identity are built around specialty coffee and the Iranian market.</p>
          <p>We are a small roastery in Tehran focused on clarity, repeatability, and freshness. Every batch is selected by season, transparency, and cup quality.</p>
        </div>
      </section>
    </PageShell>
  );
}
