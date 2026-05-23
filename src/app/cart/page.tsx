import { CartContent } from "@/components/cart/CartContent";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "سبد خرید" };

export default function CartPage() {
  return (
    <PageShell>
      <CartContent locale="fa" />
    </PageShell>
  );
}
