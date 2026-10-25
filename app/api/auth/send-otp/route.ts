import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mrviyqlwcfqlnifcvftg.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydml5cWx3Y2ZxbG5pZmN2ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzA0MDcsImV4cCI6MjEwODQwNjQwN30.HqgGdOvnveEcAqoupy-8gNTTQ2oGNDqnIgIG8F0VM74";

const supabase = createClient(supabaseUrl, supabaseKey);

// Configurable Nodemailer SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Generate a secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    // Invalidate prior unverified codes for this email
    try {
      await supabase
        .from("auth_otp_codes")
        .update({ verified: true })
        .eq("email", cleanEmail)
        .eq("verified", false);
    } catch {
      // Non-critical cleanup
    }

    // 2. Save the code to Supabase auth_otp_codes table
    const { error: dbError } = await supabase.from("auth_otp_codes").insert({
      email: cleanEmail,
      otp_code: otpCode,
      expires_at: expiresAt.toISOString(),
      verified: false,
    });

    if (dbError) {
      console.error("[send-otp] DB insert error:", dbError);
      throw dbError;
    }

    const emailHtml = `
      <div style="background:#050505;color:#ffffff;padding:28px;border-radius:14px;font-family:system-ui,-apple-system,sans-serif;border:1px solid #ff2a8d;max-width:480px;margin:0 auto;">
         <p style="color:#ff2a8d;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;font-weight:700;">Security Verification</p>
         <p style="color:#d4d4d8;font-size:14px;margin:0 0 16px 0;line-height:1.5;">Use the 6-digit verification code below to complete your sign-up to the त्रिNETRA Defense Grid:</p>
         <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#e5ff40;background:#111115;padding:16px 24px;border-radius:10px;display:inline-block;font-family:ui-monospace,Menlo,monospace;border:1px solid rgba(229,255,64,0.3);">${otpCode}</div>
         <p style="color:#71717a;font-size:12px;margin:18px 0 0 0;line-height:1.5;">This code expires in 10 minutes. Never share this OTP with anyone, including banking or cyber defense agents.</p>
       </div>
    `;

    let emailDispatched = false;

    // 3. Send email using SMTP if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"त्रिNETRA Portal" <${process.env.SMTP_SENDER_EMAIL || process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: `Your Verification Code: ${otpCode}`,
          html: emailHtml,
        });
        emailDispatched = true;
        console.log(`[send-otp] Dispatched via Nodemailer SMTP to ${cleanEmail}`);
      } catch (smtpErr: any) {
        console.warn("[send-otp] SMTP dispatch warning:", smtpErr?.message);
      }
    }

    // 4. Fallback dispatch via Resend if RESEND_API_KEY is present
    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "TriNETRA Security <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: `Your त्रिNETRA Verification Code: ${otpCode}`,
            html: emailHtml,
          }),
        });
        if (resendRes.ok) emailDispatched = true;
      } catch (resendErr) {
        console.warn("[send-otp] Resend dispatch note:", resendErr);
      }
    }

    // 5. Native Supabase OTP trigger fallback
    if (!emailDispatched) {
      try {
        const { error: sbError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: true },
        });
        if (!sbError) emailDispatched = true;
      } catch (sbEx: any) {
        console.warn("[send-otp] Supabase native auth note:", sbEx?.message);
      }
    }

    console.log(`[send-otp] Dispatched 6-digit OTP for ${cleanEmail} (email sent: ${emailDispatched})`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      email: cleanEmail,
      emailSent: emailDispatched,
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
