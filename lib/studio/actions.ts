"use server";

import { del } from "@vercel/blob";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { artworks, rooms } from "@/lib/db/schema";
import { isValidHex, slugify } from "@/lib/museum/color";
import type { ArtworkSize } from "@/lib/museum/types";

function textField(form: FormData, name: string) { return String(form.get(name) ?? "").trim(); }
function validateRoom(name: string, color: string) {
  if (!name || name.length > 80) throw new Error("Enter a room name under 80 characters.");
  if (!isValidHex(color)) throw new Error("Enter a six-digit HEX color.");
}
async function uniqueSlug(name: string, exceptId?: string) {
  const base = slugify(name);
  const existing = await getDatabase().select({ id: rooms.id, slug: rooms.slug }).from(rooms);
  const taken = new Set(existing.filter((room) => room.id !== exceptId).map((room) => room.slug));
  let result = base, suffix = 2;
  while (taken.has(result)) result = `${base}-${suffix++}`;
  return result;
}
export async function createRoom(form: FormData) {
  await requireAdmin();
  const name = textField(form, "name"), backgroundColor = textField(form, "backgroundColor").toUpperCase();
  validateRoom(name, backgroundColor);
  const db = getDatabase();
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(rooms);
  const [room] = await db.insert(rooms).values({ name, slug: await uniqueSlug(name), backgroundColor, sortOrder: count }).returning({ id: rooms.id });
  revalidatePath("/");
  redirect(`/studio/rooms/${room.id}`);
}
export async function updateRoom(form: FormData) {
  await requireAdmin();
  const id = textField(form, "id"), name = textField(form, "name"), backgroundColor = textField(form, "backgroundColor").toUpperCase();
  validateRoom(name, backgroundColor);
  const [oldRoom] = await getDatabase().select().from(rooms).where(eq(rooms.id, id)).limit(1);
  if (!oldRoom) throw new Error("Room not found.");
  const slug = await uniqueSlug(name, id);
  await getDatabase().update(rooms).set({ name, slug, backgroundColor }).where(eq(rooms.id, id));
  revalidatePath("/"); revalidatePath(`/room/${oldRoom.slug}`); revalidatePath(`/room/${slug}`);
  redirect(`/studio/rooms/${id}`);
}
export async function deleteRoom(form: FormData) {
  await requireAdmin();
  const id = textField(form, "id"), db = getDatabase();
  const [room] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  if (!room) throw new Error("Room not found.");
  const works = await db.select({ imageUrl: artworks.imageUrl }).from(artworks).where(eq(artworks.roomId, id));
  await db.delete(rooms).where(eq(rooms.id, id));
  const urls = works.map((work) => work.imageUrl).filter(isBlobUrl);
  if (urls.length) await del(urls);
  revalidatePath("/"); revalidatePath(`/room/${room.slug}`);
  redirect("/studio");
}

