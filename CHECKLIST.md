# त्रिNETRA — 24-Hour Hackathon Execution Checklist & Milestones

This checklist serves as the operational roadmap for the 24-hour sprint, tracking deliverables across all 4 modules, the hero page, and each team member's role.

---

## 🕒 Master 24-Hour Timeline Tracker

| Phase | Time Window | Focus Area | Status |
|---|---|---|---|
| **Phase 1** | Hours 00:00 – 02:00 | Repository setup, shadcn architecture, API contracts & env config | ✅ **COMPLETED** |
| **Phase 2** | Hours 02:00 – 05:00 | Liquid Sculpture Hero, UI scanner skeleton & initial QR rules | 🟡 **IN PROGRESS** |
| **Phase 3** | Hours 05:00 – 08:00 | Mandatory TinyFish Fetch remote browser integration & evidence display | ⬜ PENDING |
| **Phase 4** | Hours 08:00 – 11:00 | NLP message analysis, URL risk scoring & behavior heuristics | ⬜ PENDING |
| **Phase 5** | Hours 11:00 – 14:00 | TinyFish Search & brand verification agent | ⬜ PENDING |
| **Phase 6** | Hours 14:00 – 17:00 | Transaction DNA vectorization & HDBSCAN campaign clustering | ⬜ PENDING |
| **Phase 7** | Hours 17:00 – 20:00 | Analyst portal, campaign confirmation loop & privacy safeguards | ⬜ PENDING |
| **Phase 8** | Hours 20:00 – 22:00 | End-to-end integration testing, latency tuning & bug fixes | ⬜ PENDING |
| **Phase 9** | Hours 22:00 – 24:00 | Feature freeze, slide deck finalization & rehearsed live demo | ⬜ PENDING |

---

## 🎨 Hero Page & Frontend Design Checklist

- [x] **Project Structure Setup:**
  - [x] Next.js 16 with App Router and TypeScript (`tsconfig.json` with `@/*` aliases).
  - [x] Tailwind CSS v4 integration in `app/globals.css`.
  - [x] shadcn project directory configuration (`components.json`, `@/lib/utils.ts`).
  - [x] Standard `@/components/ui/` folder established.
- [x] **Liquid Sculpture Hero Component (`liquid-sculpture-hero.tsx`):**
  - [x] WebGL2 GPGPU particle physics simulation (~100,000 particles).
  - [x] Jet Black background (`#050505`) configured.
  - [x] Hot Pink particle animation & wake glow (`#ff2a8d`).
  - [x] High-voltage Chartreuse text highlights (`#e5ff40`).
  - [x] Centerpiece placement: Sacred त्रिNETRA mystical Third Eye logo embedded directly in the canvas.
  - [x] Cursor interaction: Material turns liquid on hover/pointer-drag, settles back into the crisp logo.
  - [x] Responsive layout: Mobile portrait aspect fallback + container query adaptions.
  - [x] Reduced motion accessibility (`prefers-reduced-motion`) support.
- [x] **Interactive Sentinel Scanner Sandbox (`app/page.tsx`):**
  - [x] Claimed recipient vs actual QR VPA input fields.
  - [x] Suspicious SMS/WhatsApp extortion message box.
  - [x] Phishing URL inspection trigger.
  - [x] Explainable composite risk score meter (0–100) with LOW / MEDIUM / HIGH indicators.
  - [x] Top 3 threat drivers breakdown.
  - [x] Live TinyFish DOM forensic crawl evidence card.

---

## 🛡️ Module-by-Module Technical Deliverables

### Module A: Pre-Payment Fraud Detection
- [x] Define weight distribution: Behavior (50%), NLP (20%), Phishing URL (15%), QR Mismatch (15%).
- [x] Implement claimed vs decoded QR beneficiary comparison logic.
- [ ] Connect Python QR decoder (`pyzbar` / `opencv`) on backend for camera/file uploads.
- [ ] Connect lightweight HuggingFace / scikit-learn NLP urgency classifier.
- [x] Build explainable reason generator for human readability.

### Module B: Mandatory TinyFish Live-Web Intelligence
- [ ] **TinyFish Fetch (Core Mandatory Goal):**
  - [ ] Configure `TINYFISH_API_KEY` in backend `.env`.
  - [ ] Implement `POST /inspect-url` calling TinyFish remote browsing.
  - [ ] Extract final resolved URL, page title, and suspicious `<form>` input fields.
  - [ ] Handle timeouts and connection errors gracefully without blocking payment score.
