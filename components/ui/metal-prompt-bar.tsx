"use client";

import * as React from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetalPromptBarProps {
  chips?: string[];
  disabled?: boolean;
  onSubmit: (text: string, activeChip?: string) => void;
  placeholder?: string;
  className?: string;
}

export function MetalPromptBar({
  chips = ["Agent", "Auto", "Tools"],
  disabled = false,
  onSubmit,
  placeholder = "Ask त्रिNETRA Sentinel or paste UPI ID / URL...",
  className,
}: MetalPromptBarProps) {
  const [input, setInput] = React.useState("");
  const [activeChip, setActiveChip] = React.useState(chips[0] || "Agent");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed, activeChip);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("w-full relative flex flex-col gap-2", className)}>
      {/* Outer Metallic Container */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_0_25px_-5px_rgba(255,42,141,0.2)] focus-within:shadow-[0_0_30px_rgba(255,42,141,0.4)] transition-all duration-300">
        <div className="rounded-[15px] bg-[#0c0c12]/95 backdrop-blur-xl px-3.5 py-2.5 flex flex-col gap-2">
          {/* Input Row */}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={disabled}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="button"
              disabled={disabled || !input.trim()}
              onClick={() => handleSubmit()}
              aria-label="Send query"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 shrink-0",
                input.trim() && !disabled
                  ? "bg-gradient-to-tr from-[#ff2a8d] to-[#ff0055] text-white shadow-[0_0_15px_rgba(255,42,141,0.6)] hover:scale-105 cursor-pointer"
                  : "bg-white/[0.04] text-neutral-600 cursor-not-allowed border border-white/5"
              )}
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Chips Selector Row */}
          {chips && chips.length > 0 && (
            <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                {chips.map((chip) => {
                  const isSelected = chip === activeChip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setActiveChip(chip);
                        inputRef.current?.focus();
                      }}
                      className={cn(
                        "rounded-lg px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-[#ff2a8d]/15 text-[#ff2a8d] border-[#ff2a8d]/50 shadow-[0_0_10px_rgba(255,42,141,0.3)] font-semibold"
                          : "bg-transparent text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-white/[0.03]"
                      )}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                <Sparkles className="h-3 w-3 text-[#e5ff40]" />
                <span>AI SENTINEL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetalPromptBar;
