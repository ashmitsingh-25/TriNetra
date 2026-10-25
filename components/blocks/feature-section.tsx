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

const STEP_SEEDS = [4211, 7919, 14893];

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
      onClick={(e) => {
        // Reforge the background 3D orbit when clicking empty canvas space
        if ((e.target as HTMLElement).tagName !== "BUTTON") {
          setSeed((s) => nextSeed(s));
        }
      }}
      className={cn(
        "relative w-full min-h-screen bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden",
        className
      )}
    >
      <style>{INK_ORBIT_BG_CSS}</style>

      {/* FULL-PAGE 3D INK ORBIT BACKGROUND COVERING THE ENTIRE SECTION */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <InkOrbitSculpture
          background="#050505"
          height="100%"
          ink="#ff2a8d"
          seed={seed}
          onReforge={(next) => setSeed(next)}
          label="त्रिNETRA · 3D SENTINEL"
          hint="Move cursor to tilt · Click anywhere to reforge"
        />
        {/* Subtle radial vignette so left-side typography stays razor-sharp */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/30 to-transparent" />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto pointer-events-none">
        {/* Editorial Kicker & Headline */}
        <div className="mb-14 max-w-3xl pointer-events-auto">
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
          <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
            Traditional banking systems react only after money has already left a victim&apos;s account.
            त्रिNETRA intervenes at the moment you scan a QR code or receive a payment link.
          </p>
        </div>

        {/* 2-Column Grid Floating Over the Full-Screen 3D Orbit Background */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          {/* LEFT COLUMN: 3 Interactive Step Cards */}
          <div className="lg:col-span-6 space-y-5 pointer-events-auto">
            {features.map((feature, index) => {
              const isActive = index === currentFeature;
              const isCompleted = index < currentFeature;

              return (
                <div
                  key={feature.step}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(index);
                  }}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border backdrop-blur-md",
                    isActive
                      ? "bg-[#050505]/70 border-[#ff2a8d]/70 shadow-[0_0_35px_-10px_rgba(255,42,141,0.35)]"
                      : "bg-[#050505]/45 border-white/[0.08] opacity-70 hover:opacity-100 hover:border-white/20"
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
                            isActive ? "text-[#e5ff40]" : "text-neutral-400"
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
                      <p className="mt-2 text-sm sm:text-base text-neutral-300 leading-relaxed">
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

          {/* RIGHT COLUMN: Open Viewport for the 3D Orbit Background + Translucent Active Status Card at the Bottom */}
          <div className="lg:col-span-6 flex flex-col justify-end min-h-[380px] pointer-events-auto">
            <div className="rounded-2xl bg-[#050505]/70 backdrop-blur-xl border border-[#ff2a8d]/40 p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-[#ff2a8d] text-xs font-mono uppercase tracking-widest">
                  {currentFeature === 0 && <ShieldAlert className="w-4 h-4"/>}
                  {currentFeature === 1 && <Globe className="w-4 h-4"/>}
                  {currentFeature === 2 && <Activity className="w-4 h-4"/>}
                  <span>{activeFeature?.tag || "REAL-TIME INTERCEPT"}</span>
                </div>
                <span className="text-xs font-mono text-[#e5ff40]">
                  SEED: #{String(seed).padStart(4, "0")}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white">
                {activeFeature?.title}
              </h4>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {activeFeature?.content}
              </p>

              {activeFeature?.metrics && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">DETECTION METRIC</span>
                  <span className="text-[#e5ff40] font-semibold">
                    {activeFeature.metrics}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- 3D sculpture */

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = String(hex).replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 0];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = clamp(t, 0, 1);
  return (
    "rgb(" +
    A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",") +
    ")"
  );
}

function rgba(a: string, b: string, t: number, alpha: number): string {
  return mixHex(a, b, t)
    .replace("rgb(", "rgba(")
    .replace(")", "," + alpha + ")");
}

function nextSeed(seed: number): number {
  const s = Math.abs(Math.floor(seed)) || 1;
  const n = ((s * 48271 + 11) % 2147483647) % 100000;
  return n === s ? (n + 7919) % 100000 : n;
}

function headingOf(yaw: number): number {
  const d = Math.round((yaw * 180) / Math.PI) % 360;
  return (d + 360) % 360;
}

type Cloud = { core: Float32Array; grain: Float32Array; spikes: Float32Array };
const CORE_N = 2800;
const GRAIN_N = 16000;
const SPIKE_N = 16;
const SPHERE_R = 0.28;

function buildCloud(
  seed: number,
  coreN: number,
  grainN: number,
  spikeN: number
): Cloud {
  const rand = mulberry32(seed * 2654435761 + 1);
  const unit = (): [number, number, number] => {
    const z = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    return [r * Math.cos(a), r * Math.sin(a), z];
  };
  const cross = (a: number[], b: number[]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (v: number[]): [number, number, number] => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const curves: number[][] = [];
  const loops = 3 + Math.floor(rand() * 2);
  const W = 0.092;
  for (let k = 0; k < loops; k++) {
    const n = unit();
    const u = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const v = cross(n, u);
    const p = Array.from({ length: 8 }, () => rand() * Math.PI * 2);
    const R = 0.9 + rand() * 0.16;
    const pts: number[] = [];
    const RES = 220;
    for (let i = 0; i <= RES; i++) {
      const t = (i / RES) * Math.PI * 2;
      const r =
        R *
        (1 +
          0.15 * Math.sin(2 * t + p[0]) +
          0.07 * Math.sin(3 * t + p[1]) +
          0.04 * Math.sin(5 * t + p[2]));
      const h = R * (0.24 * Math.sin(2 * t + p[3]) + 0.08 * Math.sin(3 * t + p[4]));
      const c = Math.cos(t) * r;
      const s = Math.sin(t) * r;
      const w =
        W *
        (0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(3 * t + p[5]), 1.5)) *
        (0.72 + 0.28 * Math.sin(7 * t + p[6]));
      pts.push(
        u[0] * c + v[0] * s + n[0] * h,
        u[1] * c + v[1] * s + n[1] * h,
        u[2] * c + v[2] * s + n[2] * h,
        Math.max(0.018, w)
      );
    }
    curves.push(pts);
  }
  for (let b = 0; b < 3; b++) {
    const A = curves[Math.floor(rand() * loops)];
    const B = curves[Math.floor(rand() * loops)];
    const ia = Math.floor(rand() * (A.length / 4)) * 4;
    const ib = Math.floor(rand() * (B.length / 4)) * 4;
    const a = [A[ia], A[ia + 1], A[ia + 2]];
    const c = [B[ib], B[ib + 1], B[ib + 2]];
    const mid = norm([(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]);
    const lift = 1.08 + rand() * 0.18;
    const m = [mid[0] * lift, mid[1] * lift, mid[2] * lift];
    const pts: number[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const q = 1 - t;
      pts.push(
        q * q * a[0] + 2 * q * t * m[0] + t * t * c[0],
        q * q * a[1] + 2 * q * t * m[1] + t * t * c[1],
        q * q * a[2] + 2 * q * t * m[2] + t * t * c[2],
        W * (0.16 + 0.42 * Math.sin(Math.PI * t))
      );
    }
    curves.push(pts);
  }
  const segs: { c: number[]; i: number; len: number }[] = [];
  let total = 0;
  for (const c of curves) {
    for (let i = 0; i + 4 < c.length; i += 4) {
      const len = Math.hypot(
        c[i + 4] - c[i],
        c[i + 5] - c[i + 1],
        c[i + 6] - c[i + 2]
      );
      segs.push({ c, i, len });
      total += len;
    }
  }
  const core = new Float32Array(coreN * 4);
  const tan = new Float32Array(coreN * 3);
  let si = 0;
  let acc = 0;
  for (let k = 0; k < coreN; k++) {
    const target = ((k + 0.5) / coreN) * total;
    while (si < segs.length - 1 && acc + segs[si].len < target)
      acc += segs[si++].len;
    const { c, i, len } = segs[si];
    const f = len ? clamp((target - acc) / len, 0, 1) : 0;
    for (let d = 0; d < 4; d++)
      core[k * 4 + d] = c[i + d] + (c[i + 4 + d] - c[i + d]) * f;
    tan.set(
      norm([c[i + 4] - c[i], c[i + 5] - c[i + 1], c[i + 6] - c[i + 2]]),
      k * 3
    );
  }
  const grain = new Float32Array(grainN * 3);
  for (let g = 0; g < grainN; g++) {
    const k = Math.floor(rand() * coreN);
    const T = [tan[k * 3], tan[k * 3 + 1], tan[k * 3 + 2]];
    const d = unit();
    const dot = d[0] * T[0] + d[1] * T[1] + d[2] * T[2];
    const o = norm([d[0] - dot * T[0], d[1] - dot * T[1], d[2] - dot * T[2]]);
    const w = core[k * 4 + 3];
    const dust = rand() < 0.05;
    const r = dust
      ? w * (1.3 + rand() * 1.6)
      : w * (0.35 + 0.82 * Math.sqrt(rand()));
    for (let a = 0; a < 3; a++) grain[g * 3 + a] = core[k * 4 + a] + o[a] * r;
  }
  const spikes = new Float32Array(spikeN * 6);
  for (let s = 0; s < spikeN; s++) {
    const k = Math.floor(rand() * coreN);
    const p = [core[k * 4], core[k * 4 + 1], core[k * 4 + 2]];
    const j = unit();
    const dir = norm([
      p[0] + j[0] * 0.45,
      p[1] + j[1] * 0.45,
      p[2] + j[2] * 0.45,
    ]);
    const len = 0.18 + rand() * 0.42;
    spikes.set(
      [
        p[0],
        p[1],
        p[2],
        p[0] + dir[0] * len,
        p[1] + dir[1] * len,
        p[2] + dir[2] * len,
      ],
      s * 6
    );
  }
  return { core, grain, spikes };
}

function project(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  f: number
): [number, number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const s = f / (f - z2);
  return [x1 * s, y2 * s, z2, s];
}

type InkOrbitSculptureProps = {
  height?: string;
  ink?: string;
  background?: string;
  seed?: number;
  onReforge?: (seed: number) => void;
  spin?: number;
  density?: number;
  glass?: boolean;
  hud?: boolean;
  label?: string;
  hint?: string;
  maxDpr?: number;
  className?: string;
};

function InkOrbitSculpture({
  height = "100%",
  ink = "#ff2a8d",
  background = "#050505",
  seed: seedProp = 4211,
  spin = 0.18,
  density = 1,
  glass = true,
  hud = true,
  label = "त्रिNETRA · 3D SENTINEL",
  hint = "Move cursor to tilt · Click anywhere to reforge",
  maxDpr = 2,
  className = "",
}: InkOrbitSculptureProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const headingRef = React.useRef<HTMLSpanElement | null>(null);
  const [seed, setSeed] = React.useState(seedProp);
  React.useEffect(() => setSeed(seedProp), [seedProp]);

  const colors = { ink, bg: background };
  const grainN = Math.round(GRAIN_N * clamp(density, 0.25, 1.5));

  const st = React.useRef({
    yaw: 0.6,
    pitch: 0.18,
    vyaw: 0,
    vpitch: 0,
    leanYaw: 0,
    leanPitch: 0,
    tLeanYaw: 0,
    tLeanPitch: 0,
    lastT: 0,
    from: null as Cloud | null,
    to: null as Cloud | null,
    morphT: 1,
    ring: 0,
    dirty: true,
    visible: true,
    heading: -1,
    colors,
    spin,
    glass,
  });
  const s0 = st.current;
  s0.colors = colors;
  s0.spin = spin;
  s0.glass = glass;
  s0.dirty = true;

  const builtFor = React.useRef({ seed: NaN, grainN: 0 });
  React.useEffect(() => {
    const s = st.current;
    const prev = builtFor.current;
    const next = buildCloud(seed, CORE_N, grainN, SPIKE_N);
    const canMorph = s.to && prev.grainN === grainN && prev.seed !== seed;
    s.from = canMorph ? s.to : null;
    s.to = next;
    s.morphT = canMorph ? 0 : 1;
    if (canMorph) s.ring = 1;
    s.dirty = true;
    builtFor.current = { seed, grainN };
  }, [seed, grainN]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const lens = document.createElement("canvas");
    const lctx = lens.getContext("2d");
    const s = st.current;
    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, Math.max(1, maxDpr));
      W = Math.max(1, Math.round(canvas.clientWidth * dpr));
      H = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = W;
      canvas.height = H;
      s.dirty = true;
    };
    resize();

    const onWindowMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        s.tLeanYaw = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 0.65;
        s.tLeanPitch = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 0.65;
        s.dirty = true;
      }
    };
    window.addEventListener("mousemove", onWindowMove);

    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    const io =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver((es) => {
            s.visible = es.some((e) => e.isIntersecting);
            s.dirty = true;
          })
        : null;
    io?.observe(canvas);

    const NB = 7;
    const px = new Float32Array(CORE_N + grainN);
    const py = new Float32Array(CORE_N + grainN);
    const pr = new Float32Array(CORE_N);
    const bin = new Uint8Array(CORE_N + grainN);
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = s.lastT ? Math.min(0.05, (now - s.lastT) / 1000) : 0.016;
      s.lastT = now;
      const B = s.to;
      if (!s.visible || !B || B.grain.length !== grainN * 3) return;

      s.vyaw += (s.spin - s.vyaw) * Math.min(1, dt * 1.6);
      s.yaw += s.vyaw * dt;
      s.pitch += (0.18 - s.pitch) * Math.min(1, dt * 0.9);
      s.leanYaw += (s.tLeanYaw - s.leanYaw) * Math.min(1, dt * 3);
      s.leanPitch += (s.tLeanPitch - s.leanPitch) * Math.min(1, dt * 3);
      if (s.morphT < 1) s.morphT = Math.min(1, s.morphT + dt / 1.3);
      if (s.ring > 0) s.ring = Math.max(0, s.ring - dt / 1.1);

      const yaw = s.yaw + s.leanYaw;
      const pitch = s.pitch + s.leanPitch;
      const hd = headingOf(yaw);
      if (hd !== s.heading && headingRef.current) {
        s.heading = hd;
        headingRef.current.textContent = "N " + String(hd).padStart(3, "0") + "°";
      }

      const { ink: inkC, bg } = s.colors;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Position the full-page 3D orbit sculpture across the canvas with its core centered toward the right half
      const cx = W > 900 * dpr ? W * 0.62 : W * 0.5;
      const cy = H * 0.52;
      const scale = Math.min(W, H) * 0.42;
      const f = 3.4;
      const m = easeInOutCubic(s.morphT);
      const A =
        s.from && s.from.grain.length === B.grain.length ? s.from : null;
      const mixP = (
        arrB: Float32Array,
        arrA: Float32Array | undefined,
        i: number
      ) => (arrA && m < 1 ? arrA[i] + (arrB[i] - arrA[i]) * m : arrB[i]);

      // Crosshair axes
      const reach = scale * 1.45;
      const grad = (x1: number, y1: number, x2: number, y2: number) => {
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, mixHex(inkC, bg, 1));
        g.addColorStop(0.5, mixHex(inkC, bg, 0.5));
        g.addColorStop(1, mixHex(inkC, bg, 1));
        return g;
      };
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = grad(cx, cy - reach, cx, cy + reach);
      ctx.beginPath();
      ctx.moveTo(cx, cy - reach);
      ctx.lineTo(cx, cy + reach);
      ctx.stroke();
      ctx.strokeStyle = grad(cx - reach, cy, cx + reach, cy);
      ctx.beginPath();
      ctx.moveTo(cx - reach, cy);
      ctx.lineTo(cx + reach, cy);
      ctx.stroke();

      // Reforge shockwave ring
      if (s.ring > 0) {
        const k = 1 - s.ring;
        ctx.strokeStyle = rgba("#e5ff40", bg, 0.15 + 0.65 * k, s.ring * 0.85);
        ctx.lineWidth = Math.max(1, dpr * (1 + 2 * s.ring));
        ctx.beginPath();
        ctx.arc(cx, cy, scale * (0.32 + k * 1.25), 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < CORE_N; i++) {
        const [x, y, z, sc] = project(
          mixP(B.core, A?.core, i * 4),
          mixP(B.core, A?.core, i * 4 + 1),
          mixP(B.core, A?.core, i * 4 + 2),
          yaw,
          pitch,
          f
        );
        px[i] = cx + x * scale;
        py[i] = cy + y * scale;
        pr[i] = mixP(B.core, A?.core, i * 4 + 3) * scale * sc * 0.78;
        bin[i] = clamp(Math.floor(((z + 1.25) / 2.5) * NB), 0, NB - 1);
      }
      for (let g = 0; g < grainN; g++) {
        const i = CORE_N + g;
        const [x, y, z] = project(
          mixP(B.grain, A?.grain, g * 3),
          mixP(B.grain, A?.grain, g * 3 + 1),
          mixP(B.grain, A?.grain, g * 3 + 2),
          yaw,
          pitch,
          f
        );
        px[i] = cx + x * scale;
        py[i] = cy + y * scale;
        bin[i] = clamp(Math.floor(((z + 1.25) / 2.5) * NB), 0, NB - 1);
      }

      const gs = Math.max(1, 1.15 * dpr);
      const pass = (b: number) => {
        const fade = 0.62 * (1 - b / (NB - 1));
        ctx.fillStyle = mixHex(inkC, bg, fade);
        ctx.beginPath();
        for (let i = 0; i < CORE_N; i++) {
          if (bin[i] !== b) continue;
          ctx.moveTo(px[i] + pr[i], py[i]);
          ctx.arc(px[i], py[i], pr[i], 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.fillStyle = mixHex("#ffffff", inkC, Math.min(0.9, fade + 0.25));
        for (let i = CORE_N; i < CORE_N + grainN; i++)
          if (bin[i] === b) ctx.fillRect(px[i], py[i], gs, gs);
      };

      const spikes = (front: boolean) => {
        ctx.lineWidth = Math.max(0.75, 0.85 * dpr);
        for (let k = 0; k < SPIKE_N; k++) {
          const o = k * 6;
          const a = project(
            mixP(B.spikes, A?.spikes, o),
            mixP(B.spikes, A?.spikes, o + 1),
            mixP(B.spikes, A?.spikes, o + 2),
            yaw,
            pitch,
            f
          );
          const e = project(
            mixP(B.spikes, A?.spikes, o + 3),
            mixP(B.spikes, A?.spikes, o + 4),
            mixP(B.spikes, A?.spikes, o + 5),
            yaw,
            pitch,
            f
          );
          if (a[2] >= 0 !== front) continue;
          const g = ctx.createLinearGradient(
            cx + a[0] * scale,
            cy + a[1] * scale,
            cx + e[0] * scale,
            cy + e[1] * scale
          );
          g.addColorStop(0, mixHex("#e5ff40", bg, front ? 0.1 : 0.45));
          g.addColorStop(1, mixHex(inkC, bg, 1));
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(cx + a[0] * scale, cy + a[1] * scale);
          ctx.lineTo(cx + e[0] * scale, cy + e[1] * scale);
          ctx.stroke();
        }
      };

      spikes(false);
      for (let b = 0; b < Math.floor(NB / 2) + 1; b++) pass(b);

      if (s.glass) {
        const rs = SPHERE_R * scale;
        const span = rs * 3.1;
        if (lctx) {
          const ls = Math.max(1, Math.ceil(rs * 2));
          if (lens.width !== ls) {
            lens.width = ls;
            lens.height = ls;
          }
          lctx.setTransform(1, 0, 0, 1, 0, 0);
          lctx.fillStyle = bg;
          lctx.fillRect(0, 0, ls, ls);
          lctx.drawImage(
            canvas,
            cx - span,
            cy - span,
            span * 2,
            span * 2,
            0,
            0,
            ls,
            ls
          );
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rs, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = bg;
        ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);
        if (lctx) {
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI + yaw * 0.15);
          ctx.globalAlpha = 0.85;
          ctx.drawImage(lens, -rs, -rs, rs * 2, rs * 2);
          ctx.globalAlpha = 1;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        const rim = ctx.createRadialGradient(
          cx - rs * 0.25,
          cy - rs * 0.3,
          rs * 0.1,
          cx,
          cy,
          rs
        );
        rim.addColorStop(0, "rgba(255,255,255,.55)");
        rim.addColorStop(0.55, "rgba(255,42,141,.16)");
        rim.addColorStop(0.86, rgba(inkC, bg, 0.82, 0.3));
        rim.addColorStop(1, rgba(inkC, bg, 0.25, 0.75));
        ctx.fillStyle = rim;
        ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);

        const hl = ctx.createRadialGradient(
          cx - rs * 0.38,
          cy - rs * 0.42,
          0,
          cx - rs * 0.38,
          cy - rs * 0.42,
          rs * 0.42
        );
        hl.addColorStop(0, "rgba(255,255,255,.92)");
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl;
        ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);
        ctx.restore();

        ctx.strokeStyle = mixHex(inkC, bg, 0.35);
        ctx.lineWidth = Math.max(1, dpr);
        ctx.beginPath();
        ctx.arc(cx, cy, rs, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let b = Math.floor(NB / 2) + 1; b < NB; b++) pass(b);
      spikes(true);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onWindowMove);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [grainN, maxDpr]);

  return (
    <div
      className={"ios-root relative w-full h-full overflow-hidden " + className}
      style={{
        height,
        background:
          "radial-gradient(55% 55% at 65% 50%, rgba(255,42,141,0.14), #050505)",
      }}
    >
      <canvas ref={canvasRef} className="ios-canvas" />
      {hud && (
        <>
          <div className="ios-hud ios-top" aria-hidden="true">
            <span ref={headingRef} className="text-[#e5ff40]">
              N 000°
            </span>
            {label && <span className="text-[#ff2a8d]">{label}</span>}
          </div>
          <div className="ios-hud ios-bottom" aria-hidden="true">
            <span className="text-neutral-500">{hint}</span>
            <span className="text-[#e5ff40]">
              {"seed " + String(seed).padStart(5, "0")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const INK_ORBIT_BG_CSS = `
.ios-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;max-width:none;pointer-events:none;animation:ios-fade 1.2s ease both}
.ios-hud{position:absolute;left:24px;right:24px;display:flex;justify-content:space-between;gap:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;letter-spacing:.06em;pointer-events:none;font-variant-numeric:tabular-nums;z-index:5}
.ios-top{top:20px}
.ios-bottom{bottom:20px}
@keyframes ios-fade{from{opacity:0}to{opacity:1}}
`;

export default FeatureSteps;
