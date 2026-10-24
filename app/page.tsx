"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import SculptureHero from "@/components/ui/liquid-sculpture-hero"
import StorytellingSection from "@/components/ui/storytelling-section"
import { 
  User, 
  LogOut, 
  KeyRound,
  ShieldCheck,
  Compass
} from "lucide-react"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ phone: string; email?: string } | null>(null)

  useEffect(() => {
    // Check stored user session from Supabase
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("trinetra_user")
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored))
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("trinetra_user")
    }
    setCurrentUser(null)
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#ededed]">
      {/* 
        FLORIA Liquid Particle Hero (Preserved with Jet Black, Hot Pink & Chartreuse aesthetic)
        Note: The 3D model has been removed from the front hero as requested.
      */}
      <SculptureHero
        src="/assets/trinetra-logo.png"
        darkSrc="/assets/trinetra-logo.png"
        background="#050505"
        darkBackground="#050505"
        textColor="#e5ff40"
        accentColor="#ff2a8d"
        particleColor="#ff2a8d"
        backdropText="त्रिNETRA"
        brand="त्रिNETRA"
        eyebrow="AI-POWERED UPI FRAUD PREVENTION & SCAM INTELLIGENCE"
        headline={"Stop UPI scams before payment.\nDetect scam waves before they spread."}
        headlineAccent="before they spread."
        body="Real-time UPI recipient forensic verification, QR payload decoding, and autonomous TinyFish web agents scanning the live internet for emerging phishing campaigns."
        primaryCta={{ label: "Enter Exhibition", href: "#story" }}
        secondaryCta={{ label: "Sign In / Register", href: "/auth" }}
        interactive={true}
        strength={1.3}
        radius={240}
        speed={1.2}
        liquid={1.4}
        turbulence={1.3}
        customNavRight={
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-[#e5ff40]/40 bg-[#e5ff40]/10 px-3.5 py-1.5 text-xs font-bold text-[#e5ff40]">
                  <User className="h-3.5 w-3.5" />
                  <span>{currentUser.phone}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/25 transition-all hover:scale-105 hover:opacity-95"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Sign In / Sign Up</span>
              </Link>
            )}
          </div>
        }
      />

      {/* 
        Cinematic Scroll-Driven Storytelling Section directly following the Hero.
        Pure black background (#000000) with 9:16 portrait image scaling to fullscreen
        and asymmetric editorial text elements exiting with staggered fades/slides.
      */}
      <StorytellingSection id="story" />

      {/* Minimalist Editorial Exhibition Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-12 text-center text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-bold tracking-widest text-[#d4af37]">त्रिNETRA</span>
            <span>•</span>
            <span>AI-Powered UPI Fraud Prevention &amp; Scam Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-zinc-500">
            <Link href="/auth" className="hover:text-white transition-colors">
              Sentinel Portal
            </Link>
            <a href="#story" className="hover:text-white transition-colors">
              Storytelling View
            </a>
            <span>Powered by Supabase &amp; Spline 3D</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
