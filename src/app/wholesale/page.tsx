import { PageShell } from "@/components/layout/PageShell";
import { WholesaleForm } from "@/components/forms/WholesaleForm";

export const metadata = { title: "عمده و B2B" };

export default function WholesalePage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-bold text-stone">Wholesale / B2B</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">تامین قهوه برای کافه ها و تیم ها</h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-stone">
            برنامه عمده آزادی باید سفارش منظم، آموزش باریستا، انتخاب پروفایل و پشتیبانی تغییر فصل را پوشش دهد.
          </p>
        </div>
        <WholesaleForm locale="fa" />
      </section>
    </PageShell>
  );
}
