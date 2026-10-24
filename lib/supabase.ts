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
