import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { id, table } = await request.json();

    if (!id || !table) {
      return NextResponse.json(
        { success: false, message: "Missing id or table" },
        { status: 400 }
      );
    }

    // Only allow known tables
    const allowedTables = ["form_submissions", "proposal_submissions", "ws_submissions"];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { success: false, message: "Invalid table" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Database not configured" },
        { status: 500 }
      );
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete submission error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
