import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sticky Ticky — Stick Your Style",
  description: "Discover stickers, sticker sheets, card stickers, and more with Sticky Ticky.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
