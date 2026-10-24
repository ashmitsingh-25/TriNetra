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
        const rect = canvas.getBoundingClientRect()
        // Map window cursor into canvas client space
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

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-black ${className}`}
    >
      <Spline
        scene={sceneUrl}
        onLoad={(splineApp) => {
          splineRef.current = splineApp
          setIsLoaded(true)
        }}
      />
    </div>
  )
}
