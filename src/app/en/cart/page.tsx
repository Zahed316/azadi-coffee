import { CartContent } from "@/components/cart/CartContent";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Cart" };

export default function EnglishCartPage() {
  return (
    <PageShell locale="en">
      <CartContent locale="en" />
    </PageShell>
  );
}
