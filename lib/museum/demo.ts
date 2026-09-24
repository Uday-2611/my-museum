import type { Artwork, Room } from "./types";

export const demoRooms: Room[] = [
  { id: "demo-blue", name: "Blue", slug: "blue", backgroundColor: "#1D3FFF", sortOrder: 0 },
  { id: "demo-night", name: "Night", slug: "night", backgroundColor: "#090909", sortOrder: 1 },
  { id: "demo-stillness", name: "Stillness", slug: "stillness", backgroundColor: "#EEEAE3", sortOrder: 2 },
];

const entries: Record<string, Array<[string, string, string, Artwork["size"], number, number, string]>> = {
  blue: [
    ["Blue Study, No. 1", "My Museum", "2026", "small", 720, 960, "/demo/blue-portrait.svg"],
    ["Across the Water", "My Museum", "2026", "large", 1400, 900, "/demo/blue-landscape.svg"],
    ["Ultramarine Window", "My Museum", "2026", "medium", 850, 1050, "/demo/blue-window.svg"],
    ["A Blue Interval", "My Museum", "2026", "full", 1600, 760, "/demo/blue-full.svg"],
  ],
  night: [
    ["After Hours", "My Museum", "2026", "medium", 850, 1050, "/demo/night-window.svg"],
    ["Last Light", "My Museum", "2026", "small", 720, 960, "/demo/night-portrait.svg"],
    ["Dark Horizon", "My Museum", "2026", "full", 1600, 760, "/demo/night-full.svg"],
    ["Quiet Street", "My Museum", "2026", "large", 1400, 900, "/demo/night-landscape.svg"],
  ],
  stillness: [
    ["The Space Between", "My Museum", "2026", "small", 720, 960, "/demo/still-portrait.svg"],
    ["Morning Wall", "My Museum", "2026", "large", 1400, 900, "/demo/still-landscape.svg"],
    ["Study in Light", "My Museum", "2026", "medium", 850, 1050, "/demo/still-window.svg"],
    ["Still Room", "My Museum", "2026", "full", 1600, 760, "/demo/still-full.svg"],
  ],
};

export const demoArtworks: Artwork[] = demoRooms.flatMap((room) => entries[room.slug].map(([name, creator, year, size, imageWidth, imageHeight, imageUrl], sortOrder) => ({
  id: `${room.slug}-${sortOrder}`, roomId: room.id, imageUrl, imageWidth, imageHeight, name, creator, year,
  description: null, size, sortOrder,
})));
