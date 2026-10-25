"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let isMounted = true

    const handleAuth = async () => {
      try {
        // Exchange code or retrieve active session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) throw error

        if (session && session.user) {
          const email = session.user.email || ""
          const fullName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            email.split("@")[0]

          // Upsert into users_profile
          try {
            await supabase.from("users_profile").upsert(
              {
                id: session.user.id,
                email: email.toLowerCase(),
                phone_number: email.toLowerCase(),
                password_hash: "google_oauth_verified",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email" }
            )
          } catch (e) {
            console.warn("Profile sync notice:", e)
          }

          // Record login entry
          try {
            await supabase.from("login_entries").insert({
              email: email.toLowerCase(),
              phone_number: email.toLowerCase(),
              auth_method: "google_oauth",
              status: "SUCCESS",
              user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
            })
          } catch (e) {
            console.warn("Login entry notice:", e)
          }

          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "trinetra_user",
              JSON.stringify({
                id: session.user.id,
                email: email,
                name: fullName,
                provider: "google",
              })
            )
          }

          if (isMounted) {
            setStatus("success")
            setTimeout(() => {
              router.push("/?tab=scanner")
            }, 1000)
          }
        } else {
          // Listen for auth state change in case session arrives asynchronously via hash fragment
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
              if (currentSession && currentSession.user) {
                const email = currentSession.user.email || ""
                const fullName =
                  currentSession.user.user_metadata?.full_name || email.split("@")[0]

                try {
                  await supabase.from("users_profile").upsert(
                    {
                      id: currentSession.user.id,
                      email: email.toLowerCase(),
                      phone_number: email.toLowerCase(),
                      password_hash: "google_oauth_verified",
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: "email" }
                  )
                } catch (e) {
                  console.warn("Profile sync notice:", e)
                }

                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "trinetra_user",
                    JSON.stringify({
                      id: currentSession.user.id,
                      email: email,
                      name: fullName,
                      provider: "google",
                    })
                  )
                }

                if (isMounted) {
                  setStatus("success")
                  subscription.unsubscribe()
                  setTimeout(() => {
                    router.push("/?tab=scanner")
                  }, 1000)
                }
              }
            }
          )

          // Timeout fallback
          setTimeout(() => {
            if (isMounted && status === "loading") {
              router.push("/?tab=scanner")
            }
          }, 3500)
        }
      } catch (err: any) {
        console.error("Auth callback error:", err)
        if (isMounted) {
          setStatus("error")
          setErrorMessage(err.message || "Failed to finalize authentication.")
        }
      }
    }

    handleAuth()

    return () => {
      isMounted = false
    }
  }, [router, status])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/90 p-8 text-center shadow-[0_0_60px_-10px_rgba(255,42,141,0.3)] backdrop-blur-xl">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff2a8d]/10 border border-[#ff2a8d]/30 text-[#ff2a8d]">
              <RefreshCw className="h-6 w-6 animate-spin text-[#ff2a8d]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Authenticating with Google</h2>
            <p className="mt-2 text-xs text-zinc-400">
              Synchronizing cryptographic session tokens with त्रिNETRA Sentinel Defense...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ff40]/10 border border-[#e5ff40]/30 text-[#e5ff40] shadow-[0_0_20px_rgba(229,255,64,0.4)]">
              <CheckCircle2 className="h-7 w-7 text-[#e5ff40]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Google Sign-In Verified</h2>
            <p className="mt-2 text-xs text-zinc-400">
              Redirecting you to Sentinel Threat Scanner...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Authentication Failed</h2>
            <p className="mt-2 text-xs text-red-300">{errorMessage}</p>
            <button
              onClick={() => router.push("/auth")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
