"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader, { TabKey } from "@/components/dashboard/dashboard-header"
import AuthGateModal from "@/components/dashboard/auth-gate-modal"
import ScannerTab from "@/components/dashboard/scanner-tab"
import TinyFishCrawlerTab from "@/components/dashboard/tinyfish-crawler-tab"
import TransactionDnaTab from "@/components/dashboard/transaction-dna-tab"
import AnalystPortalTab from "@/components/dashboard/analyst-portal-tab"
import ArchitectureTab from "@/components/dashboard/architecture-tab"
import { ShieldCheck, Activity, Terminal, Lock } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("scanner")
  const [currentUser, setCurrentUser] = useState<{ phone: string; email?: string } | null>(null)
  const [authGateOpen, setAuthGateOpen] = useState(false)
  const [gateTargetTab, setGateTargetTab] = useState<string>("Intel")

  // Sync user state from local storage or Supabase session
  useEffect(() => {
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
    // If signed out while on a protected tab, fallback to scanner
    if (["tinyfish", "transaction-dna", "analyst-portal"].includes(activeTab)) {
      setActiveTab("scanner")
    }
  }

  const handleOpenAuthGate = (tabKey: TabKey) => {
    const tabNames: Record<TabKey, string> = {
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
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#ededed] antialiased selection:bg-[#ff2a8d] selection:text-white">
      {/* Universal Dashboard Navigation Header */}
      <DashboardHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenAuthGate={handleOpenAuthGate}
      />

      {/* Main Tab View Canvas */}
      <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {activeTab === "scanner" && (
          <ScannerTab 
            onExploreArchitecture={() => setActiveTab("architecture")} 
            onOpenAuthGate={() => handleOpenAuthGate("tinyfish")}
            currentUser={currentUser}
          />
        )}

        {activeTab === "tinyfish" && (
          currentUser ? (
            <TinyFishCrawlerTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-white/10 bg-[#161618] p-8 max-w-md">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  TinyFish Autonomous Crawler requires verified phone authorization.
                </p>
                <button
                  onClick={() => handleOpenAuthGate("tinyfish")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg"
                >
                  Authenticate to Access
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === "transaction-dna" && (
          currentUser ? (
            <TransactionDnaTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-white/10 bg-[#161618] p-8 max-w-md">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Transaction DNA &amp; HDBSCAN Wave Clustering requires verified analyst login.
                </p>
                <button
                  onClick={() => handleOpenAuthGate("transaction-dna")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] py-3 text-xs font-bold text-white shadow-lg"
                >
                  Authenticate to Access
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === "analyst-portal" && (
          currentUser ? (
            <AnalystPortalTab />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl border border-white/10 bg-[#161618] p-8 max-w-md">
                <Lock className="mx-auto h-12 w-12 text-[#ff2a8d] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Tab</h3>
                <p className="text-xs text-zinc-400 mb-6">
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
          )
        )}

        {activeTab === "architecture" && (
          <ArchitectureTab onSwitchTab={(tab) => handleSelectTab(tab as TabKey)} />
        )}
      </main>

      {/* Cyber Defense Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#0a0a0c] px-4 sm:px-6 lg:px-8 py-10">
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
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        targetTabName={gateTargetTab}
      />
    </div>
  )
}
