"use client"

import React, { useState, useEffect } from "react"
import { 
  Shield, 
  Scan, 
  Brain, 
  Activity, 
  Gavel, 
  Ban, 
  CheckCircle, 
  ShieldAlert, 
  CheckCheck, 
  AlertCircle, 
  CheckCircle2, 
  Terminal,
  KeyRound,
  LockOpen
} from "lucide-react"

export default function AnalystPortalTab() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("TRN-8821")
  const [verdictBanner, setVerdictBanner] = useState<{
    show: boolean
    type: "blacklist" | "benign" | "escalate"
    message: string
  }>({ show: false, type: "blacklist", message: "" })

  const incidents = [
    {
      id: "TRN-8821",
      badge: "CRITICAL INTERCEPT",
      title: "Fake PM-Kisan Scheme Phishing VPA",
      score: "92",
      tag: "Urgent Intent",
      vpa: "pmkisan.relieffund@axisbank",
      latency: "42ms",
      attempts: "18 attempts blocked",
      color: "text-[#ff2a8d] border-l-[#ff2a8d]",
    },
    {
      id: "TRN-8819",
      badge: "CAMPAIGN CLUSTER",
      title: "Electricity Bill Disconnection Hook",
      score: "88",
      tag: "High Risk",
      vpa: "powerbill.urgentpay@paytm",
      latency: "28ms",
      attempts: "44 attempts blocked",
      color: "text-[#edbf75] border-l-[#edbf75]",
    },
    {
      id: "TRN-8815",
      badge: "REVERSE QR ATTACK",
      title: "OLX Army Officer Advance Buyer Trap",
      score: "95",
      tag: "Critical",
      vpa: "armyregiment.verify@sbi",
      latency: "19ms",
      attempts: "91 attempts blocked",
      color: "text-red-400 border-l-red-500",
    },
    {
      id: "TRN-8809",
      badge: "APK INJECT",
      title: "Kalyan Jewelers 50% Off Voucher Spoof",
      score: "86",
      tag: "Pending Crawl",
      vpa: "kjewel.festiveoffer@icici",
      latency: "34ms",
      attempts: "12 attempts blocked",
      color: "text-zinc-400 border-l-zinc-500",
    },
  ]

  const triggerAction = (type: "blacklist" | "benign" | "escalate") => {
    if (type === "blacklist") {
      setVerdictBanner({
        show: true,
        type: "blacklist",
        message: `ACTION CONFIRMED: Recipient VPA for #${selectedIncidentId} permanently blacklisted. 42 PSP switches notified.`,
      })
    } else if (type === "benign") {
      setVerdictBanner({
        show: true,
        type: "benign",
        message: `ACTION CONFIRMED: #${selectedIncidentId} marked as Benign. False positive signature registered for heuristic refinement.`,
      })
    } else if (type === "escalate") {
      setVerdictBanner({
        show: true,
        type: "escalate",
        message: `ACTION CONFIRMED: Incident Dossier #${selectedIncidentId} bundled and pushed to National Cyber Crime Reporting Portal (1930 / MHA).`,
      })
    }
  }

  // Hotkey support: A (Blacklist), R (Benign), E (Escalate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)) return
      const k = e.key.toUpperCase()
      if (k === "A") {
        e.preventDefault()
        triggerAction("blacklist")
      } else if (k === "R") {
        e.preventDefault()
        triggerAction("benign")
      } else if (k === "E") {
        e.preventDefault()
        triggerAction("escalate")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIncidentId])

  return (
    <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ─── TOP WAR ROOM TELEMETRY HEADER ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#ff2a8d]/15 text-[#ff2a8d] uppercase tracking-wider ring-1 ring-[#ff2a8d]/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff2a8d] animate-ping" />
              TRIAGE WAR ROOM · SEC-OPS TIER 4
            </span>
            <span className="font-mono text-xs text-zinc-500">SESSION: #ANL-904-DELTA</span>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#d6ef2f]/20 text-[#d6ef2f] uppercase">
              ZERO-TRUST INTENT TRAP
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Fraud Analyst Command &amp; <span className="text-[#ff2a8d] italic font-light">Review Hub</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Real-time human-in-the-loop decision console. Rapid forensic triage of automated zero-day UPI intent captures, headless crawler DOM captures, and neural scam campaign clusters.
          </p>
        </div>

        {/* Quick KPI Flashcards */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          <div className="p-4 rounded-xl bg-[#1c1b1d] ring-1 ring-white/10 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Protected Today</span>
            <div className="mt-2">
              <div className="font-mono text-xl sm:text-2xl text-[#d6ef2f] font-bold tracking-tight">₹1.84 Cr</div>
              <div className="font-mono text-[10px] text-zinc-500 mt-0.5">+18.4% vs yday</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1c1b1d] ring-1 ring-white/10 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Blacklisted VPAs</span>
            <div className="mt-2">
              <div className="font-mono text-xl sm:text-2xl text-white font-bold tracking-tight">3,412</div>
              <div className="font-mono text-[10px] text-[#ff2a8d] mt-0.5">47 added past 1hr</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1c1b1d] ring-1 ring-white/10 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Active Campaigns</span>
            <div className="mt-2">
              <div className="font-mono text-xl sm:text-2xl text-[#edbf75] font-bold tracking-tight">18</div>
              <div className="font-mono text-[10px] text-zinc-500 mt-0.5">4 High Urgency</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3-COLUMN WORKSPACE: INCIDENT QUEUE (4 COLS) + EVIDENCE DOSSIER (8 COLS) ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Incident Queue (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#ff2a8d]" />
              <h2 className="text-base font-bold text-white">Urgent Intercepts</h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
                12 PENDING
              </span>
            </div>
            <span className="font-mono text-xs text-zinc-400">Risk &gt; 85</span>
          </div>

          <div className="flex flex-col gap-3">
            {incidents.map((inc) => {
              const isSelected = selectedIncidentId === inc.id

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "border-[#ff2a8d] bg-[#201f21] shadow-lg shadow-[#ff2a8d]/10"
                      : "border-white/10 bg-[#131315] hover:bg-[#1c1b1d]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-[#ff2a8d] font-bold">
                        #{inc.id} · {inc.badge}
                      </span>
                      <span className="font-bold text-sm text-white mt-0.5">
                        {inc.title}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xl text-white font-extrabold">
                        {inc.score}<span className="text-xs text-zinc-500 font-normal">/100</span>
                      </span>
                      <span className="font-mono text-[9px] uppercase font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        {inc.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 font-mono text-xs text-zinc-400 truncate">
                    UPI: <span className="text-white font-semibold">{inc.vpa}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-zinc-500 border-t border-white/5 pt-2">
                    <span>Latency: <strong className="text-[#d6ef2f]">{inc.latency}</strong></span>
                    <span>{inc.attempts}</span>
                    {isSelected && <span className="text-[#ff2a8d] font-bold">ACTIVE</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ML Retraining Telemetry Widget */}
          <div className="p-4 rounded-xl bg-[#131315] ring-1 ring-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#d6ef2f] uppercase font-bold">
                CONTINUOUS ML RETRAINING
              </span>
              <span className="font-mono text-[10px] text-[#d6ef2f]">ACTIVE SYNC</span>
            </div>
            <p className="text-xs text-zinc-400">
              Each analyst decision updates gradient weights for TinyFish autonomous web crawler detection thresholds.
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#d6ef2f] h-1.5 rounded-full" style={{ width: "82%" }} />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pt-1">
              <span>False Positives: <strong>0.04%</strong></span>
              <span>Retrain batch: <strong>240 / 300</strong></span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Deep Evidence Dossier & Action Portal (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Dossier Header Bar */}
          <div className="p-4 rounded-xl bg-[#131315] ring-1 ring-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff2a8d]/20 text-[#ff2a8d] flex items-center justify-center font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">Dossier: #{selectedIncidentId}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px] uppercase font-bold">
                    THREAT LEVEL: 92/100
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-400">
                  Protocol: Zero-Trust Intent Intercept · Timestamp: 14:02:11 IST
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-[#edbf75] px-3 py-1 rounded-full bg-[#edbf75]/10 border border-[#edbf75]/20">
              Sovereign Layer 4 Rule Triggered
            </span>
          </div>

          {/* Evidence Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tile A: Decoded UPI Intent */}
            <div className="p-5 rounded-2xl bg-[#131315] ring-1 ring-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-sm text-white uppercase">Decoded UPI Intent &amp; Headers</span>
                <span className="font-mono text-[10px] text-[#edbf75]">URI PARSED</span>
              </div>

              <div className="bg-black/80 p-3 rounded-lg font-mono text-xs text-zinc-300 break-all select-all">
                upi://pay?pa=pmkisan.relieffund@axisbank&amp;pn=PM%20KISAN%20NODAL&amp;mc=8931&amp;tid=AXIS99018471&amp;tr=TXN8821&amp;tn=Disaster%20Relief%20Grant%20Fee&amp;am=2500.00&amp;cu=INR
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#1c1b1d]">
                  <span className="text-zinc-400">Recipient VPA:</span>
                  <span className="text-[#ff2a8d] font-bold">pmkisan.relieffund@axisbank</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#1c1b1d]">
                  <span className="text-zinc-400">Claimed Name:</span>
                  <span className="text-white">PM KISAN NODAL</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#1c1b1d]">
                  <span className="text-zinc-400">MCC Code:</span>
                  <span className="text-red-400 font-bold">8931 (Non-Gov Utility Spoof)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#1c1b1d]">
                  <span className="text-zinc-400">Account Age:</span>
                  <span className="text-red-400 font-bold">3 hours 14 mins</span>
                </div>
              </div>
            </div>

            {/* Tile B: Behavioral & NLP Signals */}
            <div className="p-5 rounded-2xl bg-[#131315] ring-1 ring-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-sm text-white uppercase">Behavioral &amp; NLP Signals</span>
                <span className="font-mono text-[10px] text-[#ff2a8d]">SCAM NLP MATCH</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Gov Impersonation:</span>
                    <span className="text-red-400 font-bold">98% Match</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Artificial Urgency:</span>
                    <span className="text-[#ff2a8d] font-bold">94%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-[#ff2a8d] h-2 rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Mule Swarm Topology:</span>
                    <span className="text-[#edbf75] font-bold">89%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-[#edbf75] h-2 rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-[#edbf75] uppercase">Detected Linguistic Hook:</span>
                  <p className="font-sans text-xs italic text-zinc-200">
                    &ldquo;Pay ₹2,500 biometric portal charge to immediately unlock your 17th installment grant of ₹6,000.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Tile C: TinyFish Autonomous DOM Crawler Telemetry */}
          <div className="p-6 rounded-2xl bg-[#131315] ring-1 ring-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#d6ef2f]" />
                <h3 className="font-bold text-sm text-white">TinyFish Autonomous DOM Crawler Telemetry</h3>
              </div>
              <span className="font-mono text-[10px] text-[#d6ef2f] px-2 py-0.5 rounded bg-[#d6ef2f]/10">
                CRAWL COMPLETED 14ms AGO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/80 p-4 rounded-xl font-mono text-xs space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Target Origin:</span>
                  <span className="text-red-400">https://pmkisan-direct-relief.pages.dev</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Host Provider:</span>
                  <span className="text-white">Cloudflare Pages Spoof</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Exfil Channel:</span>
                  <span className="text-[#d6ef2f]">Telegram Bot API (-10048...)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Victim Reach:</span>
                  <span className="text-red-400 font-bold">24,000 WhatsApp blast</span>
                </div>
              </div>

              <div className="bg-[#1c1b1d] p-4 rounded-xl flex flex-col justify-between gap-2 border border-white/10">
                <span className="font-mono text-[10px] text-zinc-400 uppercase">DOM Forensics Finding:</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Deceptive HTML form extracts Aadhaar number, Mobile OTP, and injects a dynamic reverse-payment QR payload requesting ₹2,500.
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#d6ef2f]">
                  <span className="w-2 h-2 rounded-full bg-[#d6ef2f]" />
                  <span>Reverse payload successfully captured &amp; blocked.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Engine: Action Buttons with Hotkeys A, R, E */}
          <div className="p-6 rounded-2xl bg-[#201f21] ring-1 ring-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-[#d6ef2f]" />
                  <span>Analyst Verdict &amp; Protocol Dispatch</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Executing a verdict automatically broadcasts mitigation rules to 42 participating UPI banking switches.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span>Hotkeys:</span>
                <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold">A</kbd>
                <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold">R</kbd>
                <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold">E</kbd>
              </div>
            </div>

            {/* Verdict Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => triggerAction("blacklist")}
                className="p-4 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white hover:opacity-95 shadow-lg shadow-[#ff2a8d]/25 transition-all text-left flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between w-full">
                  <Ban className="h-5 w-5" />
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/30">[A] HOTKEY</span>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Confirm Scam &amp; Blacklist VPA</div>
                  <div className="text-[11px] text-zinc-200 mt-0.5">Instant block across all UPI switches</div>
                </div>
              </button>

              <button
                onClick={() => triggerAction("benign")}
                className="p-4 rounded-xl bg-[#131315] hover:bg-[#1c1b1d] text-white ring-1 ring-white/10 transition-all text-left flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between w-full">
                  <CheckCircle className="h-5 w-5 text-[#d6ef2f]" />
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/10">[R] HOTKEY</span>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Mark Benign False Positive</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Whitelist VPA &amp; tune heuristic weights</div>
                </div>
              </button>

              <button
                onClick={() => triggerAction("escalate")}
                className="p-4 rounded-xl bg-[#131315] hover:bg-[#1c1b1d] text-white ring-1 ring-white/10 transition-all text-left flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between w-full">
                  <ShieldAlert className="h-5 w-5 text-[#edbf75]" />
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/10">[E] HOTKEY</span>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#edbf75]">Escalate to LEA / 1930 Portal</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Push FIR packet to Cyber Cell</div>
                </div>
              </button>
            </div>

            {/* Verdict execution status banner */}
            {verdictBanner.show && (
              <div className="p-3.5 rounded-xl bg-black/80 ring-1 ring-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 shrink-0" />
                  <span>{verdictBanner.message}</span>
                </div>
                <button
                  onClick={() => setVerdictBanner({ ...verdictBanner, show: false })}
                  className="text-zinc-500 hover:text-white ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
