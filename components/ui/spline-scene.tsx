"use client"

import React, { useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import Spline to prevent SSR window issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black/80">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
      <span className="mt-3 font-mono text-xs text-zinc-500">Loading Sentinel 3D Cortex...</span>
    </div>
  ),
})

interface SplineSceneProps {
  sceneUrl: string
  className?: string
}

export default function SplineScene({ sceneUrl, className = "" }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const splineRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Remove any unwanted UI overlays, "Get in touch" buttons, and "Built with Spline" watermarks
  useEffect(() => {
    const sanitizeSplineDOM = () => {
      if (!containerRef.current) return

      // Find any anchor tags or buttons inside the spline container
      const allElements = containerRef.current.querySelectorAll("a, button, div, span, p, img")
      allElements.forEach((el) => {
        const text = (el.textContent || "").trim().toLowerCase()
        const href = ((el as HTMLAnchorElement).href || "").toLowerCase()
        const id = (el.id || "").toLowerCase()
        const classNameStr = (el.className || "").toString().toLowerCase()

        if (
          text.includes("get in touch") ||
          text.includes("built with spline") ||
          href.includes("spline.design") ||
          id.includes("spline-watermark") ||
          classNameStr.includes("spline-watermark") ||
          classNameStr.includes("watermark")
        ) {
          const htmlEl = el as HTMLElement
          htmlEl.style.setProperty("display", "none", "important")
          htmlEl.style.setProperty("opacity", "0", "important")
          htmlEl.style.setProperty("visibility", "hidden", "important")
          htmlEl.style.setProperty("pointer-events", "none", "important")
        }
      })
    }

    sanitizeSplineDOM()
    const interval = setInterval(sanitizeSplineDOM, 250)
    return () => clearInterval(interval)
  }, [])

  // Global cursor follow forwarding:
  // When cursor moves anywhere on the window (even over the right-side login half),
  // forward synthetic mouse events to the Spline canvas so the 3D model tracks the cursor everywhere!
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const canvas = containerRef.current.querySelector("canvas")
      if (!canvas) return

      // Forward mouse event to canvas if target is outside container
      if (!containerRef.current.contains(e.target as Node)) {
        const syntheticEvent = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
        })
        canvas.dispatchEvent(syntheticEvent)
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove)
  }, [])

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp
    setIsLoaded(true)

    // Hide any 3D objects named "Get in touch" or buttons inside the 3D scene
    try {
      if (splineApp && typeof splineApp.getAllObjects === "function") {
        const objects = splineApp.getAllObjects()
        objects.forEach((obj: any) => {
          const name = (obj.name || "").toLowerCase()
          if (
            name.includes("touch") ||
            name.includes("get in") ||
            name.includes("button") ||
            name.includes("btn") ||
            name.includes("contact")
          ) {
            obj.visible = false
          }
        })
      }

      // Also try findObjectByName directly
      const candidateNames = ["Get in touch", "Button", "Get in Touch", "get in touch", "CTA", "cta"]
      candidateNames.forEach((n) => {
        try {
          const obj = splineApp.findObjectByName(n)
          if (obj) obj.visible = false
        } catch {
          // ignore
        }
      })
    } catch (e) {
      console.warn("Spline object sanitize error", e)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-black ${className}`}
    >
      <style jsx global>{`
        a[href*="spline.design"],
        #spline-watermark,
        .spline-watermark,
        [class*="spline-watermark"],
        [class*="watermark"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      <Spline
        scene={sceneUrl}
        onLoad={handleSplineLoad}
      />
    </div>
  )
}
