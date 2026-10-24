"use client"

import React, { useState } from "react"
import { 
  Terminal, 
  Globe, 
  Zap, 
  Compass, 
  LockOpen, 
  AlertCircle, 
  ShieldCheck, 
  Shield, 
  Network, 
  ListFilter, 
  FileCode2, 
  Copy, 
  Check, 
  AlertTriangle,
  Play,
  KeyRound,
  RefreshCw
} from "lucide-react"

export default function TinyFishCrawlerTab() {
  const [targetUrl, setTargetUrl] = useState("https://electricity-bill-update-kyc.in/portal/verify-sbi")
  const [isCrawling, setIsCrawling] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [crawlLogs, setCrawlLogs] = useState<string[]>([
    "[14:02:11.002] INIT Worker thread #TF-89 spawn (Chromium headless sandbox)",
    "[14:02:11.018] GET https://electricity-bill-update-kyc.in/portal/verify-sbi (HTTP/2)",
    "[14:02:11.082] HEADER TLS 1.3 | SNI: electricity-bill-update-kyc.in | Issuer: Let's Encrypt",
    "[14:02:11.110] EVASION Geo-fence check: Request from non-Indian IP redirected to 404",
    "[14:02:11.114] PROXY Reseeding residential Pune proxy node... Connected (AS55836)",
    "[14:02:11.340] DOM_EXTRACT 1 form found with <input name=\"upi_pin\" type=\"password\">",
    "[14:02:11.395] MALICIOUS Discord/Telegram webhook exfiltration hook identified in bundle.js",
    "[14:02:11.412] AGENT_DISPATCH Auto-injected honey-credentials to poison scammer database",
    "[14:02:11.450] SYNC TriNETRA Global Ledger updated in 12ms. Intercept rule propagated."
  ])

  const jsonPayload = `{
  "sentinel_event_id": "evt_tf_984189214",
  "status": "MALICIOUS_CONTAINED",
  "target_url": "${targetUrl}",
  "verdict": {
    "risk_score": 98.8,
    "category": "CREDENTIAL_AND_UPI_PIN_HARVESTER",
    "impersonated_brand": "State Bank of India / Mahavitaran Electricity"
  },
  "extracted_vpa": [
    {
      "vpa": "billdesk.mahadiscom@axisbank",
      "flagged_previously": true,
      "correlations_count": 119
    }
  ],
  "honeypot_action": {
    "poison_injected": true,
    "decoy_records_sent": 50
  }
}`

  const handleDispatch = async () => {
    if (!targetUrl.trim()) return
    setIsCrawling(true)
    const timeStr = new Date().toLocaleTimeString()
    setCrawlLogs((prev) => [
      `[${timeStr}] DISPATCH Inspecting new target: ${targetUrl}`,
      `[${timeStr}] TLS 1.3 Handshake initiating...`,
      ...prev
    ])

    try {
      const res = await fetch("/api/inspect-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await res.json()
      const finishTime = new Date().toLocaleTimeString()

      if (data.success && data.isProvided) {
        setCrawlLogs((prev) => [
          `[${finishTime}] VERDICT: ${data.isPhishing ? "CRITICAL_TRAP" : "BENIGN"} | Risk score computed.`,
          `[${finishTime}] DOM_ANALYSIS: ${data.detectedTraps?.length || 0} credential trap elements identified.`,
          `[${finishTime}] HOST_INFO: ${data.serverHost}`,
          `[${finishTime}] DOM_FINDING: ${data.riskSummary}`,
          ...prev
        ])
      }
    } catch (e: any) {
      console.error("Crawler fetch error:", e)
    } finally {
      setIsCrawling(false)
    }
  }

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(jsonPayload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ─── OPERATIONAL HEADER & STATUS HUD ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d6ef2f]/15 text-[#d6ef2f] font-mono text-[11px] font-bold tracking-widest uppercase ring-1 ring-[#d6ef2f]/30">
              <span className="w-2 h-2 rounded-full bg-[#d6ef2f] animate-pulse" />
              MODULE B · ACTIVE CRAWLER ENGINE
            </span>
            <span className="text-zinc-600 font-mono text-xs">|</span>
            <span className="font-mono text-xs text-[#edbf75]">MCP-PROTOCOL: v4.81-SEC</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            TinyFish <span className="text-[#ff2a8d] italic font-light">Autonomous</span> Crawler
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Autonomous headless sandboxing, deceptive DOM forensic inspection, and graph-correlated entity spoofing analysis for hostile UPI phishing vectors.
          </p>
        </div>

        {/* Telemetry Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 bg-[#1c1b1d] p-3 rounded-xl ring-1 ring-white/10 shadow-xl">
          <div className="px-4 py-3 bg-[#201f21] rounded-lg flex flex-col">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Sandbox Ping</span>
            <span className="font-mono text-xl text-[#d6ef2f] font-bold mt-0.5">14<span className="text-xs text-zinc-400 font-normal">ms</span></span>
          </div>
          <div className="px-4 py-3 bg-[#201f21] rounded-lg flex flex-col">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Domains Crawled</span>
            <span className="font-mono text-xl text-[#ff2a8d] font-bold mt-0.5">18,409</span>
          </div>
          <div className="px-4 py-3 bg-[#201f21] rounded-lg flex flex-col">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">Spoof Precision</span>
            <span className="font-mono text-xl text-[#edbf75] font-bold mt-0.5">99.98%</span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: URL / TARGET VECTOR DISPATCH BAR ─── */}
      <div className="bg-[#131315] p-5 sm:p-6 rounded-2xl ring-1 ring-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Terminal className="h-5 w-5 text-[#d6ef2f]" />
            <span>Target Vector Dispatch</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>NODE:</span>
            <span className="text-[#d6ef2f] font-bold">MUMBAI-AP-SOUTH-1</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#edbf75]">CHROMIUM HEADLESS 128.0</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 bg-black/70 p-1.5 rounded-xl ring-1 ring-white/10">
          <div className="flex items-center gap-3 px-3 w-full">
            <Globe className="h-5 w-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter suspect SMS URI, shortlink, or IP target..."
              className="w-full bg-transparent text-sm sm:text-base font-mono text-[#d6ef2f] outline-none placeholder-zinc-500"
            />
          </div>
          <button
            onClick={handleDispatch}
            disabled={isCrawling}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#d6ef2f] text-black font-mono text-xs font-bold uppercase tracking-wider hover:scale-102 shadow-[0_0_20px_rgba(214,239,47,0.35)] transition-all disabled:opacity-50"
          >
            {isCrawling ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Crawling DOM...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Dispatch TinyFish</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-zinc-400">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Preload Vectors:</span>
          <button
            onClick={() => {
              setTargetUrl("https://state-electricity-ebill-portal.xyz/pay-instant")
            }}
            className="hover:text-[#d6ef2f] underline decoration-dotted transition-colors"
          >
            Fake State Electricity Portal
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setTargetUrl("https://fastag-kyc-desk.top/update")
            }}
            className="hover:text-[#d6ef2f] underline decoration-dotted transition-colors"
          >
            Fake Fastag KYC Suspend Link
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setTargetUrl("https://billdesk.io/official-pay")
            }}
            className="hover:text-[#d6ef2f] underline decoration-dotted transition-colors"
          >
            Legitimate Official Bill Gateway
          </button>
        </div>
      </div>

      {/* ─── SECTION 2 & 3: HEADLESS DOM SANDBOX & ENTITY SPOOF MATRIX ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Headless DOM Inspection Viewport (7 Cols) */}
        <div className="lg:col-span-7 bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-base font-bold text-white">Headless DOM Render Sandbox</span>
            </div>
            <span className="font-mono text-[10px] font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 ring-1 ring-red-500/40 uppercase">
              Active Honeypot Trap
            </span>
          </div>

          {/* Virtual Browser Window Frame */}
          <div className="bg-black/90 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
            {/* Browser top chrome */}
            <div className="bg-[#1c1b1d] px-4 py-2 flex items-center justify-between font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded text-red-400 font-semibold text-[11px]">
                <LockOpen className="h-3 w-3" />
                <span className="truncate max-w-[280px]">electricity-bill-update-kyc.in/portal/verify-sbi</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#ff2a8d]">ISOLATED EMULATOR</span>
            </div>

            {/* DOM Visual Mockup Screen */}
            <div className="p-6 relative font-sans space-y-4 bg-[#0e0e10]">
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
                <div className="bg-red-600 px-2.5 py-0.5 rounded text-white font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>DECEPTIVE FORM DETECTED</span>
                </div>
                <span className="font-mono text-[10px] text-red-400 bg-black/80 px-2 py-0.5 rounded">
                  Target: /api/stealer.php?dest=tg_bot
                </span>
              </div>

              {/* Fake Phishing Mockup Render */}
              <div className="max-w-md mx-auto bg-[#1c1b1d] p-5 rounded-xl border border-white/10 shadow-inner space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                  <div className="w-8 h-8 rounded bg-[#ff2a8d] flex items-center justify-center font-bold text-white text-xs">
                    SBI
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white leading-tight">Urgent Power Bill Settlement</p>
                    <p className="text-[11px] text-zinc-400">Pending Disconnection Notice #WB-77192</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-white">
                  <div className="bg-[#2a2a2c] p-2.5 rounded-lg space-y-1">
                    <label className="font-mono text-[10px] text-zinc-400 uppercase">Recipient UPI ID</label>
                    <div className="flex items-center justify-between font-mono text-red-400 font-bold">
                      <span>billdesk.mahadiscom@axisbank</span>
                      <span className="text-[9px] uppercase bg-red-500/20 px-1 rounded">Spoofed VPA</span>
                    </div>
                  </div>

                  <div className="bg-[#2a2a2c] p-2.5 rounded-lg space-y-1">
                    <label className="font-mono text-[10px] text-zinc-400 uppercase">Settlement Amount</label>
                    <div className="font-bold text-base text-white">
                      ₹11.00 <span className="text-zinc-500 text-xs font-normal">(Re-Verification Token)</span>
                    </div>
                  </div>

                  {/* Intercepted Input */}
                  <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30 relative">
                    <label className="font-mono text-[10px] text-red-400 font-bold uppercase flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Intercepted Hostile Field: 6-Digit Secret UPI PIN</span>
                    </label>
                    <div className="flex gap-2 mt-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 w-8 rounded bg-black/80 border border-red-500/40 flex items-center justify-center text-[#ff2a8d] font-mono text-base">
                          ●
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full py-2.5 rounded-lg bg-[#ff2a8d]/20 border border-[#ff2a8d]/40 text-[#ffb1c7] font-mono text-[11px] font-bold text-center uppercase tracking-wide">
                    Simulated Intercept: Submission Blocked by TriNETRA
                  </div>
                </div>
              </div>

              {/* Heuristic Callout Markers */}
              <div className="grid grid-cols-3 gap-2 pt-2 font-mono text-[11px]">
                <div className="bg-[#1c1b1d] p-2 rounded-lg flex flex-col">
                  <span className="text-zinc-500 uppercase text-[9px]">Hidden Iframes</span>
                  <span className="text-red-400 font-bold">3 Extracted</span>
                </div>
                <div className="bg-[#1c1b1d] p-2 rounded-lg flex flex-col">
                  <span className="text-zinc-500 uppercase text-[9px]">DOM Keyloggers</span>
                  <span className="text-red-400 font-bold">1 Active Handler</span>
                </div>
                <div className="bg-[#1c1b1d] p-2 rounded-lg flex flex-col">
                  <span className="text-zinc-500 uppercase text-[9px]">PhishTank Crosscheck</span>
                  <span className="text-[#edbf75] font-bold">Positive (98.4%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Entity Spoof Verification Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#ff2a8d]" />
                <span className="text-base font-bold text-white">Entity Identity Matrix</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-red-400 px-2.5 py-0.5 rounded-full bg-red-500/20 ring-1 ring-red-500/30 uppercase">
                CRITICAL MISMATCH
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#1c1b1d] p-3 rounded-xl space-y-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Claimed Institution</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">State Bank of India</span>
                  <span className="font-mono text-[11px] text-[#edbf75]">NPCI Member</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1c1b1d] p-3 rounded-xl space-y-1">
                  <span className="font-mono text-[10px] text-[#d6ef2f] uppercase font-bold">Legitimate Apex</span>
                  <p className="font-mono text-xs text-white truncate">sbi.co.in</p>
                  <p className="font-mono text-[10px] text-zinc-500">Age: 27 Years</p>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#d6ef2f]/20 text-[#d6ef2f] font-mono text-[9px] uppercase">
                    EV SSL Valid
                  </span>
                </div>
                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30 space-y-1">
                  <span className="font-mono text-[10px] text-red-400 uppercase font-bold">Target Domain</span>
                  <p className="font-mono text-xs text-red-300 font-bold truncate">sbi-reward-points.cc</p>
                  <p className="font-mono text-[10px] text-red-400">Age: 2 Days Old</p>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[9px] uppercase">
                    Free Cloudflare Cert
                  </span>
                </div>
              </div>

              <div className="bg-[#1c1b1d] p-3 rounded-xl space-y-2">
                <span className="font-mono text-[10px] text-zinc-400 uppercase">Autonomous Forensic Verdict</span>
                <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="font-mono text-xs text-red-400 font-bold">PHISHING CREDENTIAL HARVESTER</p>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                    High confidence impersonation of SBI YONO UPI gateway. Domain registered through anonymous foreign registrar with redacted WHOIS.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk score gauge */}
            <div className="bg-[#1c1b1d] p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-zinc-400 uppercase">TinyFish Threat Score</p>
                <p className="font-mono text-2xl text-red-400 font-extrabold">98.8 <span className="text-xs text-zinc-500">/ 100</span></p>
                <p className="font-mono text-[10px] text-zinc-500">Severity: L5 Critical Escalation</p>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#27272a" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ff2a8d" strokeDasharray="98, 100" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <span className="absolute font-mono text-[10px] font-bold text-[#ff2a8d]">FATAL</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#edbf75] pt-1">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-[#edbf75]" />
                <span>NPCI Blacklist Dispatched</span>
              </span>
              <span className="text-[#d6ef2f] font-bold">DNS SINKHOLED</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SECTION 4: SCAM GRAPH CORRELATION NEXUS ─── */}
      <div className="bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-[#edbf75]" />
              <h2 className="text-lg font-bold text-white">Scam Graph Correlation Nexus</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live telemetry aggregated across National Cyber Crime Reporting Portal (1930), Chakshu, and Telecom intelligence.
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-[#1c1b1d] font-mono text-xs text-[#d6ef2f] ring-1 ring-white/10">
            Total Correlated Records: 1,429
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1c1b1d] p-4 rounded-xl space-y-2 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#ff2a8d] uppercase">Phone Vector</span>
              <span className="font-mono text-[10px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">61 Reports</span>
            </div>
            <div>
              <p className="font-mono text-base text-white font-bold">+91 98765 41092</p>
              <p className="text-[11px] text-zinc-400">Carrier: Vi (Prepaid / Rajasthan Circle)</p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono flex flex-col gap-0.5 text-zinc-400">
              <span className="text-[#d6ef2f]">Modus: Electricity Disconnection Call</span>
              <span className="text-zinc-500 text-[10px]">First Detected: 3 days ago</span>
            </div>
          </div>

          <div className="bg-[#1c1b1d] p-4 rounded-xl space-y-2 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#edbf75] uppercase">Illicit VPA Node</span>
              <span className="font-mono text-[10px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">119 Reports</span>
            </div>
            <div>
              <p className="font-mono text-base text-white font-bold truncate">elec-bill.desk@axisbank</p>
              <p className="text-[11px] text-zinc-400">Linked Mule: Canara Bank IFSC CNRB00021</p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono flex flex-col gap-0.5 text-zinc-400">
              <span className="text-red-400 font-bold">Cumulative Loss: ₹14,20,500</span>
              <span className="text-zinc-500 text-[10px]">Frozen Status: IN PROCESS (L2)</span>
            </div>
          </div>

          <div className="bg-[#1c1b1d] p-4 rounded-xl space-y-2 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#d6ef2f] uppercase">Hosting Subnet AS</span>
              <span className="font-mono text-[10px] text-[#edbf75] bg-[#2a2a2c] px-1.5 py-0.5 rounded">AS 49505</span>
            </div>
            <div>
              <p className="font-mono text-base text-white font-bold">194.26.29.0/24</p>
              <p className="text-[11px] text-zinc-400">Bulletproof Host: Offshore Gateway</p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono flex flex-col gap-0.5 text-zinc-400">
              <span className="text-[#d6ef2f]">Active Scam Hostnames: 28 Live</span>
              <span className="text-zinc-500 text-[10px]">Cloudflare Bypass: TRUE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 5: LIVE LOGS & RAW STRUCTURED JSON ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Live Log Console (6 Cols) */}
        <div className="lg:col-span-6 bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-[#d6ef2f]" />
                <span className="text-base font-bold text-white">TinyFish Live Crawl Log</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d6ef2f] animate-ping" />
                <span className="font-mono text-[10px] text-[#d6ef2f] uppercase font-bold">STREAMING</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Autonomous worker threads processing remote headers, TLS parameters, and DOM elements.
            </p>
          </div>

          <div className="bg-black/80 p-4 rounded-xl font-mono text-xs space-y-1.5 overflow-x-auto text-zinc-300 max-h-64 overflow-y-auto">
            {crawlLogs.map((log, i) => (
              <div key={i} className="text-zinc-400 leading-relaxed font-mono">
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Buffer Size: 4,096 KB</span>
            <button 
              onClick={() => setCrawlLogs(["[00:00:00.000] LOG BUFFER CLEARED", "[00:00:00.001] Listening for new crawl dispatches..."])}
              className="text-[#d6ef2f] hover:underline uppercase font-bold text-[10px]"
            >
              Clear Telemetry
            </button>
          </div>
        </div>

        {/* Raw JSON Payload (6 Cols) */}
        <div className="lg:col-span-6 bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-[#ff2a8d]" />
                <span className="text-base font-bold text-white">TinyFish Structured JSON Output</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-white uppercase transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Standardized threat event format delivered via webhook to partner banks and UPI apps.
            </p>
          </div>

          <div className="bg-black/80 p-4 rounded-xl overflow-x-auto text-white">
            <pre className="font-mono text-xs leading-relaxed text-zinc-300">
              {jsonPayload}
            </pre>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Payload Size: 1.2 KB</span>
            <span className="text-[#edbf75] font-bold">API STATUS: 200 OK</span>
          </div>
        </div>

      </div>

    </div>
  )
}
