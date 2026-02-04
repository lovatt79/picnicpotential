import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventDate: string;
  backupDate: string;
  eventType: string;
  eventTime: string;
  additionalTime: string;
  city: string;
  exactLocation: string;
  colorChoice1: string;
  colorChoice1Other: string;
  colorChoice2: string;
  colorChoice2Other: string;
  groupSize: string;
  guestNames: string;
  foodOptions: string[];
  dessertOptions: string[];
  dessertOther: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
  referredBy: string;
  addOns: string[];
  occasion: string;
  notes: string;
}

function generateOpsEmailHTML(data: FormData): string {
  const color1 = data.colorChoice1 === "Other" ? `Other: ${data.colorChoice1Other}` : data.colorChoice1;
  const color2 = data.colorChoice2 === "Other" ? `Other: ${data.colorChoice2Other}` : data.colorChoice2;
  const heardAbout = data.howDidYouHear === "Other" ? `Other: ${data.howDidYouHearOther}` : data.howDidYouHear;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2C2C2C; margin: 0; padding: 0; background-color: #f9f6f2; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #B8D4C8, #D4E8DF); padding: 30px; text-align: center; }
    .header h1 { font-family: Georgia, serif; color: #2C2C2C; margin: 0; font-size: 24px; }
    .header p { color: #6B6B6B; margin: 8px 0 0; font-size: 14px; }
    .section { padding: 20px 30px; border-bottom: 1px solid #f0ebe5; }
    .section h2 { font-family: Georgia, serif; color: #E8B86D; margin: 0 0 12px; font-size: 18px; }
    .row { display: flex; margin-bottom: 8px; }
    .label { font-weight: 600; color: #2C2C2C; min-width: 180px; font-size: 14px; }
    .value { color: #6B6B6B; font-size: 14px; }
    .list-item { padding: 4px 0; color: #6B6B6B; font-size: 14px; }
    .footer { padding: 20px 30px; text-align: center; color: #6B6B6B; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Service Request</h1>
      <p>From ${data.firstName} ${data.lastName}</p>
    </div>

    <div class="section">
      <h2>Contact Information</h2>
      <div class="row"><span class="label">Name:</span><span class="value">${data.firstName} ${data.lastName}</span></div>
      <div class="row"><span class="label">Phone:</span><span class="value">${data.phone}</span></div>
      <div class="row"><span class="label">Email:</span><span class="value">${data.email}</span></div>
    </div>

    <div class="section">
      <h2>Event Details</h2>
      <div class="row"><span class="label">Event Date:</span><span class="value">${data.eventDate || "Not specified"}</span></div>
      <div class="row"><span class="label">Backup Date:</span><span class="value">${data.backupDate || "Not specified"}</span></div>
      <div class="row"><span class="label">Event Type:</span><span class="value">${data.eventType || "Not specified"}</span></div>
      <div class="row"><span class="label">Time:</span><span class="value">${data.eventTime || "Not specified"}</span></div>
      <div class="row"><span class="label">Occasion:</span><span class="value">${data.occasion || "Not specified"}</span></div>
      <div class="row"><span class="label">Additional Time:</span><span class="value">${data.additionalTime || "None"}</span></div>
      <div class="row"><span class="label">City:</span><span class="value">${data.city || "Not specified"}</span></div>
      <div class="row"><span class="label">Exact Location:</span><span class="value">${data.exactLocation || "Not specified"}</span></div>
      <div class="row"><span class="label">Group Size:</span><span class="value">${data.groupSize || "Not specified"}</span></div>
      <div class="row"><span class="label">Guest Names:</span><span class="value">${data.guestNames || "Not provided"}</span></div>
    </div>

    <div class="section">
      <h2>Color Palette</h2>
      <div class="row"><span class="label">1st Choice:</span><span class="value">${color1 || "Not selected"}</span></div>
      <div class="row"><span class="label">2nd Choice:</span><span class="value">${color2 || "Not selected"}</span></div>
    </div>

    ${data.foodOptions.length > 0 ? `
    <div class="section">
      <h2>Food Selections</h2>
      ${data.foodOptions.map((f) => `<div class="list-item">• ${f}</div>`).join("")}
    </div>
    ` : ""}

    ${data.dessertOptions.length > 0 || data.dessertOther ? `
    <div class="section">
      <h2>Dessert Selections</h2>
      ${data.dessertOptions.map((d) => `<div class="list-item">• ${d}</div>`).join("")}
      ${data.dessertOther ? `<div class="list-item">• Other: ${data.dessertOther}</div>` : ""}
    </div>
    ` : ""}

    ${data.addOns.length > 0 ? `
    <div class="section">
      <h2>Add-Ons</h2>
      ${data.addOns.map((a) => `<div class="list-item">• ${a}</div>`).join("")}
    </div>
    ` : ""}

    <div class="section">
      <h2>Additional Info</h2>
      <div class="row"><span class="label">How They Heard:</span><span class="value">${heardAbout || "Not specified"}</span></div>
      ${data.referredBy ? `<div class="row"><span class="label">Referred By:</span><span class="value">${data.referredBy}</span></div>` : ""}
      ${data.notes ? `<div class="row"><span class="label">Notes:</span><span class="value">${data.notes}</span></div>` : ""}
    </div>

    <div class="footer">
      <p>This request was submitted via the Picnic Potential website.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateCustomerEmailHTML(data: FormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2C2C2C; margin: 0; padding: 0; background-color: #f9f6f2; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #B8D4C8, #F5D5D5); padding: 40px 30px; text-align: center; }
    .header h1 { font-family: Georgia, serif; color: #2C2C2C; margin: 0; font-size: 28px; }
    .header p { color: #6B6B6B; margin: 12px 0 0; font-size: 16px; }
    .body { padding: 30px; }
    .body p { color: #6B6B6B; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .highlight { background: #FFF9F5; border-left: 4px solid #E8B86D; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .highlight p { margin: 0; color: #2C2C2C; font-size: 14px; }
    .cta { text-align: center; margin: 24px 0; }
    .cta a { display: inline-block; background: #E8B86D; color: #2C2C2C; text-decoration: none; padding: 12px 32px; border-radius: 50px; font-weight: 600; font-size: 14px; }
    .footer { padding: 24px 30px; text-align: center; border-top: 1px solid #f0ebe5; }
    .footer p { color: #9B9B9B; font-size: 12px; margin: 4px 0; }
    .social { margin-top: 12px; }
    .social a { color: #E8B86D; text-decoration: none; font-size: 13px; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You, ${data.firstName}!</h1>
      <p>We&rsquo;ve received your service request</p>
    </div>

    <div class="body">
      <p>Thank you for submitting the picnic request form. We are so excited to start planning your experience!</p>

      <p>Our team will review your request and respond with pricing and details based on your selections. You can expect to hear from us within 24&ndash;48 hours.</p>

      <div class="highlight">
        <p><strong>Important:</strong> Please note that picnic reservations are not secured until the deposit has been received. We will include deposit details in our response.</p>
      </div>

      <p>In the meantime, check out our Pinterest and Instagram for inspiration!</p>

      <div class="cta">
        <a href="https://www.instagram.com/Picnic.Potential/">Follow Us on Instagram</a>
      </div>

      <p>If you have any questions or need to make changes, feel free to reply to this email or contact us at <a href="mailto:Info@picnicpotential.com" style="color: #E8B86D;">Info@picnicpotential.com</a>.</p>

      <p style="margin-top: 24px;">With love,<br /><strong>The Picnic Potential Team</strong></p>
    </div>

    <div class="footer">
      <div class="social">
        <a href="https://www.instagram.com/Picnic.Potential/">Instagram</a>
        <a href="https://www.pinterest.com/PicnicPotential/">Pinterest</a>
      </div>
      <p style="margin-top: 12px;">&copy; ${new Date().getFullYear()} Picnic Potential. All rights reserved.</p>
      <p>Sonoma County, California</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const data: FormData = await request.json();

    // Send notification email to operations team
    await resend.emails.send({
      from: "Picnic Potential <onboarding@resend.dev>",
      to: "Info@picnicpotential.com",
      subject: `New Service Request from ${data.firstName} ${data.lastName} - ${data.eventType || "General Inquiry"}`,
      html: generateOpsEmailHTML(data),
    });

    // Send confirmation email to customer
    if (data.email) {
      await resend.emails.send({
        from: "Picnic Potential <onboarding@resend.dev>",
        to: data.email,
        subject: "We've Received Your Request! - Picnic Potential",
        html: generateCustomerEmailHTML(data),
      });
    }

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or email us directly at Info@picnicpotential.com" },
      { status: 500 }
    );
  }
}
