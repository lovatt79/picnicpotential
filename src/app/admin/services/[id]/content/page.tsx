"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

type TabType = "sections" | "features" | "gallery";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface GalleryImage {
  id: string;
  image_id: string;
  caption: string;
  sort_order: number;
  image?: { url: string };
}

export default function ServiceContentPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<TabType>("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceName, setServiceName] = useState("");

  // Service Page data
  const [servicePageId, setServicePageId] = useState<string | null>(null);
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageId, setHeroImageId] = useState<string | null>(null);
  const [introText, setIntroText] = useState("");
  const [featuresTitle, setFeaturesTitle] = useState("What's Included");
  const [featuresDescription, setFeaturesDescription] = useState("");
  const [galleryTitle, setGalleryTitle] = useState("Gallery");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("Ready to Get Started?");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Request This Service");
  const [ctaButtonLink, setCtaButtonLink] = useState("/request");

  // Features data
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isCreatingFeature, setIsCreatingFeature] = useState(false);

  // Gallery data
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const iconOptions = [
    { value: "check", label: "✓ Check" },
    { value: "star", label: "⭐ Star" },
    { value: "sparkles", label: "✨ Sparkles" },
    { value: "heart", label: "❤️ Heart" },
    { value: "truck", label: "🚚 Truck" },
    { value: "camera", label: "📷 Camera" },
    { value: "cake", label: "🎂 Cake" },
    { value: "gift", label: "🎁 Gift" },
    { value: "music", label: "🎵 Music" },
    { value: "palette", label: "🎨 Palette" },
  ];

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    setLoading(true);

    // Get service name
    const { data: service } = await supabase
      .from("services")
      .select("title")
      .eq("id", params.id)
      .single();

    if (service) setServiceName(service.title);

    // Get or create service page
    let { data: servicePage } = await supabase
      .from("service_pages")
      .select("*")
      .eq("service_id", params.id)
      .single();

    if (!servicePage) {
      // Create service page if it doesn't exist
      const { data: newPage } = await supabase
        .from("service_pages")
        .insert({ service_id: params.id })
        .select()
        .single();
      servicePage = newPage;
    }

    if (servicePage) {
      setServicePageId(servicePage.id);
      setHeroSubtitle(servicePage.hero_subtitle || "");
      setIntroText(servicePage.intro_text || "");
      setFeaturesTitle(servicePage.features_section_title || "What's Included");
      setFeaturesDescription(servicePage.features_section_description || "");
      setGalleryTitle(servicePage.gallery_section_title || "Gallery");
      setGalleryDescription(servicePage.gallery_section_description || "");
      setCtaTitle(servicePage.cta_section_title || "Ready to Get Started?");
      setCtaDescription(servicePage.cta_section_description || "");
      setCtaButtonText(servicePage.cta_button_text || "Request This Service");
      setCtaButtonLink(servicePage.cta_button_link || "/request");

      // Load hero image
      if (servicePage.hero_image_id) {
        const { data: imageData } = await supabase
          .from("media")
          .select("url")
          .eq("id", servicePage.hero_image_id)
          .single();
        if (imageData) {
          setHeroImageUrl(imageData.url);
          setHeroImageId(servicePage.hero_image_id);
        }
      }

      // Load features
      const { data: featuresData } = await supabase
        .from("service_features")
        .select("*")
        .eq("service_page_id", servicePage.id)
        .order("sort_order", { ascending: true });

      if (featuresData) setFeatures(featuresData);

      // Load gallery images
      const { data: galleryData } = await supabase
        .from("service_gallery_images")
        .select("*, image:media(url)")
        .eq("service_page_id", servicePage.id)
        .order("sort_order", { ascending: true });

      if (galleryData) setGalleryImages(galleryData);
    }

    setLoading(false);
  }

  async function handleSaveSections() {
    if (!servicePageId) return;
    setSaving(true);

    const { error } = await supabase
      .from("service_pages")
      .update({
        hero_subtitle: heroSubtitle,
        hero_image_id: heroImageId,
        intro_text: introText,
        features_section_title: featuresTitle,
        features_section_description: featuresDescription,
        gallery_section_title: galleryTitle,
        gallery_section_description: galleryDescription,
        cta_section_title: ctaTitle,
        cta_section_description: ctaDescription,
        cta_button_text: ctaButtonText,
        cta_button_link: ctaButtonLink,
      })
      .eq("id", servicePageId);

    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Sections saved successfully!");
    }
  }

  async function handleSaveFeature() {
    if (!editingFeature || !servicePageId) return;

    if (isCreatingFeature) {
      const { error } = await supabase.from("service_features").insert({
        service_page_id: servicePageId,
        title: editingFeature.title,
        description: editingFeature.description,
        icon: editingFeature.icon,
        sort_order: features.length,
      });
      if (error) alert("Error creating feature: " + error.message);
    } else {
      const { error } = await supabase
        .from("service_features")
        .update({
          title: editingFeature.title,
          description: editingFeature.description,
          icon: editingFeature.icon,
        })
        .eq("id", editingFeature.id);
      if (error) alert("Error updating feature: " + error.message);
    }

    setEditingFeature(null);
    setIsCreatingFeature(false);
    loadData();
  }

  async function handleDeleteFeature(id: string) {
    if (!confirm("Delete this feature?")) return;
    const { error } = await supabase.from("service_features").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else loadData();
  }

  async function handleAddGalleryImage(url: string, mediaId: string) {
    if (!servicePageId) return;

    const { error } = await supabase.from("service_gallery_images").insert({
      service_page_id: servicePageId,
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

  async function handleUpdateCaption(imageId: string, caption: string) {
    const { error } = await supabase
      .from("service_gallery_images")
      .update({ caption })
      .eq("id", imageId);

    if (error) alert("Error updating caption: " + error.message);
  }

  async function handleDeleteGalleryImage(id: string) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("service_gallery_images").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else loadData();
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
          href={`/admin/services/${params.id}`}
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Service
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">
          {serviceName} - Page Content
        </h1>
        <p className="text-warm-gray mt-2">
          Manage features, gallery, and section content for this service
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          {[
            { id: "sections", label: "Sections" },
            { id: "features", label: "Features" },
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

      {/* Sections Tab */}
      {activeTab === "sections" && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Optional subtitle for hero section"
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Hero Image (optional - overrides service card image)"
                    onImageUploaded={(url, mediaId) => {
                      setHeroImageUrl(url);
                      setHeroImageId(mediaId);
                    }}
                    currentImageUrl={heroImageUrl || undefined}
                    aspectRatio="21/9"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Intro Section</h3>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Intro Text
                </label>
                <textarea
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Detailed introduction for the service"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Features Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={featuresTitle}
                    onChange={(e) => setFeaturesTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Section Description
                  </label>
                  <textarea
                    value={featuresDescription}
                    onChange={(e) => setFeaturesDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Optional description above features"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Gallery Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Section Description
                  </label>
                  <textarea
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Optional description above gallery"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">CTA Section</h3>
              <div className="space-y-4">
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
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                </div>
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
                    placeholder="/request"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleSaveSections}
                disabled={saving}
                className="w-full bg-charcoal text-white px-6 py-3 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save All Sections"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === "features" && (
        <div className="max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingFeature({
                  id: "",
                  title: "",
                  description: "",
                  icon: "check",
                  sort_order: features.length,
                });
                setIsCreatingFeature(true);
              }}
              className="bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
            >
              + Add Feature
            </button>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {iconOptions.find((o) => o.value === feature.icon)?.label.split(" ")[0] || "✓"}
                      </span>
                      <h3 className="font-serif text-xl text-charcoal">{feature.title}</h3>
                    </div>
                    <p className="text-warm-gray">{feature.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingFeature(feature);
                        setIsCreatingFeature(false);
                      }}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {features.length === 0 && (
            <div className="text-center py-12 text-warm-gray">
              No features yet. Click "Add Feature" to create one.
            </div>
          )}

          {/* Feature Edit Modal */}
          {editingFeature && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                <h3 className="text-xl font-semibold text-charcoal mb-4">
                  {isCreatingFeature ? "Add Feature" : "Edit Feature"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingFeature.title}
                      onChange={(e) =>
                        setEditingFeature({ ...editingFeature, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingFeature.description}
                      onChange={(e) =>
                        setEditingFeature({ ...editingFeature, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Icon
                    </label>
                    <select
                      value={editingFeature.icon}
                      onChange={(e) =>
                        setEditingFeature({ ...editingFeature, icon: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveFeature}
                    className="flex-1 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingFeature(null);
                      setIsCreatingFeature(false);
                    }}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="max-w-6xl">
          <div className="mb-6">
            <ImageUpload
              label="Add Gallery Image"
              onImageUploaded={handleAddGalleryImage}
              aspectRatio="4/3"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image?.url}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <textarea
                    value={item.caption}
                    onChange={(e) => {
                      const updated = galleryImages.map((img) =>
                        img.id === item.id ? { ...img, caption: e.target.value } : img
                      );
                      setGalleryImages(updated);
                    }}
                    onBlur={(e) => handleUpdateCaption(item.id, e.target.value)}
                    placeholder="Add caption..."
                    rows={2}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                  <button
                    onClick={() => handleDeleteGalleryImage(item.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {galleryImages.length === 0 && (
            <div className="text-center py-12 text-warm-gray">
              No gallery images yet. Upload one above to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
