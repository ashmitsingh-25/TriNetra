"use client";

import React, { useState } from "react";
import { Check, Shield, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const TRINETRA_FAQS: FAQItem[] = [
  {
    question: "Does त्रिNETRA ever ask for my UPI PIN, OTP, or bank password?",
    answer:
      "Never. त्रिNETRA operates on a strict zero-credential policy. We only inspect incoming QR codes, UPI IDs (pa/pn parameters), SMS text, and suspicious website links before you open your payment app.",
  },
  {
    question: "How does the ₹99 Sentinel Pro plan protect my family from UPI scams?",
    answer:
      "For ₹99/month, you get unlimited real-time QR & VPA mismatch checks, unlimited TinyFish live website inspections for electricity bill and KYC links, instant WhatsApp/SMS scam alerts, and family protection for up to 4 members.",
  },
  {
    question: "How does TinyFish check a suspicious link without infecting my phone?",
    answer:
      "When you paste a link into our TinyFish Intel tab, our remote web agent opens that webpage on an isolated cloud server—never on your device—and checks if the page contains hidden UPI PIN inputs or fake bank forms.",
  },
  {
    question: "What happens when an analyst confirms a scammer's UPI ID?",
    answer:
      "Confirmed scam UPI IDs and phishing domains are immediately added to our live Supabase blacklist and grouped into Transaction DNA scam waves, so any user scanning that QR code is warned immediately.",
  },
  {
    question: "Can I generate an official report for the 1930 National Cybercrime Portal?",
    answer:
      "Yes. Both Sentinel Pro users and Fraud Analysts can download a structured JSON/forensic evidence packet containing the decoded UPI link, scammer bank handle, and TinyFish website capture to attach to a 1930 complaint.",
  },
];

export default function Pricing({
  onGetStarted,
}: {
  onGetStarted?: () => void;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="relative w-full bg-[#050505] py-24 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden">
      {/* Ambient Pink/Chartreuse Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[720px] rounded-full bg-[#ff2a8d]/10 blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* PART A: PRICING HEADER & ₹99 CARDS */}
        <div className="text-left md:text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-[2px] w-7 bg-[#ff2a8d]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff2a8d]">
              SIMPLE TRANSPARENT PRICING & FAQS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Complete UPI protection{" "}
            <span className="block font-serif italic font-normal text-[#ff2a8d] mt-1">
              for just ₹99.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
            One prevented electricity bill or fake KYC scam saves thousands of rupees.
            Start free or unlock unlimited TinyFish web agents for ₹99/month.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-28">
          {/* Card 1: Citizen Basic (Free) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                CITIZEN STARTER
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">₹0</span>
                <span className="text-sm text-neutral-500">/ forever</span>
              </div>
              <p className="mt-3 text-sm text-neutral-400">
                Essential pre-payment QR verification for everyday UPI users.
              </p>

              <ul className="mt-8 space-y-3.5 text-sm text-neutral-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>Unlimited UPI QR Code & VPA Name Checks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>SMS & WhatsApp Urgency Tone Detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>5 TinyFish Live Website Scans / day</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>Community Scam VPA Blacklist Access</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onGetStarted}
              className="mt-10 w-full rounded-full border border-white/15 bg-white/[0.04] py-3.5 text-sm font-semibold text-white hover:border-white/35 hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Start Free Scan →
            </button>
          </div>

          {/* Card 2: Featured ₹99 Sentinel Pro Plan */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#ff2a8d] bg-gradient-to-b from-[#ff2a8d]/[0.12] via-[#0a0a0f] to-[#050505] p-8 shadow-[0_0_55px_-12px_rgba(255,42,141,0.5)] lg:-translate-y-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#ff2a8d] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5"/> MOST POPULAR • FULL PROTECTION
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#e5ff40]">
                  त्रिNETRA SENTINEL PRO
                </span>
                <Shield className="w-5 h-5 text-[#ff2a8d]"/>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-6xl font-extrabold text-white tracking-tight">
                  ₹99
                </span>
                <span className="text-sm text-neutral-400">/ month</span>
              </div>
              <p className="mt-3 text-sm text-neutral-300">
                Complete real-time UPI fraud prevention and autonomous TinyFish web protection for you and your family.
              </p>

              <ul className="mt-8 space-y-3.5 text-sm text-white">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#ff2a8d] shrink-0"/>
                  <span>Unlimited 3-Way QR & Bank Handle Forensics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#ff2a8d] shrink-0"/>
                  <span>Unlimited TinyFish Headless Website Inspections</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#ff2a8d] shrink-0"/>
                  <span>Live Transaction DNA Scam Wave Alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#ff2a8d] shrink-0"/>
                  <span>1-Click 1930 Cybercrime FIR Evidence Export</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#ff2a8d] shrink-0"/>
                  <span>Protects up to 4 Family Members (Parents & Seniors)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onGetStarted}
              className="mt-10 w-full rounded-full bg-[#ff2a8d] py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,42,141,0.65)] hover:bg-[#ff2a8d]/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Sentinel Pro for ₹99 <ArrowRight className="w-4 h-4"/>
            </button>
          </div>

          {/* Card 3: Merchant & PSP API */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                MERCHANT & FINTECH SHIELD
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">₹499</span>
                <span className="text-sm text-neutral-500">/ month</span>
              </div>
              <p className="mt-3 text-sm text-neutral-400">
                For shops, soundbox merchants, and security teams monitoring bulk UPI intents.
              </p>

              <ul className="mt-8 space-y-3.5 text-sm text-neutral-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>Everything in ₹99 Sentinel Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>Full Fraud Analyst Command & Review Hub</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>Soundbox QR Sticker Swap Tamper Protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#e5ff40] shrink-0"/>
                  <span>REST API Access (`/check-payment` & `/inspect-url`)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onGetStarted}
              className="mt-10 w-full rounded-full border border-[#e5ff40]/40 bg-[#e5ff40]/10 py-3.5 text-sm font-semibold text-[#e5ff40] hover:bg-[#e5ff40] hover:text-black transition-all cursor-pointer"
            >
              Open Analyst Portal →
            </button>
          </div>
        </div>

        {/* PART B: INTERACTIVE FAQS SECTION */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-white/10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-7 bg-[#ff2a8d]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff2a8d]">
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Everything you need{" "}
              <span className="font-serif italic font-normal text-[#ff2a8d]">
                to know.
              </span>
            </h3>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {TRINETRA_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="py-6">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#ff2a8d] transition-colors">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-neutral-400 transition-transform duration-300",
                        isOpen && "rotate-180 border-[#ff2a8d] text-[#ff2a8d]"
                      )}
                    >
                      <ChevronDown className="w-4 h-4"/>
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
