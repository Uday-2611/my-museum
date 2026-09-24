import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { artworks, rooms } from "@/lib/db/schema";
import { demoArtworks, demoRooms } from "./demo";
import type { Artwork, Room } from "./types";

export async function getRooms(): Promise<Room[]> {
  if (!process.env.DATABASE_URL) return demoRooms;
  return getDatabase().select().from(rooms).orderBy(asc(rooms.sortOrder), asc(rooms.createdAt));
}
export async function getRoom(slug: string): Promise<Room | null> {
  if (!process.env.DATABASE_URL) return demoRooms.find((room) => room.slug === slug) ?? null;
  const [room] = await getDatabase().select().from(rooms).where(eq(rooms.slug, slug)).limit(1);
  return room ?? null;
}
export async function getRoomById(id: string): Promise<Room | null> {
  const [room] = await getDatabase().select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return room ?? null;
}
export async function getArtworks(roomId: string): Promise<Artwork[]> {
  if (!process.env.DATABASE_URL) return demoArtworks.filter((work) => work.roomId === roomId);
  return getDatabase().select().from(artworks).where(eq(artworks.roomId, roomId)).orderBy(asc(artworks.sortOrder), asc(artworks.createdAt));
}
