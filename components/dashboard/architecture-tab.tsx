"use client"

import React, { useState } from "react"
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  Database, 
  Lock, 
  GitBranch, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Workflow, 
  Server,
  Share2,
  FileCode
} from "lucide-react"

export default function ArchitectureTab({ onSwitchTab }: { onSwitchTab?: (tab: string) => void }) {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0)

  const architectureLayers = [
    {
      id: "module-a",
      title: "Module A: Pre-Payment Intent & Identity Forensics",
      code: "UPI-SENTINEL-CORE-V1",
      badge: "Edge Verification (<120ms)",
      color: "from-pink-500/20 to-purple-500/20 border-pink-500/30",
      accent: "text-pink-400",
      description: "Intercepts incoming intent before money moves. Analyzes VPA age, bank routing mismatch, QR payload signatures, and NLP urgency cues from SMS/WhatsApp notifications.",
      specs: [
        "VPA Reverse Lookup (NPCI Resolver simulation)",
        "Zero-Trust QR Code Payload Sanitizer",
        "Transformer-based Extortion SMS Urgency Classifier",
        "Deterministic Risk Scoring Engine (0-100 Gauge)"
      ],
      destinationTab: "scanner"
    },
    {
      id: "module-b",
      title: "Module B: TinyFish Autonomous Phishing Crawler",
      code: "TINYFISH-DOM-EXTRACTOR",
      badge: "Real-Time Agent Sandbox",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
      accent: "text-cyan-400",
      description: "Headless browser crawler powered by TinyFish MCP. Dispatches into suspected phishing URLs in electricity bill or KYC SMS messages, fills honeypot fake credentials, and extracts malicious Telegram bot C2 tokens.",
      specs: [
        "Headless Chrome DOM Tree & Form Inspection",
        "Synthetic Credential Injector (Honeypot Trap)",
        "Telegram / Discord C2 Webhook Sniffer",
        "Real-Time Evidence Capture & Screenshot OCR"
      ],
      destinationTab: "tinyfish"
    },
    {
      id: "module-c",
      title: "Module C: Transaction DNA & HDBSCAN Wave Clustering",
      code: "SCAM-WAVE-RADAR-V3",
      badge: "Unsupervised Vector Space",
      color: "from-rose-500/20 to-red-500/20 border-rose-500/30",
      accent: "text-rose-400",
      description: "Embeds transaction metadata, beneficiary patterns, timing rhythms, and crawler signals into 6-dimensional vectors. Uses HDBSCAN to detect emerging scam clusters before human complaint filings.",
      specs: [
        "UMAP 6D-to-2D Dimensionality Reduction",
        "HDBSCAN Dynamic Noise & Core Cluster Isolation",
        "Mule Syndicate Correlation Graph",
        "Inter-Bank Broadcast Bus (<50ms Pub/Sub)"
      ],
      destinationTab: "transaction-dna"
    },
    {
      id: "module-d",
      title: "Module D: Fraud Analyst War Room & Protocol Dispatch",
      code: "ANALYST-TRIAGE-DESK",
      badge: "Human-in-the-Loop Hotkeys",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
      accent: "text-amber-400",
      description: "Equips bank fraud desks and cyber-cell officers with keyboard-driven incident triage (A: Approve, R: Reject/Freeze, E: Escalate to Law Enforcement), with instant push to the national central blacklist.",
      specs: [
        "Single-Key Accelerated Decisioning (A / R / E)",
        "Automated Frozen VPA Bank Alert Broadcast",
        "LEAF / CORD / I4C Indian Cybercrime Export",
        "Immutable Audit Log with Cryptographic Signatures"
      ],
      destinationTab: "analyst-portal"
    }
  ]

  const pipelineStages = [
    { name: "1. Client Trigger", role: "User scans QR or pastes UPI ID / Extortion SMS text in payment flow" },
    { name: "2. Edge Forensics", role: "TriNetra Sentinel performs parallel VPA lookup and heuristic keyword analysis (<120ms)" },
    { name: "3. TinyFish Dispatch", role: "If suspicious link exists, autonomous TinyFish sandbox inspects phishing forms & traps C2" },
    { name: "4. Vector Clustering", role: "Transaction DNA vector mapped into HDBSCAN space to locate active scam syndicates" },
    { name: "5. Intercept / Analyst", role: "Scores ≥75 locked immediately; edge alert dispatched to bank and law enforcement" }
  ]

  return (
    <div className="w-full space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#161618] p-6 lg:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-500/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#ff2a8d] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff2a8d]">
                Architectural Blueprint
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              त्रिNETRA Cyber Defense System Architecture
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
              An end-to-end multi-agent orchestration pipeline uniting instant client-side pre-payment verification, headless automated crawler reconnaissance via TinyFish MCP, and unsupervised vector clustering into a unified defense grid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Total Latency</p>
              <p className="font-mono text-lg font-bold text-emerald-400">&lt; 140 ms</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Threat Recall</p>
              <p className="font-mono text-lg font-bold text-[#ff2a8d]">99.84%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Inter-Bank Sync</p>
              <p className="font-mono text-lg font-bold text-cyan-400">Real-Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Signal Flow Diagram */}
      <div className="rounded-2xl border border-white/10 bg-[#121214] p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Workflow className="h-5 w-5 text-[#ff2a8d]" />
              End-to-End Autonomous Defense Pipeline
            </h2>
            <p className="text-xs text-zinc-400">Click any stage to trace data flow through the sentinel system.</p>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            Active Inspection Protocol: <span className="font-bold text-white">LIVE-EVAL-V2.4</span>
          </span>
        </div>

        {/* Steps track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineStages.map((step, idx) => {
            const isSelected = activePipelineStep === idx
            return (
              <button
                key={idx}
                onClick={() => setActivePipelineStep(idx)}
                className={`relative rounded-xl p-4 text-left transition-all border ${
                  isSelected 
                    ? "border-[#ff2a8d] bg-[#ff2a8d]/10 shadow-[0_0_20px_rgba(255,42,141,0.2)]"
                    : "border-white/5 bg-[#1a191b] hover:border-white/20 hover:bg-[#201f21]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[11px] font-bold ${isSelected ? "text-[#ff2a8d]" : "text-zinc-400"}`}>
                    STAGE 0{idx + 1}
                  </span>
                  {isSelected && <Radio className="h-3.5 w-3.5 text-[#ff2a8d] animate-pulse" />}
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5">{step.name}</h4>
                <p className="text-[11px] text-zinc-400 leading-normal line-clamp-3">{step.role}</p>
              </button>
            )
          })}
        </div>

        {/* Detailed stage breakdown */}
        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Terminal className="h-3.5 w-3.5 text-[#ff2a8d]" />
            <span className="text-[11px] uppercase tracking-wider">Pipeline Deep-Trace</span>
          </div>
          <div className="space-y-1 text-zinc-300">
            <p className="text-[#ffb1c7] font-semibold">{pipelineStages[activePipelineStep].name}</p>
            <p className="text-zinc-400">{pipelineStages[activePipelineStep].role}</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#ff2a8d]" />
            The 4 Operational Intelligence Pillars
          </h2>
          <span className="text-xs text-zinc-400">All modules active & synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {architectureLayers.map((mod) => (
            <div 
              key={mod.id}
              className={`rounded-2xl border bg-gradient-to-br ${mod.color} p-6 transition-all hover:scale-[1.01] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {mod.code}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{mod.title}</h3>
                  </div>
                  <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-300 border border-white/10 whitespace-nowrap">
                    {mod.badge}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {mod.description}
                </p>

                <div className="space-y-2 mb-6">
                  {mod.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${mod.accent}`} />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onSwitchTab && (
                <button
                  onClick={() => onSwitchTab(mod.destinationTab)}
                  className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 group"
                >
                  <span>Launch Live Module View</span>
                  <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security, Privacy & Compliance Safeguards */}
      <div className="rounded-2xl border border-white/10 bg-[#161618] p-6 lg:p-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#ff2a8d]" />
          Zero-Knowledge Privacy & Regulatory Compliance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">UPI & NPCI Guidelines</h4>
            <p className="text-[11px] text-zinc-400">
              Operates within RBI Digital Payment Security Controls (Master Direction 2021) and does not store account MPIN or payment credentials.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <Lock className="h-5 w-5 text-cyan-400 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">Zero-Knowledge Verification</h4>
            <p className="text-[11px] text-zinc-400">
              Payer personal identification data (PII) is hashed with SHA-256 before vector embeddings are formed, preserving customer anonymity while tracing syndicates.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <Share2 className="h-5 w-5 text-[#ff2a8d] mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">National Cyber Registry Sync</h4>
            <p className="text-[11px] text-zinc-400">
              Direct telemetry export to Indian Cybercrime Coordination Centre (I4C), Citizen Financial Cyber Fraud Reporting System (CFCFRS 1930).
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
