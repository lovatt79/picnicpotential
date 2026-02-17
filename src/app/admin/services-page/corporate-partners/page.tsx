"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

interface CorporatePartner {
  id: string;
  name: string;
  logo_id: string | null;
  logo_url: string | null;
  url: string | null;
  sort_order: number;
  is_published: boolean;
}

export default function CorporatePartnersAdmin() {
  const supabase = createClient();
  const [partners, setPartners] = useState<CorporatePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    logoUrl: "",
    logoId: null as string | null,
    url: "",
    is_published: true,
  });

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_partners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      // Fetch logo URLs for each partner
      const partnersWithLogos = await Promise.all(
        (data || []).map(async (partner) => {
          let logoUrl = partner.logo_url;
          if (partner.logo_id) {
            const { data: imageData } = await supabase
              .from("media")
              .select("url")
              .eq("id", partner.logo_id)
              .single();
            if (imageData) logoUrl = imageData.url;
          }
          return { ...partner, logo_url: logoUrl };
        })
      );
      setPartners(partnersWithLogos);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setFormData({
      id: "",
      name: "",
      logoUrl: "",
      logoId: null,
      url: "",
      is_published: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  }

  async function openEditModal(partner: CorporatePartner) {
    // Fetch logo URL if logo_id exists
    let logoUrl = partner.logo_url || "";
    if (partner.logo_id) {
      const { data: imageData } = await supabase
        .from("media")
        .select("url")
        .eq("id", partner.logo_id)
        .single();
      if (imageData) logoUrl = imageData.url;
    }

    setFormData({
      id: partner.id,
      name: partner.name,
      logoUrl: logoUrl,
      logoId: partner.logo_id,
      url: partner.url || "",
      is_published: partner.is_published,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  }

  const handleLogoUpload = (url: string, mediaId: string) => {
    setFormData({ ...formData, logoUrl: url, logoId: mediaId });
  };

  async function handleSave() {
    if (!formData.name.trim()) {
      setError("Partner name is required");
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing) {
      const { error } = await supabase
        .from("corporate_partners")
        .update({
          name: formData.name,
          logo_url: formData.logoUrl || null,
          logo_id: formData.logoId,
          url: formData.url || null,
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
      const { error } = await supabase.from("corporate_partners").insert({
        name: formData.name,
        logo_url: formData.logoUrl || null,
        logo_id: formData.logoId,
        url: formData.url || null,
        is_published: formData.is_published,
        sort_order: partners.length,
      });

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    loadPartners();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this partner?")) return;

    const { error } = await supabase.from("corporate_partners").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      loadPartners();
    }
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("corporate_partners")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      loadPartners();
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
          <h1 className="font-serif text-3xl text-charcoal">Corporate Partners</h1>
          <p className="mt-2 text-sm text-warm-gray">
            Manage corporate partner logos displayed on the /services page
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          Add Partner
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-sage-light p-4">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-sage-dark">No Logo</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-charcoal mb-1">{partner.name}</h3>
              {partner.url && (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:underline block mb-2 truncate"
                >
                  {partner.url}
                </a>
              )}
              <div className="flex items-center gap-2 text-xs mb-3">
                <span
                  className={`px-2 py-1 rounded ${
                    partner.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {partner.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(partner)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(partner.id, partner.is_published)}
                  className="text-sm text-charcoal hover:text-gold"
                >
                  {partner.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12 text-warm-gray">
          <p>No corporate partners yet. Click "Add Partner" to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-serif text-2xl text-charcoal">
                {isEditing ? "Edit Partner" : "New Partner"}
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
                  Partner Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g., Company Name"
                />
              </div>

              <div>
                <ImageUpload
                  label="Partner Logo"
                  onImageUploaded={handleLogoUpload}
                  currentImageUrl={formData.logoUrl || undefined}
                  aspectRatio="16/9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Website URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({ ...formData, is_published: e.target.checked })
                    }
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
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
