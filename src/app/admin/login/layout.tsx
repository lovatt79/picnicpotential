import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Picnic Potential",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout overrides the parent admin layout
  // providing a clean page without the admin sidebar
  return <html lang="en"><body>{children}</body></html>;
}
