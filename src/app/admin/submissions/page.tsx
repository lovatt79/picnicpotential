import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const statusColors: Record<string, string> = {
  new: "bg-gold text-charcoal",
  contacted: "bg-sky text-charcoal",
  quoted: "bg-lavender text-charcoal",
  confirmed: "bg-sage text-charcoal",
  completed: "bg-gray-500 text-white",
  cancelled: "bg-red-200 text-red-800",
};

export default async function SubmissionsPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Form Submissions</h1>
        <p className="text-warm-gray mt-1">View and manage service requests</p>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Event Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-warm-gray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-charcoal">{sub.first_name} {sub.last_name}</div>
                      <div className="text-sm text-warm-gray">{sub.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                    {sub.event_type || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                    {sub.event_date ? new Date(sub.event_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[sub.status] || "bg-gray-200"}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-warm-gray">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/admin/submissions/${sub.id}`}
                      className="text-gold hover:text-charcoal text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No submissions yet</h3>
          <p className="text-warm-gray">When customers submit the request form, their submissions will appear here.</p>
        </div>
      )}
    </div>
  );
}
