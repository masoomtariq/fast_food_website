import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grab & Go | Fast Food",
  description:
    "Grab & Go is a bright, playful fast food ordering experience inspired by the brand logo palette of red, orange, yellow, and blue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)] antialiased">{children}</body>
    </html>
  );
}
