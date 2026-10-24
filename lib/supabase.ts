import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mrviyqlwcfqlnifcvftg.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydml5cWx3Y2ZxbG5pZmN2ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzA0MDcsImV4cCI6MjEwODQwNjQwN30.HqgGdOvnveEcAqoupy-8gNTTQ2oGNDqnIgIG8F0VM74"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  id: string
  phone_number: string
  email: string
  created_at?: string
}

export interface LoginEntry {
  id?: string
  phone_number: string
  email?: string
  login_timestamp?: string
  auth_method?: string
  status?: string
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export interface TinyFishTelemetry {
  targetOrigin?: string
  hostProvider?: string
  exfilChannel?: string
  victimReach?: string
  domFinding?: string
  crawledAt?: string
  [key: string]: any
}

export interface InterceptDossier {
  id: string
  title: string
  category_tag: string
  risk_score: number
  status: "PENDING" | "CONFIRMED_SCAM" | "FALSE_POSITIVE" | "ESCALATED_1930"
  raw_upi_uri: string
  recipient_vpa: string
  claimed_name: string
  mcc_code: string
  account_age: string
  latency_ms: number
  attempts_blocked: number
  gov_impersonation_score: number
  urgency_score: number
  mule_swarm_score: number
  qr_mismatch_score: number
  linguistic_hook: string
  tinyfish_telemetry: TinyFishTelemetry
  feature_vector: number[]
  created_at?: string
}

export interface MlWeights {
  behavior: number
  nlp: number
  url: number
  qr_mismatch: number
  bias: number
}

export interface MlModelState {
  id: number
  weights: MlWeights
  learning_rate: number
  total_trained_samples: number
  batch_target: number
  false_positive_count: number
  total_verdicts: number
  updated_at?: string
}

export interface AnalystVerdict {
  id?: string
  dossier_id: string
  verdict: "CONFIRM_SCAM" | "FALSE_POSITIVE" | "ESCALATE_1930"
  weights_before: MlWeights
  weights_after: MlWeights
  loss_delta: number
  created_at?: string
}

