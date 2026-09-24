export type ArtworkSize = "small" | "medium" | "large" | "full";
export type Room = { id: string; name: string; slug: string; backgroundColor: string; sortOrder: number };
export type Artwork = { id: string; roomId: string; imageUrl: string; imageWidth: number; imageHeight: number; name: string; creator: string; year: string; description: string | null; size: ArtworkSize; sortOrder: number };
