"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  open_in_new_tab: boolean;
  children: {
    id: string;
    label: string;
    href: string;
    open_in_new_tab: boolean;
  }[];
}

export default function LayoutShell({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems?: NavItem[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-charcoal focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar navItems={navItems} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
