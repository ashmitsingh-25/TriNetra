"use client"

import React, { useEffect, useState } from "react"
import { supabase, type LoginEntry } from "@/lib/supabase"
import { Database, RefreshCw, X, ShieldCheck, Clock, Smartphone, Mail } from "lucide-react"

interface LoginEntriesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginEntriesModal({ isOpen, onClose }: LoginEntriesModalProps) {
  const [entries, setEntries] = useState<LoginEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("login_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (data) {
        setEntries(data)
      }
    } catch (err) {
      console.error("Error fetching login entries:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchEntries()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#e5ff40]" />
            <h3 className="font-bold text-white">Supabase Live Database: Login Entries</h3>
            <span className="rounded bg-[#e5ff40]/20 px-2 py-0.5 text-[10px] font-bold text-[#e5ff40]">
              table: login_entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEntries}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              title="Refresh entries"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-zinc-500">
              <Database className="mb-2 h-10 w-10 text-zinc-700" />
              <p className="text-sm">No login entries recorded yet.</p>
              <p className="mt-1 text-xs text-zinc-600">Sign in or register a new user to generate real-time database logs.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950 p-4 transition-colors hover:border-[#ff2a8d]/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Smartphone className="h-4 w-4 text-[#e5ff40]" />
                      <span>{item.phone_number}</span>
                      {item.email && (
                        <span className="flex items-center gap-1 text-xs font-normal text-zinc-400">
                          <Mail className="h-3.5 w-3.5 text-zinc-500" /> {item.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.login_timestamp ? new Date(item.login_timestamp).toLocaleString() : "Just now"}
                      </span>
                      <span>Method: {item.auth_method}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> {item.status || "SUCCESS"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
