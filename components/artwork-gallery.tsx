import Image from "next/image";
import type { Artwork } from "@/lib/museum/types";

export function ArtworkGallery({ artworks }: { artworks: Artwork[] }) {
  if (!artworks.length) return <p className="gallery-empty">This room is waiting for its first object.</p>;
  return <div className="artwork-gallery">{artworks.map((work, index) => <figure key={work.id} className={`artwork artwork-${work.size} artwork-position-${index % 4}`}>
    <Image src={work.imageUrl} alt={work.name} width={work.imageWidth} height={work.imageHeight} sizes={work.size === "full" ? "(max-width: 700px) 100vw, 94vw" : work.size === "large" ? "(max-width: 700px) 90vw, 72vw" : work.size === "medium" ? "(max-width: 700px) 76vw, 48vw" : "(max-width: 700px) 60vw, 30vw"} priority={index === 0} className="artwork-image" />
    <figcaption><span className="artwork-title">{work.name}</span><span className="artwork-credit">{[work.creator, work.year].filter(Boolean).join(", ")}</span>{work.description && <p className="artwork-description">{work.description}</p>}</figcaption>
  </figure>)}</div>;
}
