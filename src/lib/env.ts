import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(12).optional(),
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  ZARINPAL_MERCHANT_ID: z.string().min(1).optional(),
  ZARINPAL_SANDBOX: z.string().default("true"),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL: z.string().email().default("hello@azadicoffee.com"),
  WHOLESALE_EMAIL: z.string().email().default("wholesale@azadicoffee.com"),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}

export function requireProductionEnv() {
  const env = getServerEnv();
  const missing = [
    ["DATABASE_URL", env.DATABASE_URL],
    ["ADMIN_EMAIL", env.ADMIN_EMAIL],
    ["ADMIN_PASSWORD", env.ADMIN_PASSWORD],
    ["ADMIN_SESSION_SECRET", env.ADMIN_SESSION_SECRET],
    ["ZARINPAL_MERCHANT_ID", env.ZARINPAL_MERCHANT_ID],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(`Missing production env vars: ${missing.map(([key]) => key).join(", ")}`);
  }

  return env;
}
