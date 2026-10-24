import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, otpCode } = body

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit OTP code are required." },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanToken = otpCode.trim()

    let isVerified = false
    let verificationMethod = ""

    // 1. Check against public.auth_otp_codes in Supabase
    const { data: dbOtp, error: dbError } = await supabase
      .from("auth_otp_codes")
      .select("*")
      .eq("email", cleanEmail)
      .eq("otp_code", cleanToken)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dbOtp) {
      isVerified = true
      verificationMethod = "database_otp"

      // Mark as verified so it cannot be replayed
      await supabase
        .from("auth_otp_codes")
        .update({ verified: true })
        .eq("id", dbOtp.id)
    }

    // 2. Also try verifying against Supabase Auth verifyOtp
    try {
      const { data: sbAuthData, error: sbAuthError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "email",
      })

      if (!sbAuthError && sbAuthData?.session) {
        isVerified = true
        verificationMethod = verificationMethod ? `${verificationMethod}_and_supabase_auth` : "supabase_auth"
      }
    } catch (sbEx) {
      // If Supabase native fails but database OTP passed, we proceed smoothly
      console.log("[verify-otp] Supabase native verify note:", sbEx)
    }

    if (!isVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired OTP code. Please re-check the 6-digit code sent to your email or request a new one.",
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "6-digit OTP verified successfully.",
      email: cleanEmail,
      method: verificationMethod,
    })
  } catch (err: any) {
    console.error("[verify-otp] Unexpected error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify OTP." },
      { status: 500 }
    )
  }
}
