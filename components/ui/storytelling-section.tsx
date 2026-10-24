"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Globe, 
  Activity, 
  Terminal, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  KeyRound
} from "lucide-react"

interface StorytellingSectionProps {
  id?: string
  currentUser?: { phone: string; email?: string } | null
  onOpenPortal?: (tabKey?: string) => void
}

export default function StorytellingSection({ 
  id = "story", 
  currentUser, 
  onOpenPortal 
}: StorytellingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [viewport, setViewport] = useState({ width: 1440, height: 900 })

  // Track viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Smooth scroll progress tracking
  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollableDistance = rect.height - window.innerHeight
      if (scrollableDistance <= 0) return

      // Progress: 0 at top entrance, 1 at bottom of track
      const rawProgress = -rect.top / scrollableDistance
      const clamped = Math.min(Math.max(rawProgress, 0), 1)

      setProgress(clamped)
    }

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Smooth easing curve (easeInOutCubic)
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Initial eye logo dimensions
  const baseSize = Math.min(Math.max(viewport.width * 0.28, 240), 400)
  const targetScale = Math.max(viewport.width / (baseSize * 0.75), viewport.height / (baseSize * 0.75)) * 1.35
  const scrollEased = easeInOutCubic(progress)
  const currentScale = 1 + scrollEased * (targetScale - 1)

  // Background glow expansion and opacity as user scrolls
  const auraOpacity = 0.5 + scrollEased * 0.5
  const auraSpread = 1 + scrollEased * 2.2

  // Determine active architectural narrative stage based on scroll progress
  // Stage 0: 0.00 - 0.22 (Architecture Genesis)
  // Stage 1: 0.22 - 0.48 (Module A & B)
  // Stage 2: 0.48 - 0.74 (Module C: Transaction DNA)
  // Stage 3: 0.74 - 1.00 (Module D: War Room & Protocol)
  const stage = progress < 0.25 ? 0 : progress < 0.50 ? 1 : progress < 0.75 ? 2 : 3

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full bg-[#000000]"
      style={{ height: "400vh" }}
    >
      {/* Sticky Fullscreen Exhibition Viewport */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#000000] px-4 sm:px-6 lg:px-8 py-8 select-none">
        
        {/* ─── VOLUMETRIC BACKGROUND EFFECT (Expands on scroll) ─── */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, ${0.16 * auraOpacity}) 0%, rgba(255, 42, 141, ${0.10 * auraOpacity}) 45%, transparent 75%)`,
            transform: `scale(${auraSpread})`,
          }}
        />

        {/* Ambient Expanding Sacred Rings */}
        <div
          className="pointer-events-none absolute rounded-full border border-[#d4af37]/20 transition-transform duration-100 ease-out"
          style={{
            width: `${baseSize * 1.5}px`,
            height: `${baseSize * 1.5}px`,
            transform: `scale(${1 + scrollEased * 2.8})`,
            opacity: Math.max(0.6 - scrollEased * 0.5, 0.1),
            filter: "blur(1px)",
          }}
        />

        <div
          className="pointer-events-none absolute rounded-full border border-[#ff2a8d]/15 transition-transform duration-100 ease-out"
          style={{
            width: `${baseSize * 2.1}px`,
            height: `${baseSize * 2.1}px`,
            transform: `scale(${1 + scrollEased * 3.5})`,
            opacity: Math.max(0.4 - scrollEased * 0.4, 0.05),
            filter: "blur(2px)",
          }}
        />

        {/* ─── CENTER EYE LOGO CONTAINER (SEAMLESSLY MIXED INTO BACKGROUND) ─── */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform z-0"
          style={{
            transform: `scale(${currentScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Deep Golden/Copper Core Halo */}
          <div
            className="absolute inset-[-40px] rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, ${0.45 * auraOpacity}) 0%, rgba(255, 42, 141, ${0.25 * auraOpacity}) 40%, transparent 75%)`,
              filter: `blur(${30 + scrollEased * 25}px)`,
            }}
          />

          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              mixBlendMode: "screen",
              maskImage: "radial-gradient(ellipse 68% 58% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 74%)",
              WebkitMaskImage: "radial-gradient(ellipse 68% 58% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 74%)",
            }}
          >
            <div className="relative h-[135%] w-[135%] -translate-y-[6%]">
              <Image
                src="/assets/trinetra-logo.png"
                alt="त्रिNETRA Mystical Eye"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                className="object-contain object-center select-none"
              />
            </div>
          </div>
        </div>

        {/* ─── TOP SECTION TRACKER ─── */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#ff2a8d] animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff2a8d]">
              STORYTELLING MODE · ARCHITECTURE REVELATION
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>PILLAR 0{stage + 1} / 04</span>
            <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#e5ff40] to-[#ff2a8d] transition-all duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="text-[#e5ff40] font-bold">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* ─── STORYTELLING ARCHITECTURAL CARD STAGES ─── */}
        <div className="relative z-10 my-auto w-full max-w-4xl">
          
          {/* Stage 0: Architecture Overview */}
          {stage === 0 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5ff40]/30 bg-[#e5ff40]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#e5ff40] shadow-[0_0_15px_rgba(229,255,64,0.2)]">
                <Cpu className="h-3.5 w-3.5" />
                The Core Architectural Blueprint
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Autonomous Pre-Payment <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a8d] via-[#ff5ea7] to-[#e5ff40]">
                  Cyber Defense Grid
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                Traditional banking fraud checks only trigger <em className="text-[#ff2a8d] font-semibold not-italic">after</em> the money has already left the victim&apos;s account. त्रिNETRA operates at the zero-trust edge, intercepting the intent vector in under 140ms.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 font-mono text-xs">
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase">Detection SLA</p>
                  <p className="text-base sm:text-lg font-bold text-[#e5ff40]">&lt; 140 ms</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase">Recall Accuracy</p>
                  <p className="text-base sm:text-lg font-bold text-[#ff2a8d]">99.84%</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase">Active Honeypots</p>
                  <p className="text-base sm:text-lg font-bold text-cyan-400">18,409</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase">Privacy Guarantee</p>
                  <p className="text-base sm:text-lg font-bold text-emerald-400">SHA-256 PII</p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 1: Module A & B (Edge Forensics + TinyFish Sandbox) */}
          {stage === 1 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ff2a8d]/30 bg-[#ff2a8d]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#ff2a8d] shadow-[0_0_15px_rgba(255,42,141,0.2)]">
                <Globe className="h-3.5 w-3.5" />
                Pillars 01 &amp; 02 · Intent Forensics &amp; TinyFish Crawler
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Simulated Honeypots &amp; <br />
                <span className="text-[#e5ff40]">Headless DOM Deception Traps</span>
              </h2>

              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed">
                When a victim receives an urgent SMS (e.g. Mahavitaran electricity disconnection), TriNETRA dispatches autonomous TinyFish headless browser agents into suspected links. The crawler injects poison honey-credentials, sniffs Telegram bot exfiltration hooks, and blocks the scam before payments execute.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
                <div className="rounded-2xl border border-white/10 bg-[#121214]/90 p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#ff2a8d]">MODULE A</span>
                    <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] text-zinc-400">&lt;120ms Edge</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Pre-Payment Intent Intercept</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Decodes QR vouchers, checks VPA age against NPCI resolver, and evaluates transformer-based psychological coercion in SMS text.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#121214]/90 p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#e5ff40]">MODULE B</span>
                    <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] text-zinc-400">TinyFish Agent</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Autonomous Phishing Crawler</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Headless Chromium sandbox parses DOM forms, detects secret UPI PIN entry attempts on non-bank domains, and halts victim checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Module C (Transaction DNA & HDBSCAN Wave Radar) */}
          {stage === 2 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <Activity className="h-3.5 w-3.5" />
                Pillar 03 · Transaction DNA &amp; HDBSCAN Wave Radar
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                High-Dimensional Vector Space <br />
                <span className="text-[#ff2a8d]">Detects Scam Waves Before Spread</span>
              </h2>

              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed">
                By mapping transaction intervals, recipient burstiness, linguistic urgency vectors, and device fingerprints into 28-dimensional mathematical tensors, HDBSCAN clusters emergent criminal syndicates at reproductive rates up to $R_0 = 4.8$.
              </p>

              <div className="rounded-2xl border border-white/10 bg-[#121214]/90 p-5 max-w-2xl mx-auto shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-red-400 font-bold uppercase">LIVE CLUSTER ALERT</span>
                  <p className="font-bold text-sm text-white">Wave #104: Fake Mahavitaran Electricity</p>
                  <p className="text-zinc-400 text-[11px]">420 vectors/hr &bull; 0.94 Novelty Index</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/80 px-4 py-2 text-center shrink-0">
                  <span className="text-[10px] text-zinc-400">Inter-Bank Sync</span>
                  <p className="text-sm font-bold text-[#e5ff40]">42 PSP Switches</p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Module D (Fraud Analyst War Room & Hotkey Triage) */}
          {stage === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5ff40]/30 bg-[#e5ff40]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#e5ff40] shadow-[0_0_15px_rgba(229,255,64,0.2)]">
                <Terminal className="h-3.5 w-3.5" />
                Pillar 04 · Fraud Analyst Command &amp; Protocol Dispatch
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Human-in-the-Loop Triage Desk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5ff40] to-[#ff2a8d]">
                  Instant Multi-Switch Broadcast
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Bank fraud desks and cyber-cell officers review zero-day intercepts in real-time. Single-key hotkey execution (<kbd className="rounded bg-black px-1.5 py-0.5 text-white font-mono font-bold">A</kbd> Approve Block, <kbd className="rounded bg-black px-1.5 py-0.5 text-white font-mono font-bold">R</kbd> Retrain ML, <kbd className="rounded bg-black px-1.5 py-0.5 text-white font-mono font-bold">E</kbd> Escalate to 1930) permanently blacklists hostile VPAs nationwide.
              </p>

              {/* Portal Access Callout */}
              <div className="rounded-2xl border border-[#ff2a8d]/40 bg-gradient-to-r from-[#1c1b1d] to-[#121214] p-6 max-w-xl mx-auto shadow-[0_0_35px_rgba(255,42,141,0.25)] space-y-4">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#ff2a8d] uppercase">DEFENSE CONSOLE</span>
                    <h3 className="font-bold text-white text-base">Enter Live Sentinel Webpages</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {currentUser ? "ACTIVE SESSION" : "AUTHENTICATION REQUIRED"}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 text-left leading-relaxed">
                  {currentUser 
                    ? `Welcome back (${currentUser.phone}). You have full clearance to inspect live telemetry, crawl honeypots, and HDBSCAN scam waves.`
                    : "Access to the real-time Scanner, TinyFish Crawler, Transaction DNA, and Analyst War Room requires authorized phone authentication."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {currentUser ? (
                    <button
                      onClick={() => onOpenPortal?.("scanner")}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/30 hover:scale-102 transition-transform"
                    >
                      <span>Open Live Sentinel Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href="/auth"
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/30 hover:scale-102 transition-transform"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>Sign In / Sign Up to Unlock Webpages</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── BOTTOM PROMPT / HINT ─── */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-zinc-400">
          <span>Scroll down to navigate architectural pillars</span>
          <span className="text-[#e5ff40]">RBI / NPCI Digital Payment Compliance Compliant</span>
        </div>

      </div>
    </section>
  )
}
