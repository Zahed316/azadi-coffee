import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "درباره آزادی" };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <h1 className="text-5xl font-bold leading-tight">درباره قهوه آزادی</h1>
        <div className="grid gap-6 text-lg leading-10 text-graphite">
          <p>آزادی از زبان بصری سیاه و سفید، فاصله گذاری دقیق و صفحات کنار هم برای ساختن تجربه ای آرام استفاده می کند. اما محتوا، محصول و هویت آن برای قهوه تخصصی و بازار فارسی طراحی شده است.</p>
          <p>ما یک برشته کاری کوچک در تهران هستیم که روی وضوح، تکرارپذیری و تازگی تمرکز دارد. هر بچ بر اساس فصل، شفافیت و کیفیت فنجان انتخاب می شود.</p>
        </div>
      </section>
    </PageShell>
  );
}
