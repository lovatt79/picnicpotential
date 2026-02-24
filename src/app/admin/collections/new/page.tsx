"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewCollectionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [heroImageId, setHeroImageId] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleImageUpload = (url: string, mediaId: string) => {
    setHeroImageUrl(url);
    setHeroImageId(mediaId || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("collection_pages")
      .insert({
        title,
        slug,
        description: description || null,
        hero_subtitle: heroSubtitle || null,
        meta_description: metaDescription || null,
        hero_image_id: heroImageId,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
    } else if (data) {
      router.push(`/admin/collections/${data.id}`);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Collections
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">New Collection</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="e.g., Weddings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="text-warm-gray text-sm mr-2">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="weddings"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="Brief description shown on the collection page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Hero Subtitle
            </label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="Subtitle shown below the title in the hero section"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="SEO description for search engines"
            />
          </div>

          <div>
            <ImageUpload
              label="Hero Image"
              onImageUploaded={handleImageUpload}
              currentImageUrl={heroImageUrl || undefined}
              aspectRatio="21/9"
            />
            <p className="text-xs text-warm-gray mt-1">
              Optional background image for the hero section
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Collection"}
          </button>
          <Link
            href="/admin/collections"
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
