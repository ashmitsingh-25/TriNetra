import { NextRequest, NextResponse } from "next/server"
import { campaignsStore } from "@/lib/campaigns-store"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const { action } = body

    if (!action || !["CONFIRM", "MITIGATE", "FALSE_ALARM", "BLOCK"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Valid action is required (CONFIRM, MITIGATE, FALSE_ALARM, BLOCK)" },
        { status: 400 }
      )
    }

    const updated = campaignsStore.updateStatus(id, action)
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Campaign wave '${id}' not found.` },
        { status: 404 }
      )
    }

    const stats = campaignsStore.getStats()

    return NextResponse.json({
      success: true,
      campaign: updated,
      stats,
      message: `Wave ${id} status updated to ${updated.status}.`
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update campaign review" },
      { status: 500 }
    )
  }
}
