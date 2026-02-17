"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

type TabType = "details" | "gallery";

export default function PartnerContentPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Partner
  const [partner, setPartner] = useState<any>(null);

  // Partner Page ID
  const [partnerPageId, setPartnerPageId] = useState<string | null>(null);

  // Details Tab Data
  const [aboutText, setAboutText] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [gallerySectionTitle, setGallerySectionTitle] = useState("Gallery");
  const [gallerySectionDescription, setGallerySectionDescription] = useState("");

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
      // Fetch partner
      const { data: partnerData } = await supabase
        .from("vendor_partners")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!partnerData) {
        router.push("/admin/partners");
        return;
      }

      setPartner(partnerData);

      // Fetch or create partner page
      let { data: partnerPage } = await supabase
        .from("partner_pages")
        .select("*")
        .eq("partner_id", params.id)
        .single();

      if (!partnerPage) {
        // Create partner page if it doesn't exist
        const { data: newPage, error: createError } = await supabase
          .from("partner_pages")
          .insert({ partner_id: params.id })
          .select()
          .single();

        if (createError) {
          setError(createError.message);
          setLoading(false);
          return;
        }

        partnerPage = newPage;
      }

      setPartnerPageId(partnerPage.id);

      // Load partner page data
      setAboutText(partnerPage.about_text || "");
      setServicesOffered(partnerPage.services_offered || "");
      setContactEmail(partnerPage.contact_email || "");
      setContactPhone(partnerPage.contact_phone || "");
      setGallerySectionTitle(partnerPage.gallery_section_title || "Gallery");
      setGallerySectionDescription(partnerPage.gallery_section_description || "");

      // Load gallery images
      await loadGalleryImages(partnerPage.id);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function loadGalleryImages(pageId: string) {
    const { data, error } = await supabase
      .from("partner_gallery_images")
      .select("*, image:media(url, alt_text)")
      .eq("partner_page_id", pageId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error loading gallery:", error);
    } else {
      setGalleryImages(data || []);
    }
  }

  async function handleSaveDetails() {
    if (!partnerPageId) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("partner_pages")
      .update({
        about_text: aboutText || null,
        services_offered: servicesOffered || null,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        gallery_section_title: gallerySectionTitle,
        gallery_section_description: gallerySectionDescription || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", partnerPageId);

    if (error) {
      setError(error.message);
    }

    setSaving(false);
  }

  async function handleAddGalleryImage(url: string, mediaId: string) {
    if (!partnerPageId) return;

    setUploadingGallery(true);

    const { error } = await supabase.from("partner_gallery_images").insert({
      partner_page_id: partnerPageId,
      image_id: mediaId,
      caption: "",
      sort_order: galleryImages.length,
    });

    if (error) {
      setError(error.message);
    } else {
      await loadGalleryImages(partnerPageId);
    }

    setUploadingGallery(false);
  }

  async function handleUpdateGalleryCaption(imageId: string, caption: string) {
    const { error } = await supabase
      .from("partner_gallery_images")
      .update({ caption })
      .eq("id", imageId);

    if (error) {
      setError(error.message);
    } else if (partnerPageId) {
      await loadGalleryImages(partnerPageId);
    }
  }

  async function handleDeleteGalleryImage(imageId: string) {
    if (!confirm("Delete this image from the gallery?")) return;

    const { error } = await supabase
      .from("partner_gallery_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      setError(error.message);
    } else if (partnerPageId) {
      await loadGalleryImages(partnerPageId);
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
          href={`/admin/partners/${params.id}`}
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Partner
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">
          {partner?.name} - Page Content
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
            onClick={() => setActiveTab("details")}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-gold text-charcoal font-medium"
                : "border-transparent text-warm-gray hover:text-charcoal"
            }`}
          >
            Details
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

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="max-w-4xl space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">About Section</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                About Text
              </label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Tell the story of this partner..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Services Offered
              </label>
              <textarea
                value={servicesOffered}
                onChange={(e) => setServicesOffered(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="What services does this partner provide?"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Contact Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="(555) 123-4567"
                />
              </div>
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

          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveDetails}
              disabled={saving}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All Details"}
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
