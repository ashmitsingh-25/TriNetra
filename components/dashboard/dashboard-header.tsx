"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  KeyRound, 
  Lock, 
  Terminal, 
  Activity, 
  Globe, 
  Cpu, 
  ScanLine,
  Sparkles
} from "lucide-react"

export type TabKey = "overview" | "scanner" | "tinyfish" | "transaction-dna" | "analyst-portal" | "architecture"

interface DashboardHeaderProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
  currentUser: { phone: string; email?: string } | null
  onSignOut: () => void
  onOpenAuthGate: (tab: TabKey) => void
}

export default function DashboardHeader({
  activeTab,
  onSelectTab,
  currentUser,
  onSignOut,
  onOpenAuthGate,
}: DashboardHeaderProps) {

  const tabs: { key: TabKey; label: string; icon: any; isProtected: boolean }[] = [
    { key: "overview", label: "Hero & Story", icon: Sparkles, isProtected: false },
    { key: "scanner", label: "Scanner", icon: ScanLine, isProtected: false },
    { key: "tinyfish", label: "TinyFish Intel", icon: Globe, isProtected: true },
    { key: "transaction-dna", label: "Transaction DNA", icon: Activity, isProtected: true },
    { key: "analyst-portal", label: "Analyst Portal", icon: Terminal, isProtected: true },
    { key: "architecture", label: "System Architecture", icon: Cpu, isProtected: false },
  ]

  const handleTabClick = (tab: { key: TabKey; isProtected: boolean }) => {
    if (tab.isProtected && !currentUser) {
      onOpenAuthGate(tab.key)
    } else {
      onSelectTab(tab.key)
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0e0e10]/90 backdrop-blur-xl shadow-[0_1px_15px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-black/60 p-1 ring-1 ring-white/15 transition-transform group-hover:scale-105">
              <Image
                src="/assets/trinetra-logo.png"
                alt="त्रिNETRA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg sm:text-xl">
                  त्रिNETRA
                </span>
                <span className="rounded-full bg-[#ff2a8d] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_10px_rgba(255,42,141,0.5)]">
                  UPI Sentinel
                </span>
              </div>
              <span className="hidden font-mono text-[10px] tracking-widest text-zinc-400 lg:inline">
                CYBER-FRAUD INTELLIGENCE GRID
              </span>
            </div>
          </Link>

          {/* Nav Tabs */}
          <nav className="hidden xl:flex items-center gap-1.5 rounded-xl bg-black/40 p-1 ring-1 ring-white/10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              const isLocked = tab.isProtected && !currentUser
              const Icon = tab.icon

              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#201f21] text-[#ffb1c7] shadow-inner ring-1 ring-white/10 font-bold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#ff2a8d]" : "text-zinc-400"}`} />
                  <span>{tab.label}</span>
                  {isLocked && (
                    <span title="Requires Authentication">
                      <Lock className="h-3 w-3 text-amber-400/80" />
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Defense Active Status Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1b1d] px-3.5 py-1.5 shadow-[0_0_12px_rgba(217,242,50,0.15)]">
            <span className="h-2 w-2 rounded-full bg-[#d6ef2f] animate-pulse" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#d6ef2f] uppercase">
              DEFENSE ACTIVE · 0ms
            </span>
          </div>

          {/* User Session Controller */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-[#e5ff40]/40 bg-[#e5ff40]/10 px-3.5 py-1.5 text-xs font-bold text-[#e5ff40]">
                <User className="h-3.5 w-3.5" />
                <span>{currentUser.phone}</span>
              </div>
              <button
                onClick={onSignOut}
                className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-4 sm:px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(255,42,141,0.4)] transition-all hover:scale-105 hover:opacity-95"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Sign In / Sign Up</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scroll Nav Tabs */}
      <div className="flex xl:hidden overflow-x-auto border-t border-white/5 bg-black/60 px-4 py-2 scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const isLocked = tab.isProtected && !currentUser
          const Icon = tab.icon

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#ff2a8d]/20 text-[#ffb1c7] ring-1 ring-[#ff2a8d]/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {isLocked && <Lock className="h-2.5 w-2.5 text-amber-400" />}
            </button>
          )
        })}
      </div>
    </header>
  )
}
