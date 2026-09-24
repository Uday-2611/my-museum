import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { getArtworks, getRoom, getRooms } from "@/lib/museum/data";
import { readableText } from "@/lib/museum/color";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const room = await getRoom((await params).slug);
  return { title: room?.name ?? "Room" };
}
export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const room = await getRoom((await params).slug);
  if (!room) notFound();
  const [allRooms, works] = await Promise.all([getRooms(), getArtworks(room.id)]);
  const position = allRooms.findIndex((item) => item.id === room.id);
  const next = allRooms.length > 1 ? allRooms[(position + 1) % allRooms.length] : null;
  return <main className="room-page" style={{ backgroundColor: room.backgroundColor, color: readableText(room.backgroundColor) }}>
    <header className="site-header room-header"><Link href="/" className="wordmark">MY MUSEUM</Link><Link href="/#rooms" className="utility-link">INDEX <span aria-hidden="true">↗</span></Link></header>
    <div className="room-opening"><p className="eyebrow">ROOM {String(position + 1).padStart(2, "0")} / {String(allRooms.length).padStart(2, "0")}</p><h1>{room.name}</h1><p className="room-count">{String(works.length).padStart(2, "0")} {works.length === 1 ? "OBJECT" : "OBJECTS"}</p></div>
    <ArtworkGallery artworks={works} />
    <footer className="room-footer"><Link href="/#rooms">← ALL ROOMS</Link>{next && <Link href={`/room/${next.slug}`}>NEXT ROOM <span>{next.name.toUpperCase()} ↗</span></Link>}</footer>
  </main>;
}
