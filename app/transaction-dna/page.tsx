"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import TransactionDnaTab from "@/components/dashboard/transaction-dna-tab"
import { 
  ArrowRight, 
  Menu, 
  X, 
  Scan, 
  Globe, 
  Activity, 
  Terminal, 
  Cpu,
  Lock,
  Sparkles
} from "lucide-react"

export default function TransactionDnaPage() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { label: "Scanner", href: "/scanner", icon: Scan },
    { label: "TinyFish Intel", href: "/?tab=tinyfish", icon: Globe },
    { label: "Transaction DNA", href: "/transaction-dna", icon: Activity, active: true },
    { label: "Analyst Portal", href: "/?tab=analyst-portal", icon: Terminal },
    { label: "System Architecture", href: "/?tab=architecture", icon: Cpu }
  ]

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

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#ededed] font-sans overflow-x-hidden selection:bg-[#ff2a8d] selection:text-white">
      
      {/* ─── MASSIVE LOW-OPACITY BACKGROUND WATERMARK ─── */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none select-none absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12vw] font-black uppercase tracking-tighter text-white opacity-[0.03] z-0 leading-none"
      >
        त्रिNETRA // DNA CLUSTERS
      </div>

      {/* ─── TOP NAVIGATION HEADER WITH 3-LINE HAMBURGER TRIGGER ─── */}
      <header className="relative z-30 w-full border-b border-white/[0.08] bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Cluster: Hamburger Trigger + Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Top-Left Hamburger Trigger & Popover */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Navigation Menu"
                aria-expanded={isOpen}
                className="w-10 h-10 rounded-xl border border-white/15 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-center text-white hover:border-[#ff2a8d]/60 hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg group focus:outline-none"
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
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = item.active

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`w-full rounded-xl px-3.5 py-2.5 flex items-center justify-between text-sm transition-all text-left ${
                            isActive
                              ? "bg-white/[0.06] text-[#ff2a8d] font-semibold shadow-inner"
                              : "text-neutral-400 hover:text-white hover:bg-white/[0.03] font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${isActive ? "text-[#ff2a8d]" : "text-neutral-400"}`} />
                            <span>{item.label}</span>
                          </div>

                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_#ff2a8d]" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Left Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-9 w-9 overflow-hidden bg-black/60 p-1 border border-white/[0.12] transition-transform group-hover:scale-105 rounded-lg">
                <Image
                  src="/assets/trinetra-logo.png"
                  alt="त्रिNETRA Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg">
                  त्रिNETRA
                </span>
              </div>
            </Link>
          </div>

          {/* Right Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/scanner" 
              className="flex items-center gap-1.5 font-mono text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <Scan className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Scanner</span>
            </Link>

            <Link 
              href="/?tab=analyst-portal" 
              className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#e5ff40] hover:text-[#d4ed36] transition-colors group"
            >
              <span>Analyst Portal</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── PAGE 3 MAIN CONTAINER ─── */}
      <main className="relative z-10 w-full">
        <TransactionDnaTab />
      </main>
    </div>
  )
}
