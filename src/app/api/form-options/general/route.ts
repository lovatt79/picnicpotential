import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 5-min CDN cache, serve stale for up to 10 min while revalidating.
// Replaces 8 direct browser→Supabase calls per form load with one
// Vercel-cached response regardless of traffic volume.
const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  const supabase = await createClient();

  const [events, colors, food, desserts, addons, occasions, attribution, locations] =
    await Promise.all([
      supabase.from("form_event_types").select("label").eq("is_active", true).order("sort_order"),
      supabase.from("form_color_options").select("label").eq("is_active", true).order("sort_order"),
      supabase
        .from("form_food_options")
        .select("label, price, price_unit, min_quantity, is_vegan, is_gluten_free")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("form_dessert_options")
        .select("label, price, price_unit, min_quantity, is_vegan, is_gluten_free")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("form_addon_options")
        .select("label, price, price_unit, category")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("form_occasion_options").select("label").eq("is_active", true).order("sort_order"),
      supabase.from("form_attribution_options").select("label").eq("is_active", true).order("sort_order"),
      supabase
        .from("form_location_options")
        .select("label, location_type, city")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

  return NextResponse.json(
    {
      eventTypes: (events.data ?? []).map((e) => e.label),
      colors: (colors.data ?? []).map((c) => c.label),
      food: food.data ?? [],
      desserts: desserts.data ?? [],
      addons: addons.data ?? [],
      occasions: (occasions.data ?? []).map((o) => o.label),
      attribution: (attribution.data ?? []).map((a) => a.label),
      locations: locations.data ?? [],
    },
    { headers: { "Cache-Control": CACHE } }
  );
}
