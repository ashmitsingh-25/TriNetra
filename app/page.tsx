"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader, { TabKey } from "@/components/dashboard/dashboard-header"
import AuthGateModal from "@/components/dashboard/auth-gate-modal"
import SculptureHero from "@/components/ui/liquid-sculpture-hero"
import ScannerTab from "@/components/dashboard/scanner-tab"
import TinyFishCrawlerTab from "@/components/dashboard/tinyfish-crawler-tab"
import TransactionDnaTab from "@/components/dashboard/transaction-dna-tab"
import AnalystPortalTab from "@/components/dashboard/analyst-portal-tab"
import { FeatureSteps, FeatureStep } from "@/components/blocks/feature-section"
import ColorChangeCards from "@/components/ui/color-change-card"
import AiChatbotSection from "@/components/sections/ai-chatbot-section"
import Pricing from "@/components/ui/pricing-1"
import { 
  User, 
  LogOut, 
  KeyRound, 
  Lock, 
  LayoutDashboard
} from "lucide-react"

const TRINETRA_ABOUT_STEPS: FeatureStep[] = [
  {
    step: "STEP 01",
    title: "Decode QR & VPA Identity",
    tag: "MODULE A // QR FORENSICS",
    metrics: "100% VPA Mismatch Accuracy",
    content: "Drop any payment QR code or paste an SMS notice. त्रिNETRA extracts the hidden upi://pay parameters and checks if the real destination bank handle matches the person or utility company claimed.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "STEP 02",
    title: "Sandbox Links with TinyFish",
    tag: "MODULE B // TINYFISH WEB AI",
    metrics: "Zero Client Device Exposure",
    content: "Autonomous TinyFish agents open suspicious electricity bill, Fastag KYC, and courier links in an isolated remote browser to expose fake UPI PIN forms and hidden payment redirects.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "STEP 03",
    title: "Cluster & Neutralize Scam Waves",
    tag: "MODULE C & D // DNA & ANALYST HUB",
    metrics: "Real-Time Supabase Sync",
    content: "Transaction DNA groups related scam attempts into waves while Fraud Analysts confirm and blacklist rogue UPI IDs across our Supabase intelligence grid.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  }
]

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
      const validDashboardTabs: TabKey[] = ["scanner", "tinyfish", "transaction-dna", "analyst-portal"]

      if (loggedInUser) {
        // Authenticated user: tabs are active and accessible! Default to scanner or requested tab.
        if (tabParam && validDashboardTabs.includes(tabParam)) {
          setActiveTab(tabParam)
        } else {
          setActiveTab("scanner")
        }
      } else {
        // Unauthenticated visitor: tabs are strictly hidden! Show only the clean landing hero.
        setActiveTab("overview")
        if (tabParam && validDashboardTabs.includes(tabParam)) {
          // If unauthenticated visitor attempts to access a tab directly, redirect to login
          window.location.href = "/auth"
        }
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("trinetra_user")
      const url = new URL(window.location.href)
      url.searchParams.delete("tab")
      window.history.replaceState({}, "", url.toString())
    }
    setCurrentUser(null)
    setActiveTab("overview")
  }

  const handleOpenAuthGate = (tabKey: TabKey) => {
    const tabNames: Record<TabKey, string> = {
      overview: "Overview",
      scanner: "Sentinel Scanner",
      tinyfish: "TinyFish Autonomous Crawler",
      "transaction-dna": "Transaction DNA & Wave Clustering",
      "analyst-portal": "Fraud Analyst Command Hub"
    }
    setGateTargetTab(tabNames[tabKey] || "Protected Tab")
    setAuthGateOpen(true)
  }

  const handleSelectTab = (tab: TabKey) => {
    if (!currentUser && tab !== "overview") {
      window.location.href = "/auth"
      return
    }
    setActiveTab(tab)
    if (typeof window !== "undefined") {
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

  const handleModuleNavigation = (idx: number) => {
    const moduleTabs: TabKey[] = ["scanner", "tinyfish", "transaction-dna", "analyst-portal"]
    const target = moduleTabs[idx] || "scanner"
    if (currentUser) {
      handleSelectTab(target)
    } else {
      if (target === "scanner") {
        window.location.href = "/scanner"
      } else {
        window.location.href = "/auth"
      }
    }
  }

  const handlePricingGetStarted = () => {
    if (currentUser) {
      handleSelectTab("scanner")
    } else {
      window.location.href = "/auth"
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] antialiased selection:bg-[#ff2a8d] selection:text-white">
      
      {/* 
        Dashboard Navigation Bar & Tabs:
        SHOWN AFTER LOGIN ONLY!
        When not logged in or on landing hero page, tabs and navigation bar are hidden.
      */}
      {currentUser && activeTab !== "overview" && (
        <DashboardHeader
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onOpenAuthGate={handleOpenAuthGate}
        />
      )}

      {/* ─── LANDING PAGE: HERO + 3 FULL-VIEWPORT SECTIONS ─── */}
      {activeTab === "overview" && (
        <main className="w-full">
          {/* Section 0: Fluid Hero */}
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
            primaryCta={
              currentUser 
                ? { label: "Launch Defense Grid", href: "/?tab=scanner" }
                : { label: "Sign In / Register", href: "/auth" }
            }
            secondaryCta={
              currentUser 
                ? { label: "Forensic Scanner", href: "/scanner" }
                : { label: "Explore Platform", href: "/auth" }
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
                      className="flex items-center gap-1.5 rounded-full border border-[#ff2a8d]/40 bg-[#ff2a8d]/15 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,42,141,0.3)] hover:scale-105 transition-all cursor-pointer"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-[#ff2a8d]" />
                      <span>Launch Defense Grid &rarr;</span>
                    </button>
                    <div className="flex items-center gap-2 rounded-full border border-[#e5ff40]/40 bg-[#e5ff40]/10 px-3.5 py-1.5 text-xs font-bold text-[#e5ff40]">
                      <User className="h-3.5 w-3.5" />
                      <span>{currentUser.phone}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
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

          {/* Section 1: About Our Website (FeatureSteps) */}
          <FeatureSteps
            features={TRINETRA_ABOUT_STEPS}
            title="How त्रिNETRA Protects Every Rupee"
            autoPlayInterval={4000}
            imageHeight="h-[500px]"
          />

          {/* Section 2: Features of Our Website (ColorChangeCards) */}
          <ColorChangeCards onNavigateModule={handleModuleNavigation} />

          {/* Section 3: AI Sentinel Chatbot & 3D Model Split */}
          <AiChatbotSection />

          {/* Section 4: Pricing (₹99) & FAQs */}
          <Pricing onGetStarted={handlePricingGetStarted} />
        </main>
      )}

      {/* ─── TAB 1: SENTINEL SCANNER (ACTIVE AFTER LOGIN) ─── */}
      {currentUser && activeTab === "scanner" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <ScannerTab 
            onExploreArchitecture={() => handleSelectTab("tinyfish")} 
            onOpenAuthGate={() => handleOpenAuthGate("tinyfish")}
            currentUser={currentUser}
          />
        </main>
      )}

      {/* ─── TAB 2: TINYFISH AUTONOMOUS CRAWLER ─── */}
      {currentUser && activeTab === "tinyfish" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <TinyFishCrawlerTab />
        </main>
      )}

      {/* ─── TAB 3: TRANSACTION DNA & WAVE CLUSTERING ─── */}
      {currentUser && activeTab === "transaction-dna" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <TransactionDnaTab />
        </main>
      )}

      {/* ─── TAB 4: FRAUD ANALYST WAR ROOM ─── */}
      {currentUser && activeTab === "analyst-portal" && (
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          <AnalystPortalTab />
        </main>
      )}


      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10 bg-[#050505] px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <span className="font-extrabold text-[#ff2a8d]">त्रिNETRA</span>
              <span>•</span>
              <span>Next-Gen Pre-Payment Cyber Defense Grid</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-400">
              Pre-Payment UPI Verification &bull; Powered by TinyFish Web Crawler
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-[#e5ff40]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff40]" />
              Live Protection Active
            </span>
            <span>1930 Cybercrime Portal Support</span>
            <span className="text-[#ff2a8d] font-bold">
              {currentUser ? `Active Session: ${currentUser.phone}` : "Zero-Trust Edge Defense"}
            </span>
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
