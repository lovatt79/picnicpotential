import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const BASE_URL = "https://www.picnicpotential.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/seating`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faqs`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/request`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/request/service`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/request/proposal`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/request/wedding-suite`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/send-a-hint`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic: services
  const { data: services } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("is_published", true);

  const servicePages: MetadataRoute.Sitemap = (services || []).map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic: partners (slug generated from name)
  const { data: partners } = await supabase
    .from("vendor_partners")
    .select("name, updated_at")
    .eq("is_published", true);

  const partnerPages: MetadataRoute.Sitemap = (partners || []).map((p) => ({
    url: `${BASE_URL}/partners/${slugify(p.name)}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Dynamic: seating options (slug generated from title)
  const { data: seating } = await supabase
    .from("seating_options")
    .select("title, updated_at")
    .eq("is_published", true);

  const seatingPages: MetadataRoute.Sitemap = (seating || []).map((s) => ({
    url: `${BASE_URL}/seating/${slugify(s.title)}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Dynamic: collection pages
  const { data: collections } = await supabase
    .from("collection_pages")
    .select("slug, updated_at")
    .eq("is_published", true);

  const collectionPages: MetadataRoute.Sitemap = (collections || []).map((c) => ({
    url: `${BASE_URL}/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic: builder pages
  const { data: builderPages } = await supabase
    .from("builder_pages")
    .select("slug, updated_at")
    .eq("is_published", true);

  const builtPages: MetadataRoute.Sitemap = (builderPages || []).map((b) => ({
    url: `${BASE_URL}/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...partnerPages, ...seatingPages, ...collectionPages, ...builtPages];
}
