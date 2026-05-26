import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "برشته کاری" };

export default function RoasteryPage() {
  return (
    <PageShell>
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">برشته کاری آزادی</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["نمونه گیری", "هر بچ با هدف ثبات، وضوح طعمی و مناسب بودن برای روش دم آوری انتخابی بررسی می شود."],
            ["پروفایل برشت", "کنترل زمان، دما و توسعه برای هر دسته برشته کاری ثبت می شود."],
            ["کنترل کیفیت", "تازگی، نگهداری و استراحت مناسب قبل از بسته بندی و ارسال بررسی می شود."],
          ].map(([title, text], index) => (
            <article key={title} className="border border-ink p-6">
              <p className="font-mono text-sm">۰{index + 1}</p>
              <h2 className="mt-5 text-2xl font-bold">{title}</h2>
              <p className="mt-4 leading-8 text-stone">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
