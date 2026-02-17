"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import type { SeatingOption } from "@/lib/supabase/types";

type TabType = "basic" | "content" | "gallery";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EditSeatingPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  // Page Content
  const [seatingPageId, setSeatingPageId] = useState<string | null>(null);
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [pricingInfo, setPricingInfo] = useState("");
  const [gallerySectionTitle, setGallerySectionTitle] = useState("Gallery");
  const [gallerySectionDescription, setGallerySectionDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("Interested in This Seating Style?");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Get a Quote");
  const [ctaButtonLink, setCtaButtonLink] = useState("/request");

  // Gallery
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    setLoading(true);

    // Load seating option basic info
    const { data: seatingData } = await supabase
      .from("seating_options")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!seatingData) {
      router.push("/admin/seating");
      return;
    }

    setTitle(seatingData.title);
    setDescription(seatingData.description || "");
    setIsPublished(seatingData.is_published);

    // Load seating card image
    if (seatingData.image_id) {
      const { data: imageData } = await supabase
        .from("media")
        .select("url")
        .eq("id", seatingData.image_id)
        .single();
      if (imageData) {
        setImageUrl(imageData.url);
        setImageId(seatingData.image_id);
      }
    }

    // Load or create seating page
    let { data: seatingPage } = await supabase
      .from("seating_pages")
      .select("*")
      .eq("seating_option_id", params.id)
      .single();

    if (!seatingPage) {
      const { data: newPage } = await supabase
        .from("seating_pages")
        .insert({ seating_option_id: params.id })
        .select()
        .single();
      seatingPage = newPage;
    }

    if (seatingPage) {
      setSeatingPageId(seatingPage.id);
      setHeroSubtitle(seatingPage.hero_subtitle || "");
      setFeaturesText(seatingPage.features_text || "");
      setPricingInfo(seatingPage.pricing_info || "");
      setGallerySectionTitle(seatingPage.gallery_section_title || "Gallery");
      setGallerySectionDescription(seatingPage.gallery_section_description || "");
      setCtaTitle(seatingPage.cta_title || "Interested in This Seating Style?");
      setCtaDescription(seatingPage.cta_description || "");
      setCtaButtonText(seatingPage.cta_button_text || "Get a Quote");
      setCtaButtonLink(seatingPage.cta_button_link || "/request");

      // Load gallery images
      const { data: galleryData } = await supabase
        .from("seating_gallery_images")
        .select("*, image:media(url, alt_text)")
        .eq("seating_page_id", seatingPage.id)
        .order("sort_order", { ascending: true });

      if (galleryData) setGalleryImages(galleryData);
    }

    setLoading(false);
  }

  async function handleSaveBasicInfo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("seating_options")
      .update({
        title,
        description,
        image_url: imageUrl || null,
        image_id: imageId,
        is_published: isPublished,
      })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      setSaving(false);
      alert("Basic info saved successfully!");
    }
  }

  async function handleSavePageContent() {
    if (!seatingPageId) return;
    setSaving(true);

    const { error } = await supabase
      .from("seating_pages")
      .update({
        hero_subtitle: heroSubtitle || null,
        features_text: featuresText || null,
        pricing_info: pricingInfo || null,
        gallery_section_title: gallerySectionTitle,
        gallery_section_description: gallerySectionDescription || null,
        cta_title: ctaTitle,
        cta_description: ctaDescription || null,
        cta_button_text: ctaButtonText,
        cta_button_link: ctaButtonLink,
      })
      .eq("id", seatingPageId);

    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Page content saved successfully!");
    }
  }

  async function handleAddGalleryImage(url: string, mediaId: string) {
    if (!seatingPageId) return;

    const { error } = await supabase.from("seating_gallery_images").insert({
      seating_page_id: seatingPageId,
      image_id: mediaId,
      caption: "",
      sort_order: galleryImages.length,
    });

    if (error) {
      alert("Error adding image: " + error.message);
    } else {
      loadData();
    }
  }

  async function handleUpdateGalleryCaption(imageId: string, caption: string) {
    const { error } = await supabase
      .from("seating_gallery_images")
      .update({ caption })
      .eq("id", imageId);

    if (error) alert("Error updating caption: " + error.message);
  }

  async function handleDeleteGalleryImage(id: string) {
    if (!confirm("Delete this image from the gallery?")) return;
    const { error } = await supabase.from("seating_gallery_images").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else loadData();
  }

  const handleBasicImageUpload = (url: string, mediaId: string) => {
    setImageUrl(url);
    setImageId(mediaId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  const seatingSlug = slugify(title);
  const viewUrl = `/seating/${seatingSlug}`;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/seating"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Seating Options
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-charcoal">Edit Seating: {title}</h1>
            <p className="text-warm-gray mt-1">Manage basic info, page content, and gallery</p>
          </div>
          <div>
            {isPublished ? (
              <Link
                href={viewUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Site
              </Link>
            ) : (
              <Link
                href={viewUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-warm-gray text-white rounded-lg hover:bg-charcoal transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview (Unpublished)
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "content", label: "Page Content" },
            { id: "gallery", label: "Gallery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-gold text-charcoal"
                  : "border-transparent text-warm-gray hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <form onSubmit={handleSaveBasicInfo} className="max-w-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Floor Cushions & Rugs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Description *
              </label>
              <p className="text-xs text-warm-gray mb-2">
                Brief description shown on seating option cards
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Brief description for cards"
              />
            </div>

            <div>
              <ImageUpload
                label="Seating Card Image"
                onImageUploaded={handleBasicImageUpload}
                currentImageUrl={imageUrl || undefined}
                aspectRatio="4/3"
              />
              <p className="text-xs text-warm-gray mt-1">
                Image shown on seating option cards and as hero image
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
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
              {saving ? "Saving..." : "Save Basic Info"}
            </button>
            <Link
              href="/admin/seating"
              className="text-warm-gray hover:text-charcoal transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}

      {/* Page Content Tab */}
      {activeTab === "content" && (
        <div className="max-w-4xl space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Hero Section</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Hero Subtitle (optional)
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Appears below the title on the hero image"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Details Section</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Features/Details Text
              </label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Detailed information about this seating style"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Pricing Information
              </label>
              <textarea
                value={pricingInfo}
                onChange={(e) => setPricingInfo(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Pricing details and packages"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Gallery Section</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Gallery Section Title
              </label>
              <input
                type="text"
                value={gallerySectionTitle}
                onChange={(e) => setGallerySectionTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Gallery Section Description (optional)
              </label>
              <textarea
                value={gallerySectionDescription}
                onChange={(e) => setGallerySectionDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">CTA Section</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Title
              </label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Description
              </label>
              <textarea
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={ctaButtonLink}
                  onChange={(e) => setCtaButtonLink(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSavePageContent}
              disabled={saving}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Page Content"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="max-w-6xl">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="font-serif text-xl text-charcoal mb-4">Add Gallery Image</h2>
            <ImageUpload
              label="Upload Image"
              onImageUploaded={handleAddGalleryImage}
              aspectRatio="4/3"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image?.url}
                    alt={item.caption || "Gallery image"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const updated = galleryImages.map((img) =>
                        img.id === item.id ? { ...img, caption: e.target.value } : img
                      );
                      setGalleryImages(updated);
                    }}
                    onBlur={(e) => handleUpdateGalleryCaption(item.id, e.target.value)}
                    placeholder="Add caption (optional)"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    onClick={() => handleDeleteGalleryImage(item.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            ))}
          </div>

          {galleryImages.length === 0 && (
            <div className="text-center py-12 text-warm-gray">
              <p>No gallery images yet. Upload images above to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
