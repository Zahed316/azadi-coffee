import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = { title: "Contact" };

export default function EnglishContactPage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold">Contact Azadi</h1>
          <p className="mt-5 leading-8 text-stone">Contact Azadi for coffee orders, cafe supply, or wholesale collaboration.</p>
        </div>
        <ContactForm locale="en" />
      </section>
    </PageShell>
  );
}
