import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "عمده و B2B" };

export default async function WholesalePage() {
  const page = await getPageBySlug("wholesale", "fa");

  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-bold text-stone">Wholesale / B2B</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">{page?.title || "تامین قهوه برای کافه ها و تیم ها"}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-stone">{page?.content || "برنامه عمده آزادی باید سفارش منظم، آموزش باریستا، انتخاب پروفایل و پشتیبانی تغییر فصل را پوشش دهد."}</p>
        </div>
        <form className="grid gap-4 border border-ink p-5">
          <input className="min-h-12 border border-ink px-4" placeholder="نام کافه یا شرکت" />
          <input className="min-h-12 border border-ink px-4" placeholder="مصرف تقریبی هفتگی" />
          <textarea className="min-h-32 border border-ink px-4 py-3" placeholder="نوع دستگاه، منو، شهر و نیاز اصلی" />
          <button type="button" className="min-h-12 border border-ink bg-ink font-bold text-paper">ثبت درخواست عمده</button>
        </form>
      </section>
    </PageShell>
  );
}
