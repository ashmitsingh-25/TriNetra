"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthSignup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      // Move to Step 2: OTP Verification
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (otpCode.length !== 6) {
        throw new Error("Please enter a valid 6-digit code.");
      }
      
      // Move to Step 3: Password creation
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Finalize Account Setup (Password & Complete)
  const handleFinalizeSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");

      // Redirect to dashboard or scanner view on success
      router.push("/?tab=scanner");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#09090d] border border-white/10 rounded-2xl text-white shadow-2xl">
      {/* Progress Indicator */}
      <div className="flex justify-between text-xs font-mono mb-6 text-neutral-400">
        <span className={step === 1 ? "text-[#ff2a8d] font-bold" : ""}>1. Contact</span>
        <span className={step === 2 ? "text-[#ff2a8d] font-bold" : ""}>2. Enter OTP</span>
        <span className={step === 3 ? "text-[#ff2a8d] font-bold" : ""}>3. Password</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1 Form */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#ff2a8d] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#ff2a8d] font-semibold rounded-xl hover:opacity-95 transition cursor-pointer text-white shadow-[0_0_20px_rgba(255,42,141,0.4)]"
          >
            {loading ? "Sending OTP..." : "Send Verification Code →"}
          </button>
        </form>
      )}

      {/* Step 2 Form */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-neutral-400">
            We sent a 6-digit code to <span className="text-white font-medium">{email}</span>.
          </p>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-center tracking-widest font-mono text-xl text-[#e5ff40] focus:outline-none focus:border-[#ff2a8d] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#ff2a8d] font-semibold rounded-xl hover:opacity-95 transition cursor-pointer text-white shadow-[0_0_20px_rgba(255,42,141,0.4)]"
          >
            Verify Code →
          </button>
        </form>
      )}

      {/* Step 3 Form */}
      {step === 3 && (
        <form onSubmit={handleFinalizeSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#ff2a8d] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e5ff40] text-black font-semibold rounded-xl hover:opacity-95 transition cursor-pointer shadow-[0_0_20px_rgba(229,255,64,0.4)]"
          >
            {loading ? "Creating Account..." : "Complete Sign Up"}
          </button>
        </form>
      )}
    </div>
  );
}
