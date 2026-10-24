"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import jsQR from "jsqr"
import KineticGrid from "@/components/ui/kinetic-grid"
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  QrCode, 
  MessageSquare, 
  Globe, 
  Terminal, 
  Upload, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw,
  Sparkles,
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  XCircle,
  Radio,
  FileText,
  BadgeAlert,
  UserCheck
} from "lucide-react"

type InputTab = "qr" | "sms" | "url"

interface AnalysisResult {
  score: number
  riskTier: "LOW" | "MEDIUM" | "HIGH"
  mismatchFound: boolean
  mismatchCode: string
  explanation: string
  flaggedPhrases: string[]
  pspInfo?: {
    provider: string
    bank: string
    type: string
  }
  qrPayloadMeta?: {
    hasPn: boolean
    pn: string
    hasMc: boolean
    mc: string
    hasSign: boolean
    signPresent: boolean
  }
  breakdown: {
    behavior: { score: number; weight: number; points: number }
    nlp: { score: number; weight: number; points: number }
    url: { score: number; weight: number; points: number }
    mismatch: { score: number; weight: number; points: number }
  }
}

interface TinyFishFetchResult {
  status: "STANDBY" | "CRITICAL_TRAP" | "BENIGN"
  pageTitle: string
  serverHost: string
  isPhishing: boolean
  detectedTraps: string[]
  riskSummary: string
  finalUrl: string
}

interface TinyFishSearchResult {
  status: "STANDBY" | "REPORTS_FOUND" | "CLEAN"
  complaintCount: number
  source: string
  lastReported: string
  keywords: string[]
  summary: string
}

interface TinyFishAgentResult {
  status: "STANDBY" | "VERIFIED" | "IMPOSTOR_FLAGGED" | "UNREGISTERED_ENTITY"
  isAffiliated: boolean
  claimedBrand: string
  officialDomain: string
  verdict: string
  explanation: string
}

interface TelemetryLog {
  timestamp: string
  channel: "FETCH" | "SEARCH" | "AGENT" | "CORE"
  message: string
}

