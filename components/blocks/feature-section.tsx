"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Check, 
  ShieldAlert, 
  Globe, 
  Activity, 
  X, 
  Play, 
  Cpu
} from "lucide-react";

export interface FeatureStep {
  step: string;
  title: string;
  content: string;
  image: string;
  tag?: string;
  metrics?: string;
}

export type InkDemoStep = { label: string; detail: string };

const TRINETRA_DEMO_STEPS: InkDemoStep[] = [
  { label: "Decode", detail: "Extracting raw upi://pay parameters (pa, pn, mc, sign) from QR payload" },
  { label: "Verify", detail: "Cross-checking claimed beneficiary name against destination bank VPA" },
  { label: "Sandbox", detail: "Dispatching TinyFish headless agent to inspect suspect URL DOM inputs" },
  { label: "Cluster", detail: "Matching linguistic urgency & VPA signature against HDBSCAN scam waves" },
  { label: "Intercept", detail: "Blocking pre-payment intent and syncing verdict to Supabase blacklist" },
];

const STEP_SEEDS = [4211, 7919, 14893];

const INK_ORBIT_TRINETRA_CSS = `
@keyframes orbit-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}
@keyframes ink-glow {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(255, 42, 141, 0.4)); }
  50% { filter: drop-shadow(0 0 30px rgba(229, 255, 64, 0.5)); }
}
.animate-orbit-pulse {
  animation: orbit-pulse 4s ease-in-out infinite;
}
.animate-ink-glow {
  animation: ink-glow 5s ease-in-out infinite;
}
`;

