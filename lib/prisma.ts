import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  const VERIFY_FULL_SSL_MODES = /sslmode=(prefer|require|verify-ca)(?=&|$)/gi;
  const needsExplicitSsl = VERIFY_FULL_SSL_MODES.test(databaseUrl);

  const adapter = new PrismaPg({
    connectionString: needsExplicitSsl ? databaseUrl.replace(VERIFY_FULL_SSL_MODES, "") : databaseUrl,
    ...(needsExplicitSsl ? { ssl: { rejectUnauthorized: true } } : {}),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
