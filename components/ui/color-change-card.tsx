"use client";

import React from "react";
import { ArrowUpRight, Scan, Globe, Activity, ShieldCheck } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

interface CardItem {
  heading: string;
  description: string;
  moduleTag: string;
  imgSrc: string;
  icon: React.ReactNode;
  onSelectModule?: () => void;
}

const TRINETRA_FEATURE_CARDS: CardItem[] = [
  {
    heading: "QR & VPA Forensics",
    moduleTag: "MODULE A // PRE-PAYMENT SCANNER",
    description:
      "Decodes raw upi://pay links before payment to compare the person or brand you think you are paying against the actual bank handle receiving your money.",
    imgSrc:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    icon: <Scan className="w-6 h-6" />,
  },
  {
    heading: "TinyFish Web Intel",
    moduleTag: "MODULE B // REMOTE LINK SANDBOX",
    description:
      "Autonomous TinyFish web agents open suspicious electricity bill, Fastag KYC, and refund links in an isolated sandbox to expose fake PIN and OTP forms.",
    imgSrc:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    heading: "Transaction DNA",
    moduleTag: "MODULE C // SCAM WAVE CLUSTERING",
    description:
      "Groups related scam messages, coercion phrases, and mule bank accounts using HDBSCAN clustering to spot coordinated scam waves before they spread.",
    imgSrc:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    heading: "Analyst Review Hub",
    moduleTag: "MODULE D // LIVE BLACKLIST & 1930 FIR",
    description:
      "Human-in-the-loop operations console backed by Supabase to confirm flagged scam UPI IDs, update detection weights, and export 1930 cybercrime reports.",
    imgSrc:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
];

export default function ColorChangeCards({
  onNavigateModule,
}: {
  onNavigateModule?: (index: number) => void;
}) {
  return (
    <section className="relative w-full bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden">
      {/* ─── WebGL Shader Animation Background (TriNETRA Theme: Hot Pink & Chartreuse) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-55">
        <ShaderAnimation speed={0.035} opacity={0.75} />
        {/* Soft radial vignette to preserve card readability and section borders */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#050505_95%]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header matching Landing Page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-7 bg-[#ff2a8d]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff2a8d]">
                CORE PLATFORM CAPABILITIES // 4-MODULE DEFENSE GRID
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Four layers of defense.{" "}
              <span className="block font-serif italic font-normal text-[#ff2a8d] mt-1">
                Zero blind spots.
              </span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm sm:text-base max-w-md leading-relaxed">
            Hover over any intelligence module below to inspect how त्रिNETRA verifies
            recipients, links, and emerging scam campaigns in real time.
          </p>
        </div>

        {/* 2x2 ColorChangeCards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRINETRA_FEATURE_CARDS.map((card, idx) => (
            <ColorChangeCard
              key={card.heading}
              heading={card.heading}
              moduleTag={card.moduleTag}
              description={card.description}
              imgSrc={card.imgSrc}
              icon={card.icon}
              onClick={() => onNavigateModule?.(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ColorChangeCard({
  heading,
  moduleTag,
  description,
  imgSrc,
  icon,
  onClick,
}: CardItem & { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative h-80 sm:h-96 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f] cursor-pointer transition-all duration-500 hover:border-[#ff2a8d] hover:shadow-[0_0_45px_-10px_rgba(255,42,141,0.45)]"
    >
      {/* Background Image that Saturates & Scales on Hover */}
      <div
        className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-25 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-45"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />

      {/* Color-Change Overlay: shifts from Obsidian Black to Hot Pink/Crimson Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-[#050505]/40 transition-colors duration-500 group-hover:from-[#ff2a8d]/90 group-hover:via-[#2a0617]/85 group-hover:to-[#050505]/50" />

      {/* Card Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        {/* Top Row: Module Tag & Animated Arrow */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#e5ff40] group-hover:border-[#e5ff40] group-hover:bg-black/80 transition-colors">
            {icon}
            {moduleTag}
          </span>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#e5ff40] group-hover:text-black group-hover:border-[#e5ff40]">
            <ArrowUpRight className="w-6 h-6 transition-transform duration-500" />
          </div>
        </div>

        {/* Bottom Row: Animated Letter Heading & Description */}
        <div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {heading.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
                style={{ transitionDelay: `${index * 18}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h3>
          <p className="text-sm sm:text-base text-neutral-300 group-hover:text-white leading-relaxed transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
