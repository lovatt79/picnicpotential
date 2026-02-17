"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

type TabType = "basic" | "content" | "gallery";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic Info
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [url, setUrl] = useState(""); // Legacy field, will sync with website
  const [logoUrl, setLogoUrl] = useState("");
  const [logoId, setLogoId] = useState<string | null>(null);
  const [partnerType, setPartnerType] = useState<"VIP" | "Preferred" | "Winery">("Preferred");
  const [isPublished, setIsPublished] = useState(true);

  // Partner Page ID
  const [partnerPageId, setPartnerPageId] = useState<string | null>(null);

  // Page Content
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageId, setHeroImageId] = useState<string | null>(null);
  const [servicesOffered, setServicesOffered] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [gallerySectionTitle, setGallerySectionTitle] = useState("Gallery");
  const [gallerySectionDescription, setGallerySectionDescription] = useState("");

  // Gallery
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

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

      // Set basic info
      setName(partnerData.name);
      setCategory(partnerData.category);
      setLocation(partnerData.location || "");
      setDescription(partnerData.description || "");
      setWebsite(partnerData.website || partnerData.url || "");
      setInstagram(partnerData.instagram || "");
      setUrl(partnerData.url || partnerData.website || ""); // Legacy support
      setLogoUrl(partnerData.logo_url || "");
      setLogoId(partnerData.logo_id || null);
      setPartnerType(partnerData.partner_type);
      setIsPublished(partnerData.is_published);

      // Fetch logo URL if logo_id exists
      if (partnerData.logo_id) {
        const { data: imageData } = await supabase
          .from("media")
          .select("url")
          .eq("id", partnerData.logo_id)
          .single();
        if (imageData) {
          setLogoUrl(imageData.url);
        }
      }

      // Fetch or create partner page
      let { data: partnerPage } = await supabase
        .from("partner_pages")
        .select("*")
        .eq("partner_id", params.id)
        .single();

      if (!partnerPage) {
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
      setServicesOffered(partnerPage.services_offered || "");
      setContactEmail(partnerPage.contact_email || "");
      setContactPhone(partnerPage.contact_phone || "");
      setGallerySectionTitle(partnerPage.gallery_section_title || "Gallery");
      setGallerySectionDescription(partnerPage.gallery_section_description || "");

      // Fetch hero image URL if hero_image_id exists
      if (partnerPage.hero_image_id) {
        const { data: heroImageData } = await supabase
          .from("media")
          .select("url")
          .eq("id", partnerPage.hero_image_id)
          .single();
        if (heroImageData) {
          setHeroImageUrl(heroImageData.url);
          setHeroImageId(partnerPage.hero_image_id);
        }
      }

      // Load gallery images
      await loadGalleryImages(partnerPage.id);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function loadGalleryImages(pageId: string) {
    const { data } = await supabase
      .from("partner_gallery_images")
      .select("*, image:media(url, alt_text)")
      .eq("partner_page_id", pageId)
      .order("sort_order", { ascending: true });

    setGalleryImages(data || []);
  }

  const handleLogoUpload = (url: string, mediaId: string) => {
    setLogoUrl(url);
    setLogoId(mediaId);
  };

  const handleHeroImageUpload = (url: string, mediaId: string) => {
    setHeroImageUrl(url);
    setHeroImageId(mediaId);
  };

  async function handleSaveBasicInfo() {
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("vendor_partners")
      .update({
        name,
        category,
        location,
        description: description || null,
        website: website || null,
        instagram: instagram || null,
        url: website || url || null, // Keep url in sync with website for legacy support
        logo_url: logoUrl || null,
        logo_id: logoId,
        partner_type: partnerType,
        is_published: isPublished,
      })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      alert("Basic info saved successfully!");
    }

    setSaving(false);
  }

  async function handleSavePageContent() {
    if (!partnerPageId) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("partner_pages")
      .update({
        hero_image_id: heroImageId,
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
    } else {
      alert("Page content saved successfully!");
    }

    setSaving(false);
  }

  async function handleAddGalleryImage(url: string, mediaId: string) {
    if (!partnerPageId) return;

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
  }

  async function handleAddMultipleGalleryImages(images: Array<{ url: string; mediaId: string }>) {
    if (!partnerPageId) return;

    const startIndex = galleryImages.length;
    const inserts = images.map((img, index) => ({
      partner_page_id: partnerPageId,
      image_id: img.mediaId,
      caption: "",
      sort_order: startIndex + index,
    }));

    const { error } = await supabase.from("partner_gallery_images").insert(inserts);

    if (error) {
      setError(error.message);
    } else {
      await loadGalleryImages(partnerPageId);
    }
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

  const handleDelete = async () => {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("vendor_partners").delete().eq("id", params.id);
    router.push("/admin/partners");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  const partnerSlug = slugify(name);
  const viewUrl = `/partners/${partnerSlug}`;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/partners"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Partners
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-charcoal">{name}</h1>
          {isPublished ? (
            <Link
              href={viewUrl}
              target="_blank"
              className="text-sm text-gold hover:text-gold-dark flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View on Site
            </Link>
          ) : (
            <Link
              href={viewUrl}
              target="_blank"
              className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview (Unpublished)
            </Link>
          )}
        </div>
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
            onClick={() => setActiveTab("basic")}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-gold text-charcoal font-medium"
                : "border-transparent text-warm-gray hover:text-charcoal"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-gold text-charcoal font-medium"
                : "border-transparent text-warm-gray hover:text-charcoal"
            }`}
          >
            Page Content
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

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Partner Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={partnerType === "VIP"}
                    onChange={() => setPartnerType("VIP")}
                    className="text-gold focus:ring-gold"
                  />
                  <span className="text-sm">VIP Partner</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={partnerType === "Preferred"}
                    onChange={() => setPartnerType("Preferred")}
                    className="text-gold focus:ring-gold"
                  />
                  <span className="text-sm">Preferred Partner</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={partnerType === "Winery"}
                    onChange={() => setPartnerType("Winery")}
                    className="text-gold focus:ring-gold"
                  />
                  <span className="text-sm">Winery</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Charcuterie, Desserts, Flowers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Santa Rosa, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Brief description of the partner and what they offer..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="https://www.instagram.com/username/"
              />
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
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </label>
              <span className="text-sm text-charcoal">Published</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveBasicInfo}
                disabled={saving}
                className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/admin/partners" className="text-warm-gray hover:text-charcoal">
                Cancel
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete Partner
            </button>
          </div>
        </div>
      )}

      {/* Page Content Tab */}
      {activeTab === "content" && (
        <div className="max-w-4xl space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Hero Section</h2>
            <p className="text-sm text-warm-gray">
              Upload a hero image to display at the top of the partner page. If no image is uploaded, a default sage background will be used.
            </p>
            <ImageUpload
              label="Hero Image"
              onImageUploaded={handleHeroImageUpload}
              currentImageUrl={heroImageUrl || undefined}
              aspectRatio="21/9"
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-charcoal">Services Offered</h2>
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
              onClick={handleSavePageContent}
              disabled={saving}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All Content"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="max-w-6xl">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="font-serif text-xl text-charcoal mb-4">Add Gallery Images</h2>
            <p className="text-sm text-warm-gray mb-4">Upload multiple images at once to add to the gallery</p>
            <MultiImageUpload
              label="Upload Multiple Images"
              onImagesUploaded={handleAddMultipleGalleryImages}
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
