"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface ServicesPageSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  link_text: string | null;
  link_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export default function ServicesSectionsAdmin() {
  const supabase = createClient();
  const [sections, setSections] = useState<ServicesPageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ServicesPageSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services_page_sections")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setSections(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editingSection) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("services_page_sections")
      .update({
        title: editingSection.title,
        content: editingSection.content,
        link_text: editingSection.link_text || null,
        link_url: editingSection.link_url || null,
        is_visible: editingSection.is_visible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingSection.id);

    if (error) {
      setError(error.message);
    } else {
      setEditingSection(null);
      loadSections();
    }

    setSaving(false);
  }

  async function handleToggleVisibility(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("services_page_sections")
      .update({ is_visible: !currentStatus })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      loadSections();
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
          href="/admin"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">Services Page Sections</h1>
        <p className="mt-2 text-sm text-warm-gray">
          Manage content sections on the /services page (Community Seating, Corporate Events, etc.)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-serif text-xl text-charcoal">{section.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      section.is_visible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {section.is_visible ? "Visible" : "Hidden"}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                    {section.section_key}
                  </span>
                </div>
                <p className="text-sm text-warm-gray line-clamp-3">{section.content}</p>
                {section.link_text && section.link_url && (
                  <p className="text-sm text-gold mt-2">
                    Link: {section.link_text} → {section.link_url}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setEditingSection(section)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  {section.is_visible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-serif text-2xl text-charcoal">Edit Section</h2>
              <p className="text-sm text-warm-gray mt-1">
                Section Key: <span className="font-mono">{editingSection.section_key}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Content
                </label>
                <textarea
                  value={editingSection.content}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none font-mono text-sm"
                />
                <p className="text-xs text-warm-gray mt-1">
                  This text will be displayed in the section. Use proper punctuation and formatting.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Link Text (optional)
                  </label>
                  <input
                    type="text"
                    value={editingSection.link_text || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, link_text: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="e.g., View All Seating Styles →"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Link URL (optional)
                  </label>
                  <input
                    type="text"
                    value={editingSection.link_url || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, link_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="e.g., /seating"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSection.is_visible}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, is_visible: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                </label>
                <span className="text-sm text-charcoal">Visible on page</span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setEditingSection(null)}
                className="text-warm-gray hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
