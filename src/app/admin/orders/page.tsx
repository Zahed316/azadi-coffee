import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/admin";
import { getAdminOrders } from "@/lib/orders/store";

export const metadata = { title: "Admin orders" };

export default async function AdminOrdersPage() {
  await requireAdminUser();
  const orders = await getAdminOrders();

  return (
    <main className="container-shell py-10" dir="ltr" lang="en">
      <Link href="/admin" className="text-sm font-bold underline">Back to dashboard</Link>
      <h1 className="mt-4 text-4xl font-bold">Orders</h1>
      <div className="mt-8 overflow-x-auto border border-ink">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-warm-paper text-left">
            <tr>
              {["Order", "Status", "Customer", "Items", "Total", "Created"].map((heading) => (
                <th key={heading} className="border-b border-ink p-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line">
                <td className="p-3 font-bold">#{order.orderNumber}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">{order.customer.phone}</td>
                <td className="p-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="p-3">{order.totalToman.toLocaleString()} toman</td>
                <td className="p-3">{order.createdAt.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-5 text-stone">No orders yet.</p>}
      </div>
    </main>
  );
}
