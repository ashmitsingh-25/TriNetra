"use client"

import React, { useState, useRef, useEffect } from "react"
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
  Scan,
  Menu,
  X
} from "lucide-react"

export type TabKey = "overview" | "scanner" | "tinyfish" | "transaction-dna" | "analyst-portal"

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
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const tabs: { key: TabKey; label: string; icon: any; isProtected: boolean }[] = [
    { key: "scanner", label: "Scanner", icon: Scan, isProtected: false },
    { key: "tinyfish", label: "TinyFish Intel", icon: Globe, isProtected: true },
    { key: "transaction-dna", label: "Transaction DNA", icon: Activity, isProtected: true },
    { key: "analyst-portal", label: "Analyst Portal", icon: Terminal, isProtected: true },
  ]

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleTabClick = (tab: { key: TabKey; isProtected: boolean }) => {
    setIsOpen(false)
    if (tab.isProtected && !currentUser) {
      onOpenAuthGate(tab.key)
    } else {
      onSelectTab(tab.key)
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0e0e10]/90 backdrop-blur-xl shadow-[0_1px_15px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left Cluster: 3-Line Hamburger Trigger + Brand Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Top-Left Rounded-Square 3-Line Trigger Button & Popover */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Navigation Menu"
              aria-expanded={isOpen}
              className="w-11 h-11 rounded-xl border border-white/15 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-center text-white hover:border-[#ff2a8d]/60 hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg group focus:outline-none focus:ring-1 focus:ring-[#ff2a8d]/50"
            >
              {isOpen ? (
                <X size={18} strokeWidth={1.75} className="text-[#ff2a8d] transition-transform duration-200" />
              ) : (
                <Menu size={18} strokeWidth={1.75} className="text-white group-hover:text-[#ff2a8d] transition-colors" />
              )}
            </button>

            {/* Popover Menu Dropdown */}
            {isOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-white/12 bg-[#08080a]/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-white/5 mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                    Navigation
                  </span>
                  <span className="font-mono text-[10px] text-neutral-600">
                    ESC to close
                  </span>
                </div>

                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.key
                    const isLocked = tab.isProtected && !currentUser
                    const Icon = tab.icon

                    return (
                      <button
                        key={tab.key}
                        onClick={() => handleTabClick(tab)}
                        className={`w-full rounded-xl px-3.5 py-2.5 flex items-center justify-between text-sm transition-all text-left ${
                          isActive
                            ? "bg-white/[0.06] text-[#ff2a8d] font-semibold shadow-inner"
                            : "text-neutral-400 hover:text-white hover:bg-white/[0.03] font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? "text-[#ff2a8d]" : "text-neutral-400"}`} />
                          <span>{tab.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isLocked && (
                            <span title="Requires Authentication">
                              <Lock className="h-3 w-3 text-amber-400/80" />
                            </span>
                          )}
                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_#ff2a8d]" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Brand & Identity: Clean त्रिNETRA Wordmark without Sentinel UPI badge */}
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
              <span className="font-extrabold tracking-tight text-white text-lg sm:text-xl">
                त्रिNETRA
              </span>
              <span className="hidden font-mono text-[10px] tracking-widest text-zinc-400 sm:inline">
                CYBER-FRAUD INTELLIGENCE GRID
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3 sm:gap-4">

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
    </header>
  )
}
