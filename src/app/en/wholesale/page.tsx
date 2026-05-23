import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "Wholesale and B2B" };

export default async function EnglishWholesalePage() {
  const page = await getPageBySlug("wholesale", "en");

  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-bold text-stone">Wholesale / B2B</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">{page?.title || "Coffee supply for cafes and teams"}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-stone">{page?.content || "Azadi wholesale covers recurring orders, barista training, profile selection, and seasonal support."}</p>
        </div>
        <form className="grid gap-4 border border-ink p-5">
          <input className="min-h-12 border border-ink px-4" placeholder="Cafe or company name" />
          <input className="min-h-12 border border-ink px-4" placeholder="Approximate weekly usage" />
          <textarea className="min-h-32 border border-ink px-4 py-3" placeholder="Machine type, menu, city, and main need" />
          <button type="button" className="min-h-12 border border-ink bg-ink font-bold text-white">Submit wholesale request</button>
        </form>
      </section>
    </PageShell>
  );
}
