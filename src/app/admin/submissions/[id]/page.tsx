"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { FormSubmission, SubmissionStatus } from "@/lib/supabase/types";

const statuses: SubmissionStatus[] = ["new", "contacted", "quoted", "confirmed", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  new: "bg-gold text-charcoal",
  contacted: "bg-sky text-charcoal",
  quoted: "bg-lavender text-charcoal",
  confirmed: "bg-sage text-charcoal",
  completed: "bg-gray-500 text-white",
  cancelled: "bg-red-200 text-red-800",
};

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("form_submissions").select("*").eq("id", params.id).single();
      if (!data) { router.push("/admin/submissions"); return; }
      setSubmission(data);
      setStatus(data.status);
      setAdminNotes(data.admin_notes || "");
      setLoading(false);
    }
    load();
  }, [params.id, router, supabase]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("form_submissions").update({ status, admin_notes: adminNotes }).eq("id", params.id);
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
      <span className="w-40 text-sm text-warm-gray">{label}:</span>
      <span className="text-sm text-charcoal">{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/submissions" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Submissions
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-charcoal">{submission.first_name} {submission.last_name}</h1>
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

            <Section title="Event Details">
              <Field label="Event Type" value={submission.event_type} />
              <Field label="Event Date" value={submission.event_date ? new Date(submission.event_date).toLocaleDateString() : null} />
              <Field label="Backup Date" value={submission.backup_date ? new Date(submission.backup_date).toLocaleDateString() : null} />
              <Field label="Event Time" value={submission.event_time} />
              <Field label="Additional Time" value={submission.additional_time} />
              <Field label="Occasion" value={submission.occasion} />
              <Field label="City" value={submission.city} />
              <Field label="Location" value={submission.exact_location} />
              <Field label="Group Size" value={submission.group_size} />
              <Field label="Guest Names" value={submission.guest_names} />
            </Section>

            <Section title="Color Choices">
              <Field label="1st Choice" value={submission.color_choice_1} />
              {submission.color_choice_1_other && <Field label="1st Choice Other" value={submission.color_choice_1_other} />}
              <Field label="2nd Choice" value={submission.color_choice_2} />
              {submission.color_choice_2_other && <Field label="2nd Choice Other" value={submission.color_choice_2_other} />}
            </Section>

            {(submission.food_options?.length > 0 || submission.dessert_options?.length > 0 || submission.addon_options?.length > 0) && (
              <Section title="Selections">
                {submission.food_options?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-charcoal mb-1">Food:</p>
                    <ul className="text-sm text-warm-gray list-disc list-inside">{submission.food_options.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {submission.dessert_options?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-charcoal mb-1">Desserts:</p>
                    <ul className="text-sm text-warm-gray list-disc list-inside">{submission.dessert_options.map((d, i) => <li key={i}>{d}</li>)}</ul>
                    {submission.dessert_other && <p className="text-sm text-warm-gray mt-1">Other: {submission.dessert_other}</p>}
                  </div>
                )}
                {submission.addon_options?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-charcoal mb-1">Add-ons:</p>
                    <ul className="text-sm text-warm-gray list-disc list-inside">{submission.addon_options.map((a, i) => <li key={i}>{a}</li>)}</ul>
                  </div>
                )}
              </Section>
            )}

            <Section title="Attribution">
              <Field label="How They Heard" value={submission.how_did_you_hear} />
              {submission.how_did_you_hear_other && <Field label="Other" value={submission.how_did_you_hear_other} />}
              {submission.referred_by && <Field label="Referred By" value={submission.referred_by} />}
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
