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
      const { data: inserted, error } = await supabase.from("ws_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        email: data.email,
        couple_name_1: data.coupleName1 || null,
        couple_name_2: data.coupleName2 || null,
        venue_name: data.venueName || null,
        venue_address: data.venueAddress || null,
        venue_contact_name: data.venueContactName || null,
        venue_contact_email: data.venueContactEmail || null,
        venue_contact_phone: data.venueContactPhone || null,
        event_date: data.eventDate || null,
        arrival_time: data.arrivalTime || null,
        suite_access_time: data.suiteAccessTime || null,
        people_count: data.peopleCount || null,
        package: data.package || null,
        food_options: data.foodOptions || [],
        addon_options: (data.addonOptions || []).map((label: string) => ({ label })),
        gift_options: (data.giftOptions || []).map((label: string) => ({ label })),
        swap_request: data.swapRequest || null,
        how_did_you_hear: data.howDidYouHear || null,
        how_did_you_hear_other: data.howDidYouHearOther || null,
        notes: data.notes || null,
        status: "new",
      }).select("id").single();

      if (error) {
        console.error("Database insert error:", error);
      }

      // Send email notifications (awaited so serverless function doesn't exit early)
      if (!error) {
        await sendFormNotifications(
          "wedding-suite",
          { ...data, id: inserted?.id },
          data.email,
          `${data.firstName} ${data.lastName}`
        );
      }
    } else {
      console.log("Wedding suite form submission received:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(
      { success: true, message: "Wedding suite request submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Wedding suite submission error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
