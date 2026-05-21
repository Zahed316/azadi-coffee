import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "نتیجه سفارش" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageShell>
      <section className="container-shell py-12">
        <div className="max-w-2xl border border-ink p-6">
          <p className="text-sm font-bold text-stone">Order / نتیجه پرداخت</p>
          <h1 className="mt-3 text-4xl font-bold">سفارش شما ثبت شد</h1>
          <p className="mt-5 leading-8 text-stone">
            شماره سفارش <span className="font-mono text-ink">{id}</span> برای نمایش وضعیت پرداخت و ارسال استفاده می شود. در نسخه متصل، این صفحه نتیجه callback درگاه را از WooCommerce می خواند.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
