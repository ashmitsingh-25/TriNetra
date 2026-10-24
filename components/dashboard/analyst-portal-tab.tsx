"use client"

import React, { useState, useEffect, useMemo } from "react"
import VerticalBarsNoise from "@/components/ui/vertical-bars"
import { supabase, InterceptDossier } from "@/lib/supabase"
import { 
  Shield, 
  Ban, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  Globe, 
  AlertTriangle, 
  MessageSquare, 
  CreditCard,
  ExternalLink,
  Check
} from "lucide-react"

// Default mock dossiers in case Supabase is empty or fetching
const DEFAULT_DOSSIERS: InterceptDossier[] = [
  {
    id: "TRN-8821",
    title: "Fake Mahadiscom Bill Disconnection SMS",
    category_tag: "UTILITY_IMPERSONATION",
    recipient_vpa: "billdesk.mahadiscom@axisbank",
    claimed_name: "Mahadiscom Electricity Board",
    raw_upi_uri: "upi://pay?pa=billdesk.mahadiscom@axisbank&pn=Mahadiscom+Urgent+Bills&am=11.00&cu=INR&tn=Electricity+Bill+Arrears",
    mcc_code: "4900 (Utilities)",
    account_age: "3 days old (Mule Account)",
    risk_score: 94,
    gov_impersonation_score: 0.96,
    urgency_score: 0.98,
    mule_swarm_score: 0.88,
    qr_mismatch_score: 0.92,
    linguistic_hook: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office. Call Officer Sharma at 98765-43210 immediately.",
    tinyfish_telemetry: {
      targetOrigin: "https://electricity-bill-update-kyc.in/portal/verify-sbi",
      hostProvider: "Offshore AS-Host (Seychelles)",
      exfilChannel: "Telegram Bot SSL Webhook",
      victimReach: "1,420 victims targeted",
      domFinding: "Page mimics Mahadiscom login and directly prompts for 6-digit UPI PIN and debit card CVV.",
      crawledAt: "Just now"
    },
    feature_vector: [0.94, 0.98, 0.96, 0.92],
    status: "PENDING",
    attempts_blocked: 312,
    latency_ms: 12,
    created_at: new Date().toISOString()
  },
  {
    id: "TRN-9042",
    title: "Counterfeit Retail Merchant QR Overlay",
    category_tag: "STICKER_SWAP",
    recipient_vpa: "rajesh.kumar771@okaxis",
    claimed_name: "Sharma General Store (UPI Verified Merchant)",
    raw_upi_uri: "upi://pay?pa=rajesh.kumar771@okaxis&pn=Sharma+General+Store&cu=INR",
    mcc_code: "0000 (Personal Account)",
    account_age: "11 days old",
    risk_score: 88,
    gov_impersonation_score: 0.12,
    urgency_score: 0.45,
    mule_swarm_score: 0.72,
    qr_mismatch_score: 0.95,
    linguistic_hook: "Merchant QR code sticker pasted over original counter display.",
    tinyfish_telemetry: {
      targetOrigin: "https://payment-gateway-instant.in/collect",
      hostProvider: "Cloudflare Free Tier",
      exfilChannel: "HTTP POST Endpoint",
      victimReach: "85 retail shoppers",
      domFinding: "Fake payment redirection gateway capturing UPI VPAs.",
      crawledAt: "2 hours ago"
    },
    feature_vector: [0.88, 0.45, 0.72, 0.95],
    status: "PENDING",
    attempts_blocked: 85,
    latency_ms: 16,
    created_at: new Date().toISOString()
  },
  {
    id: "TRN-7731",
    title: "Authorized SBI NetBanking Portal Transaction",
    category_tag: "BENIGN_MERCHANT",
    recipient_vpa: "sbipayments@sbi",
    claimed_name: "State Bank of India",
    raw_upi_uri: "upi://pay?pa=sbipayments@sbi&pn=State+Bank+of+India&cu=INR&mc=6011",
    mcc_code: "6011 (Financial Institutions)",
    account_age: "8 years (Verified Corporate VPA)",
    risk_score: 4,
    gov_impersonation_score: 0.0,
    urgency_score: 0.05,
    mule_swarm_score: 0.0,
    qr_mismatch_score: 0.0,
    linguistic_hook: "Legitimate utility payment gateway collection link.",
    tinyfish_telemetry: {
      targetOrigin: "https://retail.onlinesbi.sbi/retail/login.htm",
      hostProvider: "SBI Datacenter (Navi Mumbai)",
      exfilChannel: "None (Secure Banking Infrastructure)",
      victimReach: "Official Gateway",
      domFinding: "Official State Bank of India portal with valid EV SSL certificate.",
      crawledAt: "1 day ago"
    },
    feature_vector: [0.04, 0.05, 0.0, 0.0],
    status: "FALSE_POSITIVE",
    attempts_blocked: 0,
    latency_ms: 8,
    created_at: new Date().toISOString()
  }
]

