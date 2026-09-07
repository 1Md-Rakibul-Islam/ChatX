import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pulse — Real-time Chat",
  description: "A real-time 1-to-1 and group chat application.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
