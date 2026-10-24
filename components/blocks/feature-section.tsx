"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ShieldAlert, Globe, Activity } from "lucide-react";

export interface FeatureStep {
  step: string;
  title: string;
  content: string;
  image: string;
  tag?: string;
  metrics?: string;
}

interface FeatureStepsProps {
  features: FeatureStep[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
  className?: string;
}

export function FeatureSteps({
  features,
  title = "How त्रिNETRA Protects Every Rupee",
  autoPlayInterval = 4000,
  imageHeight = "h-[500px]",
  className,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = 50;
    const increment = 100 / (autoPlayInterval / tick);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature((c) => (c + 1) % features.length);
          return 0;
        }
        return prev + increment;
      });
    }, tick);

    return () => clearInterval(timer);
  }, [autoPlayInterval, features.length]);

  const handleSelect = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <section
      className={cn(
        "relative w-full bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden",
        className
      )}
    >
      {/* Subtle Background Watermark */}
      <div className="pointer-events-none select-none absolute -top-6 left-8 text-[9rem] sm:text-[13rem] font-bold tracking-tighter text-[#ff2a8d]/[0.03] leading-none">
        त्रिNETRA
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Editorial Kicker & Headline matching Landing Page */}
        <div className="mb-16 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-7 bg-[#ff2a8d]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff2a8d]">
              ABOUT त्रिNETRA // PRE-PAYMENT CYBER DEFENSE
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            {title}{" "}
            <span className="block font-serif italic font-normal text-[#ff2a8d] mt-1">
              before money leaves.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Traditional banking systems react only after money has already left a victim&apos;s account.
            त्रिNETRA intervenes at the moment you scan a QR code or receive a payment link.
          </p>
        </div>

        {/* 2-Column Interactive FeatureSteps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Stepper List */}
          <div className="lg:col-span-6 space-y-6">
            {features.map((feature, index) => {
              const isActive = index === currentFeature;
              const isCompleted = index < currentFeature;

              return (
                <div
                  key={feature.step}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border",
                    isActive
                      ? "bg-white/[0.03] border-[#ff2a8d]/60 shadow-[0_0_35px_-10px_rgba(255,42,141,0.3)]"
                      : "bg-transparent border-white/[0.06] opacity-55 hover:opacity-90 hover:border-white/15"
                  )}
                >
                  <div className="flex items-start gap-5">
                    {/* Step Circle Indicator */}
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                        isActive
                          ? "bg-[#ff2a8d] border-[#ff2a8d] text-white shadow-[0_0_20px_rgba(255,42,141,0.6)]"
                          : isCompleted
                            ? "bg-[#e5ff40]/15 border-[#e5ff40] text-[#e5ff40]"
                            : "bg-white/[0.03] border-white/15 text-neutral-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5"/> : index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            "text-xs font-mono uppercase tracking-[0.18em]",
                            isActive ? "text-[#e5ff40]" : "text-neutral-500"
                          )}
                        >
                          {feature.step}
                        </span>
                        {feature.tag && (
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#ff2a8d]/15 text-[#ff2a8d] border border-[#ff2a8d]/30">
                            {feature.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-neutral-400 leading-relaxed">
                        {feature.content}
                      </p>

                      {/* Animated Progress Bar for Active Step */}
                      {isActive && (
                        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#ff2a8d] to-[#e5ff40] transition-all duration-75"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual Frame (`h-[500px]`) */}
          <div className="lg:col-span-6">
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#09090d] shadow-2xl",
                imageHeight
              )}
            >
              {features.map((feature, index) => {
                const isActive = index === currentFeature;
                return (
                  <div
                    key={feature.step}
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all duration-700 ease-out",
                      isActive
                        ? "opacity-100 translate-y-0 scale-100 z-10"
                        : "opacity-0 translate-y-6 scale-95 z-0 pointer-events-none"
                    )}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover opacity-55 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/65 to-transparent" />

                    {/* Live Forensic HUD Overlay inside the Image Card */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[#050505]/85 border border-white/15 text-[#e5ff40]">
                          <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-pulse" />
                          {feature.step} // LIVE ENGINE
                        </span>
                        <span className="text-xs font-mono text-white/60 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                          त्रिNETRA SENTINEL
                        </span>
                      </div>

                      <div className="rounded-2xl bg-[#050505]/90 backdrop-blur-xl border border-[#ff2a8d]/30 p-6 shadow-2xl">
                        <div className="flex items-center gap-3 text-[#ff2a8d] text-xs font-mono uppercase tracking-widest mb-2">
                          {index === 0 && <ShieldAlert className="w-4 h-4"/>}
                          {index === 1 && <Globe className="w-4 h-4"/>}
                          {index === 2 && <Activity className="w-4 h-4"/>}
                          <span>{feature.tag || "REAL-TIME INTERCEPT"}</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white">{feature.title}</h4>
                        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                          {feature.content}
                        </p>
                        {feature.metrics && (
                          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                            <span className="text-neutral-400">DETECTION COVERAGE</span>
                            <span className="text-[#e5ff40] font-semibold">{feature.metrics}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
