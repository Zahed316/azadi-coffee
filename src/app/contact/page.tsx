import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = { title: "تماس" };

export default function ContactPage() {
  return (
    <PageShell>
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold">تماس با آزادی</h1>
          <p className="mt-5 leading-8 text-stone">برای خرید، تامین قهوه کافه یا همکاری عمده با آزادی تماس بگیرید.</p>
        </div>
        <ContactForm locale="fa" />
      </section>
    </PageShell>
  );
}
