import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, date, affected_forms, reason")
    .order("date");

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, affected_forms, reason } = await request.json();
  if (!date || !affected_forms?.length) {
    return NextResponse.json({ error: "date and affected_forms are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blocked_dates")
    .upsert({ date, affected_forms, reason: reason || null }, { onConflict: "date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
