export type WaveStatus = "RAPID SURGE" | "ACTIVE VECTOR" | "CONTAINED" | "MITIGATED" | "FALSE ALARM"
export type WaveCategory = "Zero-Day Emergent" | "QR Hijack Vector" | "Coercive Extortion" | "Benign Baseline"

export interface ClusterNode {
  id: string
  x: number // 0 to 800 SVG coordinates
  y: number // 0 to 400 SVG coordinates
  r?: number
  clusterId: string
  category: WaveCategory
  label?: string
}

export interface CampaignWave {
  id: string
  title: string
  attackSurface: string
  targetEcosystem: string[]
  velocityPerHour: string
  firstSeen: string
  status: WaveStatus
  statusColor: string
  actionText: string
  noveltyScore: number // 0.00 to 1.00
  linkedVpas: string[]
  sampleSms: string
  category: WaveCategory
  radarMetrics: [number, number, number, number, number, number] // [burstVelocity, vpaEntropy, linguisticUrgency, urlRedirectHops, deviceSpoof, recipientAge]
  temporalBurstiness: string
  linguisticUrgencyText: string
  vpaDomainObfuscation: string
  nodes: ClusterNode[]
  confirmedCount?: number
}

export interface GlobalCampaignStats {
  activeClusters: number
  zeroDayWaves: number
  globalMitigationRate: number
  pendingSyncCount: number
  lastSyncTimestamp: string
}

