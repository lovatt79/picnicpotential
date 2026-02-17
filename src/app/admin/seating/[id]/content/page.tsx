"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

type TabType = "sections" | "gallery";

export default function SeatingContentPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabType>("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Seating Option
  const [seatingOption, setSeatingOption] = useState<any>(null);

  // Seating Page ID
  const [seatingPageId, setSeatingPageId] = useState<string | null>(null);

  // Sections Tab Data
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [pricingInfo, setPricingInfo] = useState("");
  const [gallerySectionTitle, setGallerySectionTitle] = useState("Gallery");
  const [gallerySectionDescription, setGallerySectionDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("Interested in This Seating Style?");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Get a Quote");
  const [ctaButtonLink, setCtaButtonLink] = useState("/request");

  // Gallery Tab Data
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      // Fetch seating option
      const { data: seatingData } = await supabase
        .from("seating_options")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!seatingData) {
        router.push("/admin/seating");
        return;
      }

      setSeatingOption(seatingData);

      // Fetch or create seating page
      let { data: seatingPage } = await supabase
        .from("seating_pages")
        .select("*")
        .eq("seating_option_id", params.id)
        .single();

      if (!seatingPage) {
        // Create seating page if it doesn't exist
        const { data: newPage, error: createError } = await supabase
          .from("seating_pages")
          .insert({ seating_option_id: params.id })
          .select()
          .single();

        if (createError) {
          setError(createError.message);
          setLoading(false);
          return;
        }

        seatingPage = newPage;
      }

      setSeatingPageId(seatingPage.id);

      // Load seating page data
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
      await loadGalleryImages(seatingPage.id);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function loadGalleryImages(pageId: string) {
    const { data, error } = await supabase
      .from("seating_gallery_images")
      .select("*, image:media(url, alt_text)")
      .eq("seating_page_id", pageId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error loading gallery:", error);
    } else {
      setGalleryImages(data || []);
    }
  }

  async function handleSaveSections() {
    if (!seatingPageId) return;

    setSaving(true);
    setError(null);

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
        updated_at: new Date().toISOString(),
      })
      .eq("id", seatingPageId);

    if (error) {
      setError(error.message);
    }

    setSaving(false);
  }

  async function handleAddGalleryImage(url: string, mediaId: string) {
    if (!seatingPageId) return;

    setUploadingGallery(true);

    const { error } = await supabase.from("seating_gallery_images").insert({
      seating_page_id: seatingPageId,
      image_id: mediaId,
      caption: "",
      sort_order: galleryImages.length,
    });

    if (error) {
      setError(error.message);
    } else {
      await loadGalleryImages(seatingPageId);
    }

    setUploadingGallery(false);
  }

  async function handleUpdateGalleryCaption(imageId: string, caption: string) {
    const { error } = await supabase
      .from("seating_gallery_images")
      .update({ caption })
      .eq("id", imageId);

    if (error) {
      setError(error.message);
    } else if (seatingPageId) {
      await loadGalleryImages(seatingPageId);
    }
  }

  async function handleDeleteGalleryImage(imageId: string) {
    if (!confirm("Delete this image from the gallery?")) return;

    const { error } = await supabase
      .from("seating_gallery_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      setError(error.message);
    } else if (seatingPageId) {
      await loadGalleryImages(seatingPageId);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/seating/${params.id}`}
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Seating Option
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">
          {seatingOption?.title} - Page Content
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("sections")}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === "sections"
                ? "border-gold text-charcoal font-medium"
                : "border-transparent text-warm-gray hover:text-charcoal"
            }`}
          >
            Sections
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === "gallery"
                ? "border-gold text-charcoal font-medium"
                : "border-transparent text-warm-gray hover:text-charcoal"
            }`}
          >
            Gallery ({galleryImages.length})
          </button>
        </nav>
      </div>

      {/* Sections Tab */}
      {activeTab === "sections" && (
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
              onClick={handleSaveSections}
              disabled={saving}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All Sections"}
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
                    onChange={(e) => handleUpdateGalleryCaption(item.id, e.target.value)}
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
