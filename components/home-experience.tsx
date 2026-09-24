"use client";

import Link from "next/link";
import { useState } from "react";
import { RoomIndex } from "@/components/room-index";
import { readableText } from "@/lib/museum/color";
import type { Room } from "@/lib/museum/types";

export function HomeExperience({ rooms }: { rooms: Room[] }) {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  return <main className="home-page" style={{ backgroundColor: activeRoom?.backgroundColor ?? "#F3F3F0", color: activeRoom ? readableText(activeRoom.backgroundColor) : "#171715" }}>
    <header className="site-header"><Link href="/" className="wordmark">MY MUSEUM</Link><nav className="home-nav" aria-label="Museum navigation"><a href="#rooms" className="utility-link">INDEX <span aria-hidden="true">↘</span></a><Link href="/studio/login" className="home-studio-link">STUDIO</Link></nav></header>
    <section className="home-intro" aria-labelledby="home-title"><p className="eyebrow">AN INDEPENDENT COLLECTION</p><h1 id="home-title">A personal collection<br />of things I found<br />worth keeping.</h1><div className="intro-bottom"><p>Because apparently a portfolio wasn’t enough space for all the things I like.</p><p>Paintings, photographs, images, objects and other things I came across and wanted to keep. There is no particular system. The collection is simply divided into rooms.</p></div></section>
    <section id="rooms" aria-label="Rooms"><RoomIndex rooms={rooms} onActiveChange={setActiveRoom} /></section>
    <footer className="site-footer"><span>MY MUSEUM</span><span>A PERSONAL COLLECTION</span></footer>
  </main>;
}
