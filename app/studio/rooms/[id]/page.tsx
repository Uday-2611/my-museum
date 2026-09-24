import Link from "next/link";
import { notFound } from "next/navigation";
import { SortableList } from "@/components/studio/sortable-list";
import { requireAdmin } from "@/lib/auth/session";
import { getArtworks, getRoomById } from "@/lib/museum/data";
export const dynamic = "force-dynamic";
export default async function StudioRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const room = await getRoomById((await params).id); if (!room) notFound();
  const works = await getArtworks(room.id);
  return <main><Link href="/studio" className="studio-back">← ROOMS</Link><h1 className="studio-room-title">{room.name}</h1><div className="studio-subline"><span>{String(works.length).padStart(2, "0")} OBJECTS</span><span>{room.backgroundColor}</span><Link href={`/room/${room.slug}`} target="_blank">VIEW ROOM ↗</Link></div><section className="studio-section"><div className="studio-toolbar"><span>OBJECTS / {String(works.length).padStart(2, "0")}</span><Link className="studio-action" href={`/studio/rooms/${room.id}/artworks/new`}>+ ADD OBJECT</Link></div>{works.length ? <SortableList roomId={room.id} initial={works.map((work) => ({ id: work.id, title: work.name, meta: work.size.toUpperCase(), href: `/studio/rooms/${room.id}/artworks/${work.id}`, editHref: `/studio/rooms/${room.id}/artworks/${work.id}` }))} /> : <p className="studio-empty">No objects yet. Add the first one to this room.</p>}</section></main>;
}
