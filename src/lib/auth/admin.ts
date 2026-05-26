import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";

const COOKIE_NAME = "azadi_admin_session";
const SESSION_DAYS = 7;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "development-admin-session-secret-change-before-production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function verifyPassword(candidate: string) {
  const env = getServerEnv();
  const configured = env.ADMIN_PASSWORD;
  if (!configured) return false;
  return constantTimeEqual(candidate, configured);
}

export async function loginAdmin(email: string, password: string) {
  const env = getServerEnv();
  if (!env.ADMIN_EMAIL || !verifyPassword(password) || email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    return { ok: false, message: "Invalid admin credentials." };
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = sign(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const user = await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { name: "Admin" },
    create: {
      email: env.ADMIN_EMAIL,
      name: "Admin",
      passwordHash: "env-admin-password",
      role: "ADMIN",
    },
  });

  await prisma.adminSession.create({
    data: { tokenHash, userId: user.id, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${token}.${tokenHash}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { ok: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (raw) {
    const [, tokenHash] = raw.split(".");
    if (tokenHash) {
      await prisma.adminSession.deleteMany({ where: { tokenHash } });
    }
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const [token, tokenHash] = raw.split(".");
  if (!token || !tokenHash || sign(token) !== tokenHash) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
