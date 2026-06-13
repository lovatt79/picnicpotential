import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  const supabase = await createClient();

  const [packages, addons, food, attribution, locations] = await Promise.all([
    supabase
      .from("prop_package_options")
      .select("label, description, price")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("prop_addon_options")
      .select("label, description, price, price_unit")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("prop_food_options")
      .select("label, description, price, price_unit, category")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("form_attribution_options")
      .select("label")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("form_location_options")
      .select("label, location_type, city")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return NextResponse.json(
    {
      packages: packages.data ?? [],
      addons: addons.data ?? [],
      food: food.data ?? [],
      attribution: (attribution.data ?? []).map((a) => a.label),
      locations: locations.data ?? [],
    },
    { headers: { "Cache-Control": CACHE } }
  );
}