- [ ] **TinyFish Search:**
  - [ ] Implement `POST /search-scams` to crawl publicly reported scam indices.
  - [ ] Surface citation URLs and community reports in the UI.
- [ ] **TinyFish Agent (Stretch Goal):**
  - [ ] Autonomous brand domain verifier checking claimed entity vs official registry.

### Module C: Transaction DNA & Emerging Scam Detection
- [ ] Synthesize test dataset (200+ samples of electricity scams, lottery frauds, fake KYC).
- [ ] Compute 8-dimensional feature vector (amount bracket, hour of day, domain age, recipient variance, NLP vectors).
- [ ] Run HDBSCAN / DBSCAN clustering to group related events.
- [ ] Compute **Novelty Score** relative to existing confirmed scam signatures.
- [ ] Flag anomalous clusters for human analyst verification.

### Module D: Fraud Analyst Dashboard
- [ ] Build table view of flagged transactions and suspicious clusters.
- [ ] Display raw TinyFish inspection logs alongside user submission.
- [ ] Implement **Confirm Scam** and **Reject (False Positive)** buttons.
- [ ] Store confirmed scam patterns in SQLite database (`patterns.db`).

---

## 👥 Team Member Assignment Matrix

### Member 1 — Ashmit (Team Lead & TinyFish Lead)
- [ ] Oversee GitHub repo, branch policies, and deployment pipeline.
- [ ] Implement TinyFish Fetch backend client (`services/tinyfish.py`).
- [ ] Implement TinyFish Search & fallback mocks for safe offline demo.
- [ ] Orchestrate the 8-step live hackathon presentation flow.

### Member 2 — Parth (Frontend Lead)
- [x] Initialize Next.js, Tailwind v4, and shadcn component library.
- [x] Integrate `liquid-sculpture-hero.tsx` with Jet Black / Hot Pink / Chartreuse colorway.
- [ ] Polish camera QR scanner component for real-time mobile scanning.
- [ ] Connect frontend forms to FastAPI endpoints via TanStack Query or native fetch.
- [ ] Ensure mobile responsive layout across all screen breakpoints.

### Member 3 — Ankush (AI/ML & Heuristics Lead)
- [ ] Prepare clean synthetic dataset of Indian UPI fraud patterns.
- [ ] Write QR payload extraction regex (`pa`, `pn`, `am`, `cu`).
- [ ] Build NLP urgency scoring script using TF-IDF / small Transformer.
- [ ] Implement Transaction DNA vectorizer and HDBSCAN clustering script.

### Member 4 — Aman (Backend, DB & Analyst Portal)
- [ ] Bootstrap FastAPI application with CORS and Pydantic schemas.
- [ ] Implement SQLite database models (`Transaction`, `Campaign`, `AnalystReview`).
- [ ] Expose REST routes: `/check-payment`, `/inspect-url`, `/campaigns`.
- [ ] Build the Fraud Analyst Dashboard page with cluster inspection view.

---

## 🎬 Final 8-Step Hackathon Demo Storyboard

1. **Step 1:** Introduce the problem — UPI frauds in India tricking users into scanning QR codes or clicking fake KYC links.
2. **Step 2:** Land on the **त्रिNETRA** homepage — showcase the interactive WebGL2 liquid particle Third Eye hero.
3. **Step 3:** Enter a real-world scenario — victim receives an SMS claiming electricity disconnection.
4. **Step 4:** User enters the claimed SBI electricity recipient and uploads the scammer's QR code.
5. **Step 5:** **TriNETRA executes instant forensic check:** Flags immediate VPA mismatch (Actual: `quickpay.refund992@ybl`).
6. **Step 6:** **TinyFish Fetch in Action:** Remote crawler opens the malicious link in background, discovers a counterfeit banking form, and streams proof.
7. **Step 7:** **Transaction DNA Alert:** Identifies this transaction as part of an emerging cluster of 14 identical electricity scams.
8. **Step 8:** **Analyst Hub:** Switch to analyst view, inspect the cluster, and click **Confirm Campaign**, immediately blacklisting the pattern.

---

## 🔒 Security & Privacy Safeguards Checklist
- [x] Explicitly zero storage of UPI PINs, passwords, or OTPs.
- [x] Environment variables isolated on backend (`.env.example` created).
- [x] Remote browsing sandboxed via TinyFish (no SSRF vulnerability).
- [x] Synthetic transactions only for demo safety.
