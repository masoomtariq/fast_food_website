import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grab & Go",
  description: "A simple and intuitive food ordering app for quick and easy meals on the go.  Browse our menu, customize your order, and enjoy delicious food delivered right to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-black antialiased">{children}</body>
    </html>
  );
}