// ─── 3D INK ORBIT SCULPTURE CANVAS (60FPS PROCEDURAL MATHEMATICS) ───
function InkOrbitSculpture({
  seed,
  activeStep,
  className,
}: {
  seed: number;
  activeStep: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Handle high DPI resize
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse tilt tracking
    const handlePointerMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerRef.current.targetX = Math.max(-1, Math.min(1, nx));
      pointerRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("mousemove", handlePointerMove);

    // Procedural pseudo-random seeded values
    const seededRandom = (s: number) => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };

    // Generate 3D orbit rings and particles based on step & seed
    const ringCount = 5;
    const particleCount = 130;

    const particles = Array.from({ length: particleCount }).map((_, i) => {
      const ringIndex = i % ringCount;
      const angleOffset = (i / particleCount) * Math.PI * 2;
      const speed = (0.35 + seededRandom(seed + i) * 0.7) * (ringIndex % 2 === 0 ? 1 : -1);
      const size = 1.2 + seededRandom(seed + i * 2) * 2.2;
      const tiltX = (seededRandom(seed + ringIndex * 3) - 0.5) * 1.1;
      const tiltY = (seededRandom(seed + ringIndex * 4) - 0.5) * 1.1;
      const colorType = i % 3; // 0: pink, 1: chartreuse, 2: white

      return {
        ringIndex,
        angle: angleOffset,
        speed,
        size,
        tiltX,
        tiltY,
        colorType,
        trail: [] as { x: number; y: number; alpha: number }[],
      };
    });

    const render = () => {
      time += 0.016;

      // Smooth pointer interpolation
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.05;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.05;

      // Dark background with slight trail fade for ink motion blur
      ctx.fillStyle = "rgba(9, 9, 13, 0.28)";
      ctx.fillRect(0, 0, width, height);

      // Centering & scale strictly tuned to frame dimensions
      const cx = width / 2;
      const cy = height / 2;
      const scaleBase = Math.min(width, height) * 0.32;

      const rotY = pointerRef.current.x * 0.75 + time * 0.22;
      const rotX = pointerRef.current.y * 0.55 + 0.32;

      // ─── 1. CORE RADIAL GLOW & SACRED THIRD EYE FOCAL ───
      const corePulse = 16 + Math.sin(time * 3) * 3.5;
      const radialGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, scaleBase * 1.35);
      radialGradient.addColorStop(0, "rgba(255, 42, 141, 0.28)");
      radialGradient.addColorStop(0.35, "rgba(229, 255, 64, 0.09)");
      radialGradient.addColorStop(1, "rgba(9, 9, 13, 0)");
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, scaleBase * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // ─── 2. RADAR & DEFENSE SPIKES (CROSSHAIRS & SPIKES) ───
      const spikeCount = 8;
      const spikeInner = scaleBase * 0.25;
      const spikeOuter = scaleBase * 0.95 + Math.sin(time * 4) * 6;
      ctx.save();
      for (let k = 0; k < spikeCount; k++) {
        const spikeAngle = (k / spikeCount) * Math.PI * 2 + rotY * 0.4;
        const cosA = Math.cos(spikeAngle);
        const sinA = Math.sin(spikeAngle);
        
        ctx.beginPath();
        ctx.moveTo(cx + cosA * spikeInner, cy + sinA * spikeInner);
        ctx.lineTo(cx + cosA * spikeOuter, cy + sinA * spikeOuter);
        ctx.strokeStyle = k % 2 === 0 ? "rgba(255, 42, 141, 0.22)" : "rgba(229, 255, 64, 0.16)";
        ctx.lineWidth = k % 4 === 0 ? 1.5 : 0.8;
        ctx.stroke();

        // Tip tick
        if (k % 2 === 0) {
          ctx.beginPath();
          ctx.arc(cx + cosA * spikeOuter, cy + sinA * spikeOuter, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#e5ff40";
          ctx.fill();
        }
      }
      ctx.restore();

      // ─── 3. GLASS SPHERE CENTRAL CORE ───
      // Outer glass rim glow
      ctx.save();
      ctx.fillStyle = activeStep === 1 ? "#e5ff40" : "#ff2a8d";
      ctx.shadowColor = activeStep === 1 ? "#e5ff40" : "#ff2a8d";
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Specular glass highlight reflection
      ctx.beginPath();
      ctx.arc(cx - corePulse * 0.12, cy - corePulse * 0.12, corePulse * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();

      // ─── 4. 3D ORBITAL RINGS ───
      for (let r = 0; r < ringCount; r++) {
        const radius = scaleBase * (0.42 + r * 0.21);
        const ringTiltX = rotX + (r * 0.14);
        const ringTiltY = rotY + (r * 0.18);

        ctx.beginPath();
        const steps = 64;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          
          // 3D coordinate on circle
          let x3 = radius * Math.cos(theta);
          let y3 = radius * Math.sin(theta) * 0.36;
          let z3 = radius * Math.sin(theta);

          // Rotate around X
          const cosX = Math.cos(ringTiltX);
          const sinX = Math.sin(ringTiltX);
          const yRotX = y3 * cosX - z3 * sinX;
          const zRotX = y3 * sinX + z3 * cosX;

          // Rotate around Y
          const cosY = Math.cos(ringTiltY);
          const sinY = Math.sin(ringTiltY);
          const xRotY = x3 * cosY + zRotX * sinY;
          const zFinal = -x3 * sinY + zRotX * cosY;

          // Perspective projection
          const fov = 340;
          const scale = fov / (fov + zFinal);
          const projX = cx + xRotY * scale;
          const projY = cy + yRotX * scale;

          if (s === 0) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }

        ctx.strokeStyle = r % 2 === 0 ? "rgba(255, 42, 141, 0.22)" : "rgba(229, 255, 64, 0.18)";
        ctx.lineWidth = r === activeStep ? 1.6 : 0.85;
        ctx.stroke();
      }

      // ─── 5. ORBITING INK PARTICLES WITH 3D DEPTH ───
      particles.forEach((p) => {
        p.angle += p.speed * 0.022;

        const rad = scaleBase * (0.42 + p.ringIndex * 0.21) + Math.sin(time * 2.2 + p.ringIndex) * 6;
        const curTiltX = rotX + p.tiltX;
        const curTiltY = rotY + p.tiltY;

        // 3D position
        let x3 = rad * Math.cos(p.angle);
        let y3 = rad * Math.sin(p.angle) * 0.36;
        let z3 = rad * Math.sin(p.angle);

        // Rotation transforms
        const cosX = Math.cos(curTiltX);
        const sinX = Math.sin(curTiltX);
        const yRotX = y3 * cosX - z3 * sinX;
        const zRotX = y3 * sinX + z3 * cosX;

        const cosY = Math.cos(curTiltY);
        const sinY = Math.sin(curTiltY);
        const xRotY = x3 * cosY + zRotX * sinY;
        const zFinal = -x3 * sinY + zRotX * cosY;

        // Perspective
        const fov = 340;
        const scale = fov / (fov + zFinal);
        const projX = cx + xRotY * scale;
        const projY = cy + yRotX * scale;

        // Save trail point
        p.trail.unshift({ x: projX, y: projY, alpha: 0.8 });
        if (p.trail.length > 5) p.trail.pop();

        // Draw trail
        for (let t = 0; t < p.trail.length - 1; t++) {
          const pt = p.trail[t];
          const nextPt = p.trail[t + 1];
          const trailAlpha = (1 - t / p.trail.length) * 0.35;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);
          ctx.strokeStyle = p.colorType === 0 ? `rgba(255, 42, 141, ${trailAlpha})` : `rgba(229, 255, 64, ${trailAlpha})`;
          ctx.lineWidth = p.size * scale * 0.65;
          ctx.stroke();
        }

        // Draw particle node
        const depthAlpha = Math.max(0.2, Math.min(1, (scale - 0.4) * 1.5));
        const color = p.colorType === 0 
          ? `rgba(255, 42, 141, ${depthAlpha})` 
          : p.colorType === 1 
            ? `rgba(229, 255, 64, ${depthAlpha})` 
            : `rgba(255, 255, 255, ${depthAlpha * 0.9})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(1, p.size * scale), 0, Math.PI * 2);
        ctx.fill();

        // Highlight nodes
        if (p.size > 2.4 && depthAlpha > 0.7) {
          ctx.shadowColor = p.colorType === 0 ? "#ff2a8d" : "#e5ff40";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * scale * 0.75, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, [seed, activeStep]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full block cursor-grab active:cursor-grabbing", className)}
    />
  );
}

// ─── LIVE WORKFLOW DEMO DIALOG MODAL ───
function DemoDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveStage(0);
      return;
    }

    let stage = 0;
    const interval = setInterval(() => {
      stage = (stage + 1) % TRINETRA_DEMO_STEPS.length;
      setActiveStage(stage);
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-[#ff2a8d]/40 bg-[#0a0a0f] p-6 sm:p-8 shadow-[0_0_60px_-10px_rgba(255,42,141,0.4)] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a8d]/15 text-[#ff2a8d] border border-[#ff2a8d]/30 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] animate-ping" />
              LIVE FORENSIC PIPELINE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Real-Time Intercept Workflow
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Watch how त्रिNETRA&apos;s 5-stage zero-trust telemetry stack evaluates an incoming payment intent in under 140ms:
        </p>

        {/* 5-Stage Stepper List */}
        <div className="space-y-3">
          {TRINETRA_DEMO_STEPS.map((s, idx) => {
            const isCurrent = idx === activeStage;
            const isPassed = idx < activeStage;

            return (
              <div
                key={s.label}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5",
                  isCurrent
                    ? "bg-[#ff2a8d]/10 border-[#ff2a8d] shadow-[0_0_20px_-5px_rgba(255,42,141,0.5)]"
                    : isPassed
                      ? "bg-white/[0.02] border-[#e5ff40]/30 text-neutral-300"
                      : "bg-transparent border-white/5 opacity-40 text-neutral-500"
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border",
                    isCurrent
                      ? "bg-[#ff2a8d] text-white border-[#ff2a8d] shadow-[0_0_12px_#ff2a8d]"
                      : isPassed
                        ? "bg-[#e5ff40] text-black border-[#e5ff40]"
                        : "bg-black/60 text-neutral-500 border-white/10"
                  )}
                >
                  {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-mono text-xs uppercase tracking-wider font-bold",
                      isCurrent ? "text-white" : isPassed ? "text-[#e5ff40]" : "text-neutral-500"
                    )}>
                      Stage {idx + 1}: {s.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold text-[#ff2a8d] animate-pulse">
                        EXECUTING &bull; 18ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between border-t border-white/10">
          <span className="font-mono text-xs text-neutral-500 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#e5ff40]" />
            <span>Supabase Real-Time Active</span>
          </span>

          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#ff0055] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#ff2a8d]/30 hover:opacity-95 transition-all cursor-pointer"
          >
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT: FEATURESTEPS WITH ALIGNED STEPPERS & SEPARATED 3D FRAME ───
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
  className,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [seed, setSeed] = useState<number>(STEP_SEEDS[0]);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const tick = 50;
    const increment = 100 / (autoPlayInterval / tick);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature((c) => {
            const next = (c + 1) % features.length;
            setSeed(STEP_SEEDS[next % STEP_SEEDS.length]);
            return next;
          });
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
    setSeed(STEP_SEEDS[index % STEP_SEEDS.length]);
  };

  const activeFeature = features[currentFeature] || features[0];

  return (
    <section
      className={cn(
        "relative w-full bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden",
        className
      )}
    >
      <style>{INK_ORBIT_TRINETRA_CSS}</style>

      {/* Subtle Background Watermark */}
      <div className="pointer-events-none select-none absolute -top-6 left-8 text-[9rem] sm:text-[13rem] font-bold tracking-tighter text-[#ff2a8d]/[0.03] leading-none">
        त्रिNETRA
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP HEADER: Full-width editorial intro */}
        <div className="mb-14 max-w-3xl">
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

        {/* 2-COLUMN BODY: Left = 3 Step Cards | Right = Active Card on top + Full Unobstructed 3D Orbit Beneath */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Stepper List */}
          <div className="lg:col-span-6 space-y-5">
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

          {/* RIGHT COLUMN: Placed alongside step cards, Active Card on top and Full 3D Orbit Animation beneath it */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* 1. Active Module Info Card */}
            <div className="rounded-2xl bg-[#09090d] border border-[#ff2a8d]/35 p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-[#ff2a8d] text-xs font-mono uppercase tracking-widest font-bold">
                  {currentFeature === 0 && <ShieldAlert className="w-4 h-4"/>}
                  {currentFeature === 1 && <Globe className="w-4 h-4"/>}
                  {currentFeature === 2 && <Activity className="w-4 h-4"/>}
                  <span>{activeFeature?.tag || "REAL-TIME INTERCEPT"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase font-bold text-white bg-[#ff2a8d]/80 hover:bg-[#ff2a8d] border border-[#ff2a8d] transition-all shadow-[0_0_15px_rgba(255,42,141,0.4)] cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Pipeline Demo</span>
                  </button>
                  <span className="text-xs font-mono text-neutral-500">
                    SEED: #{String(seed).padStart(4, "0")}
                  </span>
                </div>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeFeature?.title}
              </h4>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {activeFeature?.content}
              </p>

              {activeFeature?.metrics && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">DETECTION METRIC</span>
                  <span className="text-[#e5ff40] font-semibold">{activeFeature.metrics}</span>
                </div>
              )}
            </div>

            {/* 2. Dedicated 3D Ink Orbit Sculpture Frame (h-[480px], 100% unobstructed) */}
            <div className="relative w-full h-[480px] overflow-hidden rounded-3xl border border-white/10 bg-[#09090d] shadow-2xl">
              <InkOrbitSculpture seed={seed} activeStep={currentFeature} />
              
              {/* Top HUD Badge */}
              <div className="pointer-events-none absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[#050505]/85 border border-white/15 text-[#e5ff40] backdrop-blur-md shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#e5ff40] animate-pulse" />
                  {activeFeature?.step || "STEP 01"} // 3D DEFENSE ORBIT
                </span>
              </div>

              {/* Bottom Right Corner Indicator */}
              <div className="pointer-events-none absolute bottom-4 right-4 z-10 text-[10px] font-mono text-neutral-500 bg-[#050505]/75 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                DRAG TO TILT // 60FPS
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Live Pipeline Workflow Dialog */}
      <DemoDialog isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}

export default FeatureSteps;
