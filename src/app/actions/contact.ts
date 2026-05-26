"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";

type ContactState = {
  error?: string;
  success?: boolean;
};

export async function submitContact(_prevState: ContactState, formData: FormData): Promise<ContactState> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name) return { error: "نام الزامی است." };
  if (!phone) return { error: "شماره تماس الزامی است." };
  if (!message || message.length < 10) return { error: "پیام باید حداقل ۱۰ کاراکتر باشد." };

  if (process.env.DATABASE_URL) {
    await prisma.contactSubmission.create({
      data: { name, phone, message, locale: "fa" },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Contact form submission (no Resend key):", { name, phone, message });
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const toEmail = process.env.CONTACT_EMAIL || "hello@azadicoffee.com";
    const { error } = await resend.emails.send({
      from: "Azadi Coffee <contact@azadicoffee.com>",
      to: [toEmail],
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "ارسال پیام با خطا مواجه شد. لطفا دوباره تلاش کنید." };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact email error:", err);
    return { error: "ارسال پیام با خطا مواجه شد. لطفا دوباره تلاش کنید." };
  }
}
