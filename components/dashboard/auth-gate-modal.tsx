"use client"

import React from "react"
import Link from "next/link"
import { ShieldAlert, Lock, ArrowRight, X, KeyRound } from "lucide-react"

interface AuthGateModalProps {
  isOpen: boolean
  onClose: () => void
  targetTabName?: string
}

export default function AuthGateModal({ isOpen, onClose, targetTabName }: AuthGateModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-[#ff2a8d]/40 bg-[#111116] p-6 sm:p-8 shadow-[0_0_50px_rgba(255,42,141,0.25)] text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff2a8d]/15 text-[#ff2a8d] ring-1 ring-[#ff2a8d]/30 shadow-lg">
          <Lock className="h-8 w-8" />
        </div>

        {/* Heading */}
        <div className="mt-5">
          <span className="font-mono text-[10px] font-bold tracking-widest text-[#ff2a8d] uppercase">
            RESTRICTED INTELLIGENCE MODULE
          </span>
          <h3 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
            Authentication Required
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {targetTabName ? `The "${targetTabName}" module ` : "This section "} 
            contains real-time UPI scam telemetry, autonomous TinyFish DOM crawl honeypots, and HDBSCAN campaign vector clustering.
          </p>
        </div>

        {/* Details list */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/50 p-4 text-left font-mono text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff40]" />
            <span>Real-time NPCI Honeypots &amp; Threat Feeds</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d]" />
            <span>Autonomous Web Sandboxing &amp; Telegram Exfil</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
            <span>Zero-day Incident Triage &amp; VPA Revocation</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/auth"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff2a8d]/30 transition-all hover:scale-102 hover:opacity-95"
          >
            <KeyRound className="h-4 w-4" />
            <span>Sign In / Sign Up to Unlock</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            Stay on Public Overview
          </button>
        </div>
      </div>
    </div>
  )
}
