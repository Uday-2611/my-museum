import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete } from "@/components/studio/confirm-delete";
import { ArtworkForm } from "@/components/studio/artwork-form";
import { deleteArtwork } from "@/lib/studio/actions";
import { requireAdmin } from "@/lib/auth/session";
import { getArtworks, getRoomById } from "@/lib/museum/data";
export default async function EditArtworkPage({ params }: { params: Promise<{ id: string; artworkId: string }> }) {
  await requireAdmin(); const { id, artworkId } = await params; const room = await getRoomById(id); if (!room) notFound();
  const work = (await getArtworks(id)).find((item) => item.id === artworkId); if (!work) notFound();
  return <main><Link href={`/studio/rooms/${id}`} className="studio-back">← {room.name.toUpperCase()}</Link><ArtworkForm roomId={id} work={work} /><form action={deleteArtwork} className="studio-form" style={{ marginTop: 100 }}><input type="hidden" name="id" value={work.id} /><input type="hidden" name="roomId" value={room.id} /><ConfirmDelete message={`Delete ${work.name}? This cannot be undone.`}><button className="delete-button" type="submit">DELETE OBJECT</button></ConfirmDelete></form></main>;
}
