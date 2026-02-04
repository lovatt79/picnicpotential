import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the form submission
    console.log("Form submission received:", JSON.stringify(data, null, 2));

    // TODO: Integrate with email service when ready

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
