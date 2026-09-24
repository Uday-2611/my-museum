import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { artworks, rooms } from "../lib/db/schema";
import { demoArtworks, demoRooms } from "../lib/museum/demo";

config({ path: ".env.local" });
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env.local first.");
const db = drizzle(neon(process.env.DATABASE_URL));
async function main() {
  for (const room of demoRooms) {
    const [existing] = await db.select({ id: rooms.id }).from(rooms).where(eq(rooms.slug, room.slug)).limit(1);
    if (existing) continue;
    const [created] = await db.insert(rooms).values({ name: room.name, slug: room.slug, backgroundColor: room.backgroundColor, sortOrder: room.sortOrder }).returning({ id: rooms.id });
    await db.insert(artworks).values(demoArtworks.filter((work) => work.roomId === room.id).map((work) => ({ roomId: created.id, imageUrl: work.imageUrl, imageWidth: work.imageWidth, imageHeight: work.imageHeight, name: work.name, creator: work.creator, year: work.year, description: work.description, size: work.size, sortOrder: work.sortOrder })));
    console.log(`Seeded ${room.name}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
