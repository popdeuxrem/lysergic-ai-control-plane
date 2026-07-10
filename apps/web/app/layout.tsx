import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lysergic Control Plane",
  description: "Production infrastructure for reliable AI execution on AMD hardware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
