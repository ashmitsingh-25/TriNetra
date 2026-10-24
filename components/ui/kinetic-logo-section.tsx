"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import KineticGrid from "@/components/ui/kinetic-grid";
import { ArrowRight, Sparkles, Shield, ScanLine, LayoutDashboard } from "lucide-react";

interface KineticLogoSectionProps {
  id?: string;
  currentUser?: { phone: string; email?: string } | null;
  onOpenScanner?: () => void;
}

export default function KineticLogoSection({
  id = "kinetic-grid",
  currentUser,
  onOpenScanner,
}: KineticLogoSectionProps) {
  return (
    <section id={id} className="relative w-full overflow-hidden bg-[#000000]">
      <KineticGrid globalColor="trinetra" className="min-h-screen flex items-center justify-center">
        
        {/* ─── BLENDED TRINETRA LOGO AMBIENT CORE ─── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          
          {/* Deep Sacred Aura Halos */}
          <div 
            className="absolute h-[500px] w-[500px] rounded-full blur-[90px] opacity-70"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.45) 0%, rgba(255, 42, 141, 0.25) 45%, transparent 75%)"
            }}
          />

          {/* Secondary Outer Ripple Halo */}
          <div 
            className="absolute h-[700px] w-[700px] rounded-full border border-[#ff2a8d]/10 animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div 
            className="absolute h-[900px] w-[900px] rounded-full border border-[#d4af37]/10"
          />

          {/* 
            TriNetra Mystical Eye Logo Blended into the Kinetic Canvas:
            - mixBlendMode: screen for complete seamless integration with black canvas
            - Feathered mask isolates the central emblem cleanly
          */}
          <div 
            className="relative flex items-center justify-center will-change-transform opacity-85"
            style={{
              width: "min(85vw, 480px)",
              height: "min(85vw, 480px)",
              mixBlendMode: "screen",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 75%)",
            }}
          >
            <div className="relative h-[130%] w-[130%] -translate-y-[4%]">
              <Image
                src="/assets/trinetra-logo.png"
                alt="त्रिNETRA Mystical Eye"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain object-center select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ─── INTERACTIVE KINETIC GRID CONTENT OVERLAY ─── */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
          
          {/* Subtle Cyber Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(255,42,141,0.2)]">
            <span className="h-2 w-2 rounded-full bg-[#ff2a8d] animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300">
              Interactive Sentinel Grid
            </span>
          </div>

          {/* Minimalist Display Headline */}
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Move your cursor. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a8d] via-[#ff6ba9] to-[#e5ff40]">
              Click anywhere to ripple.
            </span>
          </h2>

          {/* Balanced Subtext */}
          <p className="mt-5 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            A real-time mathematical kinetic grid that warps toward incoming threats and propagates defensive mitigation ripples across 42 UPI banking switches.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {currentUser ? (
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,42,141,0.4)] hover:scale-105 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Launch Scanner Console &rarr;</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenScanner}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,42,141,0.4)] hover:scale-105 transition-all"
                >
                  <ScanLine className="h-4 w-4" />
                  <span>Inspect Public Scanner</span>
                </button>
                <Link
                  href="/auth"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:border-[#ff2a8d] hover:bg-white/5 transition-all"
                >
                  <span>Sign In / Register</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Bottom Indicators */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 font-mono text-xs text-zinc-500 w-full max-w-2xl">
            <div>
              <span className="text-[10px] uppercase text-zinc-400">Grid Sensitivity</span>
              <p className="text-white font-bold text-sm">260px Radius</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-zinc-400">Threat SLA</span>
              <p className="text-[#e5ff40] font-bold text-sm">&lt; 140ms</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-zinc-400">Inter-Bank Bus</span>
              <p className="text-[#ff2a8d] font-bold text-sm">42 Switches</p>
            </div>
          </div>

        </div>

      </KineticGrid>
    </section>
  );
}
