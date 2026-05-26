import { Resend } from "resend";
import type { LocalOrder } from "@/lib/orders/store";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

export async function sendOrderPaidNotifications(order: LocalOrder) {
  const resend = getResend();
  if (!resend) return;

  const toEmail = process.env.CONTACT_EMAIL || "hello@azadicoffee.com";
  const lines = [
    `Order: #${order.orderNumber}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Total: ${order.totalToman.toLocaleString()} toman`,
    "",
    "Items:",
    ...order.items.map((item) => `- ${item.nameEn} x ${item.quantity}`),
  ];

  await resend.emails.send({
    from: "Azadi Coffee <orders@azadicoffee.com>",
    to: [toEmail],
    subject: `Paid order #${order.orderNumber}`,
    text: lines.join("\n"),
  });
}