export default function AnalystPortalTab() {
  const [dossiers, setDossiers] = useState<InterceptDossier[]>(DEFAULT_DOSSIERS)
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("TRN-8821")
  const [filterTab, setFilterTab] = useState<"PENDING" | "CONFIRMED" | "SAFE">("PENDING")
  
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success"
  })

  // 1. Fetch live dossiers from Supabase
  const loadDossiers = async () => {
    try {
      const { data, error } = await supabase
        .from("intercept_dossiers")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        setDossiers(data as InterceptDossier[])
      }
    } catch (err) {
      console.error("Supabase load error:", err)
    }
  }

  // 2. Realtime listener
  useEffect(() => {
    loadDossiers()

    const channel = supabase
      .channel("analyst-portal-dossiers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "intercept_dossiers" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setDossiers(prev => [payload.new as InterceptDossier, ...prev.filter(d => d.id !== payload.new.id)])
          } else if (payload.eventType === "UPDATE") {
            setDossiers(prev => prev.map(d => d.id === payload.new.id ? (payload.new as InterceptDossier) : d))
          } else if (payload.eventType === "DELETE") {
            setDossiers(prev => prev.filter(d => d.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Filtered dossiers based on selected filter tab
  const filteredDossiers = useMemo(() => {
    if (filterTab === "PENDING") {
      return dossiers.filter(d => d.status === "PENDING")
    }
    if (filterTab === "CONFIRMED") {
      return dossiers.filter(d => d.status === "CONFIRMED_SCAM" || d.status === "ESCALATED_1930")
    }
    return dossiers.filter(d => d.status === "FALSE_POSITIVE")
  }, [dossiers, filterTab])

  // Active focused dossier
  const activeDossier = useMemo(() => {
    const foundInFilter = filteredDossiers.find(d => d.id === selectedIncidentId)
    if (foundInFilter) return foundInFilter
    if (filteredDossiers.length > 0) return filteredDossiers[0]
    return dossiers.find(d => d.id === selectedIncidentId) || dossiers[0]
  }, [filteredDossiers, dossiers, selectedIncidentId])

  // Re-sync selected ID when activeDossier changes
  useEffect(() => {
    if (activeDossier && activeDossier.id !== selectedIncidentId) {
      setSelectedIncidentId(activeDossier.id)
    }
  }, [activeDossier, selectedIncidentId])

  // Download Cybercrime Report JSON
  const handleDownloadReport = (dossier: InterceptDossier) => {
    const reportData = {
      agency: "Ministry of Home Affairs (MHA) - Indian Cyber Crime Coordination Centre (I4C)",
      reportingHelpline: "1930 National Cyber Helpline (https://cybercrime.gov.in)",
      caseNumber: dossier.id,
      timestamp: new Date().toISOString(),
      classification: "Section 66D IT Act & Section 420 IPC (UPI Impersonation Cyber Fraud)",
      paymentEvidence: {
        claimedEntity: dossier.claimed_name,
        scammerUpiId: dossier.recipient_vpa,
        decodedUpiUri: dossier.raw_upi_uri,
        merchantCategoryCode: dossier.mcc_code,
        riskScore: `${dossier.risk_score} / 100`,
        victimMessageSnippet: dossier.linguistic_hook
      },
      websiteForensics: dossier.tinyfish_telemetry || {
        targetOrigin: "N/A",
        domFinding: "No website linked"
      },
      recommendedAction: `Blacklist UPI VPA '${dossier.recipient_vpa}' and freeze associated beneficiary bank account.`
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Cybercrime-Report-${dossier.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setNotification({
      show: true,
      message: `Cybercrime evidence report for #${dossier.id} downloaded successfully.`,
      type: "success"
    })
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000)
  }

  // Confirm Scam & Blacklist VPA action
  const handleConfirmScam = async () => {
    if (!activeDossier || isActionLoading) return
    setIsActionLoading(true)

    try {
      const res = await fetch("/api/analyst/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossierId: activeDossier.id,
          verdict: "CONFIRM_SCAM",
          analystName: "TriNETRA Fraud Analyst"
        })
      })

      const data = await res.json()
      if (data.success) {
        setDossiers(prev => prev.map(d => d.id === activeDossier.id ? { ...d, status: "CONFIRMED_SCAM" } : d))
        setNotification({
          show: true,
          message: `Confirmed scam: '${activeDossier.recipient_vpa}' has been added to the blacklist.`,
          type: "success"
        })
      } else {
        throw new Error(data.error || "Failed to update status")
      }
    } catch (err: any) {
      setNotification({
        show: true,
        message: err.message || "Could not confirm scam.",
        type: "error"
      })
    } finally {
      setIsActionLoading(false)
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000)
    }
  }

  // Mark as Safe (False Alarm) action
  const handleMarkSafe = async () => {
    if (!activeDossier || isActionLoading) return
    setIsActionLoading(true)

    try {
      const res = await fetch("/api/analyst/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossierId: activeDossier.id,
          verdict: "FALSE_POSITIVE",
          analystName: "TriNETRA Fraud Analyst"
        })
      })

      const data = await res.json()
      if (data.success) {
        setDossiers(prev => prev.map(d => d.id === activeDossier.id ? { ...d, status: "FALSE_POSITIVE" } : d))
        setNotification({
          show: true,
          message: `Case #${activeDossier.id} marked as Safe (False Alarm).`,
          type: "success"
        })
      } else {
        throw new Error(data.error || "Failed to mark safe")
      }
    } catch (err: any) {
      setNotification({
        show: true,
        message: err.message || "Could not mark as safe.",
        type: "error"
      })
    } finally {
      setIsActionLoading(false)
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000)
    }
  }

  // Re-Check Link with TinyFish
  const handleReCheckLink = async () => {
    if (!activeDossier || isCrawling) return
    setIsCrawling(true)

    try {
      const targetUrl = activeDossier.tinyfish_telemetry?.targetOrigin || "https://electricity-bill-update-kyc.in/portal/verify-sbi"
      const res = await fetch("/api/inspect-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl })
      })

      const data = await res.json()
      if (data.success) {
        const updatedTelemetry = {
          targetOrigin: targetUrl,
          hostProvider: "Offshore AS-Host",
          exfilChannel: data.extractedVpa ? `UPI Redirection (${data.extractedVpa})` : "Credential Harvesting",
          victimReach: "Active phishing target",
          domFinding: data.dangerousInputsDetected 
            ? `Page asks for ${data.inputSummary || "UPI PIN and OTP"}.` 
            : (data.summary || "Web link verified."),
          crawledAt: "Just now"
        }

        setDossiers(prev => prev.map(d => d.id === activeDossier.id ? { ...d, tinyfish_telemetry: updatedTelemetry } : d))
        setNotification({
          show: true,
          message: `TinyFish re-checked link: Form analyzed in real-time.`,
          type: "success"
        })
      }
    } catch (err: any) {
      setNotification({
        show: true,
        message: "Failed to re-check link.",
        type: "error"
      })
    } finally {
      setIsCrawling(false)
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000)
    }
  }

  return (
    <VerticalBarsNoise className="w-full">
      <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#ededed]">
        
        {/* Floating Notification */}
        {notification.show && (
          <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium border backdrop-blur-xl animate-in fade-in duration-200 ${
            notification.type === "success" 
              ? "bg-[#0a0a0c]/95 border-[#e5ff40] text-[#e5ff40]" 
              : "bg-[#0a0a0c]/95 border-red-500 text-red-400"
          }`}>
            <Check className="h-4 w-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* ─── HEADER: CLEAR TITLE & EXPLANATION ─── */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff2a8d] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#ff2a8d] font-bold">
              HUMAN-IN-THE-LOOP VERIFICATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Fraud Analyst <span className="text-[#ff2a8d] italic font-serif font-normal">Review Hub.</span>
          </h1>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
            <strong className="text-white">What this tab is used for:</strong> Whenever a user scans a suspicious QR code or website link, it is sent here for final human verification. Analysts review the payment details and either blacklist the scammer&apos;s UPI ID in our database or mark it as a safe false alarm.
          </div>
        </div>

        {/* ─── 2-COLUMN REVIEW WORKFLOW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN (4 COLS): FLAGGED PAYMENTS WAITING FOR REVIEW ── */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Flagged Payments Waiting for Review
              </h2>
              <span className="font-mono text-xs text-[#ff2a8d] font-bold">
                {dossiers.filter(d => d.status === "PENDING").length} Pending
              </span>
            </div>

            {/* Filter Tabs: Pending, Confirmed Scams, Safe */}
            <div className="flex rounded-xl bg-black/60 p-1 border border-white/10 gap-1 text-xs">
              <button
                onClick={() => setFilterTab("PENDING")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  filterTab === "PENDING"
                    ? "bg-[#ff2a8d] text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Pending ({dossiers.filter(d => d.status === "PENDING").length})
              </button>
              <button
                onClick={() => setFilterTab("CONFIRMED")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  filterTab === "CONFIRMED"
                    ? "bg-[#ff2a8d] text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Confirmed ({dossiers.filter(d => d.status === "CONFIRMED_SCAM" || d.status === "ESCALATED_1930").length})
              </button>
              <button
                onClick={() => setFilterTab("SAFE")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  filterTab === "SAFE"
                    ? "bg-[#e5ff40] text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Safe ({dossiers.filter(d => d.status === "FALSE_POSITIVE").length})
              </button>
            </div>

            {/* Cases List */}
            <div className="flex flex-col gap-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredDossiers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs border border-white/5 rounded-xl bg-black/40">
                  No cases in this folder.
                </div>
              ) : (
                filteredDossiers.map((inc) => {
                  const isSelected = activeDossier?.id === inc.id
                  const isHighRisk = inc.risk_score >= 80

                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "border-[#ff2a8d] bg-[#141418] shadow-lg shadow-[#ff2a8d]/10"
                          : "border-white/10 bg-black/60 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          {/* 1. Case Title */}
                          <span className="font-bold text-sm text-white line-clamp-1">
                            {inc.title}
                          </span>
                          
                          {/* 2. Scammer UPI ID */}
                          <span className="font-mono text-xs text-zinc-400 truncate mt-1">
                            UPI ID: <span className="text-[#ff2a8d] font-semibold">{inc.recipient_vpa}</span>
                          </span>
                        </div>

                        {/* 3. Risk Score */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`font-mono text-base font-extrabold ${
                            isHighRisk ? "text-red-400" : "text-[#e5ff40]"
                          }`}>
                            {inc.risk_score}/100
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">
                            Risk
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (8 COLS): SELECTED CASE EVIDENCE & DECISION ── */}
          {activeDossier ? (
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Top Case Identity Bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/60 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ff2a8d]/20 text-[#ff2a8d] flex items-center justify-center font-bold border border-[#ff2a8d]/30">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Case #{activeDossier.id} &bull; {activeDossier.title}
                    </h3>
                    <span className="font-mono text-xs text-zinc-400">
                      Status: <strong className={activeDossier.status === "FALSE_POSITIVE" ? "text-[#e5ff40]" : "text-[#ff2a8d]"}>{activeDossier.status}</strong>
                    </span>
                  </div>
                </div>

                <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                  activeDossier.risk_score >= 80 
                    ? "bg-red-500/20 text-red-400 border-red-500/30" 
                    : "bg-[#e5ff40]/20 text-[#e5ff40] border-[#e5ff40]/30"
                }`}>
                  Risk Score: {activeDossier.risk_score}/100
                </span>
              </div>

              {/* CARD 1: Payment & Message Details */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <CreditCard className="h-4 w-4 text-[#ff2a8d]" />
                  <h4 className="font-bold text-sm text-white">Payment &amp; Message Details</h4>
                </div>

                {/* Claimed Name vs Actual UPI ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Claimed Person or Entity</span>
                    <div className="font-bold text-sm text-white">
                      {activeDossier.claimed_name || "Unknown"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">Actual Destination UPI ID</span>
                    <div className="font-mono font-bold text-sm text-[#ff2a8d] select-all">
                      {activeDossier.recipient_vpa}
                    </div>
                  </div>
                </div>

                {/* Decoded UPI Payment Link */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">
                    Decoded UPI Payment Link
                  </span>
                  <div className="p-3 rounded-xl bg-black/90 border border-white/10 font-mono text-xs text-zinc-300 break-all select-all">
                    {activeDossier.raw_upi_uri}
                  </div>
                </div>

                {/* Exact Scam Message Text */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3 text-[#e5ff40]" />
                    <span>Exact Scam Message Text Sent to Victim</span>
                  </span>
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                    &ldquo;{activeDossier.linguistic_hook}&rdquo;
                  </div>
                </div>
              </div>

              {/* CARD 2: Website Check Result */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#e5ff40]" />
                    <h4 className="font-bold text-sm text-white">Website Check Result</h4>
                  </div>

                  <button
                    onClick={handleReCheckLink}
                    disabled={isCrawling}
                    className="font-mono text-xs text-[#e5ff40] hover:text-white px-3 py-1 rounded-full bg-[#e5ff40]/10 hover:bg-[#e5ff40]/20 border border-[#e5ff40]/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isCrawling ? "animate-spin" : ""}`} />
                    <span>{isCrawling ? "Checking..." : "Re-Check Link ↻"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 space-y-2">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase block">
                      Website URL Linked to Case
                    </span>
                    <a
                      href={activeDossier.tinyfish_telemetry?.targetOrigin || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#ff2a8d] hover:underline truncate block"
                    >
                      {activeDossier.tinyfish_telemetry?.targetOrigin || "No website link recorded"}
                    </a>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Host: {activeDossier.tinyfish_telemetry?.hostProvider || "Offshore Server"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 space-y-2">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase block">
                      What TinyFish Found on This Page
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {activeDossier.tinyfish_telemetry?.domFinding || "Form inspected: Credential harvesting trap detected."}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 3: Take Action */}
              <div className="p-5 rounded-2xl bg-[#111114] border border-white/10 space-y-3">
                <div className="pb-1">
                  <h4 className="font-bold text-sm text-white">Take Action</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Decide the outcome for this flagged payment. Changes are saved to Supabase immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Button 1: Confirm Scam & Blacklist UPI ID */}
                  <button
                    onClick={handleConfirmScam}
                    disabled={isActionLoading}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white hover:opacity-95 shadow-md shadow-[#ff2a8d]/20 transition-all text-left flex flex-col justify-between gap-2 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4" />
                      <span className="font-bold text-xs sm:text-sm">Confirm Scam &amp; Blacklist UPI ID</span>
                    </div>
                    <span className="text-[10px] text-zinc-200">
                      Adds UPI ID to blacklist table in Supabase
                    </span>
                  </button>

                  {/* Button 2: Mark as Safe (False Alarm) */}
                  <button
                    onClick={handleMarkSafe}
                    disabled={isActionLoading}
                    className="p-3.5 rounded-xl bg-black/70 hover:bg-white/[0.05] text-white border border-white/10 transition-all text-left flex flex-col justify-between gap-2 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#e5ff40]" />
                      <span className="font-bold text-xs sm:text-sm">Mark as Safe (False Alarm)</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Marks case as safe in Supabase
                    </span>
                  </button>

                  {/* Button 3: Download Cybercrime Report (.json) */}
                  <button
                    onClick={() => handleDownloadReport(activeDossier)}
                    className="p-3.5 rounded-xl bg-black/70 hover:bg-white/[0.05] text-[#e5ff40] border border-[#e5ff40]/30 hover:border-[#e5ff40] transition-all text-left flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span className="font-bold text-xs sm:text-sm text-white">Download Cybercrime Report (.json)</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Formatted evidence for 1930 Cybercrime portal
                    </span>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 p-12 text-center text-zinc-500 border border-white/10 rounded-2xl bg-black/40">
              Select a flagged payment from the left to view evidence and take action.
            </div>
          )}

        </div>

      </div>
    </VerticalBarsNoise>
  )
}
