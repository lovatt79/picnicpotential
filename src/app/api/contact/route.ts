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
      // Build insert payload based on submission type
      const insertData = data.type === "hint"
        ? {
            // Send a Hint form — map sender/recipient fields
            first_name: data.senderName || null,
            last_name: "",
            email: data.senderEmail || null,
            event_type: "Send a Hint",
            occasion: data.occasion || null,
            notes: [
              `Recipient: ${data.recipientName || "—"}`,
              `Recipient Email: ${data.recipientEmail || "—"}`,
              data.message ? `\nMessage:\n${data.message}` : "",
            ].filter(Boolean).join("\n"),
            status: "new",
          }
        : {
            // Standard service request form
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            email: data.email,
            event_date: data.eventDate || null,
            backup_date: data.backupDate || null,
            event_type: data.eventType || null,
            event_time: data.eventTime || null,
            additional_time: data.additionalTime || null,
            city: data.city || null,
            exact_location: data.exactLocation || null,
            group_size: data.groupSize || null,
            guest_names: data.guestNames || null,
            occasion: data.occasion || null,
            color_choice_1: data.colorChoice1 || null,
            color_choice_1_other: data.colorChoice1Other || null,
            color_choice_2: data.colorChoice2 || null,
            color_choice_2_other: data.colorChoice2Other || null,
            food_options: data.foodOptions || [],
            dessert_options: data.dessertOptions || [],
            dessert_other: data.dessertOther || null,
            addon_options: data.addOns || [],
            how_did_you_hear: data.howDidYouHear || null,
            how_did_you_hear_other: data.howDidYouHearOther || null,
            referred_by: data.referredBy || null,
            notes: data.notes || null,
            status: "new",
          };

      // Insert into form_submissions table
      const { error } = await supabase.from("form_submissions").insert(insertData);

      if (error) {
        console.error("Database insert error:", error);
      }
    } else {
      // Supabase not configured - just log the submission
      console.log("Form submission received:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Form submission error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
