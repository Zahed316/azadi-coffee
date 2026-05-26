import { PageShell } from "@/components/layout/PageShell";
import { WholesaleForm } from "@/components/forms/WholesaleForm";

export const metadata = { title: "Wholesale and B2B" };

export default function EnglishWholesalePage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-bold text-stone">Wholesale / B2B</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">Coffee supply for cafes and teams</h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-stone">
            Azadi wholesale covers recurring orders, barista training, profile selection, and seasonal support.
          </p>
        </div>
        <WholesaleForm locale="en" />
      </section>
    </PageShell>
  );
}
