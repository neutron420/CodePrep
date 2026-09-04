import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../app/generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file and run with dotenv loaded.");
}

const cleanUrl = databaseUrl
  .replace(/[?&]channel_binding=[^&]*/gi, "")
  .replace(/[?&]sslmode=[^&]*/gi, "");

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.warn("Script PG pool idle connection reset handled:", err.message);
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