export type ArtworkInput = { id?: string; roomId: string; imageUrl: string; imageWidth: number; imageHeight: number; name: string; creator: string; year: string; description: string; size: ArtworkSize };
function isBlobUrl(url: string) { try { const host = new URL(url).hostname; return host === "public.blob.vercel-storage.com" || host.endsWith(".public.blob.vercel-storage.com"); } catch { return false; } }
export async function saveArtwork(input: ArtworkInput) {
  await requireAdmin();
  const db = getDatabase();
  const [room] = await db.select().from(rooms).where(eq(rooms.id, input.roomId)).limit(1);
  if (!room) throw new Error("Room not found.");
  const name = input.name.trim(), creator = input.creator.trim(), year = input.year.trim(), description = input.description.trim();
  if (!name || name.length > 160) throw new Error("Enter a name under 160 characters.");
  if (creator.length > 160 || year.length > 40 || description.length > 800) throw new Error("One of the text fields is too long.");
  if (!["small", "medium", "large", "full"].includes(input.size)) throw new Error("Choose a size.");
  if (!Number.isInteger(input.imageWidth) || !Number.isInteger(input.imageHeight) || input.imageWidth < 1 || input.imageHeight < 1) throw new Error("Image dimensions are invalid.");
  if (!input.imageUrl.startsWith("/demo/") && !isBlobUrl(input.imageUrl)) throw new Error("Upload an image first.");
  let oldUrl: string | null = null;
  if (input.id) {
    const [existing] = await db.select().from(artworks).where(and(eq(artworks.id, input.id), eq(artworks.roomId, input.roomId))).limit(1);
    if (!existing) throw new Error("Object not found.");
    oldUrl = existing.imageUrl;
    await db.update(artworks).set({ imageUrl: input.imageUrl, imageWidth: input.imageWidth, imageHeight: input.imageHeight, name, creator, year, description: description || null, size: input.size }).where(eq(artworks.id, input.id));
  } else {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(artworks).where(eq(artworks.roomId, room.id));
    await db.insert(artworks).values({ roomId: room.id, imageUrl: input.imageUrl, imageWidth: input.imageWidth, imageHeight: input.imageHeight, name, creator, year, description: description || null, size: input.size, sortOrder: count });
  }
  if (oldUrl && oldUrl !== input.imageUrl && isBlobUrl(oldUrl)) await del(oldUrl);
  revalidatePath(`/room/${room.slug}`); revalidatePath(`/studio/rooms/${room.id}`);
  return { roomId: room.id };
}
export async function deleteArtwork(form: FormData) {
  await requireAdmin();
  const id = textField(form, "id"), roomId = textField(form, "roomId"), db = getDatabase();
  const [work] = await db.select().from(artworks).where(and(eq(artworks.id, id), eq(artworks.roomId, roomId))).limit(1);
  if (!work) throw new Error("Object not found.");
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  await db.delete(artworks).where(eq(artworks.id, id));
  if (isBlobUrl(work.imageUrl)) await del(work.imageUrl);
  if (room) revalidatePath(`/room/${room.slug}`);
  revalidatePath(`/studio/rooms/${roomId}`);
  redirect(`/studio/rooms/${roomId}`);
}
async function reorder(table: typeof rooms | typeof artworks, ids: string[], roomId?: string) {
  if (!ids.length || ids.length > 500 || new Set(ids).size !== ids.length) throw new Error("Invalid order.");
  const db = getDatabase();
  if (table === rooms) {
    const records = await db.select({ id: rooms.id }).from(rooms).orderBy(asc(rooms.sortOrder));
    if (records.length !== ids.length || records.some((record) => !ids.includes(record.id))) throw new Error("Room list changed. Refresh and try again.");
    const cases = ids.map((id, i) => sql`when ${id}::uuid then ${i}`);
    await db.update(rooms).set({ sortOrder: sql`case ${rooms.id} ${sql.join(cases, sql` `)} end` }).where(inArray(rooms.id, ids));
  } else {
    if (!roomId) throw new Error("Room is required.");
    const records = await db.select({ id: artworks.id }).from(artworks).where(eq(artworks.roomId, roomId));
    if (records.length !== ids.length || records.some((record) => !ids.includes(record.id))) throw new Error("Object list changed. Refresh and try again.");
    const cases = ids.map((id, i) => sql`when ${id}::uuid then ${i}`);
    await db.update(artworks).set({ sortOrder: sql`case ${artworks.id} ${sql.join(cases, sql` `)} end` }).where(and(eq(artworks.roomId, roomId), inArray(artworks.id, ids)));
  }
}
export async function reorderRooms(ids: string[]) { await requireAdmin(); await reorder(rooms, ids); revalidatePath("/"); revalidatePath("/studio"); }
export async function reorderArtworks(roomId: string, ids: string[]) {
  await requireAdmin(); await reorder(artworks, ids, roomId);
  const [room] = await getDatabase().select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (room) revalidatePath(`/room/${room.slug}`);
  revalidatePath(`/studio/rooms/${roomId}`);
}
