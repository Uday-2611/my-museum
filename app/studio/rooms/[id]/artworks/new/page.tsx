import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkForm } from "@/components/studio/artwork-form";
import { requireAdmin } from "@/lib/auth/session";
import { getRoomById } from "@/lib/museum/data";
export default async function NewArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const room = await getRoomById((await params).id); if (!room) notFound();
  return <main><Link href={`/studio/rooms/${room.id}`} className="studio-back">← {room.name.toUpperCase()}</Link><ArtworkForm roomId={room.id} /></main>;
}
