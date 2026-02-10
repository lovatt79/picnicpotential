import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts for dashboard stats
  const [
    { count: servicesCount },
    { count: seatingCount },
    { count: partnersCount },
    { count: testimonialsCount },
    { count: faqsCount },
    { count: submissionsCount },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("seating_options").select("*", { count: "exact", head: true }),
    supabase.from("vendor_partners").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("form_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Services", count: servicesCount ?? 0, href: "/admin/services", color: "bg-sage" },
    { label: "Seating Options", count: seatingCount ?? 0, href: "/admin/seating", color: "bg-blush" },
    { label: "Partners", count: partnersCount ?? 0, href: "/admin/partners", color: "bg-lavender" },
    { label: "Testimonials", count: testimonialsCount ?? 0, href: "/admin/testimonials", color: "bg-peach" },
    { label: "FAQs", count: faqsCount ?? 0, href: "/admin/faqs", color: "bg-sky" },
    { label: "New Submissions", count: submissionsCount ?? 0, href: "/admin/submissions", color: "bg-gold" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
        <p className="text-warm-gray mt-1">Welcome to the Picnic Potential admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-2xl font-bold text-charcoal">{stat.count}</span>
            </div>
            <p className="text-sm text-warm-gray">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-charcoal mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/services/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-sage-light transition-colors"
            >
              <span className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-sm text-charcoal">Add New Service</span>
            </Link>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-peach-light transition-colors"
            >
              <span className="w-8 h-8 bg-peach rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-sm text-charcoal">Add New Testimonial</span>
            </Link>
            <Link
              href="/admin/faqs/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-light transition-colors"
            >
              <span className="w-8 h-8 bg-sky rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-sm text-charcoal">Add New FAQ</span>
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold-light transition-colors"
            >
              <span className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <span className="text-sm text-charcoal">View All Submissions</span>
            </Link>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-charcoal">Recent Submissions</h2>
            <Link href="/admin/submissions" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          {recentSubmissions && recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/admin/submissions/${submission.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {submission.first_name} {submission.last_name}
                    </p>
                    <p className="text-xs text-warm-gray">
                      {submission.event_type} &bull; {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      submission.status === "new"
                        ? "bg-gold text-charcoal"
                        : submission.status === "contacted"
                        ? "bg-sky text-charcoal"
                        : submission.status === "confirmed"
                        ? "bg-sage text-charcoal"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {submission.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-warm-gray text-sm">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
