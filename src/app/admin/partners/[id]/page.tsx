"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoId, setLogoId] = useState<string | null>(null);
  const [partnerType, setPartnerType] = useState<"VIP" | "Preferred">("Preferred");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("vendor_partners").select("*").eq("id", params.id).single();
      if (!data) { router.push("/admin/partners"); return; }
      setName(data.name);
      setCategory(data.category);
      setLocation(data.location || "");
      setUrl(data.url || "");
      setLogoUrl(data.logo_url || "");
      setLogoId(data.logo_id || null);
      setPartnerType(data.partner_type);
      setIsPublished(data.is_published);

      // Fetch logo URL if logo_id exists
      if (data.logo_id) {
        const { data: imageData } = await supabase
          .from("media")
          .select("url")
          .eq("id", data.logo_id)
          .single();
        if (imageData) {
          setLogoUrl(imageData.url);
        }
      }

      setLoading(false);
    }
    load();
  }, [params.id, router, supabase]);

  const handleLogoUpload = (url: string, mediaId: string) => {
    setLogoUrl(url);
    setLogoId(mediaId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("vendor_partners").update({
      name,
      category,
      location,
      url: url || null,
      logo_url: logoUrl || null,
      logo_id: logoId,
      partner_type: partnerType,
      is_published: isPublished,
    }).eq("id", params.id);
    if (error) { setError(error.message); setSaving(false); }
    else { router.push("/admin/partners"); router.refresh(); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("vendor_partners").delete().eq("id", params.id);
    router.push("/admin/partners");
    router.refresh();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/partners" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Partners
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">Edit Partner</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Partner Type *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={partnerType === "VIP"} onChange={() => setPartnerType("VIP")} className="text-gold focus:ring-gold" />
                <span className="text-sm">VIP Partner</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={partnerType === "Preferred"} onChange={() => setPartnerType("Preferred")} className="text-gold focus:ring-gold" />
                <span className="text-sm">Preferred Partner</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Website URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <ImageUpload
              label="Partner Logo"
              onImageUploaded={handleLogoUpload}
              currentImageUrl={logoUrl || undefined}
              aspectRatio="16/9"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
            <span className="text-sm text-charcoal">Published</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
            <Link href={`/admin/partners/${params.id}/content`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Page Content
            </Link>
            <Link href="/admin/partners" className="text-warm-gray hover:text-charcoal">Cancel</Link>
          </div>
          <button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm">Delete Partner</button>
        </div>
      </form>
    </div>
  );
}
