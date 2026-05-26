import { z } from "zod";

/** Convert empty strings to undefined so `.optional()` works for env vars set to `""` */
function emptyStr(v: unknown) {
  return v === "" ? undefined : v;
}

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyStr, z.string().url()).default("http://localhost:3000"),
  DATABASE_URL: z.preprocess(emptyStr, z.string().min(1)).optional(),
  ADMIN_EMAIL: z.preprocess(emptyStr, z.string().email()).optional(),
  ADMIN_PASSWORD: z.preprocess(emptyStr, z.string().min(8)).optional(),
  ADMIN_SESSION_SECRET: z.preprocess(emptyStr, z.string().min(32)).optional(),
  ZARINPAL_MERCHANT_ID: z.preprocess(emptyStr, z.string().min(1)).optional(),
  ZARINPAL_SANDBOX: z.preprocess(emptyStr, z.string()).default("true"),
  RESEND_API_KEY: z.preprocess(emptyStr, z.string().min(1)).optional(),
  CONTACT_EMAIL: z.preprocess(emptyStr, z.string().email()).default("hello@azadicoffee.com"),
  WHOLESALE_EMAIL: z.preprocess(emptyStr, z.string().email()).default("wholesale@azadicoffee.com"),
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
