"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface LuxuryPicnicCategory {
  id: string;
  title: string;
  description: string;
  gradient_class: string;
  sort_order: number;
  is_published: boolean;
}

const GRADIENT_OPTIONS = [
  { value: "from-blush to-peach-light", label: "Blush to Peach" },
  { value: "from-lavender-light to-sky-light", label: "Lavender to Sky" },
  { value: "from-peach-light to-blush-light", label: "Peach to Blush" },
  { value: "from-sky-light to-sage-light", label: "Sky to Sage" },
  { value: "from-sage to-sage-light", label: "Sage" },
  { value: "from-gold to-gold-light", label: "Gold" },
];

export default function LuxuryPicnicsAdmin() {
  const supabase = createClient();
  const [categories, setCategories] = useState<LuxuryPicnicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    gradient_class: "from-blush to-peach-light",
    is_published: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("luxury_picnic_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setFormData({
      id: "",
      title: "",
      description: "",
      gradient_class: "from-blush to-peach-light",
      is_published: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  }

  function openEditModal(category: LuxuryPicnicCategory) {
    setFormData({
      id: category.id,
      title: category.title,
      description: category.description,
      gradient_class: category.gradient_class,
      is_published: category.is_published,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing) {
      const { error } = await supabase
        .from("luxury_picnic_categories")
        .update({
          title: formData.title,
          description: formData.description,
          gradient_class: formData.gradient_class,
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formData.id);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("luxury_picnic_categories").insert({
        title: formData.title,
        description: formData.description,
        gradient_class: formData.gradient_class,
        is_published: formData.is_published,
        sort_order: categories.length,
      });

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;

    const { error } = await supabase
      .from("luxury_picnic_categories")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      loadCategories();
    }
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("luxury_picnic_categories")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      loadCategories();
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin
          </Link>
          <h1 className="font-serif text-3xl text-charcoal">Luxury Picnic Categories</h1>
          <p className="mt-2 text-sm text-warm-gray">
            Manage the 4 category cards in the Luxury Picnics section of the /services page
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${category.gradient_class}`}
              >
                <span className="font-serif text-sm text-charcoal/50 text-center px-2">
                  {category.title}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-charcoal mb-1">{category.title}</h3>
              <p className="text-sm text-warm-gray mb-3">{category.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    category.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(category.id, category.is_published)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  {category.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-serif text-2xl text-charcoal">
                {isEditing ? "Edit Category" : "New Category"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g., Private Celebrations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Gradient Color
                </label>
                <select
                  value={formData.gradient_class}
                  onChange={(e) => setFormData({ ...formData, gradient_class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {GRADIENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 h-20 rounded-lg bg-gradient-to-br" style={{
                  background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }} className={`mt-2 h-20 rounded-lg bg-gradient-to-br ${formData.gradient_class}`} />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                </label>
                <span className="text-sm text-charcoal">Published</span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-warm-gray hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
