import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendFormNotifications } from "@/lib/email/send-notifications";

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

    // Turnstile verification
    const turnstileToken = data.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, message: "Verification challenge is required." },
        { status: 400 }
      );
    }
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: "Verification failed. Please try again." },
        { status: 403 }
      );
    }

    const supabase = getSupabase();

    if (supabase) {
      const { data: inserted, error } = await supabase.from("proposal_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        email: data.email,
        proposee_name: data.proposeeName || null,
        proposal_date_1: data.proposalDate1 || null,
        proposal_date_2: data.proposalDate2 || null,
        proposal_time: data.proposalTime || null,
        location: data.location || null,
        location_details: data.locationDetails || null,
        colors: data.colors || null,
        package: data.package || null,
        addon_options: (data.addonOptions || []).map((label: string) => ({ label })),
        food_options: (data.foodOptions || []).map((label: string) => ({ label })),
        how_did_you_hear: data.howDidYouHear || null,
        how_did_you_hear_other: data.howDidYouHearOther || null,
        notes: data.notes || null,
        status: "new",
      }).select("id").single();

      if (error) {
        console.error("Database insert error:", error);
      }

      // Send email notifications (fire-and-forget)
      if (!error) {
        sendFormNotifications(
          "proposal",
          { ...data, id: inserted?.id },
          data.email,
          `${data.firstName} ${data.lastName}`
        ).catch((err) => console.error("Email notification error:", err));
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
