"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import SplineScene from "@/components/ui/spline-scene"
import { 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  UserCheck
} from "lucide-react"

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "google">("signin")
  const [googleLoading, setGoogleLoading] = useState(false)

  // Direct Google OAuth handler via Supabase
  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    setSignInError("")
    setSignUpError("")
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      if (activeTab === "signin") {
        setSignInError(err.message || "Failed to initiate Google sign-in.")
      } else {
        setSignUpError(err.message || "Failed to initiate Google sign-in.")
      }
      setGoogleLoading(false)
    }
  }

  // Sign In state (Direct Email Login)
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [showSignInPass, setShowSignInPass] = useState(false)
  const [signInError, setSignInError] = useState("")
  const [signInLoading, setSignInLoading] = useState(false)

  // Sign Up state (Direct Email Signup -> Create Password)
  const [signUpStep, setSignUpStep] = useState<"email" | "password">("email")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [signUpError, setSignUpError] = useState("")
  const [signUpLoading, setSignUpLoading] = useState(false)

  // Success state
  const [authSuccess, setAuthSuccess] = useState(false)

  // Validate email address
  const isValidEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  // Validate alphanumeric password >= 6
  const isValidPassword = (pass: string) => {
    if (pass.length < 6) return false
    const hasAlpha = /[a-zA-Z]/.test(pass)
    const hasNum = /[0-9]/.test(pass)
    return hasAlpha && hasNum
  }

  // Redirect after successful authentication
  const handleAuthComplete = (user: { email: string; phone?: string }) => {
    setAuthSuccess(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("trinetra_user", JSON.stringify(user))
    }
    // Redirect directly to the Sentinel Scanner dashboard tab
    setTimeout(() => {
      router.push("/?tab=scanner")
    }, 1200)
  }

  // ─── DIRECT EMAIL SIGN IN HANDLER ───
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInError("")

    const cleanInput = signInEmail.trim()
    if (!cleanInput) {
      setSignInError("Please enter your registered email address.")
      return
    }

    if (!signInPassword) {
      setSignInError("Please enter your password.")
      return
    }

    setSignInLoading(true)

    try {
      const lowerInput = cleanInput.toLowerCase()

      // Query users_profile by email first
      let { data: user, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("email", lowerInput)
        .maybeSingle()

      // Fallback: If not found by email, check phone_number column in case of prior mobile registration
      if (!user) {
        const cleanPhone = cleanInput.replace(/\s+/g, "")
        const phoneLookup = await supabase
          .from("users_profile")
          .select("*")
          .eq("phone_number", cleanPhone)
          .maybeSingle()

        if (phoneLookup.data) {
          user = phoneLookup.data
        }
      }

      if (error || !user) {
        setSignInError("No account found with this email. Please switch to Sign Up to register.")
        setSignInLoading(false)
        return
      }

      if (user.password_hash !== signInPassword) {
        setSignInError("Incorrect password. Please verify and try again.")
        setSignInLoading(false)
        return
      }

      // Record login entry in Supabase telemetry
      try {
        await supabase.from("login_entries").insert({
          email: user.email || lowerInput,
          phone_number: user.phone_number || user.email || lowerInput,
          auth_method: "direct_email_password",
          status: "SUCCESS",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
        })
      } catch {
        // Non-blocking telemetry insert
      }

      handleAuthComplete({ email: user.email || lowerInput, phone: user.phone_number || user.email })
    } catch (err: any) {
      setSignInError(err.message || "Sign in failed. Check your network connection.")
    } finally {
      setSignInLoading(false)
    }
  }

  // ─── SIGN UP STEP 1: VERIFY & ADVANCE TO PASSWORD CREATION ───
  const handleProceedToPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    const cleanEmail = signUpEmail.trim().toLowerCase()
    if (!isValidEmail(cleanEmail)) {
      setSignUpError("Please enter a valid email address (e.g. name@company.com or name@gmail.com).")
      return
    }

    setSignUpLoading(true)

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users_profile")
        .select("id, email")
        .eq("email", cleanEmail)
        .maybeSingle()

      if (existingUser) {
        setSignUpError("An account with this email already exists. Please switch to Sign In.")
        setSignUpLoading(false)
        return
      }

      // Smoothly advance directly to password creation — NO OTP REQUIRED!
      setSignUpStep("password")
    } catch (err: any) {
      setSignUpError(err.message || "Failed to process email. Please try again.")
    } finally {
      setSignUpLoading(false)
    }
  }

  // ─── SIGN UP STEP 2: CREATE PASSWORD & COMPLETE SIGNUP ───
  const handleFinalizeSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!isValidPassword(newPassword)) {
      setSignUpError("Password must be at least 6 alphanumeric characters (must include letters and numbers).")
      return
    }

    if (newPassword !== confirmPassword) {
      setSignUpError("New password and confirm password do not match.")
      return
    }

    setSignUpLoading(true)

    try {
      const cleanEmail = signUpEmail.trim().toLowerCase()

      // Insert new user into public.users_profile in Supabase
      const { error: profileError } = await supabase.from("users_profile").insert({
        email: cleanEmail,
        phone_number: cleanEmail,
        password_hash: newPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        // If profile already exists, attempt update
        if (profileError.code === "23505") {
          const { error: updateError } = await supabase
            .from("users_profile")
            .update({
              password_hash: newPassword,
              updated_at: new Date().toISOString(),
            })
            .eq("email", cleanEmail)

          if (updateError) throw updateError
        } else {
          throw profileError
        }
      }

      // Record successful signup telemetry
      try {
        await supabase.from("login_entries").insert({
          email: cleanEmail,
          phone_number: cleanEmail,
          auth_method: "direct_email_signup",
          status: "SUCCESS",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
        })
      } catch {
        // Non-blocking telemetry
      }

      handleAuthComplete({ email: cleanEmail, phone: cleanEmail })
    } catch (err: any) {
      setSignUpError(err.message || "Failed to create account. Please try again.")
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
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md transition-colors hover:border-[#ff2a8d]/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 text-[#ff2a8d]" />
          <span>Back to Landing</span>
        </Link>
        <div className="hidden items-center gap-2 font-mono text-xs text-zinc-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-pulse" />
          <span>त्रिNETRA SECURITY GATEWAY</span>
        </div>
      </div>

      {/* ─── LEFT HALF: SPLINE 3D MODEL WITH CURSOR TRACKING ─── */}
      <div className="relative flex h-[40vh] w-full flex-col justify-between overflow-hidden border-b border-white/10 bg-black/90 lg:h-screen lg:w-1/2 lg:border-b-0 lg:border-r">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#ff2a8d]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#e5ff40]/10 blur-3xl" />

        {/* Spline 3D Scene */}
        <div className="relative h-full w-full">
          <SplineScene
            sceneUrl="https://prod.spline.design/gSJh2PEkOkX7R4h9/scene.splinecode"
            className="h-full w-full"
          />
        </div>

        {/* Bottom Feature Teaser */}
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 hidden lg:block rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-md p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#ff2a8d] font-bold">
              Autonomous Cyber Defense Grid
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Real-time QR payee forensics, TinyFish honeypot inspection, and HDBSCAN fraud clustering.
          </p>
        </div>
      </div>

      {/* ─── RIGHT HALF: LOGIN / SIGNUP INTERFACE ─── */}
      <div className="relative flex min-h-[60vh] w-full items-center justify-center p-6 sm:p-12 lg:h-screen lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header Branding */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2a8d]/30 bg-[#ff2a8d]/10 px-3.5 py-1 text-xs font-mono text-[#ff2a8d]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#e5ff40]" />
              <span>DIRECT EMAIL ACCESS &bull; NO OTP REQUIRED</span>
            </div>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl tracking-tight">
              त्रिNETRA Portal
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Zero-Trust Pre-Payment Threat & Scam Intelligence Defense.
            </p>
          </div>

          {/* Success Screen after authentication */}
          {authSuccess ? (
            <div className="rounded-2xl border border-[#e5ff40]/40 bg-zinc-950/90 p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ff40]/20 text-[#e5ff40] shadow-[0_0_25px_rgba(229,255,64,0.4)]">
                <CheckCircle2 className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">Authentication Verified</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Credentials authorized. Synchronizing with त्रिNETRA Sentinel Network...
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-[#e5ff40]">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#e5ff40] border-t-transparent" />
                <span>Redirecting to Sentinel Scanner...</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Tab Selector: Direct Sign In vs Sign Up vs Direct Google */}
              <div className="mb-6 grid grid-cols-3 rounded-xl bg-black/60 p-1 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin")
                    setSignInError("")
                  }}
                  className={`rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-[#ff2a8d] text-white shadow-md shadow-[#ff2a8d]/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup")
                    setSignUpStep("email")
                    setSignUpError("")
                  }}
                  className={`rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-[#e5ff40] to-[#c7e030] text-black shadow-md shadow-[#e5ff40]/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("google")
                    setSignInError("")
                    setSignUpError("")
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "google"
                      ? "bg-white text-zinc-950 shadow-md shadow-white/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <GoogleIcon className="h-3.5 w-3.5" />
                  <span>Google</span>
                </button>
              </div>

              {/* ─── TAB 3: DIRECT GOOGLE TAB ─── */}
              {activeTab === "google" && (
                <div className="space-y-5 text-center py-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.08] border border-white/20 shadow-[0_0_30px_rgba(66,133,244,0.35)]">
                    <GoogleIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Direct Google Access</h3>
                    <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Instant 1-click sign in and sign up connected directly to Supabase authentication. No passwords or OTP codes required.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {googleLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                        <span>Connecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon className="h-4 w-4" />
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ─── TAB 1: DIRECT EMAIL SIGN IN ─── */}
              {activeTab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Mail className="h-3.5 w-3.5 text-[#ff2a8d]" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="text"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-[#ff2a8d]" />
                        <span>Password</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignInPass ? "text" : "password"}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPass(!showSignInPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2a8d]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {signInLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Credentials...
                      </>
                    ) : (
                      <>
                        <span>Sign In to त्रिNETRA</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Direct Google Sign-In Option on Sign In Tab */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative bg-zinc-950 px-3 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                      Or sign in with
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] py-3 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-[#ff2a8d]/60 hover:shadow-[0_0_20px_rgba(255,42,141,0.25)] active:scale-[0.99] cursor-pointer"
                  >
                    {googleLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-[#ff2a8d]" />
                    ) : (
                      <GoogleIcon className="h-4 w-4" />
                    )}
                    <span>Sign In with Google</span>
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signup")
                        setSignUpStep("email")
                      }}
                      className="text-xs text-zinc-400 hover:text-[#ff2a8d] transition-colors cursor-pointer"
                    >
                      New to त्रिNETRA? <span className="font-semibold text-white underline">Create Account in Seconds</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ─── TAB 2: DIRECT EMAIL SIGN UP (NO OTP) ─── */}
              {activeTab === "signup" && (
                <div>
                  {/* Step Progress Indicators */}
                  <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 text-[11px] font-mono">
                    <span className={signUpStep === "email" ? "font-bold text-[#e5ff40]" : "text-zinc-500"}>
                      1. Email Address
                    </span>
                    <span className="text-zinc-600">&rarr;</span>
                    <span className={signUpStep === "password" ? "font-bold text-[#e5ff40]" : "text-zinc-500"}>
                      2. Create Password
                    </span>
                  </div>

                  {/* Step 1: Direct Email Input */}
                  {signUpStep === "email" && (
                    <form onSubmit={handleProceedToPassword} className="space-y-4">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                          <Mail className="h-3.5 w-3.5 text-[#e5ff40]" />
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="name@example.com or name@gmail.com"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#e5ff40] focus:ring-1 focus:ring-[#e5ff40]"
                          required
                          autoFocus
                        />
                        <span className="mt-1 block text-[10px] text-zinc-400 font-mono">
                          Direct sign up &bull; No email OTP required &bull; Instant activation
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
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e5ff40] to-[#c7e030] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#e5ff40]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      >
                        {signUpLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-black" /> Checking Email...
                          </>
                        ) : (
                          <>
                            <span>Continue to Create Password</span>
                            <ArrowRight className="h-4 w-4 text-black" />
                          </>
                        )}
                      </button>

                      {/* Direct Google Sign-Up Option on Sign Up Tab */}
                      <div className="relative my-4 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative bg-zinc-950 px-3 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                          Or sign up instantly with
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={googleLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] py-3 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-[#e5ff40]/60 hover:shadow-[0_0_20px_rgba(229,255,64,0.25)] active:scale-[0.99] cursor-pointer"
                      >
                        {googleLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-[#e5ff40]" />
                        ) : (
                          <GoogleIcon className="h-4 w-4" />
                        )}
                        <span>Sign Up with Google</span>
                      </button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab("signin")}
                          className="text-xs text-zinc-400 hover:text-[#e5ff40] transition-colors cursor-pointer"
                        >
                          Already have an account? <span className="font-semibold text-white underline">Sign In</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 2: Create Password & Finalize Account */}
                  {signUpStep === "password" && (
                    <form onSubmit={handleFinalizeSignUp} className="space-y-4">
                      {/* Active Email Chip with Change Action */}
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <UserCheck className="h-4 w-4 text-[#e5ff40] shrink-0" />
                          <span className="truncate text-xs font-mono text-zinc-200">
                            {signUpEmail}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignUpStep("email")}
                          className="text-[11px] font-mono text-[#ff2a8d] hover:underline cursor-pointer shrink-0 ml-2"
                        >
                          Change
                        </button>
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                          <Lock className="h-3.5 w-3.5 text-[#e5ff40]" />
                          <span>Create Password (Min 6 Alphanumeric)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="e.g. Sentinel99"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#e5ff40] focus:ring-1 focus:ring-[#e5ff40]"
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#e5ff40]" />
                          <span>Confirm Password</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password to confirm"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#e5ff40] focus:ring-1 focus:ring-[#e5ff40]"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Password validation indicators */}
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded-full border ${newPassword.length >= 6 ? "border-[#e5ff40]/40 bg-[#e5ff40]/10 text-[#e5ff40]" : "border-white/10 text-zinc-500"}`}>
                          &bull; 6+ chars
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${isValidPassword(newPassword) ? "border-[#e5ff40]/40 bg-[#e5ff40]/10 text-[#e5ff40]" : "border-white/10 text-zinc-500"}`}>
                          &bull; Letters &amp; numbers
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${newPassword && newPassword === confirmPassword ? "border-[#e5ff40]/40 bg-[#e5ff40]/10 text-[#e5ff40]" : "border-white/10 text-zinc-500"}`}>
                          &bull; Match
                        </span>
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
                          onClick={() => setSignUpStep("email")}
                          className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-zinc-400 hover:bg-white/5 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={signUpLoading}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e5ff40] to-[#c7e030] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#e5ff40]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                          {signUpLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin text-black" /> Creating Profile...
                            </>
                          ) : (
                            <>
                              <span>Launch Defense Grid</span>
                              <Sparkles className="h-4 w-4 text-black" />
                            </>
                          )}
                        </button>
                      </div>
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
