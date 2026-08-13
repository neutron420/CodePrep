import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../app/generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file and run with dotenv loaded.");
}

const VERIFY_FULL_SSL_MODES = /sslmode=(prefer|require|verify-ca)(?=&|$)/gi;
const needsExplicitSsl = VERIFY_FULL_SSL_MODES.test(databaseUrl);

const adapter = new PrismaPg({
  connectionString: needsExplicitSsl ? databaseUrl.replace(VERIFY_FULL_SSL_MODES, "") : databaseUrl,
  ...(needsExplicitSsl ? { ssl: { rejectUnauthorized: true } } : {}),
});

export const prisma = new PrismaClient({ adapter });

export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
