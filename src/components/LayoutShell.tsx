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
      <Navbar navItems={navItems} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
