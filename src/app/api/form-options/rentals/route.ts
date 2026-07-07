import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  const supabase = await createClient();

  const { data: attribution } = await supabase
    .from("form_attribution_options")
    .select("label")
    .eq("is_active", true)
    .order("sort_order");

  return NextResponse.json(
    { attribution: (attribution ?? []).map((a) => a.label) },
    { headers: { "Cache-Control": CACHE } }
  );
}
