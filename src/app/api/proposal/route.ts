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
    const data = await request.json();
    const supabase = getSupabase();

    if (supabase) {
      const { error } = await supabase.from("proposal_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        email: data.email,
        proposee_name: data.proposeeName || null,
        proposal_date_1: data.proposalDate1 || null,
        proposal_date_2: data.proposalDate2 || null,
        proposal_time: data.proposalTime || null,
        location: data.location || null,
        colors: data.colors || null,
        package: data.package || null,
        addon_options: (data.addonOptions || []).map((label: string) => ({ label })),
        food_options: (data.foodOptions || []).map((label: string) => ({ label })),
        how_did_you_hear: data.howDidYouHear || null,
        how_did_you_hear_other: data.howDidYouHearOther || null,
        notes: data.notes || null,
        status: "new",
      });

      if (error) {
        console.error("Database insert error:", error);
      }
    } else {
      console.log("Proposal form submission received:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(
      { success: true, message: "Proposal request submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Proposal submission error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
