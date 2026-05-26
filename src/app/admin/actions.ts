"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/auth/admin";

export async function submitAdminLogin(_prevState: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const result = await loginAdmin(email, password);

  if (!result.ok) {
    return { error: result.message };
  }

  redirect("/admin");
}

export async function submitAdminLogout() {
  await logoutAdmin();
  redirect("/admin/login");
}
