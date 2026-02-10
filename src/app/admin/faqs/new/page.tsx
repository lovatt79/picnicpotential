"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewFAQPage() {
  const router = useRouter();
  const supabase = createClient();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("faqs").insert({ question, answer, is_published: isPublished });
    if (error) { setError(error.message); setSaving(false); }
    else { router.push("/admin/faqs"); router.refresh(); }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/faqs" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to FAQs
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">New FAQ</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Question *</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" placeholder="What question do customers ask?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Answer *</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} required rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none" placeholder="Provide the answer..." />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
            <span className="text-sm text-charcoal">Published</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <button type="submit" disabled={saving} className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50">{saving ? "Saving..." : "Create FAQ"}</button>
          <Link href="/admin/faqs" className="text-warm-gray hover:text-charcoal">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
