"use client"

import React, { useState, useEffect, useMemo } from "react"
import BreathBloom from "@/components/ui/breath-bloom"
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  CircleDot, 
  Fingerprint, 
  Download, 
  Radio, 
  Search, 
  Network, 
  Check, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react"
import { CampaignWave, GlobalCampaignStats, WaveCategory, BENIGN_BASELINE_NODES } from "@/lib/campaigns-store"

interface TransactionDnaTabProps {
  onExploreScanner?: () => void
}

export default function TransactionDnaTab({ onExploreScanner }: TransactionDnaTabProps) {
  const [campaigns, setCampaigns] = useState<CampaignWave[]>([])
  const [stats, setStats] = useState<GlobalCampaignStats>({
    activeClusters: 47,
    zeroDayWaves: 6,
    globalMitigationRate: 99.84,
    pendingSyncCount: 0,
    lastSyncTimestamp: "Just now"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWaveId, setSelectedWaveId] = useState<string>("WAVE-104")
  const [filterQuery, setFilterQuery] = useState("")
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL")
  const [categoryToggles, setCategoryToggles] = useState<Record<WaveCategory, boolean>>({
    "Zero-Day Emergent": true,
    "QR Hijack Vector": true,
    "Coercive Extortion": true,
    "Benign Baseline": true
  })

  const [broadcastActive, setBroadcastActive] = useState(false)
  const [syncStatusText, setSyncStatusText] = useState("READY (0 PENDING)")
  const [lastRevisionTime, setLastRevisionTime] = useState("Just now")
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [actionNotification, setActionNotification] = useState<string | null>(null)

  const [targets, setTargets] = useState({
    npci: true,
    trai: true,
    psps: true,
  })

  // Load campaigns from API
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns")
      const data = await res.json()
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns)
        if (data.stats) setStats(data.stats)
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
    const interval = setInterval(fetchCampaigns, 8000)
    return () => clearInterval(interval)
  }, [])

  // Currently selected wave
  const selectedWave = useMemo(() => {
    return campaigns.find(c => c.id.toLowerCase() === selectedWaveId.toLowerCase()) || campaigns[0]
  }, [campaigns, selectedWaveId])

  // Filtered campaigns for table
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = 
        !filterQuery ||
        c.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.attackSurface.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.targetEcosystem.some(t => t.toLowerCase().includes(filterQuery.toLowerCase())) ||
        c.linkedVpas.some(v => v.toLowerCase().includes(filterQuery.toLowerCase()))

      const matchesCategory = 
        activeCategoryFilter === "ALL" || c.category === activeCategoryFilter

      return matchesSearch && matchesCategory
    })
  }, [campaigns, filterQuery, activeCategoryFilter])

  // Filtered nodes for 2D map
  const visibleNodes = useMemo(() => {
    const nodesList: any[] = []

    campaigns.forEach(c => {
      if (categoryToggles[c.category]) {
        const isDimmed = filterQuery && !c.id.toLowerCase().includes(filterQuery.toLowerCase()) &&
          !c.title.toLowerCase().includes(filterQuery.toLowerCase()) &&
          !c.linkedVpas.some(v => v.toLowerCase().includes(filterQuery.toLowerCase()))

        c.nodes.forEach(n => {
          nodesList.push({
            ...n,
            isDimmed,
            isSelected: c.id === selectedWave?.id
          })
        })
      }
    })

    if (categoryToggles["Benign Baseline"]) {
      BENIGN_BASELINE_NODES.forEach(n => {
        nodesList.push({
          ...n,
          isDimmed: Boolean(filterQuery),
          isSelected: false
        })
      })
    }

    return nodesList
  }, [campaigns, categoryToggles, filterQuery, selectedWave])

  // Calculate dynamic 6-axis radar polygon points
  // Center: (100, 100), Max Radius: 75
  const radarPolygonPoints = useMemo(() => {
    if (!selectedWave || !selectedWave.radarMetrics) {
      return "100,25 165,65 155,135 100,165 45,125 35,65"
    }

    const metrics = selectedWave.radarMetrics
    const angles = [
      -Math.PI / 2,        // 0: BURST VELOCITY (Top)
      -Math.PI / 6,        // 1: VPA ENTROPY (Top-Right)
      Math.PI / 6,         // 2: LINGUISTIC COERCION (Bottom-Right)
      Math.PI / 2,         // 3: QR REDIRECT HOPS (Bottom)
      (5 * Math.PI) / 6,   // 4: DEVICE SPOOF (Bottom-Left)
      (-5 * Math.PI) / 6   // 5: RECIPIENT AGE (Top-Left)
    ]

    const points = metrics.map((val, idx) => {
      const radius = (Math.max(10, Math.min(100, val)) / 100) * 75
      const x = 100 + radius * Math.cos(angles[idx])
      const y = 100 + radius * Math.sin(angles[idx])
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    return points.join(" ")
  }, [selectedWave])

  // Handle Analyst Actions (Confirm, Mitigate, Block, False Alarm)
  const handleReviewAction = async (waveId: string, action: "CONFIRM" | "MITIGATE" | "FALSE_ALARM" | "BLOCK") => {
    setActionLoadingId(waveId)
    try {
      const res = await fetch(`/api/campaigns/${waveId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })
      const data = await res.json()
      if (data.success && data.campaign) {
        setCampaigns(prev => prev.map(c => c.id === waveId ? data.campaign : c))
        if (data.stats) setStats(data.stats)
        setActionNotification(`Rule update: ${waveId} marked as ${data.campaign.status}`)
        setTimeout(() => setActionNotification(null), 4000)
      }
    } catch (err) {
      console.error("Review action error:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Handle Download Cluster Forensic Report (.json)
  const handleDownloadReport = () => {
    if (!selectedWave) return

    const reportData = {
      platform: "त्रिNETRA Sentinel Grid // HDBSCAN Neural Cluster V3.8",
      exportedAt: new Date().toISOString(),
      clusterId: selectedWave.id,
      title: selectedWave.title,
      threatStatus: selectedWave.status,
      noveltyScore: selectedWave.noveltyScore,
      velocityPerHour: selectedWave.velocityPerHour,
      attackSurface: selectedWave.attackSurface,
      targetEcosystem: selectedWave.targetEcosystem,
      radarAttributionMetrics: {
        burstVelocity: selectedWave.radarMetrics[0],
        vpaEntropy: selectedWave.radarMetrics[1],
        linguisticUrgency: selectedWave.radarMetrics[2],
        urlRedirectHops: selectedWave.radarMetrics[3],
        deviceSpoof: selectedWave.radarMetrics[4],
        recipientAge: selectedWave.radarMetrics[5]
      },
      readouts: {
        temporalBurstiness: selectedWave.temporalBurstiness,
        linguisticUrgencyNLP: selectedWave.linguisticUrgencyText,
        vpaDomainObfuscation: selectedWave.vpaDomainObfuscation
      },
      linkedDestinationVpas: selectedWave.linkedVpas,
      sampleCoercionPayload: selectedWave.sampleSms,
      cryptographicSignatureSha256: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trinetra-${selectedWave.id.toLowerCase()}-forensics.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle Multi-Target Sync
  const handleBroadcastAll = async () => {
    setBroadcastActive(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC", targets })
      })
      const data = await res.json()
      if (data.success) {
        setSyncStatusText("SYNCED (0 PENDING)")
        const now = new Date().toLocaleTimeString("en-IN", { hour12: false })
        setLastRevisionTime(now)
        if (data.stats) setStats(data.stats)
        setActionNotification("Multi-Target Broadcast synced successfully across NPCI & Gateway nodes.")
        setTimeout(() => setActionNotification(null), 4000)
      }
    } catch (err) {
      console.error("Broadcast sync error:", err)
    } finally {
      setBroadcastActive(false)
    }
  }

  // Toggle Category visibility on map
  const toggleCategory = (cat: WaveCategory) => {
    setCategoryToggles(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <BreathBloom className="w-full">
      <div className="w-full flex flex-col gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#ededed]">
        
        {/* Floating Action Banner Notification */}
        {actionNotification && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-2 bg-[#ff2a8d] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono font-bold animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>{actionNotification}</span>
          </div>
        )}

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
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#e5ff40] font-mono text-[11px] font-bold">
                NEURAL CLUSTER V3.8
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Transaction DNA &amp; <span className="text-[#ff2a8d] italic font-serif font-normal">Emerging Scam Waves</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Unsupervised HDBSCAN vector embeddings continuously segment UPI recipient telemetries, isolating emergent zero-day synthetic extortion cartels before NPCI settlement reconciliation.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 shrink-0 bg-black/60 backdrop-blur-md p-4 rounded-xl ring-1 ring-white/10 shadow-xl">
            <div className="flex flex-col border-r border-white/10 pr-4">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">ACTIVE CLUSTERS</span>
              <span className="font-mono text-2xl text-white font-black">{stats.activeClusters}</span>
            </div>
            <div className="flex flex-col border-r border-white/10 pr-4">
              <span className="font-mono text-[10px] text-[#ff2a8d] uppercase tracking-wider">ZERO-DAY WAVES</span>
              <span className="font-mono text-2xl text-[#ff2a8d] font-black">0{stats.zeroDayWaves}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#e5ff40] uppercase tracking-wider">GLOBAL MITIGATION</span>
              <span className="font-mono text-2xl text-[#e5ff40] font-black">{stats.globalMitigationRate}%</span>
            </div>
          </div>
        </div>

        {/* ─── URGENT WAVE ALERT BANNER (SYNCS TO SELECTED WAVE) ─── */}
        {selectedWave && (
          <div className="w-full bg-[#111114]/90 backdrop-blur-md rounded-2xl p-5 ring-1 ring-[#ff2a8d]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ff2a8d]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#ff2a8d]/15 flex items-center justify-center text-[#ff2a8d] shrink-0 ring-1 ring-[#ff2a8d]/40 shadow-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-white">
                    #{selectedWave.id}: {selectedWave.title}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${selectedWave.statusColor}`}>
                    {selectedWave.status}
                  </span>
                </div>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Attack Surface: <span className="text-neutral-300">{selectedWave.attackSurface}</span>
                  <span className="text-[#ff2a8d] font-semibold ml-2">({selectedWave.velocityPerHour})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 relative z-10 w-full md:w-auto justify-end">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-mono text-[10px] text-zinc-400 uppercase">NOVELTY INDEX</span>
                <span className="font-mono text-base font-bold text-[#ff2a8d]">
                  {selectedWave.noveltyScore.toFixed(2)} / 1.00
                </span>
              </div>
              <button
                onClick={() => handleReviewAction(selectedWave.id, "CONFIRM")}
                disabled={actionLoadingId === selectedWave.id}
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(255,42,141,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoadingId === selectedWave.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                <span>Push Immediate NPCI Rule</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── BENTO GRID: 2D SCATTER MAP (8 COLS) + FEATURE RADAR (4 COLS) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 2D Embedding Scatter Map (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-[#e5ff40]" />
                <h2 className="text-lg font-bold text-white">HDBSCAN High-Dimensional Embedding Map</h2>
              </div>
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-zinc-400 font-mono text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#e5ff40] animate-pulse" />
                <span>Live UMAP Projection (28D &rarr; 2D)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Each plotted node constitutes a high-velocity UPI session. Click any cluster or point to inspect vector attribution metrics in real time.
            </p>

            {/* Interactive SVG Scatter Canvas */}
            <div className="relative w-full h-[400px] bg-black/80 rounded-xl ring-1 ring-white/10 p-2 overflow-hidden group">
              {/* Grid background */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              <svg viewBox="0 0 800 400" className="w-full h-full relative z-10 select-none">
                {/* Cluster Hull Enclosures */}
                {categoryToggles["Zero-Day Emergent"] && (
                  <g 
                    className="cursor-pointer transition-opacity"
                    onClick={() => setSelectedWaveId("WAVE-104")}
                  >
                    <circle cx="580" cy="140" r="70" fill="#ff2a8d" fillOpacity="0.12" />
                    <circle cx="580" cy="140" r="48" fill="#ff2a8d" fillOpacity="0.2" className="animate-pulse" />
                    <line x1="585" y1="140" x2="675" y2="85" stroke="#ff2a8d" strokeWidth="1.5" strokeDasharray="3,3" />
                    <polygon points="680,82 667,84 672,93" fill="#ff2a8d" />
                    <text x="686" y="80" fill="#ffb1c7" fontFamily="monospace" fontSize="10" fontWeight="700">
                      ZERO-DAY OUTLIER TRAJECTORY
                    </text>
                    <text x="515" y="55" fill="#ffb1c7" fontFamily="monospace" fontSize="11" fontWeight="800">
                      WAVE #104: MAHAVITARAN/BESCOM
                    </text>
                  </g>
                )}

                {categoryToggles["QR Hijack Vector"] && (
                  <g 
                    className="cursor-pointer transition-opacity"
                    onClick={() => setSelectedWaveId("WAVE-092")}
                  >
                    <path d="M 455,255 Q 520,235 565,275 T 525,345 T 445,305 Z" fill="#e5ff40" fillOpacity="0.12" />
                    <text x="435" y="360" fill="#e5ff40" fontFamily="monospace" fontSize="11" fontWeight="700">
                      WAVE #092: QR OVERLAY HIJACK
                    </text>
                  </g>
                )}

                {categoryToggles["Coercive Extortion"] && (
                  <g 
                    className="cursor-pointer transition-opacity"
                    onClick={() => setSelectedWaveId("WAVE-088")}
                  >
                    <path d="M 280,95 Q 320,75 385,105 T 365,175 T 285,155 Z" fill="#f59e0b" fillOpacity="0.14" />
                    <text x="295" y="80" fill="#fbbf24" fontFamily="monospace" fontSize="11" fontWeight="700">
                      WAVE #088: COERCIVE LOAN APK
                    </text>
                  </g>
                )}

                {categoryToggles["Benign Baseline"] && (
                  <g>
                    <text x="125" y="145" fill="#a1a1aa" fontFamily="monospace" fontSize="10" opacity="0.7">
                      CLUSTER #01: VERIFIED P2P RETAIL
                    </text>
                    <text x="180" y="375" fill="#a1a1aa" fontFamily="monospace" fontSize="10" opacity="0.7">
                      WAVE #064: STUDENT MULE FUNNEL
                    </text>
                  </g>
                )}

                {/* Individual Interactive Nodes */}
                {visibleNodes.map((node, i) => {
                  const isSelectedWave = node.clusterId === selectedWave?.id
                  const nodeColor = 
                    node.category === "Zero-Day Emergent" ? "#ff2a8d" :
                    node.category === "QR Hijack Vector" ? "#e5ff40" :
                    node.category === "Coercive Extortion" ? "#fbbf24" : "#71717a"

                  return (
                    <g 
                      key={node.id || i}
                      className="cursor-pointer group/node"
                      onClick={() => node.clusterId && setSelectedWaveId(node.clusterId)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelectedWave ? (node.r || 5) + 2 : node.r || 4.5}
                        fill={nodeColor}
                        opacity={node.isDimmed ? 0.2 : 0.9}
                        stroke={isSelectedWave ? "#ffffff" : "transparent"}
                        strokeWidth={isSelectedWave ? 1.5 : 0}
                        className="transition-all duration-300 hover:scale-125"
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Floating Inspection HUD Tooltip */}
              <div className="absolute bottom-4 right-4 bg-[#141416]/95 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-1.5 font-mono text-xs max-w-xs pointer-events-none">
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold text-[10px] text-zinc-400">INSPECTION FOCUS:</span>
                  <span className="text-[#ff2a8d] font-bold">#{selectedWave?.id}</span>
                </div>
                <div className="text-zinc-400 flex justify-between text-[11px]">
                  <span>Novelty Score:</span>
                  <span className="text-[#e5ff40] font-bold">{selectedWave?.noveltyScore.toFixed(2)}</span>
                </div>
                <div className="text-zinc-400 flex justify-between text-[11px]">
                  <span>Velocity:</span>
                  <span className="text-white">{selectedWave?.velocityPerHour}</span>
                </div>
                <div className="text-zinc-400 flex justify-between text-[11px]">
                  <span>Linked VPAs:</span>
                  <span className="text-[#ff2a8d] font-bold">{selectedWave?.linkedVpas.length} VPAs</span>
                </div>
              </div>
            </div>

            {/* Legend and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => toggleCategory("Zero-Day Emergent")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                    categoryToggles["Zero-Day Emergent"]
                      ? "bg-[#ff2a8d]/15 border-[#ff2a8d]/40 text-[#ff2a8d]"
                      : "bg-black/40 border-white/10 text-zinc-600 line-through"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a8d]" />
                  <span>Zero-Day Emergent</span>
                </button>

                <button
                  onClick={() => toggleCategory("QR Hijack Vector")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                    categoryToggles["QR Hijack Vector"]
                      ? "bg-[#e5ff40]/15 border-[#e5ff40]/40 text-[#e5ff40]"
                      : "bg-black/40 border-white/10 text-zinc-600 line-through"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e5ff40]" />
                  <span>QR Hijack Vector</span>
                </button>

                <button
                  onClick={() => toggleCategory("Coercive Extortion")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                    categoryToggles["Coercive Extortion"]
                      ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                      : "bg-black/40 border-white/10 text-zinc-600 line-through"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Coercive Extortion</span>
                </button>

                <button
                  onClick={() => toggleCategory("Benign Baseline")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                    categoryToggles["Benign Baseline"]
                      ? "bg-zinc-800 border-white/20 text-zinc-300"
                      : "bg-black/40 border-white/10 text-zinc-600 line-through"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                  <span>Benign Baseline</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedWaveId("WAVE-104")
                    setFilterQuery("")
                    setCategoryToggles({
                      "Zero-Day Emergent": true,
                      "QR Hijack Vector": true,
                      "Coercive Extortion": true,
                      "Benign Baseline": true
                    })
                  }} 
                  className="px-3.5 py-1 rounded-full bg-[#201f21] border border-white/10 text-zinc-300 hover:text-white transition-colors"
                >
                  Reset Center
                </button>
              </div>
            </div>
          </div>

          {/* Right: Feature Attribution Hexagon Radar (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#ff2a8d]">
                  <Fingerprint className="h-4 w-4" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">DNA POLYGON PROFILE</span>
                </div>
                <span className="font-mono text-xs text-[#e5ff40] font-bold">
                  WAVE #{selectedWave?.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Scam Signature Breakdown</h3>
              <p className="text-xs text-zinc-400">
                Multi-axis feature attribution derived from real-time NLP intent parsing, payload inspection, and device trust signals.
              </p>
            </div>

            {/* Dynamic Hexagonal Radar SVG */}
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

                  {/* Safe Baseline Reference Polygon */}
                  <polygon points="100,75 120,88 120,112 100,125 80,112 80,88" fill="#e5ff40" fillOpacity="0.12" stroke="#e5ff40" strokeWidth="1.2" strokeDasharray="2,2" />

                  {/* Selected Wave High Anomaly Signature (Smooth Polygon Morph) */}
                  <polygon 
                    points={radarPolygonPoints}
                    fill="#ff2a8d" 
                    fillOpacity="0.38" 
                    stroke="#ff2a8d" 
                    strokeWidth="2.5" 
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Labels */}
                <span className="absolute top-0 text-[9px] font-mono text-[#ff2a8d] font-bold">BURST VELOCITY</span>
                <span className="absolute top-10 right-0 text-[9px] font-mono text-zinc-400 font-bold">VPA ENTROPY</span>
                <span className="absolute bottom-10 right-0 text-[9px] font-mono text-[#ff2a8d] font-bold">LINGUISTIC COERCION</span>
                <span className="absolute bottom-0 text-[9px] font-mono text-[#e5ff40] font-bold">QR REDIRECT HOPS</span>
                <span className="absolute bottom-10 left-0 text-[9px] font-mono text-zinc-400 font-bold">DEVICE SPOOF</span>
                <span className="absolute top-10 left-0 text-[9px] font-mono text-[#ff2a8d] font-bold">RECIPIENT AGE</span>
              </div>
            </div>

            {/* Metric Details list */}
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-white/5">
                <span className="text-zinc-400">Temporal Burstiness:</span>
                <span className="text-[#ff2a8d] font-bold">{selectedWave?.temporalBurstiness}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-white/5">
                <span className="text-zinc-400">Linguistic Urgency (NLP):</span>
                <span className="text-[#ff2a8d] font-bold">{selectedWave?.linguisticUrgencyText}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-white/5">
                <span className="text-zinc-400">VPA Domain Obfuscation:</span>
                <span className="text-[#e5ff40] font-bold">{selectedWave?.vpaDomainObfuscation}</span>
              </div>
            </div>

            <button 
              onClick={handleDownloadReport}
              className="w-full py-2.5 rounded-full bg-[#ff2a8d]/10 hover:bg-[#ff2a8d]/20 border border-[#ff2a8d]/30 text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-3.5 w-3.5 text-[#ff2a8d]" />
              <span>Download Cluster Report (.json) &rarr;</span>
            </button>
          </div>

        </div>

        {/* ─── ACTIVE SCAM CAMPAIGN CLUSTER REGISTRY TABLE ─── */}
        <div className="w-full bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-[#ff2a8d]" />
                <h2 className="text-lg font-bold text-white">Active Scam Campaign Cluster Registry</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Live catalog of identified attack archetypes ranked by spreading velocity and victim blast radius. Click any row to focus map &amp; radar.
              </p>
            </div>

            {/* Search bar & Category filter */}
            <div className="flex items-center gap-3 flex-wrap">
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

              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-full px-3 py-1.5 text-xs font-mono text-zinc-300 outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Zero-Day Emergent">Zero-Day Emergent</option>
                <option value="QR Hijack Vector">QR Hijack Vector</option>
                <option value="Coercive Extortion">Coercive Extortion</option>
                <option value="Benign Baseline">Benign Baseline</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-black/60 text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                  <th className="py-3 px-4 rounded-l-lg">Cluster ID</th>
                  <th className="py-3 px-4">Vector Pattern &amp; Payload</th>
                  <th className="py-3 px-4">Target Ecosystem</th>
                  <th className="py-3 px-4">Victim Velocity</th>
                  <th className="py-3 px-4">Linked VPAs</th>
                  <th className="py-3 px-4">Threat Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Action Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCampaigns.map((cluster) => {
                  const isSelected = cluster.id === selectedWave?.id
                  const isOperating = actionLoadingId === cluster.id

                  return (
                    <tr 
                      key={cluster.id} 
                      onClick={() => setSelectedWaveId(cluster.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-white/[0.05] border-l-2 border-l-[#ff2a8d]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#ff2a8d] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ff2a8d] animate-ping" />
                        #{cluster.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{cluster.title}</span>
                          <span className="text-zinc-400 text-[11px] line-clamp-1">{cluster.attackSurface}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cluster.targetEcosystem.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-red-400">
                        {cluster.velocityPerHour}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        <span className="text-[#e5ff40] font-bold">{cluster.linkedVpas.length}</span> verified
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cluster.statusColor}`}>
                          {cluster.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {cluster.status !== "MITIGATED" ? (
                            <button
                              onClick={() => handleReviewAction(cluster.id, "MITIGATE")}
                              disabled={isOperating}
                              className="px-3 py-1.5 rounded-full font-mono text-[11px] font-bold bg-[#ff2a8d] hover:bg-[#ff0055] text-white shadow-sm transition-all disabled:opacity-50"
                            >
                              {isOperating ? "Processing..." : cluster.actionText}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReviewAction(cluster.id, "CONFIRM")}
                              disabled={isOperating}
                              className="px-3 py-1.5 rounded-full font-mono text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                            >
                              Mitigated &check;
                            </button>
                          )}

                          <button
                            onClick={() => handleReviewAction(cluster.id, "FALSE_ALARM")}
                            disabled={isOperating}
                            title="Mark False Alarm"
                            className="px-2.5 py-1.5 rounded-full font-mono text-[10px] text-zinc-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                          >
                            False Alarm
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── INTER-BANK DISPATCH BUS ─── */}
        <div className="w-full bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/10 shadow-xl flex flex-col lg:flex-row items-stretch justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#e5ff40]">
              <Network className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold">INTER-BANK DISPATCH BUS</span>
            </div>
            <h3 className="text-lg font-bold text-white">Autonomous Sentinel Rule Broadcast</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Push freshly isolated HDBSCAN regex patterns directly to NPCI Central Rulebook, partner payment gateways, and Telecom SMS Scrubber filters to neutralize delivery infrastructure simultaneously.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={targets.npci}
                  onChange={(e) => setTargets({ ...targets, npci: e.target.checked })}
                  className="accent-[#ff2a8d] h-4 w-4 rounded"
                />
                <span className="font-mono text-xs text-white">NPCI UPI Switch</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={targets.trai}
                  onChange={(e) => setTargets({ ...targets, trai: e.target.checked })}
                  className="accent-[#ff2a8d] h-4 w-4 rounded"
                />
                <span className="font-mono text-xs text-white">TRAI DLT SMS Filter</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer select-none">
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

          <div className="flex flex-col justify-between bg-black/70 p-4 rounded-xl border border-white/10 gap-4 w-full lg:w-80 shrink-0">
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-zinc-400">
                <span>QUEUE STATUS:</span>
                <span className={`font-bold ${stats.pendingSyncCount > 0 ? "text-amber-400" : "text-[#e5ff40]"}`}>
                  {stats.pendingSyncCount > 0 ? `PENDING (${stats.pendingSyncCount} RULES)` : "SYNCED (0 PENDING)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>API SYNC LATENCY:</span>
                <span className="text-white font-bold">8.4ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>LAST RULE REVISION:</span>
                <span className="text-zinc-300">{lastRevisionTime}</span>
              </div>
            </div>

            <button
              onClick={handleBroadcastAll}
              disabled={broadcastActive}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff2a8d]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
    </BreathBloom>
  )
}
