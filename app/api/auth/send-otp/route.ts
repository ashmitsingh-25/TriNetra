import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid email address is required." },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // 1. Generate a cryptographically random 6-digit numeric OTP
    const otpCode = crypto.randomInt(100000, 999999).toString()

    // 2. Invalidate any existing unverified OTPs for this email to avoid collisions
    await supabase
      .from("auth_otp_codes")
      .update({ verified: true })
      .eq("email", cleanEmail)
      .eq("verified", false)

    // 3. Store the new 6-digit OTP code in public.auth_otp_codes (valid for 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const { error: insertError } = await supabase
      .from("auth_otp_codes")
      .insert({
        email: cleanEmail,
        otp_code: otpCode,
        expires_at: expiresAt,
        verified: false,
      })

    if (insertError) {
      console.error("[send-otp] Error saving OTP to database:", insertError)
      return NextResponse.json(
        { success: false, error: "Database error creating verification code." },
        { status: 500 }
      )
    }

    // 4. HTML Email Template with high-contrast 6-digit numeric display
    const emailHtmlBody = `
      <div style="background:#050505;color:#ffffff;padding:24px;border-radius:12px;font-family:sans-serif;border:1px solid #ff2a8d;max-width:480px;margin:0 auto;">
        <p style="color:#ff2a8d;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;font-weight:700;">त्रिNETRA Security Verification</p>
        <p style="color:#d4d4d8;font-size:14px;margin:0 0 16px 0;line-height:1.5;">Use the 6-digit verification code below to complete your sign-in to the UPI Defense Grid:</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#e5ff40;background:#111115;padding:16px 24px;border-radius:8px;display:inline-block;font-family:monospace;border:1px solid rgba(229,255,64,0.3);">${otpCode}</div>
        <p style="color:#71717a;font-size:12px;margin:16px 0 0 0;">This code expires in 10 minutes. Never share this OTP with anyone, including bank or cyber defense personnel.</p>
      </div>
    `

    let emailDispatched = false

    // 5. If Resend API Key is available, dispatch directly via Resend API
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "TriNETRA Security <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: `Your त्रिNETRA Verification Code: ${otpCode}`,
            html: emailHtmlBody,
          }),
        })
        if (resendRes.ok) {
          emailDispatched = true
          console.log(`[send-otp] Dispatched via Resend to ${cleanEmail}`)
        }
      } catch (resendErr) {
        console.warn("[send-otp] Resend dispatch note:", resendErr)
      }
    }

    // 6. Trigger Supabase native signInWithOtp (sends email via Supabase's mail service)
    try {
      const { error: sbError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      })
      if (!sbError) {
        emailDispatched = true
      } else {
        console.warn("[send-otp] Supabase native signInWithOtp note:", sbError.message)
      }
    } catch (e: any) {
      console.warn("[send-otp] Supabase signInWithOtp exception:", e?.message)
    }

    console.log(`[send-otp] Dispatched 6-digit OTP for ${cleanEmail} (email sent: ${emailDispatched})`)

    // NEVER return otpCode to the client!
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Gmail inbox and spam folder.`,
      email: cleanEmail,
      emailSent: emailDispatched,
    })
  } catch (err: any) {
    console.error("[send-otp] Unexpected error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch verification OTP." },
      { status: 500 }
    )
  }
}
