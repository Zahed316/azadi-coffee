"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";

type WholesaleState = {
  error?: string;
  success?: boolean;
};

export async function submitWholesale(_prevState: WholesaleState, formData: FormData): Promise<WholesaleState> {
  const businessName = (formData.get("businessName") as string)?.trim();
  const weeklyUsage = (formData.get("weeklyUsage") as string)?.trim();
  const details = (formData.get("details") as string)?.trim();

  if (!businessName) return { error: "Business name is required." };
  if (!weeklyUsage) return { error: "Weekly usage estimate is required." };
  if (!details || details.length < 10) return { error: "Details must be at least 10 characters." };

  if (process.env.DATABASE_URL) {
    await prisma.wholesaleInquiry.create({
      data: { businessName, weeklyUsage, details, locale: "fa" },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Wholesale form submission (no Resend key):", { businessName, weeklyUsage, details });
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const toEmail = process.env.WHOLESALE_EMAIL || process.env.CONTACT_EMAIL || "wholesale@azadicoffee.com";
    const { error } = await resend.emails.send({
      from: "Azadi Coffee <contact@azadicoffee.com>",
      to: [toEmail],
      subject: `Wholesale inquiry from ${businessName}`,
      text: `Business: ${businessName}\nWeekly usage: ${weeklyUsage}\n\nDetails:\n${details}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "Failed to send. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Wholesale email error:", err);
    return { error: "Failed to send. Please try again." };
  }
}
