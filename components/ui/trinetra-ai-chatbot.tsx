"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { MessageSquare, Sparkles, X, ShieldAlert, Bot, User } from "lucide-react";
import { MetalPromptBar } from "@/components/ui/metal-prompt-bar";
import { cn } from "@/lib/utils";

// Dynamically load Spline on client to avoid SSR hydration issues while loading the exact scene
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#050505] text-xs font-mono text-neutral-500">
      <span className="h-6 w-6 rounded-full border-2 border-[#ff2a8d] border-t-transparent animate-spin mb-3" />
      INITIALIZING 3D SENTINEL CORE...
    </div>
  ),
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
}

export default function TrinetraAIChatbot() {
  const [open, setOpen] = React.useState(false);
  const [sent, setSent] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! I am **त्रिNETRA AI Sentinel**. Paste any suspicious UPI ID (like `quickpay.refund992@ybl`), WhatsApp bill notice, or website link below, and I will verify it in real time.",
      mode: "Agent",
    },
  ]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handlePromptSubmit = async (text: string, activeChip = "Agent") => {
    // Keep the top-3 recent sent list behavior from MetalPromptBarDemo
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
    <>
      {/* Bottom-Right Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative flex items-center gap-3 rounded-full border border-[#ff2a8d]/60 bg-[#07070a]/95 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(255,42,141,0.55)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#e5ff40] cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e5ff40] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#e5ff40]" />
            </span>
            <div className="relative flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-[#ff2a8d] group-hover:text-[#e5ff40] transition-colors"/>
              <Sparkles className="h-2.5 w-2.5 text-[#e5ff40] absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
            <span>Ask त्रिNETRA AI</span>
          </button>
        )}
      </div>

      {/* Split-Window Chatbot & 3D Spline Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl h-[92vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl border border-white/15 bg-[#050505] shadow-[0_0_90px_-15px_rgba(255,42,141,0.45)] overflow-hidden">
            {/* LEFT HALF (6 cols): Moving 3D Spline Model */}
            <div className="relative hidden lg:block lg:col-span-6 h-full w-full bg-[#050505] border-r border-white/10 overflow-hidden">
              {/* Top HUD Overlay on the 3D Scene */}
              <div className="pointer-events-none absolute top-5 left-6 right-6 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-pulse" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#e5ff40]">
                    त्रिNETRA // NEURAL 3D CORE
                  </span>
                </div>
                <span className="rounded-full border border-[#ff2a8d]/40 bg-[#ff2a8d]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#ff2a8d]">
                  INTERACTIVE 3D
                </span>
              </div>

              {/* 3D Spline Canvas (oversized by 60px at bottom to clip out any Spline watermark) */}
              <div className="relative w-full h-[calc(100%+60px)]">
                <Spline scene="https://prod.spline.design/YzZysfckGeJ-wyy3/scene.splinecode"/>
              </div>

              {/* Bottom Caption */}
              <div className="pointer-events-none absolute bottom-5 left-6 right-6 z-20 rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-md p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-[#ff2a8d] mb-1">
                  Autonomous UPI Defense Assistant
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Connected live to our Supabase VPA blacklist, QR payload decoder, and TinyFish URL sandbox.
                </p>
              </div>
            </div>

            {/* RIGHT HALF (6 cols): AI Chatbot + MetalPromptBar */}
            <div className="lg:col-span-6 flex flex-col h-full w-full bg-[#07070b]">
              {/* Chatbot Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#050505]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff2a8d]/15 border border-[#ff2a8d]/40 text-[#ff2a8d]">
                    <Bot className="h-5 w-5"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold tracking-tight text-white">
                        त्रिNETRA AI Sentinel
                      </h3>
                      <span className="rounded-full bg-[#e5ff40]/15 border border-[#e5ff40]/40 px-2 py-0.5 font-mono text-[10px] text-[#e5ff40]">
                        LLM ONLINE
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Real-time UPI fraud & phishing intelligence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chatbot"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:border-[#ff2a8d] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4"/>
                </button>
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
                        <ShieldAlert className="h-3.5 w-3.5"/>
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                        msg.role === "user"
                          ? "bg-[#ff2a8d] text-white font-medium shadow-[0_0_20px_rgba(255,42,141,0.3)]"
                          : "bg-white/[0.04] border border-white/10 text-neutral-200"
                      )}
                    >
                      {msg.mode && msg.role === "user" && (
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-white/75 mb-1">
                          [{msg.mode}]
                        </span>
                      )}
                      {msg.content}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white mt-0.5">
                        <User className="h-3.5 w-3.5"/>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3 text-xs font-mono text-[#e5ff40]">
                    <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-ping" />
                    त्रिNETRA LLM inspecting telemetry...
                  </div>
                )}
              </div>

              {/* MetalPromptBar Docked at the Bottom */}
              <div className="border-t border-white/10 bg-[#050505] px-6 py-4 flex flex-col items-center gap-2.5">
                <div className="w-full max-w-[560px]">
                  <MetalPromptBar
                    chips={["Agent", "Auto", "Tools"]}
                    disabled={loading}
                    onSubmit={(text, chip) => handlePromptSubmit(text, chip)}
                  />
                </div>

                {sent.length > 0 ? (
                  <ul className="w-full max-w-[560px] space-y-0.5 text-xs text-neutral-400">
                    {sent.map((line, index) => (
                      <li key={`${line}-${index}`} className="truncate font-mono">
                        <span className="text-[#ff2a8d]">→</span> {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500">
                    Type and press Enter — in dark mode the chips reflect the send ring.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
