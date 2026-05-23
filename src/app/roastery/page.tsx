import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "برشته کاری" };

export default async function RoasteryPage() {
  const page = await getPageBySlug("roastery", "fa");

  return (
    <PageShell>
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">{page?.title || "برشته کاری آزادی"}</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["نمونه گیری", "پروفایل برشت", "کنترل کیفیت"].map((title, index) => (
            <article key={title} className="border border-ink p-6">
              <p className="font-mono text-sm">۰{index + 1}</p>
              <h2 className="mt-5 text-2xl font-bold">{title}</h2>
              <p className="mt-4 leading-8 text-stone">{page?.content || "هر بچ با هدف ثبات، وضوح طعمی و مناسب بودن برای روش دم آوری انتخابی بررسی می شود."}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
