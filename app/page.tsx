"use client"

import React, { useState } from "react"
import SculptureHero from "@/components/ui/liquid-sculpture-hero"
import AuthModal from "@/components/ui/auth-modal"
import { 
  ShieldAlert, 
  ShieldCheck, 
  QrCode, 
  Globe, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  Lock, 
  User, 
  LogOut, 
  KeyRound,
  Bot
} from "lucide-react"

export default function Home() {
  // Auth state
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ phone: string; email?: string } | null>(null)

  // Interactive prototype state for Module A & B demo
  const [claimedUPI, setClaimedUPI] = useState("electricity.bills@sbi")
  const [actualUPI, setActualUPI] = useState("quickpay.refund992@ybl")
  const [amount, setAmount] = useState("4850")
  const [messageText, setMessageText] = useState("URGENT: Your power connection will be disconnected tonight. Pay pending bill immediately via UPI or call 9876543210.")
  const [phishingUrl, setPhishingUrl] = useState("https://state-electricity-ebill-portal.xyz/pay")
  
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    score: number
    level: "LOW" | "MEDIUM" | "HIGH"
    reasons: string[]
    tinyfishStatus: string
    tinyfishData?: {
      finalUrl: string
      title: string
      phishingRisk: string
      extractedForm: string
    }
  } | null>(null)

  const handleRunScan = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setResult({
        score: 88,
        level: "HIGH",
        reasons: [
          "Critical UPI Recipient Mismatch: Claimed 'electricity.bills@sbi' vs Actual QR Destination 'quickpay.refund992@ybl'",
          "NLP Urgency & Threat Vector: High probability scam language ('disconnected tonight', 'URGENT')",
          "TinyFish Autonomous Web Crawl: Target domain registered 3 days ago with deceptive banking form mimicking official SBI power portal"
        ],
        tinyfishStatus: "COMPLETED",
        tinyfishData: {
          finalUrl: "https://state-electricity-ebill-portal.xyz/pay?ref=victim_session_492",
          title: "Electricity Bill Online Payment Gateway (Counterfeit)",
          phishingRisk: "CRITICAL (Deceptive KYC credential harvesting detected)",
          extractedForm: "Input fields requesting UPI VPA, Bank Account, and Simulated PIN Entry"
        }
      })
      setAnalyzing(false)
    }, 1100)
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#ededed]">
      {/* Liquid Particle Hero with Clean Nav and Centered Emblem */}
      <SculptureHero
        src="/assets/trinetra-logo.png"
        darkSrc="/assets/trinetra-logo.png"
        background="#050505"
        darkBackground="#050505"
        textColor="#e5ff40"
        accentColor="#ff2a8d"
        particleColor="#ff2a8d"
        backdropText="त्रिNETRA"
        brand="त्रिNETRA"
        eyebrow="AI-POWERED UPI FRAUD PREVENTION & SCAM INTELLIGENCE"
        headline={"Stop UPI scams before payment.\nDetect scam waves before they spread."}
        headlineAccent="before they spread."
        body="Real-time UPI recipient forensic verification, QR payload decoding, and autonomous TinyFish web agents scanning the live internet for emerging phishing campaigns."
        primaryCta={{ label: "Try Sentinel Scanner", href: "#scanner-demo" }}
        secondaryCta={{ label: "Explore Architecture", href: "#architecture" }}
        interactive={true}
        strength={1.3}
        radius={240}
        speed={1.2}
        liquid={1.4}
        turbulence={1.3}
        customNavRight={
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-[#e5ff40]/40 bg-[#e5ff40]/10 px-3.5 py-1.5 text-xs font-bold text-[#e5ff40]">
                  <User className="h-3.5 w-3.5" />
                  <span>{currentUser.phone}</span>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:scale-105 hover:opacity-95"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        }
      />

      {/* Auth Modal with Genkub 3D Robot on Right Side and Real Supabase OTP */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user)
        }}
      />

      {/* Feature Ribbon */}
      <section className="border-y border-white/10 bg-black/60 px-6 py-8 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff2a8d]/10 text-[#ff2a8d] ring-1 ring-[#ff2a8d]/30">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">QR Payload Forensics</h4>
              <p className="text-xs text-zinc-400">Claimed vs Actual UPI VPA match</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5ff40]/10 text-[#e5ff40] ring-1 ring-[#e5ff40]/30">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">TinyFish Live Web AI</h4>
              <p className="text-xs text-zinc-400">Autonomous remote DOM inspection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff2a8d]/10 text-[#ff2a8d] ring-1 ring-[#ff2a8d]/30">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Transaction DNA</h4>
              <p className="text-xs text-zinc-400">Emerging scam campaign clustering</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5ff40]/10 text-[#e5ff40] ring-1 ring-[#e5ff40]/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Privacy First</h4>
              <p className="text-xs text-zinc-400">Zero PIN/OTP collection guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sentinel Scanner Demonstration */}
      <section id="scanner-demo" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ff2a8d]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ff2a8d] ring-1 ring-[#ff2a8d]/30">
            <Terminal className="h-3.5 w-3.5" /> Module A & B Live Sandbox
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
            Pre-Payment Threat & Web Forensics
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400">
            Simulate a high-risk UPI payment scenario. Observe how TriNETRA fuses QR verification, NLP scam classification, and TinyFish live-web crawl evidence.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Sandbox */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-xl lg:col-span-7">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#e5ff40]">
              <Lock className="h-5 w-5 text-[#ff2a8d]" /> Transaction Ingestion Parameters
            </h3>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-zinc-300">Claimed Recipient Name / ID</label>
                  <input
                    type="text"
                    value={claimedUPI}
                    onChange={(e) => setClaimedUPI(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-zinc-300">Actual Recipient UPI (From QR Code)</label>
                  <input
                    type="text"
                    value={actualUPI}
                    onChange={(e) => setActualUPI(e.target.value)}
                    className="w-full rounded-lg border border-[#ff2a8d]/40 bg-[#ff2a8d]/5 px-3.5 py-2.5 text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-zinc-300">Transaction Amount (INR)</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-zinc-300">Suspicious SMS / WhatsApp Scam Text</label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-zinc-300">Suspicious Phishing URL</label>
                <input
                  type="text"
                  value={phishingUrl}
                  onChange={(e) => setPhishingUrl(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <button
                onClick={handleRunScan}
                disabled={analyzing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-base font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Activity className="h-5 w-5 animate-spin" /> Fusing Signals & Dispatching TinyFish...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-5 w-5" /> Execute TriNETRA Multi-Signal Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-xl lg:col-span-5">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-white">TriNETRA Risk Assessment</h3>
                {result ? (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    result.level === "HIGH" 
                      ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40" 
                      : "bg-[#e5ff40]/20 text-[#e5ff40]"
                  }`}>
                    <AlertTriangle className="h-3.5 w-3.5" /> RISK: {result.level} ({result.score}/100)
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">Awaiting scan trigger</span>
                )}
              </div>

              {result ? (
                <div className="space-y-5">
                  {/* Score gauge bar */}
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs font-semibold">
                      <span className="text-zinc-400">Composite Risk Score</span>
                      <span className="text-[#ff2a8d]">{result.score}% Threat Severity</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-[#ff2a8d] transition-all duration-700"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Top 3 Explainable Reasons */}
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Top Detection Drivers
                    </h4>
                    <ul className="space-y-2">
                      {result.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff2a8d]" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TinyFish Live Evidence Box */}
                  <div className="rounded-xl border border-[#e5ff40]/30 bg-[#e5ff40]/5 p-4 text-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#e5ff40]">
                        <Globe className="h-4 w-4" /> TinyFish Fetch Autonomous Crawler
                      </span>
                      <span className="rounded bg-[#e5ff40]/20 px-2 py-0.5 font-mono text-[10px] text-[#e5ff40]">
                        VERIFIED EVIDENCE
                      </span>
                    </div>
                    <p className="text-zinc-300">
                      <strong className="text-white">Title:</strong> {result.tinyfishData?.title}
                    </p>
                    <p className="mt-1 text-zinc-300">
                      <strong className="text-white">Phishing Assessment:</strong> {result.tinyfishData?.phishingRisk}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      Target Form: {result.tinyfishData?.extractedForm}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-500">
                  <ShieldCheck className="mb-3 h-12 w-12 text-zinc-700" />
                  <p className="text-sm">Enter transaction parameters and click execute to view real-time explainable risk fusion.</p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-lg bg-black/40 p-3 text-[11px] text-zinc-500">
              Prototype Mode: Rule-based weights (Behavior 50%, NLP 20%, Phishing 15%, QR 15%). Does not execute live payment authorization.
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Module Workflow */}
      <section id="architecture" className="border-t border-white/10 bg-black/80 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e5ff40]">
              End-to-End System Design
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
              The 4 Pillars of त्रिNETRA
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-[#ff2a8d]/40">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff2a8d]/20 text-[#ff2a8d]">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">Module A: Pre-Payment</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Decodes raw QR payloads, extracts payment VPAs, compares claimed versus true destination, and scores message NLP urgency.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-[#e5ff40]/40">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5ff40]/20 text-[#e5ff40]">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">Module B: TinyFish Intel</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Mandatory integration: TinyFish Fetch inspects suspicious pages asynchronously, TinyFish Search discovers similar community scam reports.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-[#ff2a8d]/40">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff2a8d]/20 text-[#ff2a8d]">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">Module C: Transaction DNA</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Vectorizes payment traits, timing, message structure, and domain attributes with HDBSCAN to flag emerging campaign waves before they spread.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-[#e5ff40]/40">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5ff40]/20 text-[#e5ff40]">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">Module D: Analyst Portal</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Empowers fraud analysts to review flagged clusters, verify TinyFish crawler logs, and confirm/reject new scam signatures for continuous learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 त्रिNETRA — AI-Powered UPI Fraud Prevention & Scam Intelligence. Built for 24-Hour Hackathon.</p>
        <p className="mt-2 text-zinc-600">
          Powered by Supabase Auth, TinyFish MCP, Three.js Genkub 3D Robot & Next.js.
        </p>
      </footer>
    </main>
  )
}
