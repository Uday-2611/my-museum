"use client";
import Link from "next/link";
import type { Room } from "@/lib/museum/types";

export function RoomIndex({ rooms, onActiveChange }: { rooms: Room[]; onActiveChange: (room: Room | null) => void }) {
  return <div className="index-stage">
    <div className="index-stage-inner">
      <div className="section-topline"><span>ROOMS</span><span>{String(rooms.length).padStart(2, "0")} SPACES</span></div>
      {rooms.length ? <ol className="room-index">{rooms.map((room, i) => <li key={room.id}>
        <Link href={`/room/${room.slug}`} onMouseEnter={() => onActiveChange(room)} onMouseLeave={() => onActiveChange(null)} onFocus={() => onActiveChange(room)} onBlur={() => onActiveChange(null)}>
          <span className="room-number">{String(i + 1).padStart(2, "0")}</span><span className="room-name">{room.name}</span><span className="room-arrow" aria-hidden="true">↗</span><span className="room-swatch" style={{ backgroundColor: room.backgroundColor }} />
        </Link>
      </li>)}</ol> : <p className="empty-room-note">The rooms are being prepared.</p>}
    </div>
  </div>;
}
