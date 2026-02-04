"use client";

import { useState } from "react";

export default function SendAHintPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    occasion: "",
    message: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "hint" }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-32">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <svg className="mx-auto h-16 w-16 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-6 font-serif text-3xl text-charcoal">Hint Sent!</h2>
          <p className="mt-4 text-warm-gray">
            Your hint has been sent. We hope it leads to a wonderful surprise!
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Send a Hint</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            Want someone special to know about Picnic Potential? Drop a hint and
            we&apos;ll send them a friendly message about our services.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-charcoal">Your Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.senderName}
                  onChange={(e) => updateField("senderName", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.senderEmail}
                  onChange={(e) => updateField("senderEmail", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <h2 className="mt-8 font-serif text-2xl text-charcoal">Recipient Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Their Name *</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => updateField("recipientName", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Their Email *</label>
                <input
                  type="email"
                  required
                  value={formData.recipientEmail}
                  onChange={(e) => updateField("recipientEmail", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Occasion</label>
                <select
                  value={formData.occasion}
                  onChange={(e) => updateField("occasion", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="">Select an occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Date Night">Date Night</option>
                  <option value="Just Because">Just Because</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Personal Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none resize-none"
                  placeholder="Add a personal message (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-full bg-gold px-8 py-3 text-base font-medium text-charcoal transition-colors hover:bg-gold-light disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send the Hint"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
