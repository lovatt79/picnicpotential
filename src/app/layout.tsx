import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: navRows } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  // Build tree: top-level items with nested children
  const allItems = navRows ?? [];
  const navItems = allItems
    .filter((item) => item.parent_id === null)
    .map((parent) => ({
      id: parent.id as string,
      label: parent.label as string,
      href: parent.href as string,
      open_in_new_tab: parent.open_in_new_tab as boolean,
      children: allItems
        .filter((child) => child.parent_id === parent.id)
        .map((child) => ({
          id: child.id as string,
          label: child.label as string,
          href: child.href as string,
          open_in_new_tab: child.open_in_new_tab as boolean,
        })),
    }));

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <LayoutShell navItems={navItems}>{children}</LayoutShell>
      </body>
    </html>
  );
}
