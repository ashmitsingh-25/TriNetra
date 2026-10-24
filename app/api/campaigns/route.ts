import { NextRequest, NextResponse } from "next/server"
import { campaignsStore } from "@/lib/campaigns-store"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const category = searchParams.get("category")

    let campaigns = campaignsStore.getCampaigns()

    if (query) {
      campaigns = campaigns.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.attackSurface.toLowerCase().includes(query) ||
        c.targetEcosystem.some(t => t.toLowerCase().includes(query)) ||
        c.linkedVpas.some(v => v.toLowerCase().includes(query))
      )
    }

    if (category && category !== "ALL") {
      campaigns = campaigns.filter(c => c.category === category)
    }

    const stats = campaignsStore.getStats()

    return NextResponse.json({
      success: true,
      campaigns,
      stats
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, targets } = body

    if (action === "SYNC" && targets) {
      const result = campaignsStore.executeMultiTargetSync(targets)
      const stats = campaignsStore.getStats()

      return NextResponse.json({
        success: true,
        message: "Multi-Target Rule Sync Broadcast dispatched successfully.",
        syncResult: result,
        stats
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process request" },
      { status: 500 }
    )
  }
}
