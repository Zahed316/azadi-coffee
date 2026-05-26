import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    process.env.DATABASE_URL
      ? {
          adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
          log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        }
      : {
          adapter: new PrismaPg({ connectionString: "postgresql://localhost:5432/azadi_missing" }),
          log: ["error"],
        },
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for persistent ecommerce operations.");
  }
}
