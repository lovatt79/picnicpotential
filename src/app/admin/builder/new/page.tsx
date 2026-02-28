"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewBuilderPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManual(true);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setSaving(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("builder_pages")
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        meta_description: metaDescription.trim() || null,
        content: [],
        is_published: false,
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        setError("A page with this slug already exists.");
      } else {
        setError(insertError.message);
      }
      setSaving(false);
      return;
    }

    router.push(`/admin/builder/${data.id}`);
  };

  return (
    <div>
      <Link
        href="/admin/builder"
        className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-charcoal transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Pages
      </Link>

      <h1 className="font-serif text-3xl text-charcoal mb-8">New Page</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Page Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. Spring Special 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            URL Slug
          </label>
          <div className="flex items-center gap-1">
            <span className="text-warm-gray text-sm">/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="spring-special-2025"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Meta Description <span className="text-warm-gray font-normal">(optional)</span>
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="Brief description for search engines"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || !title.trim() || !slug.trim()}
            className="px-6 py-2.5 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "Creating..." : "Create Page"}
          </button>
          <Link
            href="/admin/builder"
            className="text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
