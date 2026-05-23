import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "تماس" };

export default async function ContactPage() {
  const page = await getPageBySlug("contact", "fa");

  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold">{page?.title || "تماس با آزادی"}</h1>
          <p className="mt-5 leading-8 text-stone" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
        </div>
        <form className="grid gap-4 border border-ink p-5">
          <input className="min-h-12 border border-ink px-4" placeholder="نام" />
          <input className="min-h-12 border border-ink px-4" placeholder="شماره تماس" />
          <textarea className="min-h-32 border border-ink px-4 py-3" placeholder="پیام" />
          <button type="button" className="min-h-12 border border-ink bg-ink font-bold text-paper">ارسال پیام</button>
        </form>
      </section>
    </PageShell>
  );
}
