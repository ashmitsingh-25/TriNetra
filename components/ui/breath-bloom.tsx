"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreathBloomProps {
  children?: ReactNode;
  className?: string;
  petalCount?: number;
}

export default function BreathBloom({
  children,
  className,
  petalCount = 14,
}: BreathBloomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });
  const smoothPointerRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX / Math.max(1, width);
      pointerRef.current.y = e.clientY / Math.max(1, height);
      pointerRef.current.active = true;
    };

    const handleMouseLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // 12-second breathing cycle: 4s inhale, 4s hold, 4s exhale
    const getBreathPhase = (tSec: number) => {
      const cycle = tSec % 12;
      if (cycle < 4) {
        // 4s Inhale (ease in-out)
        const p = cycle / 4;
        return p * p * (3 - 2 * p);
      } else if (cycle < 8) {
        // 4s Hold with subtle micro-pulse
        return 1 + Math.sin(((cycle - 4) / 4) * Math.PI * 2) * 0.03;
      } else {
        // 4s Exhale (ease in-out)
        const p = 1 - (cycle - 8) / 4;
        return p * p * (3 - 2 * p);
      }
    };

    const render = (now: number) => {
      const tSec = now / 1000;
      const breath = getBreathPhase(tSec);

      // Smooth pointer interpolation
      const targetX = pointerRef.current.active ? pointerRef.current.x : 0.35 + breath * 0.3;
      const targetY = pointerRef.current.active ? pointerRef.current.y : 0.3 + breath * 0.45;
      smoothPointerRef.current.x += (targetX - smoothPointerRef.current.x) * 0.05;
      smoothPointerRef.current.y += (targetY - smoothPointerRef.current.y) * 0.05;

      const px = smoothPointerRef.current.x; // Sideways spreads petals
      const py = smoothPointerRef.current.y; // Downward grows petals

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.42;
      const baseRadius = Math.min(width, height) * (0.16 + breath * 0.1 + py * 0.14);
      const spreadFactor = 0.45 + px * 0.85;

      // Ambient core glow
      const ambientGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseRadius * 1.9);
      ambientGrad.addColorStop(0, "rgba(255, 42, 141, 0.14)");
      ambientGrad.addColorStop(0.55, "rgba(229, 255, 64, 0.03)");
      ambientGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tSec * 0.06);

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        const petalLength = baseRadius * (0.85 + 0.25 * Math.sin(tSec * 0.8 + i));
        const petalWidth = petalLength * 0.38 * spreadFactor;

        const grad = ctx.createLinearGradient(0, 0, 0, -petalLength);
        if (i % 3 === 0) {
          grad.addColorStop(0, "rgba(255, 42, 141, 0.02)");
          grad.addColorStop(0.7, "rgba(255, 42, 141, 0.12)");
          grad.addColorStop(1, "rgba(229, 255, 64, 0.22)");
        } else {
          grad.addColorStop(0, "rgba(255, 42, 141, 0.01)");
          grad.addColorStop(0.8, "rgba(255, 42, 141, 0.09)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -petalWidth,
          -petalLength * 0.35,
          -petalWidth * 0.65,
          -petalLength * 0.92,
          0,
          -petalLength
        );
        ctx.bezierCurveTo(
          petalWidth * 0.65,
          -petalLength * 0.92,
          petalWidth,
          -petalLength * 0.35,
          0,
          0
        );
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle =
          i % 3 === 0 ? "rgba(229, 255, 64, 0.18)" : "rgba(255, 42, 141, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [petalCount]);

  return (
    <div className={cn("relative w-full min-h-screen bg-[#050505] overflow-x-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
}
