"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface StorytellingSectionProps {
  id?: string
}

export default function StorytellingSection({ id = "story" }: StorytellingSectionProps) {
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
  const baseSize = Math.min(Math.max(viewport.width * 0.32, 280), 460)

  // Max scale to expand the eye logo into a full immersive ambient background
  const targetScale = Math.max(viewport.width / (baseSize * 0.75), viewport.height / (baseSize * 0.75)) * 1.35

  const scrollEased = easeInOutCubic(progress)
  const currentScale = 1 + scrollEased * (targetScale - 1)

  // Background glow expansion and opacity as user scrolls
  const auraOpacity = 0.5 + scrollEased * 0.5
  const auraSpread = 1 + scrollEased * 2.2

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full bg-[#000000]"
      style={{ height: "300vh" }}
    >
      {/* Sticky Fullscreen Exhibition Viewport */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000] select-none">
        
        {/* ─── VOLUMETRIC BACKGROUND EFFECT (Expands on scroll) ─── */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, ${0.18 * auraOpacity}) 0%, rgba(255, 42, 141, ${0.08 * auraOpacity}) 45%, transparent 75%)`,
            transform: `scale(${auraSpread})`,
          }}
        />

        {/* Ambient Expanding Sacred Ring */}
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

        {/* Secondary Ethereal Pulse Ring */}
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
          className="relative z-10 flex items-center justify-center will-change-transform"
          style={{
            transform: `scale(${currentScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Deep Golden/Copper Core Halo */}
          <div
            className="pointer-events-none absolute inset-[-40px] rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, ${0.45 * auraOpacity}) 0%, rgba(255, 140, 0, ${0.2 * auraOpacity}) 40%, transparent 75%)`,
              filter: `blur(${30 + scrollEased * 25}px)`,
            }}
          />

          {/* 
            Eye Logo Frame:
            - No borders, no solid container boxes, seamlessly blending with pure black
            - Elliptical feathered mask isolates strictly the Eye emblem and its sacred rays,
              feathering out the bottom written text cleanly.
            - mix-blend-mode: screen ensures 100% seamless transparency into the black background.
          */}
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
                className="object-contain object-center select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Subtle Bottom Ambient Gradient Blend into next section */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent"
        />

      </div>
    </section>
  )
}
