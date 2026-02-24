import { Resend } from "resend";
import type { ReactElement } from "react";

// Lazy singleton — avoids crashing at import time if env var is missing
let _resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return null;
  }
  if (!_resend) {
    _resend = new Resend(key);
  }
  return _resend;
}

// TODO: Switch to "Picnic Potential <hello@picnicpotential.com>" once domain is verified in Resend
export const FROM_ADDRESS = "Picnic Potential <onboarding@resend.dev>";
// TODO: Switch back to "info@picnicpotential.com" once domain is verified in Resend
export const OPS_EMAIL = "lovatt79@gmail.com";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: ReactElement;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] No Resend client — skipping email to:", params.to);
    return;
  }

  console.log("[Email] Sending to:", params.to, "| Subject:", params.subject);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: params.subject,
      react: params.react,
    });
    if (error) {
      console.error("[Email] Resend error:", JSON.stringify(error));
    } else {
      console.log("[Email] Sent successfully! ID:", data?.id);
    }
  } catch (err) {
    console.error("[Email] Failed to send:", err);
  }
}
