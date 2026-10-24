"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader, { TabKey } from "@/components/dashboard/dashboard-header"
import AuthGateModal from "@/components/dashboard/auth-gate-modal"
import SculptureHero from "@/components/ui/liquid-sculpture-hero"
import StorytellingSection from "@/components/ui/storytelling-section"
import ScannerTab from "@/components/dashboard/scanner-tab"
import TinyFishCrawlerTab from "@/components/dashboard/tinyfish-crawler-tab"
import TransactionDnaTab from "@/components/dashboard/transaction-dna-tab"
import AnalystPortalTab from "@/components/dashboard/analyst-portal-tab"
import ArchitectureTab from "@/components/dashboard/architecture-tab"
import { 
  User, 
  LogOut, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  LayoutDashboard,
  ArrowRight
} from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [currentUser, setCurrentUser] = useState<{ phone: string; email?: string } | null>(null)
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [gateTargetTab, setGateTargetTab] = useState<string>("Intel")

  // Sync user session from localStorage and handle redirect after login
  useEffect(() => {
    if (typeof window !== "undefined") {
      let loggedInUser = null
      const stored = localStorage.getItem("trinetra_user")
      if (stored) {
        try {
          loggedInUser = JSON.parse(stored)
          setCurrentUser(loggedInUser)
        } catch {
          // ignore parsing error
        }
      }

      // Check URL query parameter (e.g. /?tab=scanner)
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab") as TabKey | null
      const validTabs: TabKey[] = ["overview", "scanner", "tinyfish", "transaction-dna", "analyst-portal", "architecture"]

      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam)
      } else if (loggedInUser) {
        // After login on landing page, redirect directly to scanner page & other tabs!
        setActiveTab("scanner")
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("trinetra_user")
      // Remove query param if present
      const url = new URL(window.location.href)
      url.searchParams.delete("tab")
      window.history.replaceState({}, "", url.toString())
    }
    setCurrentUser(null)
    setActiveTab("overview")
  }

  const handleOpenAuthGate = (tabKey: TabKey) => {
    const tabNames: Record<TabKey, string> = {
      overview: "Overview & Story",
      scanner: "Sentinel Scanner",
      tinyfish: "TinyFish Autonomous Crawler",
      "transaction-dna": "Transaction DNA & Wave Clustering",
      "analyst-portal": "Fraud Analyst Command Hub",
      architecture: "System Architecture"
    }
    setGateTargetTab(tabNames[tabKey] || "Protected Tab")
    setAuthGateOpen(true)
  }

  const handleSelectTab = (tab: TabKey) => {
    const protectedTabs: TabKey[] = ["tinyfish", "transaction-dna", "analyst-portal"]
    if (protectedTabs.includes(tab) && !currentUser) {
      handleOpenAuthGate(tab)
      return
    }
    setActiveTab(tab)
    if (typeof window !== "undefined") {
      // Update query param cleanly without full reload
      const url = new URL(window.location.href)
      if (tab === "overview") {
        url.searchParams.delete("tab")
      } else {
        url.searchParams.set("tab", tab)
      }
      window.history.replaceState({}, "", url.toString())
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] antialiased selection:bg-[#ff2a8d] selection:text-white">
      
      {/* 
        Dashboard Navigation Bar:
        ONLY displayed when browsing dashboard tabs (scanner, tinyfish, transaction-dna, analyst-portal, architecture).
        COMPLETELY REMOVED from the landing page overview/hero to keep the hero page clean, as requested!
      */}
      {activeTab !== "overview" && (
        <DashboardHeader
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onOpenAuthGate={handleOpenAuthGate}
        />
      )}

      {/* ─── LANDING PAGE: ANIMATED HERO + ARCHITECTURE IN STORYTELLING MODE (NO HEADER BAR) ─── */}
      {activeTab === "overview" && (
        <main className="w-full">
          {/* 
            FLORIA Liquid Particle Hero (Clean full-screen, no header bar overlay)
            Features interactive WebGL2 GPGPU particles and native clean nav
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
            primaryCta={{ label: "Explore Architecture", href: "#story" }}
            secondaryCta={
              currentUser 
                ? { label: "Go to Scanner Tabs", href: "/?tab=scanner" }
                : { label: "Sign In / Register", href: "/auth" }
            }
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
                    <button
                      onClick={() => handleSelectTab("scanner")}
                      className="flex items-center gap-1.5 rounded-full border border-[#ff2a8d]/40 bg-[#ff2a8d]/15 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,42,141,0.3)] hover:scale-105 transition-all"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-[#ff2a8d]" />
                      <span>Scanner &amp; Tabs &rarr;</span>
                    </button>
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
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/30 transition-all hover:scale-105 hover:opacity-95"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Sign In / Sign Up</span>
                  </Link>
                )}
              </div>
            }
          />

          {/* 
            Second Page: Cinematic Scroll-Driven Storytelling Section Showing Architecture
            Pure black background (#000000) with expanding mystical eye emblem,
            revealing TriNETRA's 4 Architectural Pillars as the user scrolls.
          */}
          <StorytellingSection 
            id="story" 
            currentUser={currentUser} 
            onOpenPortal={(tab) => handleSelectTab((tab as TabKey) || "scanner")} 
          />

          {/* Bottom Fast Action Console */}
          <div id="portal-jump" className="border-t border-white/10 bg-[#050505] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-3xl border border-[#ff2a8d]/30 bg-gradient-to-br from-[#121214] via-[#0e0e10] to-[#000000] p-8 sm:p-12 shadow-[0_0_50px_rgba(255,42,141,0.15)] text-center space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5ff40]/30 bg-[#e5ff40]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#e5ff40]">
                <Sparkles className="h-3.5 w-3.5" />
                Live Defense Webpages Ready
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Inspect Live Scams Across India
              </h2>

              <p className="max-w-2xl mx-auto text-sm text-zinc-400">
                Switch directly to our live interactive defense consoles to test UPI intent forensics, crawl hostile phishing links via TinyFish, or view the HDBSCAN vector radar.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleSelectTab("scanner")}
                  className="rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-6 py-3 font-mono text-xs font-bold uppercase text-white shadow-lg shadow-[#ff2a8d]/25 hover:scale-105 transition-all"
                >
                  Launch Scanner
                </button>
                <button
                  onClick={() => handleSelectTab("tinyfish")}
                  className="rounded-full border border-white/10 bg-black/60 px-6 py-3 font-mono text-xs font-bold uppercase text-white hover:border-[#ff2a8d] transition-all"
                >
                  TinyFish Crawler {!currentUser && "🔒"}
                </button>
                <button
                  onClick={() => handleSelectTab("transaction-dna")}
                  className="rounded-full border border-white/10 bg-black/60 px-6 py-3 font-mono text-xs font-bold uppercase text-white hover:border-[#ff2a8d] transition-all"
                >
                  Transaction DNA {!currentUser && "🔒"}
                </button>
                <button
                  onClick={() => handleSelectTab("analyst-portal")}
                  className="rounded-full border border-white/10 bg-black/60 px-6 py-3 font-mono text-xs font-bold uppercase text-white hover:border-[#ff2a8d] transition-all"
                >
                  Analyst War Room {!currentUser && "🔒"}
                </button>
                <button
                  onClick={() => handleSelectTab("architecture")}
                  className="rounded-full border border-white/10 bg-black/60 px-6 py-3 font-mono text-xs font-bold uppercase text-[#e5ff40] hover:border-[#e5ff40] transition-all"
                >
                  System Architecture
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ─── TAB 2: SENTINEL SCANNER (SCREEN 1 - ACTIVE BY DEFAULT AFTER LOGIN) ─── */}
      {activeTab === "scanner" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <ScannerTab 
            onExploreArchitecture={() => handleSelectTab("architecture")} 
            onOpenAuthGate={() => handleOpenAuthGate("tinyfish")}
            currentUser={currentUser}
          />
        </main>
      )}

      {/* ─── TAB 3: TINYFISH AUTONOMOUS CRAWLER (SCREEN 3 - AUTH GATED) ─── */}
      {activeTab === "tinyfish" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          {currentUser ? (
            <TinyFishCrawlerTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-[#ff2a8d]/40 bg-[#121214] p-8 max-w-md shadow-[0_0_40px_rgba(255,42,141,0.2)]">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  TinyFish Autonomous Crawler requires phone authorization to view live honeypot captures and Telegram C2 sniffers.
                </p>
                <button
                  onClick={() => handleOpenAuthGate("tinyfish")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg"
                >
                  Authenticate to Access
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ─── TAB 4: TRANSACTION DNA & WAVE CLUSTERING (SCREEN 2 - AUTH GATED) ─── */}
      {activeTab === "transaction-dna" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          {currentUser ? (
            <TransactionDnaTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-[#ff2a8d]/40 bg-[#121214] p-8 max-w-md shadow-[0_0_40px_rgba(255,42,141,0.2)]">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Transaction DNA &amp; HDBSCAN Wave Clustering requires verified analyst credentials.
                </p>
                <button
                  onClick={() => handleOpenAuthGate("transaction-dna")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg"
                >
                  Authenticate to Access
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ─── TAB 5: FRAUD ANALYST WAR ROOM (SCREEN 4 - AUTH GATED) ─── */}
      {activeTab === "analyst-portal" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          {currentUser ? (
            <AnalystPortalTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-[#ff2a8d]/40 bg-[#121214] p-8 max-w-md shadow-[0_0_40px_rgba(255,42,141,0.2)]">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Fraud Analyst Command Hub requires certified law enforcement / bank credentials.
                </p>
                <button
                  onClick={() => handleOpenAuthGate("analyst-portal")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg"
                >
                  Authenticate to Access
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ─── TAB 6: SYSTEM ARCHITECTURE (SCREEN 5) ─── */}
      {activeTab === "architecture" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <ArchitectureTab onSwitchTab={(tab) => handleSelectTab(tab as TabKey)} />
        </main>
      )}

      {/* Unified Cyber Defense Footer */}
      <footer className="border-t border-white/10 bg-[#050505] px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <span className="font-extrabold text-[#ff2a8d]">त्रिNETRA</span>
              <span>•</span>
              <span>Next-Gen Pre-Payment Cyber Defense Grid</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="font-mono text-[11px] text-zinc-400">
              Zero-Trust UPI Routing &bull; NPCI Layer Forensics &bull; TinyFish Honeypots
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-[#e5ff40]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff40] animate-pulse" />
              SLA &lt;140ms
            </span>
            <span>I4C / CFCFRS 1930 Active</span>
            <span>SHA-256 Vector Privacy</span>
            <Link href="/auth" className="text-[#ff2a8d] hover:underline font-bold">
              {currentUser ? "Active Session" : "Portal Login"}
            </Link>
          </div>
        </div>
      </footer>

      {/* Authentication Gate Modal */}
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        targetTabName={gateTargetTab}
      />
    </div>
  )
}
