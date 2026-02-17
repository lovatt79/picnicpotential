"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import type { SeatingOption } from "@/lib/supabase/types";

export default function EditSeatingPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("seating_options").select("*").eq("id", params.id).single();
      if (!data) { router.push("/admin/seating"); return; }
      setTitle(data.title);
      setDescription(data.description || "");
      setImageUrl(data.image_url || "");
      setImageId(data.image_id || null);
      setIsPublished(data.is_published);

      // Fetch image URL if image_id exists
      if (data.image_id) {
        const { data: imageData } = await supabase
          .from("media")
          .select("url")
          .eq("id", data.image_id)
          .single();
        if (imageData) {
          setImageUrl(imageData.url);
        }
      }

      setLoading(false);
    }
    load();
  }, [params.id, router, supabase]);

  const handleImageUpload = (url: string, mediaId: string) => {
    setImageUrl(url);
    setImageId(mediaId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("seating_options").update({
      title,
      description,
      image_url: imageUrl || null,
      image_id: imageId,
      is_published: isPublished,
    }).eq("id", params.id);

    if (error) { setError(error.message); setSaving(false); }
    else { router.push("/admin/seating"); router.refresh(); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/seating" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Seating Options
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">Edit Seating Option</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
          </div>

          <div>
            <ImageUpload
              label="Seating Image"
              onImageUploaded={handleImageUpload}
              currentImageUrl={imageUrl || undefined}
              aspectRatio="4/3"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
            <span className="text-sm text-charcoal">Published</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="submit" disabled={saving} className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href={`/admin/seating/${params.id}/content`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Edit Page Content
          </Link>
          <Link href="/admin/seating" className="text-warm-gray hover:text-charcoal transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
