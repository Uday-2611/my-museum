"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { saveArtwork } from "@/lib/studio/actions";
import type { Artwork, ArtworkSize } from "@/lib/museum/types";

async function imageDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const result = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return result;
}
export function ArtworkForm({ roomId, work }: { roomId: string; work?: Artwork }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null), [size, setSize] = useState<ArtworkSize>(work?.size ?? "medium");
  const [error, setError] = useState(""), [busy, setBusy] = useState(false), [preview, setPreview] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const form = new FormData(event.currentTarget);
      let imageUrl = work?.imageUrl ?? "", imageWidth = work?.imageWidth ?? 0, imageHeight = work?.imageHeight ?? 0;
      if (file) {
        if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) throw new Error("Choose a JPEG, PNG, WebP or AVIF image.");
        if (file.size > 20 * 1024 * 1024) throw new Error("The image must be under 20 MB.");
        const dimensions = await imageDimensions(file);
        imageWidth = dimensions.width; imageHeight = dimensions.height;
        const blob = await upload(`artworks/${file.name}`, file, { access: "public", handleUploadUrl: "/api/upload" });
        imageUrl = blob.url;
      }
      if (!imageUrl) throw new Error("Choose an image.");
      await saveArtwork({ id: work?.id, roomId, imageUrl, imageWidth, imageHeight,
        name: String(form.get("name") ?? ""), creator: String(form.get("creator") ?? ""), year: String(form.get("year") ?? ""),
        description: String(form.get("description") ?? ""), size });
      router.push(`/studio/rooms/${roomId}`); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save the object."); setBusy(false); }
  }
  return <form className="studio-form" onSubmit={submit}><p className="eyebrow">{work ? "EDIT OBJECT" : "ADD OBJECT"}</p><h1>{work ? work.name : "Something to keep."}</h1>
    <div className="field"><label htmlFor="image">Image</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { const selected = e.target.files?.[0] ?? null; setFile(selected); if (preview) URL.revokeObjectURL(preview); setPreview(selected ? URL.createObjectURL(selected) : null); }} />{(preview || work?.imageUrl) && <Image unoptimized className="upload-preview" src={preview ?? work!.imageUrl} alt="Selected artwork" width={work?.imageWidth ?? 280} height={work?.imageHeight ?? 300} />}</div>
    <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" defaultValue={work?.name} maxLength={160} required /></div>
    <div className="field"><label htmlFor="creator">Creator / By</label><input id="creator" name="creator" defaultValue={work?.creator} maxLength={160} /></div>
    <div className="field"><label htmlFor="year">Year</label><input id="year" name="year" defaultValue={work?.year} maxLength={40} /></div>
    <div className="field"><label htmlFor="description">Short description</label><textarea id="description" name="description" defaultValue={work?.description ?? ""} maxLength={800} /></div>
    <fieldset className="field" style={{ border: 0, padding: 0 }}><legend style={{ fontSize: 11, letterSpacing: ".06em", marginBottom: 14 }}>SIZE</legend><div className="size-options">{(["small", "medium", "large", "full"] as const).map((option) => <label key={option}><input type="radio" name="size" value={option} checked={size === option} onChange={() => setSize(option)} /><span>{option.toUpperCase()}</span></label>)}</div></fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="studio-action" disabled={busy}>{busy ? "SAVING…" : work ? "SAVE OBJECT" : "ADD TO ROOM"}</button><Link className="row-link" href={`/studio/rooms/${roomId}`}>CANCEL</Link></div>
  </form>;
}
