"use client"

import React, { useState, useEffect, useMemo } from "react"
import BreathBloom from "@/components/ui/breath-bloom"
import { 
  Activity, 
  AlertTriangle, 
  Download, 
  Search, 
  Check, 
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy
} from "lucide-react"

export interface ScamWave {
  id: string
  title: string
  howItWorks: string
  urgentPhrase: string
  linkedVpas: string[]
  status: "ACTIVE SURGE" | "CONFIRMED SCAM WAVE" | "FALSE ALARM"
  attemptsReported: number
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM"
  mapCoordinates: { x: number; y: number }
}

const INITIAL_WAVES: ScamWave[] = [
  {
    id: "WAVE-104",
    title: "Fake Electricity Bill Wave",
    howItWorks: "Fake electricity cut SMS warning that power connection will be snapped tonight unless victims make an immediate token payment or install a rogue APK.",
    urgentPhrase: "Electricity will be disconnected tonight at 9:30 PM due to unpaid arrears.",
    linkedVpas: [
      "quickpay.refund992@ybl",
      "mahadiscom.billdesk@okaxis",
      "powerbill.urgentpay@paytm",
      "bescom.utility.clear@ibl"
    ],
    status: "ACTIVE SURGE",
    attemptsReported: 840,
    riskLevel: "CRITICAL",
    mapCoordinates: { x: 26, y: 32 }
  },
  {
    id: "WAVE-098",
    title: "Merchant QR Sticker Swap",
    howItWorks: "Physical and digital sticker tampering swapping legitimate merchant counter QR codes with fraudulent personal savings account VPAs.",
    urgentPhrase: "Scan here to pay tea/grocery merchant directly (No OTP required).",
    linkedVpas: [
      "retail.counter912@paytm",
      "merchant.qr.override@ybl",
      "fastpay.kirana99@icici"
    ],
    status: "ACTIVE SURGE",
    attemptsReported: 312,
    riskLevel: "HIGH",
    mapCoordinates: { x: 72, y: 28 }
  },
  {
    id: "WAVE-092",
    title: "Fake Instant Loan App",
    howItWorks: "Deceptive loan apps demanding an advance processing fee of ₹1,200 via UPI before releasing a non-existent ₹50,000 credit line.",
    urgentPhrase: "Your pre-approved loan of ₹50,000 is ready. Pay ₹1,200 verification fee to disburse.",
    linkedVpas: [
      "fastcredit.disburse@axisbank",
      "instantloan.verify@sbi",
      "loandesk.processing@okaxis"
    ],
    status: "CONFIRMED SCAM WAVE",
    attemptsReported: 495,
    riskLevel: "CRITICAL",
    mapCoordinates: { x: 38, y: 74 }
  },
  {
    id: "WAVE-088",
    title: "Telegram Task Scam",
    howItWorks: "Part-time job traps on WhatsApp & Telegram asking victims to like YouTube videos or review hotels, then demanding crypto/UPI deposits to unlock 'earnings'.",
    urgentPhrase: "Complete 3 YouTube like tasks and earn ₹3,500 daily. Deposit ₹2,000 to upgrade tier.",
    linkedVpas: [
      "vip.tasks.payout@icici",
      "freelance.salarydrop@ybl",
      "taskreward.desk@okaxis"
    ],
    status: "ACTIVE SURGE",
    attemptsReported: 620,
    riskLevel: "HIGH",
    mapCoordinates: { x: 80, y: 68 }
  }
]

