import "server-only";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/auth/admin";

export async function sendStudioCode(email: string, otp: string) {
  if (!isAdminEmail(email) || !/^\d{6}$/.test(otp)) {
    throw new Error("Unauthorized Studio code request.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Studio email delivery is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.OTP_FROM_EMAIL || "My Museum <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: `${otp} — My Museum Studio code`,
      text: `Your My Museum Studio code is ${otp}. It expires in 5 minutes. If you did not request this, ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;color:#222;padding:32px"><p style="font-size:12px;letter-spacing:.12em">MY MUSEUM / STUDIO</p><h1 style="font-size:36px;font-weight:400;letter-spacing:.08em">${otp}</h1><p style="font-size:14px">Your sign-in code expires in 5 minutes.</p><p style="font-size:12px;color:#777">If you did not request this, ignore this email.</p></div>`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Studio code email failed", response.status);
    throw new Error("Could not send the Studio code.");
  }
}
