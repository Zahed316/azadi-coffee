import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/admin";
import { getProducts } from "@/data/products";
import { getAdminOrders } from "@/lib/orders/store";
import { submitAdminLogout } from "./actions";

export const metadata = { title: "Admin dashboard" };

export default async function AdminPage() {
  const user = await requireAdminUser();
  const products = getProducts();
  const orders = await getAdminOrders();
  const paidOrders = orders.filter((order) => order.status === "PAID" || order.status === "PROCESSING");
  const revenue = paidOrders.reduce((sum, order) => sum + order.totalToman, 0);

  return (
    <main className="container-shell py-10" dir="ltr" lang="en">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink pb-5">
        <div>
          <p className="text-sm font-bold text-stone">Signed in as {user.email}</p>
          <h1 className="mt-2 text-4xl font-bold">Admin dashboard</h1>
        </div>
        <form action={submitAdminLogout}>
          <button className="min-h-10 border border-ink px-4 font-bold transition hover:bg-ink hover:text-paper">
            Sign out
          </button>
        </form>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Products", products.length.toString()],
          ["Orders", orders.length.toString()],
          ["Paid revenue", `${revenue.toLocaleString()} toman`],
        ].map(([label, value]) => (
          <article key={label} className="border border-ink p-5">
            <p className="text-sm font-bold text-stone">{label}</p>
            <strong className="mt-2 block text-3xl">{value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="border border-ink p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold underline">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {orders.slice(0, 6).map((order) => (
              <article key={order.id} className="border border-line p-3 text-sm">
                <div className="flex justify-between gap-4">
                  <strong>#{order.orderNumber}</strong>
                  <span>{order.status}</span>
                </div>
                <p className="mt-2 text-stone">{order.customer.phone}</p>
                <p className="mt-1 font-bold">{order.totalToman.toLocaleString()} toman</p>
              </article>
            ))}
            {orders.length === 0 && <p className="text-stone">No orders yet.</p>}
          </div>
        </div>

        <div className="border border-ink p-5">
          <h2 className="text-2xl font-bold">Seed product catalog</h2>
          <p className="mt-2 text-sm leading-6 text-stone">
            Product CRUD is the next backend phase. Checkout already prices from this server-side catalog.
          </p>
          <div className="mt-5 grid gap-3">
            {products.map((product) => (
              <article key={product.slug} className="border border-line p-3 text-sm">
                <div className="flex justify-between gap-4">
                  <strong>{product.nameEn}</strong>
                  <span>{product.inventory}</span>
                </div>
                <p className="mt-1 text-stone">{product.slug}</p>
                <p className="mt-1 font-bold">{product.priceToman.toLocaleString()} toman</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
