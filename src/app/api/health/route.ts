import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const checks = {
    app: "ok",
    database: "skipped",
  };

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "ok";
    } catch {
      checks.database = "error";
    }
  }

  return NextResponse.json(checks, {
    status: checks.database === "error" ? 503 : 200,
  });
}
