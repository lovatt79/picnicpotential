"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { WsSubmission, SubmissionStatus } from "@/lib/supabase/types";

const statuses: SubmissionStatus[] = ["new", "contacted", "quoted", "confirmed", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  new: "bg-gold text-charcoal",
  contacted: "bg-sky text-charcoal",
  quoted: "bg-lavender text-charcoal",
  confirmed: "bg-sage text-charcoal",
  completed: "bg-gray-500 text-white",
  cancelled: "bg-red-200 text-red-800",
};

export default function WeddingSuiteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [submission, setSubmission] = useState<WsSubmission | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("ws_submissions").select("*").eq("id", params.id).single();
      if (!data) { router.push("/admin/submissions"); return; }
      setSubmission(data);
      setStatus(data.status as SubmissionStatus);
      setAdminNotes(data.admin_notes || "");
      setLoading(false);
    }
    load();
  }, [params.id, router, supabase]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("ws_submissions").update({ status, admin_notes: adminNotes }).eq("id", params.id);
    setSaving(false);
    router.refresh();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div></div>;
  if (!submission) return null;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="font-serif text-lg text-charcoal mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex">
      <span className="w-44 text-sm text-warm-gray">{label}:</span>
      <span className="text-sm text-charcoal">{value || "—"}</span>
    </div>
  );

  const renderJsonList = (items: { label: string; quantity?: number; price?: number | null }[] | null | undefined) => {
    if (!items || !Array.isArray(items) || items.length === 0) return <span className="text-sm text-warm-gray">None selected</span>;
    return (
      <ul className="text-sm text-warm-gray list-disc list-inside">
        {items.map((item, i) => (
          <li key={i}>
            {item.label}{item.quantity ? ` (x${item.quantity})` : ""}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/submissions" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Submissions
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl text-charcoal">{submission.first_name} {submission.last_name}</h1>
              <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">Wedding Suite</span>
            </div>
            <p className="text-warm-gray mt-1">Submitted {new Date(submission.created_at).toLocaleString()}</p>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${statusColors[submission.status]}`}>{submission.status}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Section title="Contact Information">
              <Field label="Name" value={`${submission.first_name} ${submission.last_name}`} />
              <Field label="Email" value={submission.email} />
              <Field label="Phone" value={submission.phone} />
            </Section>

            <Section title="The Couple">
              <Field label="Partner 1" value={submission.couple_name_1} />
              <Field label="Partner 2" value={submission.couple_name_2} />
            </Section>

            <Section title="Venue Details">
              <Field label="Venue Name" value={submission.venue_name} />
              <Field label="Venue Address" value={submission.venue_address} />
              <Field label="Venue Contact" value={submission.venue_contact_name} />
              <Field label="Contact Email" value={submission.venue_contact_email} />
              <Field label="Contact Phone" value={submission.venue_contact_phone} />
            </Section>

            <Section title="Event Timing">
              <Field label="Wedding Date" value={submission.event_date ? new Date(submission.event_date).toLocaleDateString() : null} />
              <Field label="Arrival Time" value={submission.arrival_time} />
              <Field label="Suite Access Time" value={submission.suite_access_time} />
              <Field label="Party Size" value={submission.people_count} />
            </Section>

            <Section title="Package">
              <Field label="Selected Package" value={submission.package} />
            </Section>

            <Section title="Food & Drinks">
              {renderJsonList(submission.food_options as { label: string }[])}
            </Section>

            <Section title="Add-ons">
              {renderJsonList(submission.addon_options as { label: string }[])}
            </Section>

            <Section title="Wedding Party Gifts">
              {renderJsonList(submission.gift_options as { label: string }[])}
            </Section>

            {submission.swap_request && (
              <Section title="Swap Requests">
                <p className="text-sm text-charcoal whitespace-pre-wrap">{submission.swap_request}</p>
              </Section>
            )}

            <Section title="Attribution">
              <Field label="How They Heard" value={submission.how_did_you_hear} />
              {submission.how_did_you_hear_other && <Field label="Other" value={submission.how_did_you_hear_other} />}
            </Section>

            {submission.notes && (
              <Section title="Customer Notes">
                <p className="text-sm text-charcoal whitespace-pre-wrap">{submission.notes}</p>
              </Section>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
            <h3 className="font-serif text-lg text-charcoal mb-4">Update Status</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Internal notes about this submission..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-charcoal text-white py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
