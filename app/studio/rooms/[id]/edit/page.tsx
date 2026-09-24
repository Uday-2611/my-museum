import Link from "next/link";
import { notFound } from "next/navigation";
import { ColorInput } from "@/components/studio/color-input";
import { ConfirmDelete } from "@/components/studio/confirm-delete";
import { deleteRoom, updateRoom } from "@/lib/studio/actions";
import { requireAdmin } from "@/lib/auth/session";
import { getRoomById } from "@/lib/museum/data";
export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const room = await getRoomById((await params).id); if (!room) notFound();
  return <main><Link href={`/studio/rooms/${room.id}`} className="studio-back">← {room.name.toUpperCase()}</Link><form action={updateRoom} className="studio-form"><input type="hidden" name="id" value={room.id} /><p className="eyebrow">EDIT ROOM</p><h1>{room.name}</h1><div className="field"><label htmlFor="name">Room name</label><input id="name" name="name" defaultValue={room.name} maxLength={80} required /></div><ColorInput initial={room.backgroundColor} /><div className="form-actions"><button type="submit" className="studio-action">SAVE ROOM</button><Link className="row-link" href={`/studio/rooms/${room.id}`}>CANCEL</Link></div></form><form action={deleteRoom} className="studio-form" style={{ marginTop: 100 }}><input type="hidden" name="id" value={room.id} /><ConfirmDelete message={`Delete ${room.name} and all objects in this room? This cannot be undone.`}><button className="delete-button" type="submit">DELETE ROOM</button></ConfirmDelete></form></main>;
}
