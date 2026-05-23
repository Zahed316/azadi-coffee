import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageShell } from "@/components/layout/PageShell";
import { iranianGateways } from "@/lib/woocommerce/payments";

export const metadata = { title: "Checkout" };

const gatewayCopy: Record<string, { name: string; strategy: string }> = {
  zarinpal: {
    name: "Zarinpal",
    strategy: "Use the WooCommerce gateway plugin first; Next.js redirects to the hosted callback.",
  },
  behpardakht: {
    name: "Behpardakht Mellat",
    strategy: "Use a maintained WooCommerce plugin because settlement and verification flows are bank-specific.",
  },
  idpay: {
    name: "IDPay",
    strategy: "Acceptable as a secondary gateway after plugin maintenance and callback security review.",
  },
};

export default function EnglishCheckoutPage() {
  return (
    <PageShell locale="en">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="text-5xl font-bold">Checkout</h1>
          <p className="mt-4 max-w-2xl leading-8 text-stone">
            The production flow should create the order in WooCommerce, send the customer to the selected gateway, and verify the callback result.
          </p>
          <div className="mt-8">
            <CheckoutForm locale="en" />
          </div>
        </div>
        <aside className="border border-ink p-5 lg:self-start">
          <h2 className="font-bold">Iran payment strategy</h2>
          <div className="mt-5 grid gap-4">
            {iranianGateways.map((gateway) => (
              <article key={gateway.id} className="border-t border-ink pt-4">
                <h3 className="font-bold">{gatewayCopy[gateway.id].name}</h3>
                <p className="mt-2 text-sm leading-7 text-stone">{gatewayCopy[gateway.id].strategy}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