// Global in-memory singleton to persist state across API calls in dev/server
const INITIAL_CAMPAIGNS: CampaignWave[] = [
  {
    id: "WAVE-104",
    title: "Fake Mahavitaran/BESCOM Electricity Arrears",
    attackSurface: "SMS Push > Malicious APK (QuickSupport spoof) > Dynamic collect injection",
    targetEcosystem: ["SBI UPI", "PhonePe"],
    velocityPerHour: "+420 attempts/hr",
    firstSeen: "00:14:22 ago",
    status: "RAPID SURGE",
    statusColor: "text-red-400 bg-red-500/20 border border-red-500/40",
    actionText: "Broadcast Block",
    noveltyScore: 0.94,
    linkedVpas: [
      "quickpay.refund992@ybl",
      "mahadiscom.billdesk@okaxis",
      "powerbill.pay91@paytm",
      "bescom.utility.clear@ibl"
    ],
    sampleSms: "URGENT: Your electricity power connection will be disconnected tonight at 9:30 PM. Pay pending bill immediately via UPI or call 9876543210.",
    category: "Zero-Day Emergent",
    radarMetrics: [98, 88, 96, 75, 82, 94],
    temporalBurstiness: "98.2 / 100 [EXTREME]",
    linguisticUrgencyText: "0.96 (\"DISCONNECTED TONIGHT\")",
    vpaDomainObfuscation: "High (3 Subdomains)",
    nodes: [
      { id: "w104-1", x: 560, y: 130, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-2", x: 580, y: 115, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-3", x: 600, y: 135, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-4", x: 575, y: 155, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-5", x: 595, y: 165, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-6", x: 615, y: 125, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-7", x: 550, y: 150, r: 5.5, clusterId: "WAVE-104", category: "Zero-Day Emergent" },
      { id: "w104-core", x: 585, y: 140, r: 8, clusterId: "WAVE-104", category: "Zero-Day Emergent", label: "Zero-Day Outlier Core" }
    ]
  },
  {
    id: "WAVE-092",
    title: "Merchant Soundbox QR Sticker Overlay",
    attackSurface: "Physical Soundbox swap + dynamic payload injection replacing merchant beneficiary VPA",
    targetEcosystem: ["Paytm QR", "BharatPe"],
    velocityPerHour: "+118 attempts/hr",
    firstSeen: "02:41:09 ago",
    status: "ACTIVE VECTOR",
    statusColor: "text-[#d6ef2f] bg-[#d6ef2f]/20 border border-[#d6ef2f]/40",
    actionText: "Revoke VPA Hash",
    noveltyScore: 0.78,
    linkedVpas: [
      "soundbox.merchant.pay@ybl",
      "counter.bharatpe@axl",
      "retail.pos.qr9@icici"
    ],
    sampleSms: "Payment of Rs. 450 received via Soundbox broadcast spoof.",
    category: "QR Hijack Vector",
    radarMetrics: [72, 64, 45, 92, 70, 58],
    temporalBurstiness: "71.4 / 100 [HIGH]",
    linguisticUrgencyText: "0.45 (Counter POS Trigger)",
    vpaDomainObfuscation: "High (Dynamic QR Redirection)",
    nodes: [
      { id: "w92-1", x: 480, y: 275, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" },
      { id: "w92-2", x: 505, y: 265, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" },
      { id: "w92-3", x: 530, y: 290, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" },
      { id: "w92-4", x: 495, y: 310, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" },
      { id: "w92-5", x: 540, y: 315, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" },
      { id: "w92-6", x: 470, y: 295, r: 4.5, clusterId: "WAVE-092", category: "QR Hijack Vector" }
    ]
  },
  {
    id: "WAVE-088",
    title: "Coercive Instant Loan APK Extortion",
    attackSurface: "Sideloaded micro-lending APK extracting contacts & triggering automated collect extortion",
    targetEcosystem: ["ICICI iMobile", "GPay"],
    velocityPerHour: "+64 attempts/hr",
    firstSeen: "05:12:30 ago",
    status: "ACTIVE VECTOR",
    statusColor: "text-amber-400 bg-amber-500/20 border border-amber-500/40",
    actionText: "Confirm Scam Wave",
    noveltyScore: 0.68,
    linkedVpas: [
      "microloan.settle01@oksbi",
      "creditclearing@yesbank",
      "speedyloan.emi@ibl"
    ],
    sampleSms: "FINAL NOTICE: Overdue loan recovery agent arriving at home address. Transfer Rs. 11,200 to halt legal summons.",
    category: "Coercive Extortion",
    radarMetrics: [55, 60, 92, 40, 88, 45],
    temporalBurstiness: "54.8 / 100 [MODERATE]",
    linguisticUrgencyText: "0.92 (\"LEGAL SUMMONS / NOTICE\")",
    vpaDomainObfuscation: "Medium (Mule Savings Handles)",
    nodes: [
      { id: "w88-1", x: 300, y: 120, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-2", x: 320, y: 105, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-3", x: 340, y: 130, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-4", x: 310, y: 145, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-5", x: 355, y: 115, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-6", x: 335, y: 155, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" },
      { id: "w88-7", x: 370, y: 140, r: 4.5, clusterId: "WAVE-088", category: "Coercive Extortion" }
    ]
  },
  {
    id: "WAVE-064",
    title: "Telegram Task & Mule Funnel",
    attackSurface: "Layered commission transfers across tier-3 student savings accounts & OTC crypto mules",
    targetEcosystem: ["Airtel Payments", "Axis Bank"],
    velocityPerHour: "+29 attempts/hr",
    firstSeen: "14:02:11 ago",
    status: "MITIGATED",
    statusColor: "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40",
    actionText: "Mark False Alarm",
    noveltyScore: 0.42,
    linkedVpas: [
      "taskreward.freelance@airtel",
      "globalrating.payout@axisbank",
      "investflow77@okicici"
    ],
    sampleSms: "Earn Rs 3500 daily by rating Google Maps hotels. Daily payout guaranteed.",
    category: "Benign Baseline",
    radarMetrics: [30, 42, 38, 50, 32, 28],
    temporalBurstiness: "28.9 / 100 [CONTAINED]",
    linguisticUrgencyText: "0.38 (Task Funnel Offer)",
    vpaDomainObfuscation: "Low (P2P Student Mules)",
    nodes: [
      { id: "w64-1", x: 210, y: 320, r: 3.8, clusterId: "WAVE-064", category: "Benign Baseline" },
      { id: "w64-2", x: 230, y: 305, r: 3.8, clusterId: "WAVE-064", category: "Benign Baseline" },
      { id: "w64-3", x: 250, y: 335, r: 3.8, clusterId: "WAVE-064", category: "Benign Baseline" },
      { id: "w64-4", x: 220, y: 345, r: 3.8, clusterId: "WAVE-064", category: "Benign Baseline" },
      { id: "w64-5", x: 265, y: 315, r: 3.8, clusterId: "WAVE-064", category: "Benign Baseline" }
    ]
  }
]

// Safe baseline background points
export const BENIGN_BASELINE_NODES: ClusterNode[] = [
  { id: "base-1", x: 120, y: 180, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline", label: "Retail P2P" },
  { id: "base-2", x: 140, y: 190, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-3", x: 110, y: 210, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-4", x: 130, y: 230, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-5", x: 160, y: 170, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-6", x: 175, y: 220, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-7", x: 190, y: 195, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-8", x: 145, y: 160, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-9", x: 210, y: 215, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" },
  { id: "base-10", x: 180, y: 240, r: 3, clusterId: "BASELINE-01", category: "Benign Baseline" }
]

// Global Store State
class CampaignsStore {
  private campaigns: CampaignWave[] = JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS))
  private lastSyncTimestamp: string = new Date().toLocaleTimeString("en-IN", { hour12: false })
  private pendingSyncCount: number = 0

  public getCampaigns(): CampaignWave[] {
    return this.campaigns
  }

  public getCampaignById(id: string): CampaignWave | undefined {
    return this.campaigns.find(c => c.id.toLowerCase() === id.toLowerCase())
  }

  public updateStatus(
    id: string,
    action: "CONFIRM" | "MITIGATE" | "FALSE_ALARM" | "BLOCK"
  ): CampaignWave | null {
    const wave = this.getCampaignById(id)
    if (!wave) return null

    if (action === "CONFIRM") {
      wave.status = "RAPID SURGE"
      wave.statusColor = "text-red-400 bg-red-500/20 border border-red-500/40"
      wave.actionText = "Broadcast Block"
      wave.confirmedCount = (wave.confirmedCount || 0) + 1
      this.pendingSyncCount++
    } else if (action === "MITIGATE" || action === "BLOCK") {
      wave.status = "MITIGATED"
      wave.statusColor = "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40"
      wave.actionText = "Rule Broadcasted"
      this.pendingSyncCount = Math.max(0, this.pendingSyncCount - 1)
    } else if (action === "FALSE_ALARM") {
      wave.status = "FALSE ALARM"
      wave.statusColor = "text-zinc-400 bg-zinc-800/40 border border-zinc-700/40"
      wave.actionText = "Archived"
      this.pendingSyncCount = Math.max(0, this.pendingSyncCount - 1)
    }

    return wave
  }

  public executeMultiTargetSync(targets: { npci: boolean; trai: boolean; psps: boolean }): {
    syncedTargets: string[]
    timestamp: string
  } {
    const synced: string[] = []
    if (targets.npci) synced.push("NPCI UPI Switch")
    if (targets.trai) synced.push("TRAI DLT SMS Filter")
    if (targets.psps) synced.push("Major PSP Gateways")

    this.pendingSyncCount = 0
    this.lastSyncTimestamp = new Date().toLocaleTimeString("en-IN", { hour12: false })

    return {
      syncedTargets: synced,
      timestamp: this.lastSyncTimestamp
    }
  }

  public getStats(): GlobalCampaignStats {
    const active = this.campaigns.filter(c => c.status === "RAPID SURGE" || c.status === "ACTIVE VECTOR").length
    const zeroDays = this.campaigns.filter(c => c.category === "Zero-Day Emergent").length
    const mitigated = this.campaigns.filter(c => c.status === "MITIGATED").length
    const total = this.campaigns.length
    const rate = total > 0 ? Number(((mitigated / total) * 100).toFixed(2)) : 99.84

    return {
      activeClusters: 44 + active,
      zeroDayWaves: zeroDays,
      globalMitigationRate: Math.max(98.5, Math.min(99.98, rate)),
      pendingSyncCount: this.pendingSyncCount,
      lastSyncTimestamp: this.lastSyncTimestamp
    }
  }

  // Cross-Page Live Sync: called from /api/check-payment when a high-risk payment is detected
  public addFlaggedPayment(
    vpa: string,
    claimedRecipient: string,
    riskScore: number,
    explanation: string
  ) {
    const normalizedVpa = vpa.toLowerCase().trim()
    const textLower = (claimedRecipient + " " + explanation).toLowerCase()

    // Determine target campaign
    let target = this.campaigns.find(c => {
      if (textLower.includes("electric") || textLower.includes("mahavitaran") || textLower.includes("bescom") || textLower.includes("tata power")) {
        return c.id === "WAVE-104"
      }
      if (textLower.includes("soundbox") || textLower.includes("counter") || textLower.includes("qr")) {
        return c.id === "WAVE-092"
      }
      if (textLower.includes("loan") || textLower.includes("credit") || textLower.includes("recovery")) {
        return c.id === "WAVE-088"
      }
      return false
    })

    if (target) {
      if (!target.linkedVpas.includes(normalizedVpa)) {
        target.linkedVpas.unshift(normalizedVpa)
      }
      // Add a dynamic cluster node near existing cluster
      const baseNode = target.nodes[0] || { x: 580, y: 140 }
      const offsetX = (Math.random() - 0.5) * 40
      const offsetY = (Math.random() - 0.5) * 40
      target.nodes.push({
        id: `node-live-${Date.now()}`,
        x: Math.max(50, Math.min(750, baseNode.x + offsetX)),
        y: Math.max(50, Math.min(350, baseNode.y + offsetY)),
        r: 6,
        clusterId: target.id,
        category: target.category,
        label: `Live Flagged: ${normalizedVpa}`
      })
      this.pendingSyncCount++
      return target
    }

    // If novelty is high (> 0.85) and unmatched, spawn emergent WAVE-105
    if (riskScore >= 85) {
      let wave105 = this.campaigns.find(c => c.id === "WAVE-105")
      if (!wave105) {
        wave105 = {
          id: "WAVE-105",
          title: "Emergent Zero-Day Infiltration Pattern",
          attackSurface: "Novel synthetic payee pattern flagged via Pre-Payment Scanner",
          targetEcosystem: ["Cross-PSP Dynamic Intent"],
          velocityPerHour: "+18 attempts/hr",
          firstSeen: "Just now",
          status: "RAPID SURGE",
          statusColor: "text-red-400 bg-red-500/20 border border-red-500/40",
          actionText: "Broadcast Block",
          noveltyScore: 0.98,
          linkedVpas: [normalizedVpa],
          sampleSms: explanation,
          category: "Zero-Day Emergent",
          radarMetrics: [94, 92, 88, 70, 85, 90],
          temporalBurstiness: "92.4 / 100 [ZERO-DAY]",
          linguisticUrgencyText: "0.94 (High-Urgency Threat)",
          vpaDomainObfuscation: "High (Synthetic Pattern)",
          nodes: [
            { id: "w105-1", x: 680, y: 220, r: 7, clusterId: "WAVE-105", category: "Zero-Day Emergent", label: "Zero-Day Spike" },
            { id: "w105-2", x: 700, y: 235, r: 5.5, clusterId: "WAVE-105", category: "Zero-Day Emergent" }
          ]
        }
        this.campaigns.unshift(wave105)
      } else if (!wave105.linkedVpas.includes(normalizedVpa)) {
        wave105.linkedVpas.unshift(normalizedVpa)
      }
      this.pendingSyncCount++
      return wave105
    }

    return null
  }
}

// Global persistent instance for server runtime
declare global {
  var __triNetraCampaignsStore: CampaignsStore | undefined
}

export const campaignsStore = globalThis.__triNetraCampaignsStore ?? new CampaignsStore()
if (process.env.NODE_ENV !== "production") {
  globalThis.__triNetraCampaignsStore = campaignsStore
}
