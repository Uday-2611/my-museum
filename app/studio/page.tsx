import Link from "next/link";
import { SortableList } from "@/components/studio/sortable-list";
import { requireAdmin } from "@/lib/auth/session";
import { getRooms } from "@/lib/museum/data";
export const dynamic = "force-dynamic";
export default async function StudioPage() {
  await requireAdmin();
  const rooms = await getRooms();
  return <main><h1 className="studio-title"><span>COLLECTION MANAGEMENT</span>Studio</h1><section className="studio-section"><div className="studio-toolbar"><span>ROOMS / {String(rooms.length).padStart(2, "0")}</span><Link className="studio-action" href="/studio/rooms/new">+ NEW ROOM</Link></div>{rooms.length ? <SortableList initial={rooms.map((room) => ({ id: room.id, title: room.name, meta: room.backgroundColor, href: `/studio/rooms/${room.id}`, editHref: `/studio/rooms/${room.id}/edit` }))} /> : <p className="studio-empty">No rooms yet. Create the first room to begin the collection.</p>}</section></main>;
}