const PRESETS = [
  {
    name: "Fake Tata Power Electricity Disconnection QR",
    rawUpiUri: "upi://pay?pa=quickpay.refund992@ybl&pn=QuickPay%20Refund%20Desk&am=4850.00&cu=INR&tn=Electricity%20Bill%20Urgent%20Payment",
    claimedRecipient: "Tata Power Delhi Distribution Ltd",
    messageText: "URGENT: Your power connection will be disconnected tonight at 09:30 PM due to unpaid bill of Rs 4850. Pay immediately via UPI or call 9876543210.",
    phishingUrl: "https://state-electricity-ebill-portal.xyz/pay-instant",
    tab: "qr" as InputTab
  },
  {
    name: "Unverified FamPay Wallet Mismatch (7817929602@fam)",
    rawUpiUri: "upi://pay?pa=7817929602@fam&am=2500.00&cu=INR&tn=Personal%20Payment",
    claimedRecipient: "Parth Gupta",
    messageText: "Payment request from Parth Gupta via FamPay.",
    phishingUrl: "",
    tab: "qr" as InputTab
  },
  {
    name: "Fake Fastag KYC Deactivation Alert Link",
    rawUpiUri: "upi://pay?pa=fastag.kycupdates99@paytm&pn=Fastag%20KYC%20Desk&am=1200.00&cu=INR&tn=Fastag%20KYC%20Renewal",
    claimedRecipient: "NETC Fastag (IHMCL)",
    messageText: "Dear Customer, Your FASTAG wallet has been blocked due to incomplete KYC. Update immediately to prevent highway toll penalty: https://fastag-kyc-desk.top/update",
    phishingUrl: "https://fastag-kyc-desk.top/update",
    tab: "sms" as InputTab
  },
  {
    name: "Legitimate Verified Merchant QR (Swiggy)",
    rawUpiUri: "upi://pay?pa=swiggy@icici&pn=Swiggy%20India&am=640.00&cu=INR&tn=Food%20Order%20Payment&mc=5812&sign=MEYCIQC0k2j9",
    claimedRecipient: "Swiggy",
    messageText: "Swiggy order #98218 confirmed. Total payable: Rs 640. Thank you for ordering with us.",
    phishingUrl: "https://swiggy.com/order/98218",
    tab: "qr" as InputTab
  }
]

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<InputTab>("qr")
  const [presetIndex, setPresetIndex] = useState(0)
  const [activeSampleName, setActiveSampleName] = useState<string | null>(PRESETS[0].name)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [telemetryExpanded, setTelemetryExpanded] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // User input states
  const [rawUpiUri, setRawUpiUri] = useState(PRESETS[0].rawUpiUri)
  const [claimedRecipient, setClaimedRecipient] = useState(PRESETS[0].claimedRecipient)
  const [messageText, setMessageText] = useState(PRESETS[0].messageText)
  const [phishingUrl, setPhishingUrl] = useState(PRESETS[0].phishingUrl)

  // Decoded UPI fields
  const [parsedVpa, setParsedVpa] = useState("quickpay.refund992@ybl")
  const [parsedName, setParsedName] = useState("QuickPay Refund Desk")
  const [parsedAmount, setParsedAmount] = useState("4850.00")
  const [parsedNote, setParsedNote] = useState("Electricity Bill Urgent Payment")
  const [parsedMc, setParsedMc] = useState("")
  const [parsedSign, setParsedSign] = useState("")

  // Real API state
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    score: 92,
    riskTier: "HIGH",
    mismatchFound: true,
    mismatchCode: "BRAND_IMPERSONATION",
    explanation: "This transaction claims to pay Tata Power Delhi Distribution Ltd, but routes to an unauthorized retail handle ('quickpay.refund992@ybl') without verified Merchant Category Code ('mc') or NPCI digital signature.",
    flaggedPhrases: ["disconnected tonight", "urgent", "immediately"],
    pspInfo: {
      provider: "PhonePe",
      bank: "Yes Bank",
      type: "RETAIL_PSP"
    },
    qrPayloadMeta: {
      hasPn: true,
      pn: "QuickPay Refund Desk",
      hasMc: false,
      mc: "None (Retail P2P)",
      hasSign: false,
      signPresent: false
    },
    breakdown: {
      behavior: { score: 95, weight: 0.50, points: 47.5 },
      nlp: { score: 90, weight: 0.20, points: 18.0 },
      url: { score: 96, weight: 0.15, points: 14.4 },
      mismatch: { score: 100, weight: 0.15, points: 15.0 }
    }
  })

  const [tinyfishFetch, setTinyfishFetch] = useState<TinyFishFetchResult>({
    status: "CRITICAL_TRAP",
    pageTitle: "Online Electricity Bill Instant Clearance Desk (Counterfeit)",
    serverHost: "194.26.29.112 (Offshore AS-Host, St. Petersburg)",
    isPhishing: true,
    detectedTraps: [
      "<input name='upi_pin' type='password' maxlength='6' placeholder='Enter UPI PIN'>",
      "<form action='http://194.26.29.112/harvest.php'>"
    ],
    riskSummary: "Zero-Day Credential Harvester: Rogue form capturing confidential 6-digit UPI PIN within non-banking origin.",
    finalUrl: "https://state-electricity-ebill-portal.xyz/pay-instant"
  })

  const [tinyfishSearch, setTinyfishSearch] = useState<TinyFishSearchResult>({
    status: "REPORTS_FOUND",
    complaintCount: 19,
    source: "I4C National Cyber Crime Portal (1930) & CFCFRS Hub",
    lastReported: "14 mins ago (Bengaluru Cyber Cell)",
    keywords: ["Power Disconnection Scam", "Forged Tata Utility SMS", "YBL Retail Mule"],
    summary: "Found 19 correlated complaints registered against this destination across state cyber crime cells."
  })

  const [tinyfishAgent, setTinyfishAgent] = useState<TinyFishAgentResult>({
    status: "IMPOSTOR_FLAGGED",
    isAffiliated: false,
    claimedBrand: "Tata Power Delhi Distribution Limited",
    officialDomain: "tatapower.com",
    verdict: "IMPOSTOR DETECTED: The payee claims to be Tata Power Delhi Distribution Limited, but payment routes to an unauthorized retail handle ('quickpay.refund992@ybl').",
    explanation: "Official TATA POWER payments only route to: tatapower@icici, tpddl@hdfcbank, tatapower@sbi."
  })

  const [logs, setLogs] = useState<TelemetryLog[]>([
    { timestamp: "18:42:01.104", channel: "CORE", message: "Forensic interceptor initialized on port :3000." },
    { timestamp: "18:42:01.218", channel: "FETCH", message: "TinyFish Headless DOM crawl trapped fake utility credential portal." },
    { timestamp: "18:42:01.442", channel: "SEARCH", message: "Matched 19 cyber complaint dossiers in I4C 1930 registry." },
    { timestamp: "18:42:01.690", channel: "AGENT", message: "Corporate registry mismatch: '@ybl' is not an authorized Tata Power partner." },
    { timestamp: "18:42:01.910", channel: "CORE", message: "Signal fusion completed: Risk Score 92/100 (HIGH). Warning issued." }
  ])

  // Reset telemetry cards to fresh state during user edits or analysis
  const resetInspectionCards = () => {
    setTinyfishFetch({
      status: "STANDBY",
      pageTitle: "Pending Inspection",
      serverHost: "Waiting for verification",
      isPhishing: false,
      detectedTraps: [],
      riskSummary: "Click Verify Payment to run real-time inspection.",
      finalUrl: ""
    })
    setTinyfishSearch({
      status: "STANDBY",
      complaintCount: 0,
      source: "I4C National Cyber Crime Portal (1930)",
      lastReported: "Pending search",
      keywords: [],
      summary: "Waiting for recipient verification."
    })
    setTinyfishAgent({
      status: "STANDBY",
      isAffiliated: false,
      claimedBrand: "",
      officialDomain: "",
      verdict: "Pending verification",
      explanation: "Waiting for recipient verification."
    })
  }

  // Real-time URI parser
  const updateUriParams = (uri: string) => {
    try {
      const url = new URL(uri.replace("upi://pay", "http://dummy.com"))
      const pa = url.searchParams.get("pa") || ""
      const pn = url.searchParams.get("pn") || ""
      const am = url.searchParams.get("am") || "0.00"
      const tn = url.searchParams.get("tn") || ""
      const mc = url.searchParams.get("mc") || ""
      const sign = url.searchParams.get("sign") || ""

      setParsedVpa(pa)
      setParsedName(pn ? decodeURIComponent(pn) : "")
      setParsedAmount(am)
      setParsedNote(tn ? decodeURIComponent(tn) : "")
      setParsedMc(mc)
      setParsedSign(sign)
    } catch {
      // Ignore URL parsing errors
    }
  }

  // Real Client-Side QR Image Decoder with jsQR
  const handleQrFileUpload = (file: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (!result) return
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code && code.data) {
          const completeRawUri = code.data // Full unstripped string
          setRawUpiUri(completeRawUri)
          setActiveSampleName(null) // IMMEDIATELY CLEAR STALE PRESET
          resetInspectionCards()
          updateUriParams(completeRawUri)
          // Run fresh analysis with newly decoded QR
          executePipeline(completeRawUri, claimedRecipient, messageText, phishingUrl)
        } else {
          alert("Could not detect a clear QR code in this image. Please ensure the QR code is clearly visible or paste the raw UPI URI.")
        }
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  // Real Next.js App Router Backend Pipeline Execution
  const executePipeline = async (
    uri: string,
    claimed: string,
    msg: string,
    urlStr: string
  ) => {
    setIsAnalyzing(true)
    updateUriParams(uri)

    let currentVpa = parsedVpa
    let currentName = parsedName
    let currentAmount = parsedAmount
    let currentNote = parsedNote

    try {
      if (uri.startsWith("upi://pay")) {
        const url = new URL(uri.replace("upi://pay", "http://dummy.com"))
        currentVpa = url.searchParams.get("pa") || currentVpa
        currentName = url.searchParams.get("pn") ? decodeURIComponent(url.searchParams.get("pn")!) : currentName
        currentAmount = url.searchParams.get("am") || currentAmount
        currentNote = url.searchParams.get("tn") ? decodeURIComponent(url.searchParams.get("tn")!) : currentNote
      }
    } catch {
      // Fallback
    }

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`

    setLogs(prev => [
      { timestamp: timeStr, channel: "CORE", message: `Executing deterministic 3-way check for '${claimed || "beneficiary"}'...` },
      ...prev.slice(0, 5)
    ])

    try {
      // Call all real backend route handlers in parallel
      const [checkPaymentRes, inspectUrlRes, searchScamsRes, verifyBrandRes] = await Promise.allSettled([
        fetch("/api/check-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claimedRecipient: claimed,
            actualVpa: currentVpa,
            payeeName: currentName,
            transactionNote: currentNote,
            messageText: msg,
            phishingUrl: urlStr,
            amount: currentAmount,
            upiUri: uri
          })
        }).then(r => r.json()),

        fetch("/api/inspect-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlStr })
        }).then(r => r.json()),

        fetch("/api/search-scams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vpa: currentVpa, phone: "9876543210", domain: urlStr })
        }).then(r => r.json()),

        fetch("/api/verify-brand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claimedRecipient: claimed, destinationVpa: currentVpa, destinationUrl: urlStr })
        }).then(r => r.json())
      ])

      // 1. Process Check Payment Output
      if (checkPaymentRes.status === "fulfilled" && checkPaymentRes.value.success) {
        setAnalysis(checkPaymentRes.value)
      }

      // 2. Process TinyFish Fetch Output
      if (inspectUrlRes.status === "fulfilled" && inspectUrlRes.value.success) {
        setTinyfishFetch(inspectUrlRes.value)
      }

      // 3. Process TinyFish Search Output
      if (searchScamsRes.status === "fulfilled" && searchScamsRes.value.success) {
        setTinyfishSearch(searchScamsRes.value)
      }

      // 4. Process TinyFish Agent Output
      if (verifyBrandRes.status === "fulfilled" && verifyBrandRes.value.success) {
        setTinyfishAgent(verifyBrandRes.value)
      }

      setLogs(prev => [
        { timestamp: timeStr, channel: "CORE", message: "Deterministic analysis complete. Live telemetry updated." },
        ...prev.slice(0, 5)
      ])
    } catch (err: any) {
      console.error("Pipeline error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Preset cycling trigger
  const handleCyclePreset = () => {
    const nextIndex = (presetIndex + 1) % PRESETS.length
    setPresetIndex(nextIndex)
    const p = PRESETS[nextIndex]
    setActiveSampleName(p.name)
    setRawUpiUri(p.rawUpiUri)
    setClaimedRecipient(p.claimedRecipient)
    setMessageText(p.messageText)
    setPhishingUrl(p.phishingUrl)
    setActiveTab(p.tab)
    executePipeline(p.rawUpiUri, p.claimedRecipient, p.messageText, p.phishingUrl)
  }

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(rawUpiUri)
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
          className="pointer-events-none select-none absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13vw] font-black uppercase tracking-tighter text-white opacity-[0.03] z-0 leading-none"
        >
          त्रिNETRA // FORENSICS
        </div>

        {/* ─── TOP NAVIGATION: EXACT MATCH TO LANDING PAGE ─── */}
        <header className="relative z-20 w-full border-b border-white/[0.08] bg-black/60 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Left Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-9 w-9 overflow-hidden bg-black/60 p-1 border border-white/[0.12] transition-transform group-hover:scale-105">
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
                <span className="bg-[#ff2a8d] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(255,42,141,0.6)]">
                  UPI SENTINEL
                </span>
              </div>
            </Link>

            {/* Right Navigation Link */}
            <div className="flex items-center gap-6">
              <Link 
                href="/?tab=analyst-portal" 
                className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#e5ff40] hover:text-[#d4ed36] transition-colors group"
              >
                <span>Analyst Portal</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </header>

        {/* ─── MAIN STAGE CONTAINER (OPEN CANVAS WITH KINETIC GRID GLOW) ─── */}
        <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          
          {/* Section Kicker: Single Pink Line Pattern */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-6 bg-[#ff2a8d]" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ff2a8d]">
              UPI FORENSIC SCANNER
            </span>
          </div>

          {/* Headline Typography & Human Subtitle */}
          <div className="mb-12 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Verify any payment{" "}
              <span className="font-serif italic font-normal text-[#ff2a8d]">
                before money leaves.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-400 font-normal leading-relaxed">
              Drop a QR code, paste a suspicious payment link, or check a WhatsApp bill notice to see who is actually receiving your money.
            </p>
          </div>

          {/* ─── 2-COLUMN ASYMMETRIC GRID SEPARATED BY SUBTLE HAIRLINE ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ════════════════════════════════════════════════════════════
                LEFT COLUMN (45% width: lg:col-span-5)
                Clean, De-clustered Input Workspace directly on canvas
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Clean Borderless Pill Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab("qr")
                    setActiveSampleName(null)
                    resetInspectionCards()
                  }}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                    activeTab === "qr"
                      ? "bg-[#ff2a8d] text-white shadow-[0_0_15px_rgba(255,42,141,0.35)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  Scan QR
                </button>
                <button
                  onClick={() => {
                    setActiveTab("sms")
                    setActiveSampleName(null)
                    resetInspectionCards()
                  }}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                    activeTab === "sms"
                      ? "bg-[#ff2a8d] text-white shadow-[0_0_15px_rgba(255,42,141,0.35)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  SMS / WhatsApp
                </button>
                <button
                  onClick={() => {
                    setActiveTab("url")
                    setActiveSampleName(null)
                    resetInspectionCards()
                  }}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                    activeTab === "url"
                      ? "bg-[#ff2a8d] text-white shadow-[0_0_15px_rgba(255,42,141,0.35)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  Website Link
                </button>
              </div>

              {/* Input Workspace Body */}
              <div className="space-y-6">
                
                {/* Scan QR Tab: Minimal Drag & Drop Zone with Real Client jsQR */}
                {activeTab === "qr" && (
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleQrFileUpload(e.target.files[0])
                        }
                      }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleQrFileUpload(e.dataTransfer.files[0])
                        }
                      }}
                      className="border border-dashed border-white/10 bg-black/40 backdrop-blur-[2px] hover:border-[#ff2a8d]/50 hover:bg-white/[0.04] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                    >
                      <div className="h-10 w-10 rounded-full bg-white/[0.04] flex items-center justify-center text-neutral-400 group-hover:text-[#ff2a8d] transition-colors">
                        <QrCode className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-normal text-white">
                        Drop QR screenshot here, or click to upload
                      </p>
                      <p className="text-xs text-neutral-500 font-normal">
                        Full raw URI extracted with parameters intact (&amp;pn=, &amp;am=, &amp;tn=, &amp;mc=, &amp;sign=)
                      </p>
                    </div>
                  </div>
                )}

                {/* SMS / WhatsApp Tab */}
                {activeTab === "sms" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Suspicious Message Body
                    </label>
                    <textarea
                      rows={4}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value)
                        setActiveSampleName(null)
                        resetInspectionCards()
                      }}
                      className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors font-sans leading-relaxed"
                      placeholder="Paste SMS, WhatsApp disconnection message, or urgency text..."
                    />
                  </div>
                )}

                {/* Website Link Tab */}
                {activeTab === "url" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Suspect Payment or Portal Link
                    </label>
                    <input
                      type="text"
                      value={phishingUrl}
                      onChange={(e) => {
                        setPhishingUrl(e.target.value)
                        setActiveSampleName(null)
                        resetInspectionCards()
                      }}
                      className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors font-sans"
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* Claimed Recipient Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Merchant or Person Claimed
                  </label>
                  <input
                    type="text"
                    value={claimedRecipient}
                    onChange={(e) => {
                      setClaimedRecipient(e.target.value)
                      setActiveSampleName(null) // IMMEDIATELY CLEAR STALE PRESET
                      resetInspectionCards()
                    }}
                    className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors font-sans"
                    placeholder="e.g. Parth Gupta, Tata Power, BESCOM, SBI..."
                  />
                </div>

                {/* Decoded UPI String Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Decoded UPI URI (upi://pay)
                    </label>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 font-mono text-[11px] text-[#e5ff40] hover:underline"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy URI"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={rawUpiUri}
                    onChange={(e) => {
                      setRawUpiUri(e.target.value)
                      setActiveSampleName(null) // IMMEDIATELY CLEAR STALE PRESET
                      resetInspectionCards()
                      updateUriParams(e.target.value)
                    }}
                    className="w-full border border-white/10 bg-black/40 backdrop-blur-[2px] p-3 font-mono text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#ff2a8d] transition-colors"
                  />
                  
                  {/* Read-Only Badge: QR Registered Bank Name (pn) & VPA */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="text-neutral-500">Destination VPA:</span>
                    <span className="text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded">
                      {parsedVpa || "None detected"}
                    </span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-neutral-500">QR Bank Name (pn):</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      parsedName ? "text-[#e5ff40] bg-[#e5ff40]/10 border border-[#e5ff40]/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                    }`}>
                      {parsedName || "None (Missing in QR)"}
                    </span>
                  </div>
                </div>

                {/* Action Trigger Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => executePipeline(rawUpiUri, claimedRecipient, messageText, phishingUrl)}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-7 py-3.5 font-mono text-xs font-bold uppercase text-white shadow-[0_0_25px_rgba(255,42,141,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Verifying Destination...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Payment</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCyclePreset}
                    className="w-full sm:w-auto font-mono text-xs font-bold text-[#e5ff40] hover:text-[#d4ed36] px-2 py-2 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Try live scam example</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                {/* Current active preset indicator */}
                {activeSampleName && (
                  <p className="text-[11px] font-mono text-neutral-500">
                    Live sample: <span className="text-neutral-400">{activeSampleName}</span>
                  </p>
                )}
              </div>
            </div>


            {/* ════════════════════════════════════════════════════════════
                RIGHT COLUMN (55% width: lg:col-span-7)
                Verdict & Explainable Risk Fusion on Open Canvas
                Separated by clean subtle vertical hairline
               ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 lg:border-l lg:border-white/5 lg:pl-12 space-y-10">
              
              {/* Risk Verdict Banner */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Forensic Risk Verdict
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-mono text-6xl font-black text-white tracking-tighter">
                        {analysis.score}
                      </span>
                      <span className="font-mono text-sm text-neutral-500">/ 100</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div 
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
                      analysis.mismatchFound
                        ? "border border-[#ff2a8d] bg-[#ff2a8d]/15 text-[#ff2a8d] shadow-[0_0_20px_rgba(255,42,141,0.25)]"
                        : analysis.riskTier === "HIGH"
                        ? "border border-[#ff2a8d] bg-[#ff2a8d]/15 text-[#ff2a8d]"
                        : analysis.riskTier === "MEDIUM"
                        ? "border border-amber-500 bg-amber-500/15 text-amber-400"
                        : "border border-[#e5ff40] bg-[#e5ff40]/15 text-[#e5ff40]"
                    }`}
                  >
                    {analysis.mismatchFound ? (
                      <>
                        <BadgeAlert className="h-3.5 w-3.5" />
                        <span>HIGH THREAT — IDENTITY MISMATCH</span>
                      </>
                    ) : analysis.riskTier === "HIGH" ? (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>HIGH THREAT DETECTED</span>
                      </>
                    ) : analysis.riskTier === "MEDIUM" ? (
                      <>
                        <Radio className="h-3.5 w-3.5" />
                        <span>MEDIUM RISK CAUTION</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>VERIFIED RECIPIENT — LOW THREAT</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Horizontal Segmented Bar (Single Clean Bar) */}
                <div className="space-y-2 pt-2">
                  <div className="flex h-3 w-full bg-white/[0.04] rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${analysis.breakdown.behavior.points}%` }} 
                      className="bg-[#ff2a8d] transition-all"
                    />
                    <div 
                      style={{ width: `${analysis.breakdown.nlp.points}%` }} 
                      className="bg-[#e5ff40] transition-all"
                    />
                    <div 
                      style={{ width: `${analysis.breakdown.url.points}%` }} 
                      className="bg-amber-400 transition-all"
                    />
                    <div 
                      style={{ width: `${analysis.breakdown.mismatch.points}%` }} 
                      className="bg-rose-500 transition-all"
                    />
                  </div>

                  {/* Clean Borderless 4-Column Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-1 text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ff2a8d]" />
                      <span>Behavior ({analysis.breakdown.behavior.points} pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e5ff40]" />
                      <span>Message Tone ({analysis.breakdown.nlp.points} pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span>Link Safety ({analysis.breakdown.url.points} pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span>VPA Match ({analysis.breakdown.mismatch.points} pts)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Who You Think You're Paying vs. Who Actually Gets Paid */}
              <div className="border-t border-white/[0.08] pt-6 space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Who You Think You&apos;re Paying vs. Who Actually Gets Paid
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                  <div>
                    <span className="text-xs text-neutral-500 block">Claimed Recipient</span>
                    <span className="text-base font-medium text-white">{claimedRecipient || "Unknown Payee"}</span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-neutral-500 block">
                      Actual Bank Destination {analysis.pspInfo ? `(${analysis.pspInfo.provider})` : ""}
                    </span>
                    <div className="flex items-center sm:justify-end gap-2">
                      <span className={`font-mono text-base font-bold ${analysis.mismatchFound ? "text-[#ff2a8d]" : "text-[#e5ff40]"}`}>
                        {parsedVpa}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plain-English Explanation */}
                <p className="text-sm text-neutral-400 font-normal leading-relaxed pt-1">
                  {analysis.explanation}
                </p>
              </div>

              {/* Autonomous TinyFish MCP Intelligence Feed */}
              <div className="border-t border-white/[0.08] pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Autonomous Web &amp; Entity Inspection
                  </span>
                  <button
                    onClick={() => setTelemetryExpanded(!telemetryExpanded)}
                    className="font-mono text-[11px] text-neutral-500 hover:text-white flex items-center gap-1"
                  >
                    <span>{telemetryExpanded ? "Hide Feed" : "Show Feed"}</span>
                    {telemetryExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>

                {telemetryExpanded && (
                  <div className="space-y-4">
                    {/* 3 Context-Aware Execution Lanes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Lane 1: Context-Aware Payload or DOM Inspection */}
                      <div className="border border-white/[0.08] bg-black/40 backdrop-blur-[2px] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">
                            {phishingUrl ? "1. Headless DOM" : "1. QR Payload Inspection"}
                          </span>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            analysis.mismatchFound || tinyfishFetch.isPhishing ? "bg-[#ff2a8d]" : "bg-[#e5ff40]"
                          }`} />
                        </div>
                        {phishingUrl ? (
                          <>
                            <p className="text-xs text-white line-clamp-2">
                              {tinyfishFetch.detectedTraps[0] || tinyfishFetch.riskSummary}
                            </p>
                            <span className="font-mono text-[10px] text-neutral-500 block">
                              {tinyfishFetch.serverHost}
                            </span>
                          </>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-500 text-[10px]">Embedded Name (pn):</span>
                              <span className={`font-mono text-[10px] ${parsedName ? "text-[#e5ff40]" : "text-amber-400"}`}>
                                {parsedName ? "Present" : "Missing"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-500 text-[10px]">Merchant Code (mc):</span>
                              <span className={`font-mono text-[10px] ${parsedMc ? "text-[#e5ff40]" : "text-neutral-400"}`}>
                                {parsedMc ? parsedMc : "None (Retail)"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-500 text-[10px]">NPCI Signature:</span>
                              <span className={`font-mono text-[10px] ${parsedSign ? "text-[#e5ff40]" : "text-rose-400"}`}>
                                {parsedSign ? "Cryptographic" : "Unsigned"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lane 2: Scam Registry */}
                      <div className="border border-white/[0.08] bg-black/40 backdrop-blur-[2px] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">
                            2. Scam Registry
                          </span>
                          <span className={`h-1.5 w-1.5 rounded-full ${tinyfishSearch.complaintCount > 0 ? "bg-amber-400" : "bg-[#e5ff40]"}`} />
                        </div>
                        <p className="text-xs text-amber-300 font-medium">
                          {tinyfishSearch.complaintCount > 0 
                            ? `${tinyfishSearch.complaintCount} Complaints Reported` 
                            : "Clean Public Record"}
                        </p>
                        <span className="font-mono text-[10px] text-neutral-500 block">
                          Target: {parsedVpa || "VPA"} ({tinyfishSearch.lastReported})
                        </span>
                      </div>

                      {/* Lane 3: Identity & PSP Registry */}
                      <div className="border border-white/[0.08] bg-black/40 backdrop-blur-[2px] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">
                            3. Identity &amp; PSP Registry
                          </span>
                          <span className={`h-1.5 w-1.5 rounded-full ${analysis.mismatchFound ? "bg-[#ff2a8d]" : "bg-[#e5ff40]"}`} />
                        </div>
                        <p className={`text-xs font-medium ${analysis.mismatchFound ? "text-[#ff2a8d]" : "text-[#e5ff40]"}`}>
                          {analysis.mismatchFound ? "Unverified / Impostor" : "Verified Account"}
                        </p>
                        <span className="font-mono text-[10px] text-neutral-500 block truncate">
                          {analysis.pspInfo ? `${analysis.pspInfo.provider} (${analysis.pspInfo.bank})` : "UPI Gateway"}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Stream Output Terminal */}
                    <div className="border border-white/[0.06] bg-[#020202]/90 backdrop-blur-[2px] p-3 font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
                      {logs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-neutral-400">
                          <span className="text-neutral-600">[{log.timestamp}]</span>
                          <span className={`font-bold ${
                            log.channel === "CORE" ? "text-white" :
                            log.channel === "FETCH" ? "text-[#ff2a8d]" :
                            log.channel === "SEARCH" ? "text-amber-400" : "text-[#e5ff40]"
                          }`}>
                            {log.channel}:
                          </span>
                          <span className="text-neutral-300">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* ─── PRIVACY FOOTER STRIP ─── */}
        <footer className="relative z-10 w-full border-t border-white/[0.08] bg-black/60 py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[11px] tracking-wide text-neutral-500">
            <span className="text-[#e5ff40] font-bold">ZERO CREDENTIAL COLLECTION:</span>{" "}
            TriNETRA never requests or stores UPI PINs, OTPs, or banking passwords. All PII is pseudonymized into feature vectors.
          </p>
        </footer>
      </div>
    </KineticGrid>
  )
}
