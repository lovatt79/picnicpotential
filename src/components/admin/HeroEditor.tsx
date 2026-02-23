"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

interface PageHero {
  id: string;
  page_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_id: string | null;
  show_cta: boolean;
  cta_text: string | null;
  cta_link: string | null;
}

interface HeroEditorProps {
  pageKey: string;
  label?: string;
}

export default function HeroEditor({ pageKey, label = "Hero Section" }: HeroEditorProps) {
  const [hero, setHero] = useState<PageHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadHero();
  }, [pageKey]);

  const loadHero = async () => {
    try {
      const { data, error } = await supabase
        .from("page_heroes")
        .select("*")
        .eq("page_key", pageKey)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setHero(data);
      } else {
        // Create default entry
        const { data: newHero, error: insertError } = await supabase
          .from("page_heroes")
          .insert({ page_key: pageKey, title: "Page Title", show_cta: false })
          .select()
          .single();

        if (insertError) throw insertError;
        setHero(newHero);
      }
    } catch (error) {
      console.error("Error loading hero:", error);
      setMessage({ type: "error", text: "Failed to load hero settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!hero) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("page_heroes")
        .update({
          title: hero.title,
          description: hero.description,
          image_url: hero.image_url,
          image_id: hero.image_id,
          show_cta: hero.show_cta,
          cta_text: hero.cta_text,
          cta_link: hero.cta_link,
        })
        .eq("id", hero.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Hero settings saved!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving hero:", error);
      setMessage({ type: "error", text: "Failed to save hero settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string, mediaId: string) => {
    setHero((prev) =>
      prev
        ? { ...prev, image_url: url || null, image_id: mediaId || null }
        : null
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500">Loading hero settings...</div>
      </div>
    );
  }

  if (!hero) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-charcoal mb-4">{label}</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Title
          </label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Description
          </label>
          <textarea
            value={hero.description || ""}
            onChange={(e) =>
              setHero({ ...hero, description: e.target.value || null })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>

        <ImageUpload
          currentImageUrl={hero.image_url}
          onImageUploaded={handleImageUpload}
          label="Hero Background Image"
          aspectRatio="16/6"
          maxSizeMB={10}
        />

        <div className="border-t pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hero.show_cta}
              onChange={(e) =>
                setHero({ ...hero, show_cta: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm font-medium text-charcoal">
              Show CTA Button
            </span>
          </label>
        </div>

        {hero.show_cta && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={hero.cta_text || ""}
                onChange={(e) =>
                  setHero({ ...hero, cta_text: e.target.value || null })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Book Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                CTA Link
              </label>
              <input
                type="text"
                value={hero.cta_link || ""}
                onChange={(e) =>
                  setHero({ ...hero, cta_link: e.target.value || null })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="/request"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Hero Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
