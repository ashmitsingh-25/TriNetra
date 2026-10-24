# त्रिNETRA (TriNETRA) — AI-Powered UPI Fraud Prevention & Scam Intelligence

> **Tagline:** *Stop UPI scams before payment. Detect new scam waves before they spread.*

[![Built for 24h Hackathon](https://img.shields.io/badge/Hackathon-24h%20Sprint-ff2a8d.svg)](https://github.com/siraman/trinetra)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-white.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Structure-black.svg)](https://ui.shadcn.com/)
[![TinyFish MCP](https://img.shields.io/badge/TinyFish-Live%20Web%20AI-e5ff40.svg)](https://docs.tinyfish.ai/)

---

## 1. Project Overview

**त्रिNETRA (TriNETRA)** is an AI-powered cybersecurity platform engineered for a 24-hour hackathon to combat UPI payment fraud in real time. It blends client-side pre-payment verification with autonomous live-web intelligence driven by **TinyFish** and campaign clustering algorithms.

Traditional banking systems react *after* funds have left the victim's account. TriNETRA intervenes **at the point of scan/intent**, intercepting fraudulent QR codes, fake utility notices, and counterfeit KYC portals before money is transferred.

---

## 2. Core System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │               USER / VICTIM                  │
                    │  Enters SMS/URL or Scans Payment QR Code     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   त्रिNETRA PLATFORM                                   │
│                                                                                        │
│  ┌────────────────────────┐   ┌────────────────────────┐   ┌────────────────────────┐  │
│  │       MODULE A         │   │       MODULE B         │   │       MODULE C         │  │
│  │  Pre-Payment Forensics │   │  TinyFish Web Intel    │   │    Transaction DNA     │  │
│  │                        │   │                        │   │                        │  │
│  │ • Claimed vs QR VPA    │   │ • TinyFish Fetch       │   │ • Feature vectorizing  │  │
│  │ • NLP Urgency Scoring  │   │   (Headless DOM Crawl) │   │ • HDBSCAN Clustering   │  │
│  │ • Behavioral Heuristics│   │ • TinyFish Search      │   │ • Novelty Wave Scoring │  │
│  │ • Signal Fusion (0-100)│   │   (Scam DB discovery)  │   │ • Campaign detection   │  │
│  └───────────┬────────────┘   └───────────┬────────────┘   └───────────┬────────────┘  │
│              │                            │                            │               │
│              └────────────────────────────┼────────────────────────────┘               │
│                                           │                                            │
│                                           ▼                                            │
│                               ┌────────────────────────┐                               │
│                               │       MODULE D         │                               │
│                               │  Fraud Analyst Portal  │                               │
│                               │                        │                               │
│                               │ • Review Emerging Wave │                               │
│                               │ • Confirm / Reject Hub │                               │
│                               │ • Feedback Loop to ML  │                               │
│                               └────────────────────────┘                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Module A: Pre-Payment Fraud Detection
- **QR Payload Forensics:** Decodes raw UPI intent links (`upi://pay?pa=...&pn=...`) and isolates the actual beneficiary VPA vs the user-claimed recipient.
- **Scam NLP Classifier:** Analyzes message urgency, extortion phrasing, and utility disconnection threats.
- **Explainable Risk Fusion:**
  $$\text{Risk Score} = 0.50 \times \text{Behavior} + 0.20 \times \text{NLP} + 0.15 \times \text{Phishing URL} + 0.15 \times \text{QR Mismatch}$$
- **Thresholds:**
  - **LOW (0–30):** Verified recipient, standard behavior.
  - **MEDIUM (31–65):** Unverified brand or unfamiliar domain.
  - **HIGH (66–100):** Destination VPA mismatch or active credential harvesting detected.

### Module B: Mandatory TinyFish Web Intelligence
- **TinyFish Fetch:** Uses autonomous remote browsing to inspect suspect links asynchronously without risking victim client devices. Inspects DOM structures, detects deceptive KYC forms, and identifies fraudulent payment gateways.
- **TinyFish Search:** Queries public search indices for known complaints, fraudulent phone numbers, and scam-domain associations.
- **TinyFish Agent:** Cross-references claimed corporate identities with official registries and verified domains.

### Module C: Transaction DNA & Emerging Scam Detection
- Encodes payment attributes, temporal signals, linguistic markers, and domain attributes into a unified embedding.
- Groups related transaction markers using similarity grouping and **HDBSCAN**.
- Computes a **Novelty Score** to distinguish variants of known campaigns from emergent zero-day scam waves.

### Module D: Fraud Analyst Dashboard
- Interactive console for fraud operations teams to inspect flagged clusters, view TinyFish DOM captures, and mark campaigns as **Confirmed Scam** or **Benign False Alarm**.

---

## 3. Design Aesthetics & Visual Identity

TriNETRA adopts an ultra-modern, high-contrast cyber-defense visual identity developed with Layoza design principles:

- **Jet Black Background (`#050505`):** Deep, distraction-free obsidian canvas.
- **Hot Pink WebGL2 Simulation (`#ff2a8d`):** GPU-simulated liquid particles flowing with real-time wake dynamics, fluid curl-noise turbulence, and interactive disturbance physics.
- **High-Voltage Chartreuse (`#e5ff40`):** Electric neon accents for critical data points, security status indicators, and actionable buttons.
- **Centerpiece Mystical Third Eye ("त्रिNETRA"):** The sacred all-seeing third eye logo seamlessly embedded in the particle field, dissolving into kinetic energy when hovered and settling back into crisp geometry.

---

## 4. Codebase Structure & Component Architecture

This repository is built following the official **shadcn/ui** and **Next.js App Router** standards:

```
trinetra/
├── app/
│   ├── globals.css                # Tailwind CSS v4 & theme tokens
│   ├── layout.tsx                 # Root layout with Geist & metadata
│   └── page.tsx                   # Master interactive landing page & scanner
├── components/
│   └── ui/
│       ├── demo.tsx               # Standalone hero demonstration
│       └── liquid-sculpture-hero.tsx  # WebGL2 GPGPU Liquid Hero component
├── lib/
│   └── utils.ts                   # shadcn cn() clsx + twMerge utility
├── public/
│   └── assets/
│       └── trinetra-logo.png      # High-res त्रिNETRA Center Third Eye logo
├── components.json                # shadcn configuration registry file
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # Path aliases (@/* -> ./*)
├── CHECKLIST.md                   # 24-Hour hackathon execution milestones
└── README.md                      # Complete system documentation
```

### Why `/components/ui` is the Default Path
The `/components/ui` convention is a foundational standard of the **shadcn/ui** architecture:
1. **Tooling & CLI Interoperability:** Running `npx shadcn@latest add <component>` reads `components.json` and places atomic, headless primitives directly into `@/components/ui`.
2. **Separation of Concerns:** Differentiates reusable low-level UI primitives (`/components/ui`) from complex domain-specific feature widgets (`/components/dashboard`, `/components/scanner`).
3. **TypeScript Path Mapping:** Enabled by `"@/*": ["./*"]` in `tsconfig.json`, ensuring clean, refactor-friendly import paths like `import SculptureHero from "@/components/ui/liquid-sculpture-hero"`.

---

## 5. Getting Started & Setup Guide

### Prerequisites
- Node.js 18.x or 20.x+
- npm 9+ or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/siraman/trinetra.git
cd trinetra

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live platform.

### Running Production Build
```bash
npm run build
npm run start
```

---

## 6. Backend API Contracts (FastAPI Specification)

For the parallel backend implementation by the team:

| Endpoint | Method | Description |
|---|---|---|
| `/check-payment` | `POST` | Ingests transaction fields and computes composite risk score with top 3 explainable drivers. |
| `/inspect-url` | `POST` | Dispatches TinyFish Fetch crawler to perform DOM forensics on suspect URL. |
| `/search-scams` | `POST` | Calls TinyFish Search to find correlated community reports for UPI VPA or phone. |
| `/verify-brand` | `POST` | Dispatches TinyFish Agent to cross-verify official entity domain and contact info. |
| `/campaigns` | `GET` | Fetches active HDBSCAN scam clusters with novelty scores. |
| `/campaigns/{id}/review` | `POST` | Analyst review feedback endpoint to confirm or reject campaign clusters. |

---

## 7. Hackathon Team Responsibilities

- **Member 1 (Ashmit — Team Lead & TinyFish):** TinyFish Fetch, Search, and Agent backend integration, risk fusion routing, demo coordination.
- **Member 2 (Parth — Frontend Developer):** Scanner UI, QR image upload, real-time risk alert badges, responsive mobile layout.
- **Member 3 (Ankush — AI/ML Developer):** Synthetic scam dataset, QR rule engine, NLP urgency model, Transaction DNA clustering.
- **Member 4 (Aman — Backend & Dashboard):** FastAPI server, SQLite database models, analyst review hub, input sanitization.

---

## 8. Privacy & Ethical Safeguards

1. **Zero Credential Collection:** TriNETRA **never** prompts for, accepts, or stores UPI PINs, OTPs, or net banking passwords.
2. **Data Minimization:** Raw phone numbers and names are pseudonymized into derived feature vectors.
3. **No Autonomous Payment Blocking:** This prototype serves as a decision-support advisory system and does not claim direct NPCI or banking authority.

---

## 9. License & Credits

Built with pride for the 24-Hour Cybersecurity & AI Hackathon.
Liquid particle physics engine adapted from Guglielmo Giannattasio.
Logo & concept: **त्रिNETRA Project Team**.
