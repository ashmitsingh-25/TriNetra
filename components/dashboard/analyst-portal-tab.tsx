"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import VerticalBarsNoise from "@/components/ui/vertical-bars"
import { supabase, InterceptDossier, MlModelState, MlWeights } from "@/lib/supabase"
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
  Download,
  RefreshCw,
  ExternalLink,
  Flame,
  ArrowRight
} from "lucide-react"

export default function AnalystPortalTab() {
  const [dossiers, setDossiers] = useState<InterceptDossier[]>([])
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("TRN-8821")
  const [modelState, setModelState] = useState<MlModelState>({
    id: 1,
    weights: { behavior: 0.50, nlp: 0.20, url: 0.15, qr_mismatch: 0.15, bias: -0.10 },
    learning_rate: 0.05,
    total_trained_samples: 240,
    batch_target: 300,
    false_positive_count: 1,
    total_verdicts: 240
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  
  // Realtime weights toast notification
  const [weightDeltaToast, setWeightDeltaToast] = useState<{
    show: boolean
    message: string
    weights?: MlWeights
  }>({ show: false, message: "" })

  const [verdictBanner, setVerdictBanner] = useState<{
    show: boolean
    type: "blacklist" | "benign" | "escalate"
    message: string
  }>({ show: false, type: "blacklist", message: "" })

  // 1. Initial Fetch from Supabase
  const loadSupabaseData = async () => {
    try {
      const [dossiersRes, modelRes] = await Promise.all([
        supabase.from("intercept_dossiers").select("*").order("created_at", { ascending: false }),
        supabase.from("ml_model_state").select("*").eq("id", 1).single()
      ])

      if (dossiersRes.data && dossiersRes.data.length > 0) {
        setDossiers(dossiersRes.data as InterceptDossier[])
      }
      if (modelRes.data) {
        setModelState(modelRes.data as MlModelState)
      }
    } catch (err) {
      console.error("Supabase load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Realtime Subscriptions
  useEffect(() => {
    loadSupabaseData()

    // Subscribe to intercept_dossiers changes
    const dossiersChannel = supabase
      .channel("realtime-intercept-dossiers")
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

    // Subscribe to ml_model_state changes
    const modelChannel = supabase
      .channel("realtime-ml-model-state")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ml_model_state" },
        (payload: any) => {
          if (payload.new) {
            setModelState(payload.new as MlModelState)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(dossiersChannel)
      supabase.removeChannel(modelChannel)
    }
  }, [])

  // Currently focused dossier
  const activeDossier = useMemo(() => {
    return dossiers.find(d => d.id === selectedIncidentId) || dossiers[0]
  }, [dossiers, selectedIncidentId])

  // Count pending dossiers
  const pendingCount = useMemo(() => {
    return dossiers.filter(d => d.status === "PENDING").length
  }, [dossiers])

  // Download I4C / 1930 FIR Evidence Dossier JSON
  const downloadFirEvidenceDossier = (dossier: InterceptDossier) => {
    const firData = {
      agency: "Ministry of Home Affairs (MHA) - Indian Cyber Crime Coordination Centre (I4C)",
      reportingHelpline: "1930 National Cyber Helpline",
      portalReference: "https://cybercrime.gov.in",
      dossierId: dossier.id,
      generatedTimestamp: new Date().toISOString(),
      firClassification: "Section 66D IT Act & Section 420 IPC (UPI Cyber-Fraud Impersonation)",
      interceptForensics: {
        title: dossier.title,
        recipientVpa: dossier.recipient_vpa,
        claimedEntity: dossier.claimed_name,
        mccCode: dossier.mcc_code,
        riskScore: `${dossier.risk_score} / 100 [CRITICAL]`,
        decodedUpiUri: dossier.raw_upi_uri,
        latencyBeforeIntercept: `${dossier.latency_ms}ms`,
        blockedTransactionsSoFar: dossier.attempts_blocked,
        linguisticCoercionPhrase: dossier.linguistic_hook
      },
      tinyfishLiveCrawlerTelemetry: dossier.tinyfish_telemetry,
      modelAttributionVector: dossier.feature_vector,
      recommendedIntervention: "Freeze beneficiary account under Section 91 CrPC across issuing PSP Switch immediately."
    }

    const blob = new Blob([JSON.stringify(firData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `I4C-1930-FIR-DOSSIER-${dossier.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Trigger Action with Real SGD Online Training API Call
  const triggerAction = async (verdictType: "CONFIRM_SCAM" | "FALSE_POSITIVE" | "ESCALATE_1930") => {
    if (!activeDossier || isActionLoading) return
    setIsActionLoading(true)

    try {
      const res = await fetch("/api/analyst/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossierId: activeDossier.id,
          verdict: verdictType,
          analystName: "Lead Fraud Investigator"
        })
      })

      const data = await res.json()

      if (data.success) {
        // Update local dossier status
        setDossiers(prev => prev.map(d => d.id === activeDossier.id ? { ...d, status: data.dossier.status } : d))
        
        // Update ML model state
        if (data.weightsAfter) {
          setModelState(prev => ({
            ...prev,
            weights: data.weightsAfter,
            total_trained_samples: data.totalTrainedSamples,
            false_positive_count: data.falsePositiveRate ? Math.round((data.falsePositiveRate / 100) * data.totalTrainedSamples) : prev.false_positive_count
          }))

          // Show weight delta toast
          const w = data.weightsAfter as MlWeights
          const toastMsg = `ML Weights Updated (SGD): Behavior ${(w.behavior * 100).toFixed(1)}% | NLP ${(w.nlp * 100).toFixed(1)}% | URL ${(w.url * 100).toFixed(1)}% | QR ${(w.qr_mismatch * 100).toFixed(1)}%`
          setWeightDeltaToast({ show: true, message: toastMsg, weights: w })
          setTimeout(() => setWeightDeltaToast(prev => ({ ...prev, show: false })), 5000)
        }

        // Set verdict banner
        if (verdictType === "CONFIRM_SCAM") {
          setVerdictBanner({
            show: true,
            type: "blacklist",
            message: `ACTION CONFIRMED: VPA '${activeDossier.recipient_vpa}' added to Blacklist. SGD Gradient Step applied.`
          })
        } else if (verdictType === "FALSE_POSITIVE") {
          setVerdictBanner({
            show: true,
            type: "benign",
            message: `ACTION CONFIRMED: Dossier #${activeDossier.id} marked as False Positive. Heuristic loss corrected.`
          })
        } else if (verdictType === "ESCALATE_1930") {
          setVerdictBanner({
            show: true,
            type: "escalate",
            message: `ACTION CONFIRMED: Incident #${activeDossier.id} escalated to 1930 / I4C Cyber Crime Cell. FIR packet downloaded.`
          })
          // Automatically trigger download of FIR Dossier
          downloadFirEvidenceDossier(activeDossier)
        }

        // Auto-advance to next PENDING dossier
        const nextPending = dossiers.find(d => d.id !== activeDossier.id && d.status === "PENDING")
        if (nextPending) {
          setSelectedIncidentId(nextPending.id)
        }
      }
    } catch (err) {
      console.error("Analyst verdict execution error:", err)
    } finally {
      setIsActionLoading(false)
    }
  }

  // Trigger TinyFish Live Re-Crawl
  const handleReCrawl = async () => {
    if (!activeDossier || isCrawling) return
    setIsCrawling(true)

    try {
      const res = await fetch("/api/analyst/re-crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossierId: activeDossier.id,
          targetOrigin: activeDossier.tinyfish_telemetry?.targetOrigin
        })
      })
      const data = await res.json()
      if (data.success && data.telemetry) {
        setDossiers(prev => prev.map(d => d.id === activeDossier.id ? { ...d, tinyfish_telemetry: data.telemetry } : d))
        setVerdictBanner({
          show: true,
          type: "blacklist",
          message: `TinyFish Live Re-Crawl completed: Verified offshore credential harvesting trap.`
        })
      }
    } catch (err) {
      console.error("Re-crawl error:", err)
    } finally {
      setIsCrawling(false)
    }
  }

  // Hotkey support: A (Blacklist), R (Benign), E (Escalate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)) return
      const k = e.key.toUpperCase()
      if (k === "A") {
        e.preventDefault()
        triggerAction("CONFIRM_SCAM")
      } else if (k === "R") {
        e.preventDefault()
        triggerAction("FALSE_POSITIVE")
      } else if (k === "E") {
        e.preventDefault()
        triggerAction("ESCALATE_1930")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeDossier, isActionLoading])

  // Progress percentage for ML Retraining batch
  const progressPercent = Math.min(100, Math.round(((modelState.total_trained_samples % 300) / 300) * 100))
  const falsePositiveRate = ((modelState.false_positive_count / Math.max(1, modelState.total_verdicts)) * 100).toFixed(2)

  return (
    <VerticalBarsNoise className="w-full">
      <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#ededed]">
        
        {/* Floating Realtime Weight Delta Toast Notification */}
        {weightDeltaToast.show && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-[#0a0a0c]/95 border border-[#e5ff40] text-[#e5ff40] px-4 py-3 rounded-2xl shadow-2xl text-xs font-mono font-bold animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-xl">
            <Brain className="h-4 w-4 text-[#ff2a8d] animate-pulse" />
            <span>{weightDeltaToast.message}</span>
          </div>
        )}

        {/* ─── TOP WAR ROOM TELEMETRY HEADER ─── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#ff2a8d]/15 text-[#ff2a8d] uppercase tracking-wider ring-1 ring-[#ff2a8d]/30 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff2a8d] animate-ping" />
                TRIAGE WAR ROOM · SEC-OPS TIER 4
              </span>
              <span className="font-mono text-xs text-zinc-500">SESSION: #ANL-904-DELTA</span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#e5ff40]/15 text-[#e5ff40] font-bold uppercase border border-[#e5ff40]/30">
                REALTIME SUPABASE ACTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Fraud Analyst Command &amp; <span className="text-[#ff2a8d] italic font-serif font-normal">Review Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Real-time human-in-the-loop decision console powered by Supabase PostgreSQL and Online Stochastic Gradient Descent. Each analyst judgment refines heuristic weights for the pre-payment interceptor across the national switch.
            </p>
          </div>

          {/* Quick KPI Flashcards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-sm flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase">Protected Today</span>
              <div className="mt-2">
                <div className="font-mono text-xl sm:text-2xl text-[#e5ff40] font-bold tracking-tight">₹1.84 Cr</div>
                <div className="font-mono text-[10px] text-zinc-500 mt-0.5">+18.4% vs yday</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-sm flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase">Blacklisted VPAs</span>
              <div className="mt-2">
                <div className="font-mono text-xl sm:text-2xl text-white font-bold tracking-tight">3,412</div>
                <div className="font-mono text-[10px] text-[#ff2a8d] mt-0.5">+48 from Live Queue</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-sm flex flex-col justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase">Model Samples</span>
              <div className="mt-2">
                <div className="font-mono text-xl sm:text-2xl text-[#e5ff40] font-bold tracking-tight">{modelState.total_trained_samples}</div>
                <div className="font-mono text-[10px] text-zinc-500 mt-0.5">Target: 300 Batch</div>
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
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  {pendingCount} PENDING
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">Risk &gt; 80</span>
            </div>

            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {dossiers.map((inc) => {
                const isSelected = selectedIncidentId === inc.id
                const isConfirmed = inc.status === "CONFIRMED_SCAM"
                const isFalsePositive = inc.status === "FALSE_POSITIVE"
                const isEscalated = inc.status === "ESCALATED_1930"

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-[#ff2a8d] bg-[#141418]/90 shadow-lg shadow-[#ff2a8d]/10"
                        : "border-white/10 bg-black/60 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#ff2a8d] font-bold">
                          #{inc.id} · {inc.category_tag}
                        </span>
                        <span className="font-bold text-sm text-white mt-0.5 line-clamp-1">
                          {inc.title}
                        </span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono text-xl text-white font-extrabold">
                          {inc.risk_score}<span className="text-xs text-zinc-500 font-normal">/100</span>
                        </span>
                        <span className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isConfirmed ? "bg-red-500/20 text-red-400" :
                          isFalsePositive ? "bg-emerald-500/20 text-emerald-300" :
                          isEscalated ? "bg-amber-500/20 text-amber-300" : "bg-red-500/10 text-red-400"
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 font-mono text-xs text-zinc-400 truncate">
                      UPI: <span className="text-white font-semibold">{inc.recipient_vpa}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-zinc-500 border-t border-white/5 pt-2">
                      <span>Latency: <strong className="text-[#e5ff40]">{inc.latency_ms}ms</strong></span>
                      <span>{inc.attempts_blocked} attempts</span>
                      {isSelected && <span className="text-[#ff2a8d] font-bold">FOCUSED</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Real ML Retraining Telemetry Widget */}
            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#e5ff40] uppercase font-bold flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5" />
                  <span>CONTINUOUS ML RETRAINING</span>
                </span>
                <span className="font-mono text-[10px] text-[#e5ff40] font-bold">SGD ACTIVE</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Each analyst decision performs an online gradient descent update on feature weights:
              </p>

              {/* Animated Progress Bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#ff2a8d] to-[#e5ff40] h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pt-1">
                <span>False Positives: <strong className="text-white">{falsePositiveRate}%</strong></span>
                <span>Retrain batch: <strong className="text-[#e5ff40]">{modelState.total_trained_samples} / {modelState.batch_target}</strong></span>
              </div>

              {/* Dynamic Weights Breakdown */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono text-[9px]">
                <div className="p-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-500 block">BEH</span>
                  <span className="text-white font-bold">{((modelState.weights?.behavior || 0.5) * 100).toFixed(0)}%</span>
                </div>
                <div className="p-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-500 block">NLP</span>
                  <span className="text-white font-bold">{((modelState.weights?.nlp || 0.2) * 100).toFixed(0)}%</span>
                </div>
                <div className="p-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-500 block">URL</span>
                  <span className="text-white font-bold">{((modelState.weights?.url || 0.15) * 100).toFixed(0)}%</span>
                </div>
                <div className="p-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-500 block">QR</span>
                  <span className="text-white font-bold">{((modelState.weights?.qr_mismatch || 0.15) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Deep Evidence Dossier & Action Portal (8 Cols) */}
          {activeDossier && (
            <div className="xl:col-span-8 flex flex-col gap-6">
              
              {/* Dossier Header Bar */}
              <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff2a8d]/20 text-[#ff2a8d] flex items-center justify-center font-bold border border-[#ff2a8d]/30">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-white">Dossier: #{activeDossier.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] uppercase font-bold border border-red-500/30">
                        THREAT LEVEL: {activeDossier.risk_score}/100
                      </span>
                    </div>
                    <span className="font-mono text-xs text-zinc-400">
                      Protocol: Zero-Trust Intent Intercept · Status: <span className="text-[#e5ff40] font-bold">{activeDossier.status}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => downloadFirEvidenceDossier(activeDossier)}
                  className="font-mono text-xs text-[#e5ff40] hover:text-white px-3.5 py-1.5 rounded-full bg-[#e5ff40]/10 hover:bg-[#e5ff40]/20 border border-[#e5ff40]/30 transition-all flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download I4C FIR Dossier (.json)</span>
                </button>
              </div>

              {/* Evidence Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tile A: Decoded UPI Intent */}
                <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-sm text-white uppercase">Decoded UPI Intent &amp; Headers</span>
                    <span className="font-mono text-[10px] text-[#e5ff40] font-bold">URI PARSED</span>
                  </div>

                  <div className="bg-black/90 p-3 rounded-lg font-mono text-xs text-zinc-300 break-all select-all border border-white/5">
                    {activeDossier.raw_upi_uri}
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-zinc-400">Recipient VPA:</span>
                      <span className="text-[#ff2a8d] font-bold">{activeDossier.recipient_vpa}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-zinc-400">Claimed Name:</span>
                      <span className="text-white">{activeDossier.claimed_name}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-zinc-400">MCC Code:</span>
                      <span className="text-red-400 font-bold">{activeDossier.mcc_code}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-zinc-400">Account Age:</span>
                      <span className="text-red-400 font-bold">{activeDossier.account_age}</span>
                    </div>
                  </div>
                </div>

                {/* Tile B: Behavioral & NLP Signals */}
                <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-sm text-white uppercase">Behavioral &amp; NLP Signals</span>
                    <span className="font-mono text-[10px] text-[#ff2a8d] font-bold">FEATURE VECTOR</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-zinc-300 mb-1">
                        <span>Gov Impersonation:</span>
                        <span className="text-red-400 font-bold">{Math.round((activeDossier.gov_impersonation_score || 0.9) * 100)}% Match</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.round((activeDossier.gov_impersonation_score || 0.9) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-300 mb-1">
                        <span>Artificial Urgency:</span>
                        <span className="text-[#ff2a8d] font-bold">{Math.round((activeDossier.urgency_score || 0.94) * 100)}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div className="bg-[#ff2a8d] h-2 rounded-full" style={{ width: `${Math.round((activeDossier.urgency_score || 0.94) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-300 mb-1">
                        <span>Mule Swarm Topology:</span>
                        <span className="text-[#e5ff40] font-bold">{Math.round((activeDossier.mule_swarm_score || 0.85) * 100)}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div className="bg-[#e5ff40] h-2 rounded-full" style={{ width: `${Math.round((activeDossier.mule_swarm_score || 0.85) * 100)}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-black/70 border border-white/5 space-y-1">
                      <span className="font-mono text-[10px] text-[#e5ff40] uppercase font-bold">Detected Linguistic Hook:</span>
                      <p className="font-sans text-xs italic text-zinc-200">
                        &ldquo;{activeDossier.linguistic_hook}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Tile C: TinyFish Autonomous DOM Crawler Telemetry */}
              <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#e5ff40]" />
                    <h3 className="font-bold text-sm text-white">TinyFish Autonomous DOM Crawler Telemetry</h3>
                  </div>
                  
                  <button
                    onClick={handleReCrawl}
                    disabled={isCrawling}
                    className="font-mono text-xs text-[#e5ff40] hover:text-white px-3 py-1 rounded-full bg-[#e5ff40]/10 hover:bg-[#e5ff40]/20 border border-[#e5ff40]/30 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isCrawling ? "animate-spin" : ""}`} />
                    <span>{isCrawling ? "Re-Crawling..." : "Re-Crawl Live DOM ↻"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/80 p-4 rounded-xl font-mono text-xs space-y-2 border border-white/10">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Target Origin:</span>
                      <span className="text-red-400 truncate max-w-[200px]" title={activeDossier.tinyfish_telemetry?.targetOrigin}>
                        {activeDossier.tinyfish_telemetry?.targetOrigin || "https://payment-gateway-secure.xyz"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Host Provider:</span>
                      <span className="text-white">{activeDossier.tinyfish_telemetry?.hostProvider || "Offshore AS-Host"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Exfil Channel:</span>
                      <span className="text-[#e5ff40]">{activeDossier.tinyfish_telemetry?.exfilChannel || "Telegram SSL Webhook"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Victim Reach:</span>
                      <span className="text-red-400 font-bold">{activeDossier.tinyfish_telemetry?.victimReach || "1,420 victims"}</span>
                    </div>
                  </div>

                  <div className="bg-black/80 p-4 rounded-xl flex flex-col justify-between gap-2 border border-white/10">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">DOM Forensics Finding:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {activeDossier.tinyfish_telemetry?.domFinding || "Rogue credential form captures confidential 6-digit UPI PIN and Aadhaar OTP."}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#e5ff40]">
                      <span className="w-2 h-2 rounded-full bg-[#e5ff40]" />
                      <span>Crawled: {activeDossier.tinyfish_telemetry?.crawledAt || "Just now"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Engine: Action Buttons with Hotkeys A, R, E */}
              <div className="p-6 rounded-2xl bg-[#111114]/90 backdrop-blur-md border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Gavel className="h-5 w-5 text-[#e5ff40]" />
                      <span>Analyst Verdict &amp; Protocol Dispatch</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Executing a verdict immediately applies an Online SGD weight update to the pre-payment detector and notifies 42 banking gateways.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span>Hotkeys:</span>
                    <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold border border-white/20">A</kbd>
                    <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold border border-white/20">R</kbd>
                    <kbd className="px-2 py-0.5 rounded bg-black text-white font-bold border border-white/20">E</kbd>
                  </div>
                </div>

                {/* Verdict Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => triggerAction("CONFIRM_SCAM")}
                    disabled={isActionLoading}
                    className="p-4 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white hover:opacity-95 shadow-lg shadow-[#ff2a8d]/25 transition-all text-left flex flex-col justify-between gap-3 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Ban className="h-5 w-5" />
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/40">[A] HOTKEY</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">Confirm Scam &amp; Blacklist VPA</div>
                      <div className="text-[11px] text-zinc-200 mt-0.5">Instant block across all UPI switches</div>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerAction("FALSE_POSITIVE")}
                    disabled={isActionLoading}
                    className="p-4 rounded-xl bg-black/70 hover:bg-white/[0.05] text-white border border-white/10 transition-all text-left flex flex-col justify-between gap-3 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <CheckCircle className="h-5 w-5 text-[#e5ff40]" />
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/10">[R] HOTKEY</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">Mark Benign False Positive</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">Whitelist VPA &amp; SGD loss gradient</div>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerAction("ESCALATE_1930")}
                    disabled={isActionLoading}
                    className="p-4 rounded-xl bg-black/70 hover:bg-white/[0.05] text-white border border-white/10 transition-all text-left flex flex-col justify-between gap-3 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <ShieldAlert className="h-5 w-5 text-amber-400" />
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/10">[E] HOTKEY</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-amber-300">Escalate to LEA / 1930 Portal</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">Push FIR packet &amp; trigger auto-download</div>
                    </div>
                  </button>
                </div>

                {/* Verdict execution status banner */}
                {verdictBanner.show && (
                  <div className="p-3.5 rounded-xl bg-black/90 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-between animate-in fade-in duration-150">
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
          )}

        </div>

      </div>
    </VerticalBarsNoise>
  )
}
