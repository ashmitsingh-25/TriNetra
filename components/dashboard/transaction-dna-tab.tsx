"use client"

import React, { useState } from "react"
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  CircleDot, 
  Fingerprint, 
  Download, 
  Radio, 
  Search, 
  SlidersHorizontal, 
  Network, 
  Check, 
  RefreshCw 
} from "lucide-react"

export default function TransactionDnaTab() {
  const [filterQuery, setFilterQuery] = useState("")
  const [hoveredCluster, setHoveredCluster] = useState<string>("WAVE #104")
  const [broadcastActive, setBroadcastActive] = useState(false)
  const [dispatchedClusters, setDispatchedClusters] = useState<Record<string, boolean>>({})

  const [targets, setTargets] = useState({
    npci: true,
    trai: true,
    psps: true,
  })

  const clustersData = [
    {
      id: "WAVE-104",
      name: "Fake Electricity Bill Arrears",
      desc: "Mahavitaran / BESCOM Urgent SMS redirecting to dynamic UPI Intent",
      target: ["SBI UPI", "PhonePe"],
      velocity: "+420 attempts/hr",
      firstSeen: "00:14:22 ago",
      status: "Rapid Surge",
      statusColor: "text-red-400 bg-red-500/20",
      actionText: "Broadcast Block",
    },
    {
      id: "WAVE-092",
      name: "Physical Soundbox / Merchant QR Sticker Overlay",
      desc: "Dynamic payload injection swapping merchant beneficiary VPA",
      target: ["Paytm QR", "BharatPe"],
      velocity: "+118 attempts/hr",
      firstSeen: "02:41:09 ago",
      status: "Active Vector",
      statusColor: "text-[#d6ef2f] bg-[#d6ef2f]/20",
      actionText: "Revoke VPA Hash",
    },
    {
      id: "WAVE-089",
      name: "Coercive Instant Loan Repayment Spoof",
      desc: "Sideloaded APK extracting contact book & automating collect triggers",
      target: ["ICICI iMobile", "GPay"],
      velocity: "+64 attempts/hr",
      firstSeen: "05:12:30 ago",
      status: "Contained (L3)",
      statusColor: "text-zinc-400 bg-zinc-700/30",
      actionText: "View Dossier",
    },
    {
      id: "WAVE-064",
      name: "Telegram Task Scam & Ponzi Mule Funnel",
      desc: "Layered transfers across tier-3 student savings accounts",
      target: ["Airtel Payments", "Axis Bank"],
      velocity: "+29 attempts/hr",
      firstSeen: "14:02:11 ago",
      status: "Mitigated",
      statusColor: "text-emerald-400 bg-emerald-500/20",
      actionText: "Archive Log",
    },
  ]

  const filteredClusters = clustersData.filter(
    (c) =>
      c.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const handleDispatch = (clusterId: string) => {
    setDispatchedClusters((prev) => ({ ...prev, [clusterId]: true }))
    setTimeout(() => {
      alert(`Mitigation Rule for ${clusterId} successfully broadcast to NPCI Central Switch and 42 Banking Gateways!`)
    }, 200)
  }

  const handleBroadcastAll = () => {
    setBroadcastActive(true)
    setTimeout(() => {
      setBroadcastActive(false)
      alert("Autonomous Sentinel Rule Broadcast sent to NPCI UPI Switch, TRAI DLT, and PSP Networks.")
    }, 1200)
  }

  return (
    <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ─── TOP HEADER & TELEMETRY STREAM ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2a8d]/15 text-[#ff2a8d] font-mono text-[11px] uppercase tracking-widest ring-1 ring-[#ff2a8d]/30">
              <span className="w-2 h-2 rounded-full bg-[#ff2a8d] animate-ping" />
              MODULE C // HDBSCAN ENGINE
            </span>
            <span className="text-zinc-500 font-mono text-xs">
              EPS=0.38 · MIN_SAMPLES=14 · DIM_REDUCTION=UMAP-2D
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#d6ef2f] font-mono text-[11px]">
              NEURAL CLUSTER V3.8
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Transaction DNA &amp; <span className="text-[#ff2a8d] italic font-light">Emerging Scam Waves</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Unsupervised HDBSCAN vector embeddings continuously segment UPI recipient telemetries, isolating emergent zero-day synthetic extortion cartels before NPCI settlement reconciliation.
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-4 shrink-0 bg-[#1c1b1d] p-4 rounded-xl ring-1 ring-white/10 shadow-xl">
          <div className="flex flex-col border-r border-white/10 pr-4">
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">ACTIVE CLUSTERS</span>
            <span className="font-mono text-2xl text-white font-black">47</span>
          </div>
          <div className="flex flex-col border-r border-white/10 pr-4">
            <span className="font-mono text-[10px] text-[#ff2a8d] uppercase tracking-wider">ZERO-DAY WAVES</span>
            <span className="font-mono text-2xl text-[#ff2a8d] font-black">06</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#d6ef2f] uppercase tracking-wider">GLOBAL MITIGATION</span>
            <span className="font-mono text-2xl text-[#d6ef2f] font-black">99.84%</span>
          </div>
        </div>
      </div>

      {/* ─── URGENT WAVE ALERT BANNER ─── */}
      <div className="w-full bg-[#201f21] rounded-2xl p-5 ring-1 ring-red-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ff2a8d]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0 ring-1 ring-red-500/40 shadow-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-white">
                WAVE #104: Fake Mahavitaran Disconnection Extortion
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider ring-1 ring-red-500/40">
                CRITICAL SPREAD · R_0 = 4.8
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-400 mt-1">
              Attack Surface: SMS Push &gt; Malicious APK (QuickSupport spoof) &gt; Dynamic collect injection.{" "}
              <span className="text-[#ff2a8d] font-semibold">420 vectors/hr</span> detected across Western Maharashtra grid.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 relative z-10 w-full md:w-auto justify-end">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-mono text-[10px] text-zinc-400 uppercase">NOVELTY INDEX</span>
            <span className="font-mono text-base font-bold text-[#ff2a8d]">0.94 / 1.00</span>
          </div>
          <button
            onClick={() => handleDispatch("WAVE-104")}
            className="w-full md:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(255,42,141,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Push Immediate NPCI Rule</span>
          </button>
        </div>
      </div>

      {/* ─── BENTO GRID: 2D SCATTER MAP (8 COLS) + FEATURE RADAR (4 COLS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 2D Embedding Scatter Map (8 Cols) */}
        <div className="lg:col-span-8 bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-[#d6ef2f]" />
              <h2 className="text-lg font-bold text-white">HDBSCAN High-Dimensional Embedding Map</h2>
            </div>
            <div className="flex items-center gap-2 bg-[#201f21] px-3 py-1 rounded-full text-zinc-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#d6ef2f]" />
              <span>Live UMAP Projection (28D → 2D)</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Each plotted point constitutes a single high-velocity UPI session. Points grouped by proximity share identical linguistic sentiment triggers, transaction interval bursts, and reverse APK callout signatures.
          </p>

          {/* Interactive SVG Scatter Canvas */}
          <div className="relative w-full h-[400px] bg-black/70 rounded-xl ring-1 ring-white/10 p-2 overflow-hidden">
            {/* Grid background */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* SVG Graph */}
            <svg viewBox="0 0 800 400" className="w-full h-full relative z-10 select-none">
              {/* Normal Safe Transactions Fog */}
              <g fill="#3f3f46" opacity="0.6">
                {[
                  [120, 180], [140, 190], [110, 210], [130, 230], [160, 170],
                  [175, 220], [190, 195], [145, 160], [210, 215], [180, 240]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3" />
                ))}
              </g>
              <text x="135" y="145" fill="#a1a1aa" fontFamily="monospace" fontSize="11" opacity="0.7">
                Cluster #01: Verified P2P Retail
              </text>

              {/* Cluster Alpha: Loan App APK Extortion (Amber/Orange) */}
              <g 
                className="cursor-pointer transition-transform hover:scale-105 duration-200"
                onClick={() => setHoveredCluster("CLUSTER #89: Fake Micro-Credit")}
                onMouseEnter={() => setHoveredCluster("CLUSTER #89: Fake Micro-Credit")}
              >
                <path d="M 280,100 Q 320,80 380,110 T 360,170 T 290,150 Z" fill="#b38a45" fillOpacity="0.15" />
                {[
                  [300, 120], [320, 105], [340, 130], [310, 145], [355, 115], [335, 155], [370, 140]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#edbf75" />
                ))}
                <text x="305" y="85" fill="#edbf75" fontFamily="monospace" fontSize="11" fontWeight="700">
                  CLUSTER #89: Fake Micro-Credit Coercion
                </text>
              </g>

              {/* Cluster Beta: Electricity SMS Scam Wave 104 (CRITICAL Magenta / Neon Pulse) */}
              <g 
                className="cursor-pointer"
                onClick={() => setHoveredCluster("WAVE #104: Mahavitaran Exploit")}
                onMouseEnter={() => setHoveredCluster("WAVE #104: Mahavitaran Exploit")}
              >
                <circle cx="580" cy="140" r="65" fill="#ff2a8d" fillOpacity="0.12" />
                <circle cx="580" cy="140" r="45" fill="#ff2a8d" fillOpacity="0.22" className="animate-pulse" />
                {[
                  [560, 130], [580, 115], [600, 135], [575, 155], [595, 165], [615, 125], [550, 150]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="5.5" fill="#ff2a8d" />
                ))}
                <circle cx="585" cy="140" r="8" fill="#ff2a8d" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="585" y1="140" x2="670" y2="90" stroke="#ff2a8d" strokeWidth="1.5" strokeDasharray="3,3" />
                <polygon points="675,87 662,88 668,97" fill="#ff2a8d" />
                <text x="680" y="85" fill="#ffb1c7" fontFamily="monospace" fontSize="11" fontWeight="700">
                  ZERO-DAY OUTLIER TRAJECTORY
                </text>
                <text x="510" y="60" fill="#ffb1c7" fontFamily="monospace" fontSize="12" fontWeight="800">
                  WAVE #104 (MAHAVITARAN EXPLOIT)
                </text>
              </g>

              {/* Cluster Gamma: QR Code Re-direction Injection (Chartreuse) */}
              <g 
                className="cursor-pointer"
                onClick={() => setHoveredCluster("CLUSTER #92: Merchant QR Hijack")}
                onMouseEnter={() => setHoveredCluster("CLUSTER #92: Merchant QR Hijack")}
              >
                <path d="M 460,260 Q 520,240 560,280 T 520,340 T 450,300 Z" fill="#bdd501" fillOpacity="0.12" />
                {[
                  [480, 275], [505, 265], [530, 290], [495, 310], [540, 315], [470, 295]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#d9f232" />
                ))}
                <text x="440" y="360" fill="#d9f232" fontFamily="monospace" fontSize="11" fontWeight="700">
                  CLUSTER #92: Merchant QR Overlay Hijack
                </text>
              </g>

              {/* Cluster Delta: Crypto P2P Fast Hop Launderers */}
              <g fill="#a1a1aa" opacity="0.85">
                {[
                  [210, 320], [230, 305], [250, 335], [220, 345], [265, 315]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3.8" />
                ))}
              </g>
              <text x="180" y="375" fill="#a1a1aa" fontFamily="monospace" fontSize="11">
                Cluster #71: Crypto OTC P2P Laundering
              </text>
            </svg>

            {/* Floating Inspection HUD Tooltip */}
            <div className="absolute bottom-4 right-4 bg-[#1c1b1d]/95 p-3 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-1 font-mono text-xs pointer-events-none max-w-xs">
              <div className="flex items-center justify-between text-white">
                <span className="font-bold">INSPECTION FOCUS:</span>
                <span className="text-[#ff2a8d] font-bold">{hoveredCluster}</span>
              </div>
              <div className="text-zinc-400 flex justify-between text-[11px]">
                <span>Entropy Shift:</span>
                <span className="text-white">+3.42 sigma</span>
              </div>
              <div className="text-zinc-400 flex justify-between text-[11px]">
                <span>Centroid Vector:</span>
                <span className="text-white">[0.88, -0.42, 0.91]</span>
              </div>
              <div className="text-zinc-400 flex justify-between text-[11px]">
                <span>Total Flagged:</span>
                <span className="text-[#ff2a8d] font-bold">1,894 sessions</span>
              </div>
            </div>
          </div>

          {/* Legend and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff2a8d]" /> Zero-Day Emergent</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#d6ef2f]" /> QR Hijack Vector</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#edbf75]" /> Coercive Extortion</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-zinc-600" /> Benign Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setHoveredCluster("WAVE #104: Mahavitaran Exploit")} className="px-3 py-1 rounded bg-[#201f21] text-zinc-300 hover:text-white transition-colors">Reset Center</button>
            </div>
          </div>
        </div>

        {/* Right: Feature Attribution Hexagon Radar (4 Cols) */}
        <div className="lg:col-span-4 bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#ff2a8d]">
                <Fingerprint className="h-4 w-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">DNA POLYGON PROFILE</span>
              </div>
              <span className="font-mono text-xs text-[#d6ef2f] font-bold">HASH: #0x9F41</span>
            </div>
            <h3 className="text-base font-bold text-white">Vector Metric Breakdown</h3>
            <p className="text-xs text-zinc-400">
              Multi-axis feature attribution derived from real-time NLP intent parsing, payload inspection, and device trust signals.
            </p>
          </div>

          {/* Hexagonal Radar SVG */}
          <div className="w-full flex items-center justify-center py-2">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Concentric Hexagons */}
                <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#27272a" strokeWidth="1" />
                <polygon points="100,45 149,73 149,127 100,155 51,127 51,73" fill="none" stroke="#27272a" strokeWidth="1" />
                <polygon points="100,70 128,86 128,114 100,130 72,114 72,86" fill="none" stroke="#27272a" strokeWidth="1" />
                
                {/* Axis Rays */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="#27272a" strokeWidth="1" />
                <line x1="100" y1="100" x2="170" y2="60" stroke="#27272a" strokeWidth="1" />
                <line x1="100" y1="100" x2="170" y2="140" stroke="#27272a" strokeWidth="1" />
                <line x1="100" y1="100" x2="100" y2="180" stroke="#27272a" strokeWidth="1" />
                <line x1="100" y1="100" x2="30" y2="140" stroke="#27272a" strokeWidth="1" />
                <line x1="100" y1="100" x2="30" y2="60" stroke="#27272a" strokeWidth="1" />

                {/* Safe Baseline Polygon */}
                <polygon points="100,75 120,88 120,112 100,125 80,112 80,88" fill="#d6ef2f" fillOpacity="0.15" stroke="#d6ef2f" strokeWidth="1.5" />

                {/* Wave #104 High Anomaly Signature (Magenta) */}
                <polygon points="100,24 162,68 155,132 100,165 42,125 36,65" fill="#ff2a8d" fillOpacity="0.4" stroke="#ff2a8d" strokeWidth="2.5" />
              </svg>

              {/* Labels */}
              <span className="absolute top-0 text-[9px] font-mono text-[#ff2a8d] font-bold">BURST VELOCITY</span>
              <span className="absolute top-10 right-0 text-[9px] font-mono text-zinc-400 font-bold">VPA ENTROPY</span>
              <span className="absolute bottom-10 right-0 text-[9px] font-mono text-[#ff2a8d] font-bold">LINGUISTIC COERCION</span>
              <span className="absolute bottom-0 text-[9px] font-mono text-[#edbf75] font-bold">QR REDIRECT HOPS</span>
              <span className="absolute bottom-10 left-0 text-[9px] font-mono text-zinc-400 font-bold">DEVICE SPOOF</span>
              <span className="absolute top-10 left-0 text-[9px] font-mono text-[#ff2a8d] font-bold">RECIPIENT AGE</span>
            </div>
          </div>

          {/* Metric Details list */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c1b1d]">
              <span className="text-zinc-400">Temporal Burstiness:</span>
              <span className="text-[#ff2a8d] font-bold">98.2 / 100 [EXTREME]</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c1b1d]">
              <span className="text-zinc-400">Linguistic Urgency (NLP):</span>
              <span className="text-[#ff2a8d] font-bold">0.96 (&ldquo;DISCONNECT AT 9:30&rdquo;)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c1b1d]">
              <span className="text-zinc-400">VPA Domain Obfuscation:</span>
              <span className="text-[#edbf75] font-bold">High (3 Subdomains)</span>
            </div>
          </div>

          <button 
            onClick={() => alert("HDBSCAN Vector Tensor (.npy) exported for Python/PyTorch analysis.")}
            className="w-full py-2.5 rounded-full bg-[#201f21] text-white font-mono text-xs hover:bg-[#2a2a2c] transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export HDBSCAN Vector Tensor (.npy)</span>
          </button>
        </div>

      </div>

      {/* ─── ACTIVE SCAM CAMPAIGN CLUSTER REGISTRY TABLE ─── */}
      <div className="w-full bg-[#131315] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-[#ff2a8d]" />
              <h2 className="text-lg font-bold text-white">Active Scam Campaign Cluster Registry</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live catalog of identified attack archetypes ranked by spreading velocity and victim blast radius.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-full ring-1 ring-white/10">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by VPA, Bank, or SMS pattern..."
                className="bg-transparent text-xs font-mono text-white outline-none w-56 placeholder-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#1c1b1d] text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 rounded-l-lg">Cluster ID</th>
                <th className="py-3 px-4">Vector Pattern &amp; Payload</th>
                <th className="py-3 px-4">Target Ecosystem</th>
                <th className="py-3 px-4">Victim Velocity</th>
                <th className="py-3 px-4">First Seen</th>
                <th className="py-3 px-4">Threat Status</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Action Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClusters.map((cluster) => {
                const isDispatched = dispatchedClusters[cluster.id]

                return (
                  <tr key={cluster.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#ff2a8d] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff2a8d] animate-ping" />
                      #{cluster.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{cluster.name}</span>
                        <span className="text-zinc-400 text-[11px]">{cluster.desc}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {cluster.target.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-400">
                      {cluster.velocity}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{cluster.firstSeen}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cluster.statusColor}`}>
                        {cluster.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDispatch(cluster.id)}
                        disabled={isDispatched}
                        className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all ${
                          isDispatched
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-[#ff2a8d] text-white hover:opacity-90 shadow-sm"
                        }`}
                      >
                        {isDispatched ? "Rule Broadcasted" : cluster.actionText}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── INTER-BANK DISPATCH BUS ─── */}
      <div className="w-full bg-[#201f21] rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col lg:flex-row items-stretch justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#d6ef2f]">
            <Network className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">INTER-BANK DISPATCH BUS</span>
          </div>
          <h3 className="text-lg font-bold text-white">Autonomous Sentinel Rule Broadcast</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Push freshly isolated HDBSCAN regex patterns directly to NPCI Central Rulebook, partner payment gateways, and Telecom SMS Scrubber filters to neutralize delivery infrastructure simultaneously.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-black/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={targets.npci}
                onChange={(e) => setTargets({ ...targets, npci: e.target.checked })}
                className="accent-[#ff2a8d] h-4 w-4 rounded"
              />
              <span className="font-mono text-xs text-white">NPCI UPI Switch</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-black/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={targets.trai}
                onChange={(e) => setTargets({ ...targets, trai: e.target.checked })}
                className="accent-[#ff2a8d] h-4 w-4 rounded"
              />
              <span className="font-mono text-xs text-white">TRAI DLT SMS Filter</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-black/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={targets.psps}
                onChange={(e) => setTargets({ ...targets, psps: e.target.checked })}
                className="accent-[#ff2a8d] h-4 w-4 rounded"
              />
              <span className="font-mono text-xs text-white">Major PSP Gateways</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-black/60 p-4 rounded-xl gap-4 w-full lg:w-80 shrink-0">
          <div className="flex flex-col gap-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span>QUEUE STATUS:</span>
              <span className="text-[#d6ef2f] font-bold">READY (0 PENDING)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>API SYNC LATENCY:</span>
              <span className="text-white font-bold">8.4ms</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>LAST RULE REVISION:</span>
              <span className="text-zinc-300">Just now</span>
            </div>
          </div>

          <button
            onClick={handleBroadcastAll}
            disabled={broadcastActive}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff2a8d]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {broadcastActive ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Broadcasting to NPCI...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Execute Multi-Target Sync</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
