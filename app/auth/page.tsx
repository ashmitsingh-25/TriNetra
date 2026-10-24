"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import SplineScene from "@/components/ui/spline-scene"
import { 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Info,
  ExternalLink,
  ShieldAlert
} from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

  // Sign In state
  const [signInPhone, setSignInPhone] = useState("+91 ")
  const [signInPassword, setSignInPassword] = useState("")
  const [showSignInPass, setShowSignInPass] = useState(false)
  const [signInError, setSignInError] = useState("")
  const [signInLoading, setSignInLoading] = useState(false)

  // Sign Up state
  const [signUpStep, setSignUpStep] = useState<"details" | "otp" | "password">("details")
  const [signUpPhone, setSignUpPhone] = useState("+91 ")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [signUpError, setSignUpError] = useState("")
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [otpSentMessage, setOtpSentMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  // Success state
  const [authSuccess, setAuthSuccess] = useState(false)

  // Phone sanitizer (+91 prefix)
  const handlePhoneChange = (val: string, setter: (v: string) => void) => {
    let raw = val
    if (!raw.startsWith("+91")) {
      raw = "+91 " + raw.replace(/^\+?91\s?/, "")
    }
    setter(raw)
  }

  // Validate phone number format
  const isValidIndianPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    return digits.length === 12 && digits.startsWith("91")
  }

  // Validate Gmail constraint
  const isValidGmail = (email: string) => {
    const trimmed = email.trim().toLowerCase()
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmed)
  }

  // Validate alphanumeric password >= 6
  const isValidPassword = (pass: string) => {
    if (pass.length < 6) return false
    const hasAlpha = /[a-zA-Z]/.test(pass)
    const hasNum = /[0-9]/.test(pass)
    return hasAlpha && hasNum
  }

  // Redirect after verification
  const handleAuthComplete = (user: { phone: string; email?: string }) => {
    setAuthSuccess(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("trinetra_user", JSON.stringify(user))
    }
    // Redirect directly to the scanner page and dashboard tabs
    setTimeout(() => {
      router.push("/?tab=scanner")
    }, 1200)
  }

  // --- SIGN IN HANDLER ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInError("")

    if (!isValidIndianPhone(signInPhone)) {
      setSignInError("Please enter a valid 10-digit Indian mobile number with +91.")
      return
    }

    if (!signInPassword) {
      setSignInError("Please enter your password.")
      return
    }

    setSignInLoading(true)

    try {
      const cleanPhone = signInPhone.replace(/\s+/g, "")

      // Query users_profile from Supabase
      const { data: user, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("phone_number", cleanPhone)
        .single()

      if (error || !user) {
        setSignInError("No account found with this phone number. Please switch to Sign Up.")
        setSignInLoading(false)
        return
      }

      if (user.password_hash !== signInPassword) {
        setSignInError("Incorrect password. Please try again.")
        setSignInLoading(false)
        return
      }

      // Record login entry in Supabase
      await supabase.from("login_entries").insert({
        phone_number: cleanPhone,
        email: user.email,
        auth_method: "phone_password",
        status: "SUCCESS",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      })

      handleAuthComplete({ phone: cleanPhone, email: user.email })
    } catch (err: any) {
      setSignInError(err.message || "Sign in failed. Check network connectivity.")
    } finally {
      setSignInLoading(false)
    }
  }

  // --- SIGN UP STEP 1: SEND REAL OTP VIA SUPABASE ---
  const handleSendRealOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!isValidIndianPhone(signUpPhone)) {
      setSignUpError("Please enter a valid 10-digit phone number starting with +91.")
      return
    }

    if (!isValidGmail(signUpEmail)) {
      setSignUpError("Email must be a valid @gmail.com address (e.g. yourname@gmail.com).")
      return
    }

    setSignUpLoading(true)

    try {
      const cleanEmail = signUpEmail.trim().toLowerCase()

      // Trigger guaranteed 6-digit OTP dispatch via backend
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, phone: signUpPhone }),
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to dispatch verification OTP.")
      }

      setOtpSentMessage(result.message || `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Gmail inbox and spam folder.`)
      setSignUpStep("otp")
      setResendCooldown(60)

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      setSignUpError(err.message || "Failed to dispatch verification OTP.")
    } finally {
      setSignUpLoading(false)
    }
  }

  // --- SIGN UP STEP 2: VERIFY REAL OTP VIA SUPABASE ---
  const handleVerifyRealOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!enteredOtp || enteredOtp.trim().length < 6) {
      setSignUpError("Please enter the complete 6-digit OTP code received in your email.")
      return
    }

    setSignUpLoading(true)

    try {
      const cleanEmail = signUpEmail.trim().toLowerCase()

      // Verify the 6-digit OTP against database & Supabase Auth
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otpCode: enteredOtp.trim() }),
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Invalid or expired OTP. Please re-check the 6-digit code sent to your Gmail.")
      }

      // Successfully verified real OTP! Move to password creation
      setSignUpStep("password")
    } catch (err: any) {
      setSignUpError(err.message || "OTP verification failed.")
    } finally {
      setSignUpLoading(false)
    }
  }

  // --- SIGN UP STEP 3: SET PASSWORD & FINALIZE ---
  const handleFinalizeSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!isValidPassword(newPassword)) {
      setSignUpError("Password must be at least 6 alphanumeric characters (must include letters and digits).")
      return
    }

    if (newPassword !== confirmPassword) {
      setSignUpError("New password and confirm password do not match.")
      return
    }

    setSignUpLoading(true)

    try {
      const cleanPhone = signUpPhone.replace(/\s+/g, "")
      const cleanEmail = signUpEmail.trim().toLowerCase()

      // Upsert user into public.users_profile in Supabase
      const { error: profileError } = await supabase.from("users_profile").upsert({
        phone_number: cleanPhone,
        email: cleanEmail,
        password_hash: newPassword,
        verified_at: new Date().toISOString(),
      })

      if (profileError) {
        throw profileError
      }

      // Record successful signup entry in Supabase
      await supabase.from("login_entries").insert({
        phone_number: cleanPhone,
        email: cleanEmail,
        auth_method: "phone_email_otp_password",
        status: "SUCCESS",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      })

      handleAuthComplete({ phone: cleanPhone, email: cleanEmail })
    } catch (err: any) {
      setSignUpError(err.message || "Failed to create account.")
    } finally {
      setSignUpLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#ededed] lg:flex-row">
      {/* Top Navbar / Back Navigation */}
      <div className="absolute left-6 top-6 z-50 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md transition-colors hover:border-[#d4af37]/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing</span>
        </Link>
        <div className="hidden items-center gap-2 font-mono text-xs text-zinc-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-pulse" />
          <span>TRI-NETRA SECURITY GATEWAY</span>
        </div>
      </div>

      {/* ─── LEFT HALF: SPLINE 3D MODEL WITH CURSOR TRACKING ─── */}
      <div className="relative flex h-[45vh] w-full flex-col justify-between overflow-hidden border-b border-white/10 bg-black/90 lg:h-screen lg:w-1/2 lg:border-b-0 lg:border-r">
        {/* Subtle Ambient Lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#ff2a8d]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#d4af37]/15 blur-3xl" />

        {/* Spline 3D Scene */}
        <div className="relative h-full w-full">
          <SplineScene
            sceneUrl="https://prod.spline.design/gSJh2PEkOkX7R4h9/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* ─── RIGHT HALF: LOGIN / SIGNUP INTERFACE ─── */}
      <div className="relative flex min-h-[55vh] w-full items-center justify-center p-6 sm:p-12 lg:h-screen lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header Branding */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-mono text-[#d4af37]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>SUPABASE VERIFIED ACCESS</span>
            </div>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              त्रिNETRA Portal
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Zero-Trust Pre-Payment Threat & Scam Intelligence Defense.
            </p>
          </div>

          {/* Success Screen after authentication */}
          {authSuccess ? (
            <div className="rounded-2xl border border-[#e5ff40]/40 bg-zinc-950/90 p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ff40]/20 text-[#e5ff40]">
                <CheckCircle2 className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">Authentication Verified</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Credentials authorized. Synchronizing with TriNETRA Sentinel Network...
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-[#d4af37]">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
                <span>Redirecting to Storytelling Exhibition...</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Tab Selector: Sign In vs Sign Up */}
              <div className="mb-6 grid grid-cols-2 rounded-xl bg-black/60 p-1 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin")
                    setSignInError("")
                  }}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    activeTab === "signin"
                      ? "bg-gradient-to-r from-[#d4af37] to-[#b38f2a] text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup")
                    setSignUpError("")
                  }}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white shadow-md shadow-[#ff2a8d]/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* ─── TAB 1: SIGN IN ─── */}
              {activeTab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                      <Phone className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>Mobile Number (+91)</span>
                    </label>
                    <input
                      type="tel"
                      value={signInPhone}
                      onChange={(e) => handlePhoneChange(e.target.value, setSignInPhone)}
                      placeholder="+91 9876543210"
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-white outline-none transition-colors focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                      <Lock className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignInPass ? "text" : "password"}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your alphanumeric password"
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPass(!showSignInPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showSignInPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {signInError && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#d4af37]/20 transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {signInLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Credentials...
                      </>
                    ) : (
                      <>
                        <span>Sign In to Sentinel</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-xs text-zinc-400 hover:text-[#d4af37]"
                    >
                      Don&apos;t have an account? <span className="font-semibold underline">Register with Real OTP</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ─── TAB 2: SIGN UP ─── */}
              {activeTab === "signup" && (
                <div>
                  {/* Step Progress Indicators */}
                  <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 text-[11px] font-mono">
                    <span className={signUpStep === "details" ? "font-bold text-[#ff2a8d]" : "text-zinc-500"}>
                      1. Contact
                    </span>
                    <span className="text-zinc-700">&gt;</span>
                    <span className={signUpStep === "otp" ? "font-bold text-[#ff2a8d]" : "text-zinc-500"}>
                      2. Supabase OTP
                    </span>
                    <span className="text-zinc-700">&gt;</span>
                    <span className={signUpStep === "password" ? "font-bold text-[#ff2a8d]" : "text-zinc-500"}>
                      3. Password
                    </span>
                  </div>

                  {/* Step 1: Details (Phone + Gmail) */}
                  {signUpStep === "details" && (
                    <form onSubmit={handleSendRealOtp} className="space-y-4">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Phone className="h-3.5 w-3.5 text-[#ff2a8d]" />
                          <span>Mobile Number (+91)</span>
                        </label>
                        <input
                          type="tel"
                          value={signUpPhone}
                          onChange={(e) => handlePhoneChange(e.target.value, setSignUpPhone)}
                          placeholder="+91 9876543210"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Mail className="h-3.5 w-3.5 text-[#ff2a8d]" />
                          <span>Gmail Address (@gmail.com)</span>
                        </label>
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                          required
                        />
                        <span className="mt-1 block text-[10px] text-zinc-500">
                          * Constraint: Strictly valid @gmail.com accounts only.
                        </span>
                      </div>

                      {signUpError && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{signUpError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={signUpLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:opacity-95 disabled:opacity-50"
                      >
                        {signUpLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" /> Dispatching Supabase OTP...
                          </>
                        ) : (
                          <>
                            <span>Send Real Verification OTP</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Step 2: Real Supabase OTP Verification */}
                  {signUpStep === "otp" && (
                    <form onSubmit={handleVerifyRealOtp} className="space-y-4">
                      {otpSentMessage && (
                        <div className="flex items-start gap-2 rounded-lg border border-[#e5ff40]/30 bg-[#e5ff40]/10 p-3 text-xs text-[#e5ff40]">
                          <Info className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{otpSentMessage}</span>
                        </div>
                      )}

                      <div>
                        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            <KeyRound className="h-3.5 w-3.5 text-[#ff2a8d]" />
                            <span>Enter 6-Digit Verification Code</span>
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">Sent to Gmail</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-center font-mono text-xl tracking-[0.4em] text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                          required
                        />
                      </div>

                      {signUpError && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{signUpError}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSignUpStep("details")}
                          className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-zinc-400 hover:bg-white/5"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={signUpLoading}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:opacity-95 disabled:opacity-50"
                        >
                          {signUpLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4" /> Verify Real OTP
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        {resendCooldown > 0 ? (
                          <span className="font-mono text-xs text-zinc-500">
                            Resend code in {resendCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendRealOtp}
                            className="font-mono text-xs text-[#ff2a8d] hover:underline"
                          >
                            Resend Verification Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {/* Step 3: Password Creation */}
                  {signUpStep === "password" && (
                    <form onSubmit={handleFinalizeSignUp} className="space-y-4">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Lock className="h-3.5 w-3.5 text-[#ff2a8d]" />
                          <span>Create Password (Min 6 Alphanumeric)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="e.g. Sentinel99"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                          >
                            {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#ff2a8d]" />
                          <span>Confirm Password</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                          >
                            {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {signUpError && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{signUpError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={signUpLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:opacity-95 disabled:opacity-50"
                      >
                        {signUpLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" /> Registering in Supabase...
                          </>
                        ) : (
                          <>
                            <span>Complete Registration & Launch Story</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