export default function TransactionDnaTab() {
  const [waves, setWaves] = useState<ScamWave[]>(INITIAL_WAVES)
  const [selectedWaveId, setSelectedWaveId] = useState<string>("WAVE-104")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedVpa, setCopiedVpa] = useState<string | null>(null)

  const selectedWave = useMemo(() => {
    return waves.find(w => w.id === selectedWaveId) || waves[0]
  }, [waves, selectedWaveId])

  const filteredWaves = useMemo(() => {
    return waves.filter(w => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        w.title.toLowerCase().includes(q) ||
        w.howItWorks.toLowerCase().includes(q) ||
        w.linkedVpas.some(v => v.toLowerCase().includes(q))
      )
    })
  }, [waves, searchQuery])

  const handleUpdateStatus = (waveId: string, newStatus: ScamWave["status"]) => {
    setWaves(prev => prev.map(w => w.id === waveId ? { ...w, status: newStatus } : w))
  }

  const handleDownloadReport = (wave: ScamWave) => {
    const reportData = {
      reportType: "TriNETRA Scam Wave Intelligence Dossier",
      generatedAt: new Date().toISOString(),
      waveId: wave.id,
      waveTitle: wave.title,
      riskLevel: wave.riskLevel,
      status: wave.status,
      attemptsReported: wave.attemptsReported,
      scamMechanism: wave.howItWorks,
      urgentHook: wave.urgentPhrase,
      flaggedVpas: wave.linkedVpas,
      advisory: "Immediate precautionary alert for user-facing UPI apps and merchant networks."
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `TriNETRA-Wave-Report-${wave.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyVpa = (vpa: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(vpa)
      setCopiedVpa(vpa)
      setTimeout(() => setCopiedVpa(null), 2000)
    }
  }

  return (
    <BreathBloom>
      <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ─── HEADER: TITLE & PLAIN-ENGLISH EXPLANATION ─── */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Transaction DNA &amp;{" "}
            <span className="font-serif italic font-normal text-[#ff2a8d]">
              Scam Waves.
            </span>
          </h1>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-neutral-300 leading-relaxed space-y-1">
            <p className="font-semibold text-white">
              What this tab is used for:
            </p>
            <p className="text-neutral-400">
              Scammers rarely stop at one victim—they send the same fake bill or loan message to thousands of people using different UPI IDs. Transaction DNA groups related scam reports together by matching their message wording and payment patterns so you can spot new scam waves early.
            </p>
          </div>
        </div>

        {/* ─── SECTION 1: VISUAL SCAM WAVE MAP & WAVE SUMMARY ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Interactive Cluster Map (6 Cols) */}
          <div className="lg:col-span-6 border border-white/10 bg-black/60 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#ff2a8d]" />
                <span>Detected Scam Clusters (Click to Select)</span>
              </span>
              <span className="font-mono text-xs text-[#e5ff40]">
                {waves.length} Active Waves
              </span>
            </div>

            {/* Simulated 2D Cluster Canvas */}
            <div className="relative w-full h-72 sm:h-80 bg-neutral-950/80 rounded-xl border border-white/5 overflow-hidden p-4">
              {/* Subtle Grid Guidelines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

              {/* 4 Interactive Scam Wave Nodes */}
              {waves.map((w) => {
                const isSelected = w.id === selectedWaveId
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWaveId(w.id)}
                    style={{
                      left: `${w.mapCoordinates.x}%`,
                      top: `${w.mapCoordinates.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    className={`absolute p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 shadow-xl ${
                      isSelected
                        ? "bg-[#ff2a8d]/25 border-[#ff2a8d] ring-2 ring-[#ff2a8d]/50 scale-105 z-20"
                        : "bg-black/70 border-white/15 hover:border-white/40 z-10"
                    }`}
                  >
                    <span className="flex h-3 w-3 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? "bg-[#ff2a8d]" : "bg-[#e5ff40]"
                      }`} />
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        isSelected ? "bg-[#ff2a8d]" : "bg-[#e5ff40]"
                      }`} />
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white whitespace-nowrap">
                      {w.title}
                    </span>
                    <span className="font-mono text-[9px] text-neutral-400">
                      {w.attemptsReported} reports
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="text-[11px] font-mono text-neutral-500">
              Interactive cluster coordinates grouped by message phrasing similarity and rapid VPA rotation.
            </p>
          </div>

          {/* Right: Plain-English Selected Wave Summary (6 Cols) */}
          <div className="lg:col-span-6 border border-white/10 bg-black/60 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="font-mono text-[11px] text-[#ff2a8d] font-bold uppercase">
                    {selectedWave.id}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedWave.title}
                  </h3>
                </div>

                <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
                  selectedWave.status === "ACTIVE SURGE"
                    ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40"
                    : selectedWave.status === "CONFIRMED SCAM WAVE"
                    ? "bg-[#ff2a8d]/20 text-[#ff2a8d] ring-1 ring-[#ff2a8d]/40"
                    : "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
                }`}>
                  {selectedWave.status}
                </span>
              </div>

              {/* 1. Scam Type & How It Works */}
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Scam Type &amp; How It Works
                </span>
                <p className="text-xs sm:text-sm text-neutral-200 bg-white/[0.03] p-3 rounded-lg border border-white/5 leading-relaxed">
                  {selectedWave.howItWorks}
                </p>
              </div>

              {/* 2. Common Urgent Phrase Used */}
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Common Urgent Phrase Used
                </span>
                <p className="text-xs sm:text-sm text-[#e5ff40] bg-black/60 p-3 rounded-lg border border-white/5 font-mono leading-relaxed">
                  &ldquo;{selectedWave.urgentPhrase}&rdquo;
                </p>
              </div>

              {/* 3. Linked Scammer UPI IDs */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Linked Scammer UPI IDs ({selectedWave.linkedVpas.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedWave.linkedVpas.map((vpa) => (
                    <button
                      key={vpa}
                      onClick={() => handleCopyVpa(vpa)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white hover:border-[#ff2a8d]/50 transition-all cursor-pointer"
                    >
                      <span>{vpa}</span>
                      {copiedVpa === vpa ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-neutral-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action: Download Wave Report */}
            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => handleDownloadReport(selectedWave)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-[#ff2a8d] hover:text-white text-neutral-200 border border-white/10 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Wave Report (.json) →</span>
              </button>
            </div>
          </div>

        </div>

        {/* ─── SECTION 2: ACTIVE SCAM WAVES TABLE ─── */}
        <div className="border border-white/10 bg-black/60 backdrop-blur-md p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Active Scam Waves Table
              </h3>
              <p className="text-xs text-neutral-400">
                Click any row to inspect its cluster above or update its status.
              </p>
            </div>

            {/* Search Filter */}
            <div className="flex items-center gap-2 border border-white/10 bg-black/60 px-3 py-1.5 rounded-lg w-full sm:w-64">
              <Search className="h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wave or UPI ID..."
                className="bg-transparent text-xs text-white outline-none w-full placeholder-neutral-600 font-mono"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 font-mono text-neutral-400 text-[11px] uppercase">
                  <th className="py-3 px-4">Wave ID</th>
                  <th className="py-3 px-4">Wave Title</th>
                  <th className="py-3 px-4">Urgent Phrasing Used</th>
                  <th className="py-3 px-4">Reports</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filteredWaves.map((wave) => {
                  const isSelected = wave.id === selectedWaveId
                  return (
                    <tr
                      key={wave.id}
                      onClick={() => setSelectedWaveId(wave.id)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                        isSelected ? "bg-white/[0.05]" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#ff2a8d]">
                        {wave.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {wave.title}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 max-w-xs truncate font-mono text-[11px]">
                        {wave.urgentPhrase}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#e5ff40]">
                        {wave.attemptsReported}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className={`px-2.5 py-0.5 rounded-full ${
                          wave.status === "ACTIVE SURGE"
                            ? "bg-red-500/15 text-red-400"
                            : wave.status === "CONFIRMED SCAM WAVE"
                            ? "bg-[#ff2a8d]/15 text-[#ff2a8d]"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}>
                          {wave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {wave.status !== "CONFIRMED SCAM WAVE" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateStatus(wave.id, "CONFIRMED SCAM WAVE")
                            }}
                            className="px-2.5 py-1 rounded bg-[#ff2a8d]/20 hover:bg-[#ff2a8d] text-[#ff2a8d] hover:text-white font-mono text-[10px] font-bold transition-all"
                          >
                            Confirm Scam Wave
                          </button>
                        )}
                        {wave.status !== "FALSE ALARM" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateStatus(wave.id, "FALSE ALARM")
                            }}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 font-mono text-[10px] transition-all"
                          >
                            Mark False Alarm
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </BreathBloom>
  )
}
