"use client"

import React, { useState } from "react"
import { supabase, type LoginEntry } from "@/lib/supabase"
import { 
  X, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Database
} from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: { phone: string; email?: string }) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
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
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [signUpError, setSignUpError] = useState("")
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [otpNotice, setOtpNotice] = useState("")

  if (!isOpen) return null

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
    // 91 followed by 10 digits
    return digits.length === 12 && digits.startsWith("91")
  }

  // Validate Gmail
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
        setSignInError("Account not found with this mobile number. Please sign up first.")
        setSignInLoading(false)
        return
      }

      if (user.password_hash !== signInPassword) {
        setSignInError("Incorrect password. Please try again.")
        setSignInLoading(false)
        return
      }

      // Record successful login entry in Supabase
      await supabase.from("login_entries").insert({
        phone_number: cleanPhone,
        email: user.email,
        auth_method: "phone_password",
        status: "SUCCESS",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      })

      onSuccess({ phone: cleanPhone, email: user.email })
      onClose()
    } catch (err: any) {
      setSignInError(err.message || "Sign in failed. Check network connectivity.")
    } finally {
      setSignInLoading(false)
    }
  }

  // --- SIGN UP STEP 1: SEND OTP ---
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!isValidIndianPhone(signUpPhone)) {
      setSignUpError("Please enter a valid 10-digit phone number with +91.")
      return
    }

    if (!isValidGmail(signUpEmail)) {
      setSignUpError("Email must be a valid @gmail.com address (e.g., yourname@gmail.com).")
      return
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setOtpNotice(`OTP sent to ${signUpPhone} and ${signUpEmail}: ${code}`)
    setSignUpStep("otp")
  }

  // --- SIGN UP STEP 2: VERIFY OTP ---
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setSignUpError("Invalid OTP entered. Please check the code sent to your mobile/email.")
      return
    }

    setSignUpStep("password")
  }

  // --- SIGN UP STEP 3: SET PASSWORD & FINALIZE ---
  const handleFinalizeSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")

    if (!isValidPassword(newPassword)) {
      setSignUpError("Password must be at least 6 characters and include both letters and numbers.")
      return
    }

    if (newPassword !== confirmPassword) {
      setSignUpError("Passwords do not match. Please re-enter confirm password.")
      return
    }

    setSignUpLoading(true)

    try {
      const cleanPhone = signUpPhone.replace(/\s+/g, "")
      const cleanEmail = signUpEmail.trim().toLowerCase()

      // Insert into users_profile in Supabase
      const { error: profileError } = await supabase.from("users_profile").insert({
        phone_number: cleanPhone,
        email: cleanEmail,
        password_hash: newPassword, // In prototype hashed or stored cleanly
      })

      if (profileError) {
        if (profileError.message.includes("unique")) {
          throw new Error("An account already exists with this phone or email.")
        }
        throw profileError
      }

      // Record first login entry in Supabase
      await supabase.from("login_entries").insert({
        phone_number: cleanPhone,
        email: cleanEmail,
        auth_method: "otp_registration",
        status: "SUCCESS",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      })

      onSuccess({ phone: cleanPhone, email: cleanEmail })
      onClose()
    } catch (err: any) {
      setSignUpError(err.message || "Registration failed.")
    } finally {
      setSignUpLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-[#ff2a8d]/10">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white">त्रिNETRA</span>
            <span className="rounded bg-[#ff2a8d]/20 px-2 py-0.5 text-[10px] font-bold text-[#ff2a8d]">
              Supabase Auth
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-white/10 text-center text-sm font-semibold">
          <button
            onClick={() => {
              setActiveTab("signin")
              setSignInError("")
            }}
            className={`py-3 transition-colors ${
              activeTab === "signin"
                ? "border-b-2 border-[#e5ff40] text-[#e5ff40]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("signup")
              setSignUpStep("details")
              setSignUpError("")
            }}
            className={`py-3 transition-colors ${
              activeTab === "signup"
                ? "border-b-2 border-[#ff2a8d] text-[#ff2a8d]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* =================== SIGN IN TAB =================== */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">
                  Mobile Number (India +91)
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={signInPhone}
                    onChange={(e) => handlePhoneChange(e.target.value, setSignInPhone)}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#e5ff40] focus:ring-1 focus:ring-[#e5ff40]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type={showSignInPass ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-[#e5ff40] focus:ring-1 focus:ring-[#e5ff40]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPass(!showSignInPass)}
                    className="absolute right-3 text-zinc-400 hover:text-white"
                  >
                    {showSignInPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {signInError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={signInLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e5ff40] py-3 text-sm font-bold text-black transition-all hover:bg-[#d4ff00] disabled:opacity-50"
              >
                {signInLoading ? "Signing in..." : "Sign In to TriNETRA"}
              </button>
            </form>
          )}

          {/* =================== SIGN UP TAB =================== */}
          {activeTab === "signup" && (
            <div>
              {/* Step indicator */}
              <div className="mb-4 flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span className={signUpStep === "details" ? "text-[#ff2a8d]" : ""}>1. Details</span>
                <span>→</span>
                <span className={signUpStep === "otp" ? "text-[#ff2a8d]" : ""}>2. OTP Verification</span>
                <span>→</span>
                <span className={signUpStep === "password" ? "text-[#ff2a8d]" : ""}>3. Set Password</span>
              </div>

              {/* Step 1: Details */}
              {signUpStep === "details" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">
                      Mobile Number (+91 required)
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => handlePhoneChange(e.target.value, setSignUpPhone)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">
                      Email Address (@gmail.com constraint)
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      * Must be an active Google Gmail account.
                    </p>
                  </div>

                  {signUpError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{signUpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff2a8d] py-3 text-sm font-bold text-white transition-all hover:bg-[#ff0055]"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {signUpStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {otpNotice && (
                    <div className="rounded-xl border border-[#e5ff40]/30 bg-[#e5ff40]/10 p-3 text-xs text-[#e5ff40]">
                      <div className="font-bold">📨 Verification Code Dispatched</div>
                      <div className="mt-1 font-mono text-sm tracking-wider">{otpNotice}</div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-4 text-center font-mono text-base tracking-widest text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      />
                    </div>
                  </div>

                  {signUpError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{signUpError}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignUpStep("details")}
                      className="w-1/3 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-zinc-400 hover:bg-white/5"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff2a8d] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#ff0055]"
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Set Password */}
              {signUpStep === "password" && (
                <form onSubmit={handleFinalizeSignUp} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">
                      First: Enter New Password (Min 6 alphanumeric chars)
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="e.g. Sentinel99"
                        className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 text-zinc-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">
                      Then: Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400" />
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type your password"
                        className="w-full rounded-xl border border-white/10 bg-black/60 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 text-zinc-400 hover:text-white"
                      >
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {signUpError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{signUpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signUpLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-sm font-bold text-white transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {signUpLoading ? "Creating account in Supabase..." : "Complete Registration"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
