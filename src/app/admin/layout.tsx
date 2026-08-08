import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHelpPanel from "@/components/admin/AdminHelpPanel";

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled by middleware, no need to check here
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
      <AdminHelpPanel />
    </div>
  );
}
