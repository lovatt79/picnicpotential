"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const statusColors: Record<string, string> = {
  new: "bg-gold text-charcoal",
  contacted: "bg-sky text-charcoal",
  quoted: "bg-lavender text-charcoal",
  confirmed: "bg-sage text-charcoal",
  completed: "bg-gray-500 text-white",
  cancelled: "bg-red-200 text-red-800",
};

type Tab = "all" | "service" | "wedding" | "proposal";

interface ServiceSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  event_type: string | null;
  event_date: string | null;
  status: string;
  created_at: string;
  _type: "service";
}

interface WeddingSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  package: string | null;
  event_date: string | null;
  status: string;
  created_at: string;
  couple_name_1: string | null;
  couple_name_2: string | null;
  _type: "wedding";
}

interface ProposalSubmissionRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  package: string | null;
  proposal_date_1: string | null;
  proposee_name: string | null;
  status: string;
  created_at: string;
  _type: "proposal";
}

type Submission = ServiceSubmission | WeddingSubmission | ProposalSubmissionRow;

export default function SubmissionsPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("all");
  const [serviceSubmissions, setServiceSubmissions] = useState<ServiceSubmission[]>([]);
  const [weddingSubmissions, setWeddingSubmissions] = useState<WeddingSubmission[]>([]);
  const [proposalSubmissions, setProposalSubmissions] = useState<ProposalSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [svcRes, wsRes, propRes] = await Promise.all([
        supabase
          .from("form_submissions")
          .select("id, first_name, last_name, email, event_type, event_date, status, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("ws_submissions")
          .select("id, first_name, last_name, email, package, event_date, status, created_at, couple_name_1, couple_name_2")
          .order("created_at", { ascending: false }),
        supabase
          .from("proposal_submissions")
          .select("id, first_name, last_name, email, package, proposal_date_1, proposee_name, status, created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (svcRes.data) {
        setServiceSubmissions(svcRes.data.map((s) => ({ ...s, _type: "service" as const })));
      }
      if (wsRes.data) {
        setWeddingSubmissions(wsRes.data.map((s) => ({ ...s, _type: "wedding" as const })));
      }
      if (propRes.data) {
        setProposalSubmissions(propRes.data.map((s) => ({ ...s, _type: "proposal" as const })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const displayed: Submission[] =
    tab === "service"
      ? serviceSubmissions
      : tab === "wedding"
      ? weddingSubmissions
      : tab === "proposal"
      ? proposalSubmissions
      : [...serviceSubmissions, ...weddingSubmissions, ...proposalSubmissions].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

  const totalCount = serviceSubmissions.length + weddingSubmissions.length + proposalSubmissions.length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All Requests", count: totalCount },
    { key: "service", label: "Service Requests", count: serviceSubmissions.length },
    { key: "wedding", label: "Wedding Suite", count: weddingSubmissions.length },
    { key: "proposal", label: "Proposals", count: proposalSubmissions.length },
  ];

  const getEventDate = (sub: Submission): string | null => {
    if (sub._type === "proposal") return (sub as ProposalSubmissionRow).proposal_date_1;
    return (sub as ServiceSubmission | WeddingSubmission).event_date;
  };

  const getDetails = (sub: Submission): string => {
    if (sub._type === "service") return (sub as ServiceSubmission).event_type || "\u2014";
    if (sub._type === "wedding") return (sub as WeddingSubmission).package || "\u2014";
    return (sub as ProposalSubmissionRow).package || "\u2014";
  };

  const getDetailLink = (sub: Submission): string => {
    if (sub._type === "wedding") return `/admin/submissions/wedding-suite/${sub.id}`;
    if (sub._type === "proposal") return `/admin/submissions/proposal/${sub.id}`;
    return `/admin/submissions/${sub.id}`;
  };

  const getTypeBadge = (sub: Submission) => {
    if (sub._type === "wedding") return { className: "bg-pink-100 text-pink-700", label: "Wedding Suite" };
    if (sub._type === "proposal") return { className: "bg-rose-100 text-rose-700", label: "Proposal" };
    if (sub._type === "service" && (sub as ServiceSubmission).event_type === "Send a Hint") {
      return { className: "bg-amber-100 text-amber-700", label: "Hint" };
    }
    return { className: "bg-blue-100 text-blue-700", label: "Service" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Form Submissions</h1>
        <p className="text-warm-gray mt-1">View and manage service requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-gold text-charcoal"
                : "border-transparent text-warm-gray hover:text-charcoal hover:border-gray-300"
            }`}
          >
            {t.label}
            <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${
              tab === t.key ? "bg-gold/10 text-gold-dark" : "bg-gray-100 text-warm-gray"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Event Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-warm-gray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayed.map((sub) => {
                const badge = getTypeBadge(sub);
                const eventDate = getEventDate(sub);
                return (
                  <tr key={`${sub._type}-${sub.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-charcoal">{sub.first_name} {sub.last_name}</div>
                        <div className="text-sm text-warm-gray">{sub.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {getDetails(sub)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {eventDate ? new Date(eventDate).toLocaleDateString() : "\u2014"}
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
                        href={getDetailLink(sub)}
                        className="text-gold hover:text-charcoal text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No submissions yet</h3>
          <p className="text-warm-gray">When customers submit request forms, their submissions will appear here.</p>
        </div>
      )}
    </div>
  );
}
