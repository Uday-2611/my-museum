export function isValidHex(value: string): boolean { return /^#[0-9a-fA-F]{6}$/.test(value); }
export function readableText(hex: string): "#171715" | "#F7F7F4" {
  if (!isValidHex(hex)) return "#171715";
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? "#171715" : "#F7F7F4";
}
export function slugify(name: string) { return name.normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "room"; }
