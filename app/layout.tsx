import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = { title: { default: "My Museum", template: "%s — My Museum" }, description: "A personal collection of things I found worth keeping." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={GeistSans.variable} data-scroll-behavior="smooth"><body>{children}</body></html>;
}
