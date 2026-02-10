"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const settingKeys = [
  { key: "site_name", label: "Site Name" },
  { key: "site_tagline", label: "Site Tagline" },
  { key: "contact_email", label: "Contact Email" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "pinterest_url", label: "Pinterest URL" },
  { key: "tiktok_url", label: "TikTok URL" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    for (const { key } of settingKeys) {
      if (settings[key] !== undefined) {
        await supabase.from("site_settings").upsert({ key, value: settings[key] });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Site Settings</h1>
        <p className="text-warm-gray mt-1">Configure your website settings</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {settingKeys.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-charcoal mb-1">{label}</label>
              <input
                type={key.includes("url") || key.includes("email") ? "url" : "text"}
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sage-dark text-sm">Settings saved!</span>}
        </div>
      </div>
    </div>
  );
}
