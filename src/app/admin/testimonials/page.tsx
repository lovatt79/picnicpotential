"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: number | null;
  review_date: string | null;
  is_published: boolean;
  show_on_homepage: boolean;
  sort_order: number;
}

export default function TestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (data) setTestimonials(data);
    setLoading(false);
  }

  async function toggleField(id: string, field: "is_published" | "show_on_homepage", currentValue: boolean) {
    // Optimistic update
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: !currentValue } : t))
    );

    const { error } = await supabase
      .from("testimonials")
      .update({ [field]: !currentValue })
      .eq("id", id);

    if (error) {
      // Revert on error
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: currentValue } : t))
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  const publishedCount = testimonials.filter((t) => t.is_published).length;
  const homepageCount = testimonials.filter((t) => t.show_on_homepage).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Testimonials</h1>
          <p className="text-warm-gray mt-1">
            {testimonials.length} reviews &middot; {publishedCount} published &middot; {homepageCount} on homepage
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </Link>
      </div>

      {testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                {/* Review content */}
                <div className="flex-1 min-w-0">
                  <p className="text-charcoal italic line-clamp-3">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-sm font-medium text-charcoal">&mdash; {t.author}</p>
                    {t.review_date && (
                      <span className="text-xs text-warm-gray">
                        {new Date(t.review_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {t.rating && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-3.5 w-3.5 ${star <= t.rating! ? "text-gold" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggles + Edit */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Published toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => toggleField(t.id, "is_published", t.is_published)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        t.is_published ? "bg-sage" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                          t.is_published ? "translate-x-[22px]" : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-warm-gray">Published</span>
                  </div>

                  {/* Homepage toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => toggleField(t.id, "show_on_homepage", t.show_on_homepage)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        t.show_on_homepage ? "bg-gold" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                          t.show_on_homepage ? "translate-x-[22px]" : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-warm-gray">Homepage</span>
                  </div>

                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="text-gold hover:text-charcoal text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No testimonials yet</h3>
          <p className="text-warm-gray mb-6">Add customer reviews to display on your website</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
          >
            Add Testimonial
          </Link>
        </div>
      )}
    </div>
  );
}
