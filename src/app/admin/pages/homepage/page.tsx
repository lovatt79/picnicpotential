"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_link: string;
  featured_title: string | null;
  featured_subtitle: string | null;
  about_preview_title: string | null;
  about_preview_text: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  cta_button_text: string | null;
  cta_button_link: string | null;
}

export default function HomepageEditor() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error("Error loading homepage content:", error);
      setMessage({ type: "error", text: "Failed to load homepage content" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("homepage_content")
        .update(content)
        .eq("id", content.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Homepage content updated successfully!" });
      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({ type: "error", text: "Failed to save homepage content" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HomepageContent, value: string) => {
    setContent(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">No homepage content found. Please run the database migration.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-charcoal mb-2">Edit Homepage</h1>
        <p className="text-warm-gray">Manage your homepage content and settings</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Hero Title
              </label>
              <input
                type="text"
                value={content.hero_title}
                onChange={(e) => handleChange("hero_title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={content.hero_subtitle}
                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Hero Description
              </label>
              <textarea
                value={content.hero_description}
                onChange={(e) => handleChange("hero_description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={content.hero_cta_text}
                  onChange={(e) => handleChange("hero_cta_text", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={content.hero_cta_link}
                  onChange={(e) => handleChange("hero_cta_link", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="/request"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Featured Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={content.featured_title || ""}
                onChange={(e) => handleChange("featured_title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Why Choose Picnic Potential"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={content.featured_subtitle || ""}
                onChange={(e) => handleChange("featured_subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Optional subtitle"
              />
            </div>
          </div>
        </div>

        {/* About Preview Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">About Preview Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={content.about_preview_title || ""}
                onChange={(e) => handleChange("about_preview_title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="About Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Preview Text
              </label>
              <textarea
                value={content.about_preview_text || ""}
                onChange={(e) => handleChange("about_preview_text", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Brief introduction..."
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Bottom CTA Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Title
              </label>
              <input
                type="text"
                value={content.cta_title || ""}
                onChange={(e) => handleChange("cta_title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Ready to Create Your Perfect Picnic?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Subtitle
              </label>
              <input
                type="text"
                value={content.cta_subtitle || ""}
                onChange={(e) => handleChange("cta_subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Let us help you plan an unforgettable experience"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={content.cta_button_text || ""}
                  onChange={(e) => handleChange("cta_button_text", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Get Started"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={content.cta_button_link || ""}
                  onChange={(e) => handleChange("cta_button_link", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="/request"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-3 border border-gray-300 text-charcoal rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
