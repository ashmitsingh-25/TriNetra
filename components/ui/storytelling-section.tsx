"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Eye, Shield, Sparkles, Terminal, Activity, ArrowDown } from "lucide-react"

interface StorytellingSectionProps {
  id?: string
}

export default function StorytellingSection({ id = "story" }: StorytellingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [viewport, setViewport] = useState({ width: 1440, height: 900 })

  // Update viewport size
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

      // Progress is 0 when top of section meets top of viewport, 1 when bottom meets bottom
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

  // Smooth easing curve for the image scale
  // Eased progress grows smoothly and then accelerates slightly towards full-bleed
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Initial portrait 9:16 container dimensions based on viewport
  const baseWidth = Math.min(Math.max(viewport.width * 0.22, 260), 380)
  const baseHeight = (baseWidth * 16) / 9

  // Calculate target scale needed to fill 100vw x 100vh viewport
  const scaleX = viewport.width / baseWidth
  const scaleY = viewport.height / baseHeight
  const targetScale = Math.max(scaleX, scaleY) * 1.05

  // Interpolate scale from 1.0 to targetScale
  const scaleProgress = easeInOutCubic(progress)
  const currentScale = 1 + scaleProgress * (targetScale - 1)

  // Border radius goes from 20px to 0px
  const borderRadius = Math.max(20 * (1 - progress * 1.8), 0)

  // Shadow & rim glow opacity fades as it expands
  const glowOpacity = Math.max(1 - progress * 1.5, 0)

  // Helper for staggered text exits
  // start: progress threshold to start fading
  // end: progress threshold where opacity reaches 0
  const getExitStyles = (
    start: number,
    end: number,
    deltaX: number,
    deltaY: number,
    baseRotate: number,
    extraRotate: number
  ) => {
    if (progress <= start) {
      return {
        opacity: 1,
        transform: `translate3d(0px, 0px, 0px) rotate(${baseRotate}deg) scale(1)`,
        filter: "blur(0px)",
        pointerEvents: "auto" as const,
      }
    }
    if (progress >= end) {
      return {
        opacity: 0,
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0px) rotate(${baseRotate + extraRotate}deg) scale(0.92)`,
        filter: "blur(8px)",
        pointerEvents: "none" as const,
      }
    }
    const t = (progress - start) / (end - start)
    const easedT = t * t // ease-in exit
    const opacity = 1 - easedT
    const x = deltaX * easedT
    const y = deltaY * easedT
    const rot = baseRotate + extraRotate * easedT
    const blur = easedT * 8
    const scale = 1 - easedT * 0.08

    return {
      opacity,
      transform: `translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg) scale(${scale})`,
      filter: `blur(${blur}px)`,
      pointerEvents: opacity < 0.1 ? ("none" as const) : ("auto" as const),
    }
  }

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full bg-[#000000] text-white"
      style={{ height: "350vh" }}
    >
      {/* Sticky Fullscreen Exhibition Viewport */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000] select-none">
        
        {/* Subtle Ambient Cosmic Grid (Fades out quickly) */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: Math.max(0.4 - progress * 0.8, 0),
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
                              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 80px 80px, 80px 80px",
          }}
        />

        {/* ─── ASYMMETRIC EDITORIAL TEXT ELEMENTS ("ORGANIZED CHAOS") ─── */}

        {/* 1. TOP-LEFT: Technical Tactical Pill */}
        <div
          className="absolute left-6 top-16 z-20 max-w-[280px] sm:left-12 sm:top-20 md:left-20 md:top-24"
          style={getExitStyles(0.04, 0.32, -80, -40, -6, -4)}
        >
          <div className="rounded-xl border border-[#e5ff40]/30 bg-black/70 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#e5ff40]">
              <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-ping" />
              <span>01 // THIRD EYE OF SENTINEL</span>
            </div>
            <h4 className="mt-2 text-sm font-black uppercase tracking-tight text-white">
              VPA Intent Intercept Matrix
            </h4>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Synchronous pre-payment heuristics verify destination authority before biometric PIN confirmation.
            </p>
          </div>
        </div>

        {/* 2. TOP-RIGHT: Editorial High-Fashion Typography */}
        <div
          className="absolute right-6 top-14 z-20 max-w-[320px] text-right sm:right-12 sm:top-20 md:right-24 md:top-24"
          style={getExitStyles(0.08, 0.36, 90, -50, 4, 3)}
        >
          <span className="inline-block rounded-full bg-[#ff2a8d]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ff2a8d] ring-1 ring-[#ff2a8d]/40">
            DISCOVERY MOMENT
          </span>
          <h2 className="mt-2 font-serif text-2xl font-light italic text-white sm:text-3xl md:text-4xl">
            Forensic Vision
          </h2>
          <div className="mt-1 flex items-center justify-end gap-2 text-[11px] font-mono text-zinc-400">
            <span>ZERO PIN CAPTURE GUARANTEE</span>
            <span className="h-1 w-1 rounded-full bg-[#ff2a8d]" />
            <span className="text-[#ff2a8d]">v2.4</span>
          </div>
        </div>

        {/* 3. MID-LEFT: Sanskrit Philosophical Narrative */}
        <div
          className="absolute left-4 top-1/2 z-20 max-w-[320px] -translate-y-1/2 sm:left-10 md:left-16"
          style={getExitStyles(0.12, 0.44, -110, 0, -3, -5)}
        >
          <div className="relative pl-5 before:absolute before:left-0 before:top-1 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#d4af37] before:to-transparent">
            <span className="font-mono text-[10px] tracking-widest text-[#d4af37] uppercase">
              // COSMIC ALIGNMENT
            </span>
            <p className="mt-1.5 font-serif text-sm italic leading-relaxed text-zinc-200 sm:text-base">
              &ldquo;In Vedic tradition, TriNetra is Shiva&apos;s piercing third eye that annihilates illusion. In digital UPI, it exposes the deceitful redirect before the money vanishes.&rdquo;
            </p>
            <span className="mt-2 block font-mono text-[10px] text-zinc-500">
              § 049 // RAKSHAM GENESIS
            </span>
          </div>
        </div>

        {/* 4. MID-RIGHT: High-Contrast Monolithic Metric Card */}
        <div
          className="absolute right-4 top-1/2 z-20 max-w-[260px] -translate-y-1/2 sm:right-10 md:right-20"
          style={getExitStyles(0.16, 0.48, 120, 20, -4, 4)}
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl">
                99.8<span className="text-[#e5ff40]">%</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-300">
              Scam Clusters Neutralized
            </p>
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-[10px] font-mono text-zinc-400">
              <Activity className="h-3.5 w-3.5 text-[#e5ff40]" />
              <span>LATENCY &lt; 140MS REALTIME</span>
            </div>
          </div>
        </div>

        {/* 5. FAR TOP CENTER: Micro-Ticker Coordinates */}
        <div
          className="absolute top-8 z-20 hidden items-center gap-3 sm:flex"
          style={getExitStyles(0.02, 0.25, 0, -30, 0, 0)}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-[10px] font-mono tracking-widest text-zinc-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span>TINYFISH LIVE AGENT DEPLOYED • DOM SYNTHESIS ACTIVE</span>
          </div>
        </div>

        {/* 6. BOTTOM-LEFT: TinyFish Terminal Badge */}
        <div
          className="absolute bottom-16 left-6 z-20 max-w-[300px] sm:bottom-20 sm:left-12 md:bottom-24 md:left-20"
          style={getExitStyles(0.2, 0.55, -90, 50, 5, -3)}
        >
          <div className="rounded-xl border border-[#ff2a8d]/30 bg-black/80 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#ff2a8d]">
              <Terminal className="h-3 w-3" />
              <span>CRAWL RUNTIME 0x7A9</span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-zinc-300">
              &gt; TinyFish Autonomous Fetch: Mimicking human session to expose hidden QR destination endpoints.
            </p>
          </div>
        </div>

        {/* 7. BOTTOM-RIGHT: Sanskrit Seal & Sacred Emblem */}
        <div
          className="absolute bottom-16 right-6 z-20 max-w-[280px] text-right sm:bottom-20 sm:right-12 md:bottom-24 md:right-24"
          style={getExitStyles(0.24, 0.6, 90, 60, -3, 5)}
        >
          <div className="inline-block rounded-2xl border border-[#d4af37]/40 bg-black/75 p-4 shadow-xl backdrop-blur-md">
            <div className="text-lg font-bold tracking-widest text-[#d4af37]">
              त्रि • सत्यम् • रक्षणम्
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              TRUTH // VISION // PRESERVATION
            </div>
            <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
              <Shield className="h-3 w-3 text-[#d4af37]" />
              <span>National UPI Defense Grid</span>
            </div>
          </div>
        </div>

        {/* 8. BOTTOM CENTER: Editorial Scroll Indicator (Fades out earliest) */}
        <div
          className="absolute bottom-8 z-20 flex flex-col items-center gap-2"
          style={getExitStyles(0, 0.18, 0, 40, 0, 0)}
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
            Scroll to Expand TriNETRA
          </span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-bounce" />
          </div>
        </div>

        {/* ─── CENTER IMAGE CONTAINER (VERTICAL 9:16 PORTRAIT SCALING TO FULL SCREEN) ─── */}
        <div
          className="relative z-10 flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `scale(${currentScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Ambient Rim Light / Golden Halo behind the image */}
          <div
            className="pointer-events-none absolute inset-[-30px] rounded-3xl transition-opacity duration-300"
            style={{
              opacity: glowOpacity,
              background: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.45) 0%, rgba(255, 42, 141, 0.25) 40%, transparent 75%)",
              filter: "blur(35px)",
            }}
          />

          {/* 9:16 Portrait Canvas Frame */}
          <div
            className="relative overflow-hidden bg-black transition-all duration-75 ease-out"
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
              borderRadius: `${borderRadius}px`,
              boxShadow: glowOpacity > 0.05 
                ? `0 0 50px -10px rgba(212, 175, 55, ${0.4 * glowOpacity}), 0 25px 60px -15px rgba(0,0,0,0.9)` 
                : "none",
              border: glowOpacity > 0.05 
                ? `1px solid rgba(212, 175, 55, ${0.35 * glowOpacity})` 
                : "none",
            }}
          >
            {/* The Logo Image — Centered with its glowing third eye focal point */}
            <Image
              src="/assets/trinetra-logo.png"
              alt="त्रिNETRA Mystical Third Eye Sentinel"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover object-center"
            />

            {/* Subtle Vignette & Contrast Enhancer for cinematic depth */}
            <div 
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 transition-opacity duration-500"
              style={{ opacity: Math.max(0.6 - progress * 0.6, 0) }}
            />
          </div>
        </div>

        {/* ─── FULL IMMERSION COMPLETION OVERLAY (At progress >= 0.92) ─── */}
        {progress >= 0.92 && (
          <div 
            className="pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center justify-center text-center transition-opacity duration-700"
            style={{ opacity: Math.min((progress - 0.92) / 0.08, 1) }}
          >
            <div className="rounded-full border border-[#d4af37]/40 bg-black/60 px-6 py-2 backdrop-blur-xl">
              <p className="font-serif text-sm tracking-wider text-amber-200 sm:text-base">
                त्रिNETRA — The Digital Sentinel Awakened
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
