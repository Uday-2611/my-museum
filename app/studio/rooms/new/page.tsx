import Link from "next/link";
import { ColorInput } from "@/components/studio/color-input";
import { createRoom } from "@/lib/studio/actions";
import { requireAdmin } from "@/lib/auth/session";
export default async function NewRoomPage() { await requireAdmin(); return <main><Link href="/studio" className="studio-back">← ROOMS</Link><form action={createRoom} className="studio-form"><p className="eyebrow">NEW ROOM</p><h1>A new space.</h1><div className="field"><label htmlFor="name">Room name</label><input id="name" name="name" maxLength={80} required autoFocus placeholder="Blue" /></div><ColorInput /><div className="form-actions"><button className="studio-action" type="submit">CREATE ROOM</button><Link className="row-link" href="/studio">CANCEL</Link></div></form></main>; }
