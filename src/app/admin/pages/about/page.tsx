"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import HeroEditor from "@/components/admin/HeroEditor";
import ImageUpload from "@/components/admin/ImageUpload";

interface AboutContent {
  id: string;
  our_story_title: string;
  our_story_text: string | null;
  our_story_image_id: string | null;
  our_story_image_url: string | null;
  features_title: string;
  service_area_title: string;
  service_area_text: string | null;
}

interface AboutFeature {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
}

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
  { value: "strawberry", label: "🍓 Strawberry" },
  { value: "flowers", label: "💐 Flowers" },
  { value: "champagne", label: "🥂 Champagne" },
  { value: "cheese", label: "🧀 Charcuterie" },
  { value: "cupcake", label: "🧁 Cupcake" },
  { value: "vase", label: "🏺 Vase" },
  { value: "games", label: "🎲 Games" },
  { value: "drinks", label: "🍹 Drinks" },
  { value: "outdoors", label: "🌳 Outdoors" },
  { value: "events", label: "🎉 Events" },
  { value: "scenery", label: "🏞️ Scenery" },
  { value: "chairs", label: "🪑 Chairs" },
  { value: "tables", label: "🍽️ Tables" },
  { value: "wine", label: "🍷 Wine" },
  { value: "garden", label: "🌿 Garden" },
  { value: "beach", label: "🏖️ Beach" },
  { value: "lights", label: "💡 Lights" },
  { value: "balloons", label: "🎈 Balloons" },
];

export default function AboutPageAdmin() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [features, setFeatures] = useState<AboutFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentResult, featuresResult] = await Promise.all([
        supabase.from("about_content").select("*").single(),
        supabase
          .from("about_features")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      if (contentResult.error && contentResult.error.code !== "PGRST116")
        throw contentResult.error;
      if (featuresResult.error) throw featuresResult.error;

      setContent(contentResult.data);
      setFeatures(featuresResult.data || []);
    } catch (error) {
      console.error("Error loading about content:", error);
      setMessage({ type: "error", text: "Failed to load about content" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!content) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("about_content")
        .update({
          our_story_title: content.our_story_title,
          our_story_text: content.our_story_text,
          our_story_image_id: content.our_story_image_id,
          our_story_image_url: content.our_story_image_url,
          features_title: content.features_title,
          service_area_title: content.service_area_title,
          service_area_text: content.service_area_text,
          updated_at: new Date().toISOString(),
        })
        .eq("id", content.id);

      if (error) throw error;

      setMessage({ type: "success", text: "About content saved!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving about content:", error);
      setMessage({ type: "error", text: "Failed to save about content" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = async () => {
    try {
      const newFeature = {
        title: "New Feature",
        description: "",
        icon: "check",
        sort_order: features.length,
      };

      const { data, error } = await supabase
        .from("about_features")
        .insert(newFeature)
        .select()
        .single();

      if (error) throw error;

      setFeatures([...features, data]);
    } catch (error) {
      console.error("Error adding feature:", error);
      setMessage({ type: "error", text: "Failed to add feature" });
    }
  };

  const handleUpdateFeature = async (
    id: string,
    field: keyof AboutFeature,
    value: string | number
  ) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSaveFeature = async (feature: AboutFeature) => {
    try {
      const { error } = await supabase
        .from("about_features")
        .update({
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          sort_order: feature.sort_order,
        })
        .eq("id", feature.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Feature saved!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving feature:", error);
      setMessage({ type: "error", text: "Failed to save feature" });
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;

    try {
      const { error } = await supabase
        .from("about_features")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFeatures(features.filter((f) => f.id !== id));
      setMessage({ type: "success", text: "Feature deleted" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting feature:", error);
      setMessage({ type: "error", text: "Failed to delete feature" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-charcoal mb-2">
          About Page Settings
        </h1>
        <p className="text-warm-gray">
          Manage your About page hero, content, and features
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Hero Editor */}
      <div className="mb-8">
        <HeroEditor pageKey="about" label="About Page Hero" />
      </div>

      {/* About Content */}
      {content && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-charcoal mb-4">
            Page Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Our Story Title
              </label>
              <input
                type="text"
                value={content.our_story_title}
                onChange={(e) =>
                  setContent({ ...content, our_story_title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Our Story Text
              </label>
              <textarea
                value={content.our_story_text || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    our_story_text: e.target.value || null,
                  })
                }
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <ImageUpload
                label="Our Story Image"
                currentImageUrl={content.our_story_image_url || undefined}
                onImageUploaded={(url, mediaId) => {
                  setContent({
                    ...content,
                    our_story_image_url: url || null,
                    our_story_image_id: mediaId || null,
                  });
                }}
                aspectRatio="4/3"
              />
              <p className="text-xs text-warm-gray mt-1">
                Photo shown next to the Our Story text on the About page
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Features Section Title
              </label>
              <input
                type="text"
                value={content.features_title}
                onChange={(e) =>
                  setContent({ ...content, features_title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Service Area Title
              </label>
              <input
                type="text"
                value={content.service_area_title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    service_area_title: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Service Area Text
              </label>
              <textarea
                value={content.service_area_text || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    service_area_text: e.target.value || null,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveContent}
                disabled={saving}
                className="px-6 py-2.5 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-charcoal">
            Features ({features.length})
          </h2>
          <button
            type="button"
            onClick={handleAddFeature}
            className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Feature
          </button>
        </div>

        {features.length === 0 ? (
          <p className="text-warm-gray text-sm py-4">
            No features yet. Click &quot;Add Feature&quot; to create one.
          </p>
        ) : (
          <div className="space-y-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) =>
                        handleUpdateFeature(
                          feature.id,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Icon
                    </label>
                    <select
                      value={feature.icon}
                      onChange={(e) =>
                        handleUpdateFeature(
                          feature.id,
                          "icon",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Description
                    </label>
                    <textarea
                      value={feature.description || ""}
                      onChange={(e) =>
                        handleUpdateFeature(
                          feature.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={feature.sort_order}
                      onChange={(e) =>
                        handleUpdateFeature(
                          feature.id,
                          "sort_order",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSaveFeature(feature)}
                    className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors text-sm"
                  >
                    Save Feature
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(feature.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
