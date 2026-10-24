import { NextRequest, NextResponse } from "next/server"
import { supabase, MlWeights, InterceptDossier, MlModelState } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dossierId, verdict, analystName = "Fraud Command Senior Analyst" } = body

    if (!dossierId || !["CONFIRM_SCAM", "FALSE_POSITIVE", "ESCALATE_1930"].includes(verdict)) {
      return NextResponse.json(
        { success: false, error: "Invalid dossierId or verdict action" },
        { status: 400 }
      )
    }

    // 1. Fetch dossier from Supabase
    const { data: dossierData, error: dossierErr } = await supabase
      .from("intercept_dossiers")
      .select("*")
      .eq("id", dossierId)
      .single()

    if (dossierErr || !dossierData) {
      return NextResponse.json(
        { success: false, error: `Dossier '${dossierId}' not found in database.` },
        { status: 404 }
      )
    }

    const dossier = dossierData as InterceptDossier

    // 2. Fetch current ML model state
    const { data: modelData, error: modelErr } = await supabase
      .from("ml_model_state")
      .select("*")
      .eq("id", 1)
      .single()

    const defaultWeights: MlWeights = { behavior: 0.50, nlp: 0.20, url: 0.15, qr_mismatch: 0.15, bias: -0.10 }
    const currentModel: MlModelState = modelData || {
      id: 1,
      weights: defaultWeights,
      learning_rate: 0.05,
      total_trained_samples: 240,
      batch_target: 300,
      false_positive_count: 1,
      total_verdicts: 240
    }

    const weightsBefore = { ...currentModel.weights }

    // 3. Extract feature vector x = [behavior, nlp, url, mismatch] (normalized 0 to 1)
    const rawVector = dossier.feature_vector || []
    const x = [
      rawVector[0] ?? (dossier.risk_score / 100),
      rawVector[1] ?? Number(dossier.urgency_score || 0.8),
      rawVector[2] ?? 0.85,
      rawVector[3] ?? Number(dossier.qr_mismatch_score || 0.9)
    ]

    // 4. Target label: y = 1.0 for scam/escalate, y = 0.0 for false positive
    const y = verdict === "FALSE_POSITIVE" ? 0.0 : 1.0

    // 5. Stochastic Gradient Descent (SGD) with Sigmoid & L2 Regularization
    // Compute logit z = w . x + b
    const currentW = [
      weightsBefore.behavior,
      weightsBefore.nlp,
      weightsBefore.url,
      weightsBefore.qr_mismatch
    ]
    const bias = weightsBefore.bias ?? -0.10

    const z = currentW.reduce((sum, w, i) => sum + w * x[i], 0) + bias
    const yHat = 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))))

    // Prediction error
    const error = yHat - y
    const lossDelta = Math.abs(error)
    const eta = Number(currentModel.learning_rate) || 0.05
    const lambda = 0.001 // L2 regularization coefficient

    // Update weights: w_i = w_i - eta * (error * x_i + lambda * w_i)
    const updatedRawW = currentW.map((w, i) => {
      const grad = error * x[i] + lambda * w
      return w - eta * grad
    })
    const updatedBias = bias - eta * error

    // Project and normalize positive weights so they sum to 1.00
    const rectifiedW = updatedRawW.map(w => Math.max(0.05, w))
    const sumW = rectifiedW.reduce((a, b) => a + b, 0)
    const normalizedW: MlWeights = {
      behavior: Number((rectifiedW[0] / sumW).toFixed(4)),
      nlp: Number((rectifiedW[1] / sumW).toFixed(4)),
      url: Number((rectifiedW[2] / sumW).toFixed(4)),
      qr_mismatch: Number((rectifiedW[3] / sumW).toFixed(4)),
      bias: Number(updatedBias.toFixed(4))
    }

    // 6. Update counts
    const newTotalSamples = (currentModel.total_trained_samples || 240) + 1
    const newTotalVerdicts = (currentModel.total_verdicts || 240) + 1
    const newFpCount = verdict === "FALSE_POSITIVE" 
      ? (currentModel.false_positive_count || 1) + 1 
      : (currentModel.false_positive_count || 1)

    // 7. Persist updated ML Model State
    await supabase
      .from("ml_model_state")
      .upsert({
        id: 1,
        weights: normalizedW,
        learning_rate: eta,
        total_trained_samples: newTotalSamples,
        batch_target: currentModel.batch_target || 300,
        false_positive_count: newFpCount,
        total_verdicts: newTotalVerdicts,
        updated_at: new Date().toISOString()
      })

    // 8. Record Analyst Verdict audit trail
    await supabase.from("analyst_verdicts").insert({
      dossier_id: dossierId,
      verdict,
      weights_before: weightsBefore,
      weights_after: normalizedW,
      loss_delta: Number(lossDelta.toFixed(4)),
      created_at: new Date().toISOString()
    })

    // 9. Update Dossier status and Blacklist
    let newStatus: "CONFIRMED_SCAM" | "FALSE_POSITIVE" | "ESCALATED_1930" = "CONFIRMED_SCAM"
    if (verdict === "FALSE_POSITIVE") {
      newStatus = "FALSE_POSITIVE"
      // Remove from blacklist if present
      await supabase.from("vpa_blacklist").delete().eq("vpa", dossier.recipient_vpa)
    } else if (verdict === "ESCALATE_1930") {
      newStatus = "ESCALATED_1930"
      // Upsert into blacklist
      await supabase.from("vpa_blacklist").upsert({
        vpa: dossier.recipient_vpa,
        reason: `Escalated to 1930 / I4C: ${dossier.title}`,
        dossier_id: dossier.id,
        confirmed_by: analystName
      })
    } else {
      newStatus = "CONFIRMED_SCAM"
      // Upsert into blacklist
      await supabase.from("vpa_blacklist").upsert({
        vpa: dossier.recipient_vpa,
        reason: `Confirmed Fraudulent: ${dossier.title}`,
        dossier_id: dossier.id,
        confirmed_by: analystName
      })
    }

    const { data: updatedDossier } = await supabase
      .from("intercept_dossiers")
      .update({ status: newStatus })
      .eq("id", dossierId)
      .select("*")
      .single()

    return NextResponse.json({
      success: true,
      verdict,
      dossier: updatedDossier || { ...dossier, status: newStatus },
      weightsBefore,
      weightsAfter: normalizedW,
      lossDelta: Number(lossDelta.toFixed(4)),
      totalTrainedSamples: newTotalSamples,
      falsePositiveRate: Number(((newFpCount / newTotalVerdicts) * 100).toFixed(2)),
      message: `Verdict recorded. ML weights updated via SGD online pass.`
    })
  } catch (err: any) {
    console.error("Analyst verdict API error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process analyst verdict" },
      { status: 500 }
    )
  }
}
