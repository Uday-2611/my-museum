import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";

config({ path: ".env.local" });
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required in .env.local.");

const adminEmail = "udayagarwal234@gmail.com";
const database = drizzle(neon(url), { schema });
async function main() {
  const existing = await database.select({ email: schema.user.email }).from(schema.user);
  if (existing.some((row) => row.email.toLowerCase() === adminEmail)) {
    console.log("Studio administrator already exists.");
  } else {
    if (existing.length) throw new Error("Another account already exists. Administrator creation is limited to an empty account table.");
    await database.insert(schema.user).values({ id: randomUUID(), name: "Uday Agarwal", email: adminEmail, emailVerified: true });
    console.log("Studio administrator created. Sign in using an emailed six-digit code.");
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
