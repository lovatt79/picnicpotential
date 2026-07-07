import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendFormNotifications } from "@/lib/email/send-notifications";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (data.website) {
      return NextResponse.json({ success: true, message: "Form submitted successfully" }, { status: 200 });
    }

    if (data._t && Date.now() - Number(data._t) < 3000) {
      return NextResponse.json({ success: true, message: "Form submitted successfully" }, { status: 200 });
    }

    const turnstileToken = data.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json({ success: false, message: "Verification challenge is required." }, { status: 400 });
    }
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ success: false, message: "Verification failed. Please try again." }, { status: 403 });
    }

    const supabase = getSupabase();

    if (supabase) {
      const { data: inserted, error } = await supabase
        .from("rental_inquiries")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || null,
          email: data.email,
          event_date: data.eventDate || null,
          location: data.location || null,
          selected_items: (data.selectedItems || []).map((title: string) => ({
            title,
            quantity: data.quantities?.[title] ?? 1,
            colors: data.itemColors?.[title] ?? [],
          })),
          selected_addons: data.selectedAddOns || [],
          how_did_you_hear: data.howDidYouHear || null,
          how_did_you_hear_other: data.howDidYouHearOther || null,
          notes: data.notes || null,
          status: "new",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Database insert error:", error);
      }

      if (!error) {
        await sendFormNotifications(
          "rental-inquiry",
          { ...data, id: inserted?.id },
          data.email,
          `${data.firstName} ${data.lastName}`
        );
      }
    } else {
      console.log("Rental inquiry received:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(
      { success: true, message: "Rental inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Rental inquiry submission error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
