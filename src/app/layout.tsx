import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import LayoutShell from "@/components/LayoutShell";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Picnic Potential | Luxury Picnics & Events in Sonoma County",
    template: "%s | Picnic Potential",
  },
  description:
    "A truly unique picnic and event experience that comes in a variety of styles that fit any occasion. Serving Sonoma County wine country.",
  keywords: [
    "luxury picnic",
    "Sonoma County",
    "wine country",
    "event planning",
    "picnic setup",
    "corporate events",
    "proposals",
    "tablescapes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
