import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mrviyqlwcfqlnifcvftg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;
    const otpCode = body.otpCode || body.token;
    const password = body.password;

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otpCode).trim();

    // 1. Check if a valid, unexpired OTP exists in auth_otp_codes table
    const { data: record, error: fetchError } = await supabase
      .from("auth_otp_codes")
      .select("*")
      .eq("email", cleanEmail)
      .eq("otp_code", cleanOtp)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let verifiedByDatabase = false;

    if (!fetchError && record) {
      verifiedByDatabase = true;
      // 2. Mark OTP as verified so it cannot be replayed
      await supabase
        .from("auth_otp_codes")
        .update({ verified: true })
        .eq("id", record.id);
    }

    // Also attempt Supabase native verifyOtp if applicable
    let verifiedBySupabaseAuth = false;
    try {
      const { data: sbAuthData, error: sbAuthError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: "email",
      });
      if (!sbAuthError && sbAuthData?.session) {
        verifiedBySupabaseAuth = true;
      }
    } catch {
      // Non-critical fallback
    }

    if (!verifiedByDatabase && !verifiedBySupabaseAuth) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // 3. Complete user sign-up in Supabase Auth if service role key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { error: authError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: password || crypto.randomBytes(16).toString("hex"),
          email_confirm: true,
        });

        if (authError && !authError.message.includes("already registered") && !authError.message.includes("already exists")) {
          console.warn("[verify-otp] Supabase admin createUser note:", authError.message);
        }
      } catch (adminErr: any) {
        console.warn("[verify-otp] Admin provision note:", adminErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified and account created successfully",
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
