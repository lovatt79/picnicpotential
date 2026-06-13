import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  const supabase = await createClient();

  const [packages, food, addons, gifts, attribution] = await Promise.all([
    supabase
      .from("ws_package_options")
      .select("label, description, price")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("ws_food_options")
      .select("label, description, price, price_unit, category")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("ws_addon_options")
      .select("label, description, price, price_unit, category")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("ws_gift_options")
      .select("label, description, price, price_unit")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("form_attribution_options")
      .select("label")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return NextResponse.json(
    {
      packages: packages.data ?? [],
      food: food.data ?? [],
      addons: addons.data ?? [],
      gifts: gifts.data ?? [],
      attribution: (attribution.data ?? []).map((a) => a.label),
    },
    { headers: { "Cache-Control": CACHE } }
  );
}
