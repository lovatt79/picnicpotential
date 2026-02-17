"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewServicePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleImageUpload = (url: string, mediaId: string) => {
    setImageUrl(url);
    setImageId(mediaId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("services").insert({
      title,
      slug,
      description,
      long_description: longDescription,
      image_url: imageUrl || null,
      image_id: imageId,
      is_published: isPublished,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/services");
      router.refresh();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">New Service</h1>
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
              placeholder="e.g., Luxury Picnics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="text-warm-gray text-sm mr-2">/services/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="luxury-picnics"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="Brief description for cards and previews"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Full Description
            </label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="Detailed description for the service page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Service Image
            </label>
            <ImageUpload
              onUploadComplete={handleImageUpload}
              currentImageUrl={imageUrl || undefined}
            />
            <p className="text-xs text-warm-gray mt-1">
              Upload an image or leave blank to use a gradient placeholder
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
            <span className="text-sm text-charcoal">Published</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Service"}
          </button>
          <Link
            href="/admin/services"
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
