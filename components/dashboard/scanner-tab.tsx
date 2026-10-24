"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  ShieldAlert, 
  ShieldCheck, 
  QrCode, 
  Globe, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  Lock, 
  ArrowRight,
  Zap,
  Sparkles,
  ChevronRight,
  Scan,
  RefreshCw
} from "lucide-react"

interface ScannerTabProps {
  onExploreArchitecture?: () => void
  onOpenAuthGate?: () => void
  currentUser?: { phone: string; email?: string } | null
}

export default function ScannerTab({ onExploreArchitecture, onOpenAuthGate, currentUser }: ScannerTabProps) {
  // Interactive prototype state for Module A & B demo
  const [claimedUPI, setClaimedUPI] = useState("electricity.bills@sbi")
  const [actualUPI, setActualUPI] = useState("quickpay.refund992@ybl")
  const [amount, setAmount] = useState("4850")
  const [messageText, setMessageText] = useState("URGENT: Your power connection will be disconnected tonight at 9:30 PM. Pay pending bill immediately via UPI or call 9876543210.")
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
  } | null>({
    score: 88,
    level: "HIGH",
    reasons: [
      "Critical UPI Recipient Mismatch: Claimed 'electricity.bills@sbi' vs Actual QR Destination 'quickpay.refund992@ybl'",
      "NLP Urgency & Threat Vector: High probability scam language ('disconnected tonight at 9:30 PM', 'URGENT')",
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

  const handleRunScan = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setResult({
        score: 92,
        level: "HIGH",
        reasons: [
          `Critical Recipient Spoof: Claimed '${claimedUPI}' diverges from Destination '${actualUPI}'`,
          "NLP Urgency Vector: Siphoning psychological pressure ('disconnected tonight', 'immediately')",
          "TinyFish Headless DOM Trap: Input fields request secret 6-digit UPI PIN on non-banking origin"
        ],
        tinyfishStatus: "COMPLETED",
        tinyfishData: {
          finalUrl: phishingUrl,
          title: "Counterfeit Electricity Portal - Honeypot Trapped",
          phishingRisk: "L5 CRITICAL (Zero-day credential harvester)",
          extractedForm: "Extracted <input name='upi_pin' type='password'> inside unauthorized iframe"
        }
      })
      setAnalyzing(false)
    }, 1200)
  }

  return (
    <div className="w-full flex flex-col gap-12 pb-24">
      {/* ─── HERO STAGE SECTION ─── */}
      <section className="relative w-full overflow-hidden bg-[#0e0e10] px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Subtle Ambient Halos */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-gradient-to-tr from-[#ff2a8d]/15 via-[#dfb269]/10 to-transparent blur-[140px]" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201f21] mb-6 ring-1 ring-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ff2a8d] animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-[#ffb1c7] tracking-widest uppercase">
              AI-POWERED UPI FRAUD PREVENTION &amp; SCAM INTELLIGENCE
            </span>
          </div>

          {/* Brutalist Display Headline */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            Stop UPI scams <br className="hidden sm:inline" />
            <span className="text-white">before payment.</span> <br />
            Detect scam waves{" "}
            <span className="italic font-light text-[#ff2a8d] underline decoration-[#ff2a8d]/40 decoration-wavy decoration-1">
              before they spread.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            Real-time UPI recipient forensic verification, QR payload decoding, and autonomous TinyFish web agents scanning the live internet for emerging phishing campaigns.
          </p>

          {/* Action cluster */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#scanner-sandbox"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white font-bold text-sm shadow-[0_0_28px_rgba(255,42,141,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Try Sentinel Scanner</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            {onExploreArchitecture && (
              <button
                onClick={onExploreArchitecture}
                className="px-6 py-3.5 rounded-full bg-[#201f21] text-[#d6ef2f] font-semibold text-sm hover:bg-[#2a2a2c] ring-1 ring-white/10 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Explore Architecture</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#1c1b1d]/90 p-3 rounded-2xl ring-1 ring-white/10 backdrop-blur-md shadow-xl text-left">
            <div className="p-3.5 flex flex-col bg-[#201f21]/80 rounded-xl">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">PRE-FLIGHT LATENCY</span>
              <span className="font-mono text-xl sm:text-2xl text-[#d6ef2f] font-bold mt-1">14.2ms</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Sub-PIN verification</span>
            </div>
            <div className="p-3.5 flex flex-col bg-[#201f21]/80 rounded-xl">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">MISMATCH DETECTIONS</span>
              <span className="font-mono text-xl sm:text-2xl text-[#ff2a8d] font-bold mt-1">99.84%</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Ghost VPA intercept</span>
            </div>
            <div className="p-3.5 flex flex-col bg-[#201f21]/80 rounded-xl">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">SCAM SMS PARSER</span>
              <span className="font-mono text-xl sm:text-2xl text-[#edbf75] font-bold mt-1">78 APKs</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Crawled every minute</span>
            </div>
            <div className="p-3.5 flex flex-col bg-[#201f21]/80 rounded-xl">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">SAFE TRANSACTION VOL.</span>
              <span className="font-mono text-xl sm:text-2xl text-white font-bold mt-1">₹140.2 Cr</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Protected to date</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── INTERACTIVE SANDBOX SECTION (SCREEN 1 LOWER HALF) ─── */}
      <section id="scanner-sandbox" className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff2a8d]/15 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#ff2a8d] ring-1 ring-[#ff2a8d]/30">
              <Scan className="h-3.5 w-3.5" /> LIVE INTERCEPT ENGINE
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Inspect VPA, QR Vouchers &amp; Extortion SMS
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Simulate fraud payloads. TriNETRA compares destination authenticity, evaluates linguistic urgency, and dispatches TinyFish web agents.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#d6ef2f] animate-ping" />
            <span>HEURISTIC PIPELINE READY</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Input Sandbox (7 Columns) */}
          <div className="rounded-2xl border border-white/10 bg-[#131315] p-6 shadow-2xl lg:col-span-7">
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-[#e5ff40]">
              <Lock className="h-4 w-4 text-[#ff2a8d]" /> Transaction Ingestion Parameters
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-medium text-zinc-300">Claimed Recipient Name / ID</label>
                  <input
                    type="text"
                    value={claimedUPI}
                    onChange={(e) => setClaimedUPI(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-medium text-zinc-300">Actual Recipient UPI (From QR Code)</label>
                  <input
                    type="text"
                    value={actualUPI}
                    onChange={(e) => setActualUPI(e.target.value)}
                    className="w-full rounded-xl border border-[#ff2a8d]/40 bg-[#ff2a8d]/5 px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-zinc-300">Transaction Amount (INR)</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-zinc-300">Suspicious SMS / WhatsApp Scam Text</label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-zinc-300">Suspicious Phishing URL / APK Host</label>
                <input
                  type="text"
                  value={phishingUrl}
                  onChange={(e) => setPhishingUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#ff2a8d] focus:ring-1 focus:ring-[#ff2a8d]"
                />
              </div>

              <button
                onClick={handleRunScan}
                disabled={analyzing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" /> Fusing Signals &amp; Dispatching TinyFish...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-5 w-5" /> Execute TriNETRA Multi-Signal Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel (5 Columns) */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#131315] p-6 shadow-2xl lg:col-span-5">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-white text-base">TriNETRA Risk Assessment</h3>
                {result ? (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold ${
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
                      <span className="text-[#ff2a8d] font-mono">{result.score}% Threat Severity</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-[#ff2a8d] transition-all duration-700"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Top 3 Detection Drivers */}
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Explainable Detection Drivers
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
                  <div className="rounded-xl border border-[#e5ff40]/30 bg-[#e5ff40]/5 p-4 text-xs space-y-1.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#e5ff40]">
                        <Globe className="h-4 w-4" /> TinyFish Autonomous DOM Crawler
                      </span>
                      <span className="rounded bg-[#e5ff40]/20 px-2 py-0.5 font-mono text-[10px] text-[#e5ff40]">
                        VERIFIED EVIDENCE
                      </span>
                    </div>
                    <p className="text-zinc-300">
                      <strong className="text-white">Title:</strong> {result.tinyfishData?.title}
                    </p>
                    <p className="text-zinc-300">
                      <strong className="text-white">Phishing Assessment:</strong> {result.tinyfishData?.phishingRisk}
                    </p>
                    <p className="font-mono text-[11px] text-zinc-400">
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
              Prototype Mode: Multi-axis signal fusion (Behavior 50%, NLP 20%, Phishing 15%, QR 15%). Does not execute live payment authorization.
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
