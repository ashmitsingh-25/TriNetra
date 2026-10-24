"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VerticalBarsNoiseProps {
  children?: ReactNode;
  className?: string;
  barWidth?: number;
  barGap?: number;
}

export function VerticalBarsNoise({
  children,
  className,
  barWidth = 3,
  barGap = 14,
}: VerticalBarsNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Pseudo-Perlin 1D/2D harmonic noise generator
    const noise = (x: number, t: number) => {
      return (
        Math.sin(x * 0.045 + t * 0.9) * 0.45 +
        Math.sin(x * 0.11 - t * 1.4) * 0.35 +
        Math.cos(x * 0.23 + t * 0.6) * 0.2
      );
    };

    const render = (now: number) => {
      const t = now * 0.001;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const step = barWidth + barGap;
      const cols = Math.ceil(width / step);
      const { x: mx, y: my, active } = mouseRef.current;

      for (let i = 0; i < cols; i++) {
        const bx = i * step;
        const n = noise(i, t); // -1 to 1
        const normalized = (n + 1) * 0.5; // 0 to 1

        // Cursor proximity amplification
        const dx = active ? Math.abs(bx - mx) : 9999;
        const cursorBoost = active ? Math.max(0, 1 - dx / 240) : 0;

        const segmentHeight =
          height * (0.12 + normalized * 0.38 + cursorBoost * 0.25);
        const centerY =
          active && cursorBoost > 0.05
            ? height * 0.5 + (my - height * 0.5) * cursorBoost * 0.45
            : height * (0.48 + Math.sin(i * 0.08 + t * 0.5) * 0.12);

        const topY = centerY - segmentHeight * 0.5;

        // Baseline structural vertical guide line
        ctx.fillStyle = "rgba(255, 255, 255, 0.022)";
        ctx.fillRect(bx, 0, 1, height);

        // Animated noise bar gradient
        const grad = ctx.createLinearGradient(bx, topY, bx, topY + segmentHeight);
        if (cursorBoost > 0.35 || i % 7 === 0) {
          grad.addColorStop(0, "rgba(255, 42, 141, 0)");
          grad.addColorStop(
            0.5,
            `rgba(255, 42, 141, ${(0.08 + cursorBoost * 0.22).toFixed(3)})`
          );
          grad.addColorStop(1, "rgba(229, 255, 64, 0)");
        } else {
          grad.addColorStop(0, "rgba(255, 255, 255, 0)");
          grad.addColorStop(
            0.5,
            `rgba(255, 255, 255, ${(0.04 + normalized * 0.06).toFixed(3)})`
          );
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(bx, topY, barWidth, segmentHeight);

        // Peak energy tick mark
        if (normalized > 0.78 || cursorBoost > 0.5) {
          ctx.fillStyle =
            cursorBoost > 0.5
              ? "rgba(229, 255, 64, 0.45)"
              : "rgba(255, 42, 141, 0.35)";
          ctx.fillRect(bx, centerY - 1.5, barWidth, 3);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [barWidth, barGap]);

  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-[#050505] overflow-x-hidden",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
      {children && (
        <div className="relative z-10 w-full min-h-screen">{children}</div>
      )}
    </div>
  );
}

export default VerticalBarsNoise;
