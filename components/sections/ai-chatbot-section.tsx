"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Bot, ShieldAlert, User, Sparkles, Send } from "lucide-react";
import { MetalPromptBar } from "@/components/ui/metal-prompt-bar";
import { cn } from "@/lib/utils";

// Dynamically load Spline on client to avoid SSR hydration mismatches
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#050505] text-xs font-mono text-neutral-500">
      <span className="h-7 w-7 rounded-full border-2 border-[#ff2a8d] border-t-transparent animate-spin mb-3" />
      INITIALIZING 3D NEURAL CORE...
    </div>
  ),
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
}

export default function AiChatbotSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! I am **त्रिNETRA AI Sentinel**. Paste any suspicious UPI ID (like `quickpay.refund992@ybl`), WhatsApp bill notice, or website link below, and I will verify it in real time.",
      mode: "Agent",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handlePromptSubmit = async (text: string, activeChip = "Agent") => {
    setSent((list) => [text, ...list].slice(0, 3));

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      mode: activeChip,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: activeChip,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Inspection complete.",
          mode: activeChip,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "Connection interrupted. Please try submitting your query again.",
          mode: activeChip,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden">
      {/* Background Watermark */}
      <div className="pointer-events-none select-none absolute -top-8 right-12 text-[9rem] sm:text-[14rem] font-bold tracking-tighter text-[#ff2a8d]/[0.025] leading-none">
        SENTINEL
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Editorial Header */}
        <div className="mb-14 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-7 bg-[#ff2a8d]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff2a8d]">
              AI SENTINEL // 24/7 PRE-PAYMENT DEFENSE INTELLIGENCE
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Ask त्रिNETRA AI{" "}
            <span className="block font-serif italic font-normal text-[#ff2a8d] mt-1">
              live neural fraud detection.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Interact directly with our cybersecurity intelligence engine. Inspect suspect UPI VPAs, examine SMS payment requests, or verify electricity bill URLs before making any payment.
          </p>
        </div>

        {/* 50/50 Split Container: 3D Model on Left Side, AI Chatbot on Right Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full min-h-[640px] lg:h-[720px]">
          
          {/* LEFT HALF (6 cols): 3D Spline Scene */}
          <div className="lg:col-span-6 relative w-full h-[520px] lg:h-full rounded-3xl border border-white/15 bg-[#07070c] shadow-[0_0_70px_-15px_rgba(255,42,141,0.35)] overflow-hidden flex flex-col justify-between">
            {/* Top HUD Overlay */}
            <div className="pointer-events-none absolute top-5 left-6 right-6 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e5ff40] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#e5ff40] font-bold">
                  त्रिNETRA // NEURAL 3D CORE
                </span>
              </div>
              <span className="rounded-full border border-[#ff2a8d]/40 bg-[#ff2a8d]/15 px-3 py-1 font-mono text-[11px] font-bold text-[#ff2a8d] shadow-[0_0_15px_rgba(255,42,141,0.3)]">
                INTERACTIVE 3D
              </span>
            </div>

            {/* 3D Spline Canvas (clipped at bottom by 65px to hide any watermark) */}
            <div className="relative w-full h-[calc(100%+65px)] z-0">
              <Spline scene="https://prod.spline.design/YzZysfckGeJ-wyy3/scene.splinecode" />
            </div>

            {/* Bottom Telemetry Caption */}
            <div className="pointer-events-none absolute bottom-5 left-6 right-6 z-20 rounded-2xl border border-white/10 bg-[#050505]/85 backdrop-blur-md p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#ff2a8d] font-bold">
                  Autonomous UPI Defense Core
                </span>
                <span className="text-[10px] font-mono text-[#e5ff40]">
                  60 FPS REAL-TIME
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Move cursor or drag to inspect the 3D neural node. Directly connected to our Supabase fraud blacklist, QR payload decoder, and TinyFish DOM crawler.
              </p>
            </div>
          </div>

          {/* RIGHT HALF (6 cols): AI Chatbot Interface */}
          <div className="lg:col-span-6 relative w-full h-[600px] lg:h-full rounded-3xl border border-white/15 bg-[#07070b] shadow-2xl flex flex-col overflow-hidden">
            {/* Chatbot Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#050505]/95">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff2a8d]/15 border border-[#ff2a8d]/40 text-[#ff2a8d] shadow-[0_0_15px_rgba(255,42,141,0.3)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight text-white">
                      त्रिNETRA AI Sentinel
                    </h3>
                    <span className="rounded-full bg-[#e5ff40]/15 border border-[#e5ff40]/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#e5ff40]">
                      LLM ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Real-time UPI fraud & phishing intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                <Sparkles className="w-3.5 h-3.5 text-[#ff2a8d]" />
                <span className="hidden sm:inline">Zero-Trust AI</span>
              </div>
            </div>

            {/* Quick Test Prompts Strip */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.06] px-6 py-2.5 bg-[#050505]/60 no-scrollbar">
              {[
                "Check quickpay.refund992@ybl",
                "Is 7817929602@fam safe?",
                "Inspect https://ebill-kyc-update.xyz",
                "How to report to 1930?",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handlePromptSubmit(sample, "Tools")}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-neutral-300 hover:border-[#ff2a8d]/60 hover:text-white transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* Scrollable Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff2a8d]/20 border border-[#ff2a8d]/40 text-[#ff2a8d] mt-0.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                      msg.role === "user"
                        ? "bg-[#ff2a8d] text-white font-medium shadow-[0_0_20px_rgba(255,42,141,0.3)]"
                        : "bg-white/[0.04] border border-white/10 text-neutral-200"
                    )}
                  >
                    {msg.mode && msg.role === "user" && (
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-white/75 mb-1 font-bold">
                        [{msg.mode}]
                      </span>
                    )}
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-xs font-mono text-[#e5ff40]">
                  <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-ping" />
                  त्रिNETRA LLM inspecting forensic telemetry...
                </div>
              )}
            </div>

            {/* Docked MetalPromptBar at the Bottom */}
            <div className="border-t border-white/10 bg-[#050505] px-6 py-4 flex flex-col items-center gap-2">
              <div className="w-full">
                <MetalPromptBar
                  chips={["Agent", "Auto", "Tools"]}
                  disabled={loading}
                  onSubmit={(text, chip) => handlePromptSubmit(text, chip)}
                />
              </div>

              {sent.length > 0 ? (
                <ul className="w-full space-y-0.5 text-xs text-neutral-400">
                  {sent.map((line, index) => (
                    <li key={`${line}-${index}`} className="truncate font-mono">
                      <span className="text-[#ff2a8d]">→</span> {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-neutral-500 font-mono">
                  Press Enter to send &bull; Agent, Auto, and Tools modes available
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
