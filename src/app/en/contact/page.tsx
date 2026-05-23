import { PageShell } from "@/components/layout/PageShell";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata = { title: "Contact" };

export default async function EnglishContactPage() {
  const page = await getPageBySlug("contact", "en");

  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold">{page?.title || "Contact Azadi"}</h1>
          <p className="mt-5 leading-8 text-stone" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
        </div>
        <form className="grid gap-4 border border-ink p-5">
          <input className="min-h-12 border border-ink px-4" placeholder="Name" />
          <input className="min-h-12 border border-ink px-4" placeholder="Phone number" />
          <textarea className="min-h-32 border border-ink px-4 py-3" placeholder="Message" />
          <button type="button" className="min-h-12 border border-ink bg-ink font-bold text-white">Send message</button>
        </form>
      </section>
    </PageShell>
  );
}
