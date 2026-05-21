import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "درباره آزادی" };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">درباره قهوه آزادی</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite">
          <p>آزادی یک برند قهوه تخصصی فارسی است که روی خرید شفاف، برشته کاری دقیق و تجربه خرید ساده تمرکز دارد.</p>
          <p>هویت بصری از ریتم مینیمال سیاه و سفید الهام می گیرد، اما محتوا، محصول و لحن کاملا برای قهوه و مخاطب ایرانی طراحی شده است.</p>
        </div>
      </section>
    </PageShell>
  );
}
