# Audio Atlas — Homepage Blueprint (Chrome Built‑in AI Challenge 2025)

This document is the single source of truth for the homepage content, structure, and design. It maps directly to the hackathon judging criteria and Google’s Three Pillars of on‑device AI.

---

## Global Framing (applies to every section)
- Brand voice: confident, helpful, accessibility‑first; short verbs; avoid jargon; outcome‑oriented.
- Visual system: cream background `#FFFBF1`, ink text `#151515`, highlight yellow `#FFD21F`, soft chip border `#E6DECE`; generous whitespace; dotted “chip” cards; subtle shadows.
- Type: Playfair Display (headlines), Space Grotesk (UI/body), JetBrains Mono (code/paths). Respect `prefers-reduced-motion`.
- Layout: max content width 1100px; 12‑column grid; section paddings 64–80px desktop, 32–48px mobile; sticky yellow anchor bar linking: `What` • `Demo` • `Personas` • `Tech` • `Install`.
- CTAs: primary (black bg, yellow text), secondary (ghost underline). Microcopy reinforces on‑device privacy/offline.
- Accessibility: WCAG AA, semantic landmarks, visible focus rings, alt text, captions, aria‑live on status, keyboard‑first flows.

---

## 1) Hero — A Clear and Powerful First Impression
**Purpose:** Deliver value instantly; enable a one‑click start; surface on‑device privacy and offline.

- Headline options (choose one):
  1. Give Your Data a Voice
  2. Ask Your Charts and Audio, Get Clear Answers
  3. See Less. Know More. On‑device.
- Sub‑headline (one sentence):
  > Audio Atlas turns images, diagrams, maps, and audio into conversational answers—built for accessibility and built for speed, on your device.
- Primary CTA: **Upload Image or Audio to Start**  
  Microcopy: “Private by design — processed on your device.”
- Secondary CTAs: **Try a Sample** • **Install Chrome Extension** (right‑click any image → Analyze with Audio Atlas)
- Visuals: subtle background animation morphing a waveform → bar chart → network diagram. Parallax three sample input chips (chart, Krebs cycle, waveform). Disable/reduce motion on `prefers-reduced-motion`.
- Optional proof strip: • Offline • Screen‑reader friendly • ≤60s demo

---

## 2) How It Works — Simplicity and Clarity (3 steps)
**Purpose:** Remove ambiguity; show low friction; map to extension + chat.

Layout: three equal columns (stack on mobile). Each card uses a dotted chip background.

1) **Upload or Send**  
   Drag an image, diagram, map, or audio — or right‑click any image in Chrome and choose “Analyze with Audio Atlas.”  
   Subpoint: Analyst’s Workflow collects multiple assets into one session.  
   Icon: folder‑with‑plus + Chrome context menu.

2) **Ask Anything**  
   Ask in text or voice — “Which bar is highest?”, “Label the steps,” or “Where’s the peak frequency?”  
   Subpoint: “Explain It Simpler” and on‑the‑fly translation are one click away.  
   Icon: chat bubble + microphone.

3) **Get Instant Answers**  
   Responses are generated on‑device for privacy, speed, and reliability — even offline.  
   Subpoint: Answers cite exact visual references (e.g., “Row 3, Column 2”).  
   Icon: shield‑with‑bolt.

Inline CTA row: **Start with a sample chart** • **Record a voice question** • **Open Insights Board**

---

## 3) Dual‑Persona Showcase — The Heart of the Story
**Purpose:** Connect emotionally (accessibility) and practically (productivity). Two sub‑sections.

### A) Anjali’s Story — Accessibility & Empowerment
- Headline: **Unlocking a World of Knowledge**
- Visual: Scientific figure (e.g., Krebs cycle) framed with visible “Simplify” and “Translate labels” toggles; screen‑reader “Live region: enabled” badge.
- Problem (quote):  
  > “It feels like the most important conversations in my field are happening in a language I’m not allowed to speak.”
- Solution (short paragraph):  
  Audio Atlas makes complex visuals speak. Anjali uploads a diagram, asks questions in her own words, and receives step‑wise, referenced explanations that can be simplified or translated on the fly. She moves from dependence to independent discovery.
- Feature highlights:
  - Explain It Simpler — one‑click rewrite tuned for clarity.
  - On‑the‑Fly Translation — detects non‑English labels and translates them inline.
  - Voice‑first flow — mic shortcut, captions, keyboard‑first controls.
- Micro‑CTA: **Experience the Accessibility Flow** (prefilled Krebs cycle demo; focus on mic button).

### B) David’s Story — Professional Speed & Scale
- Headline: **Supercharge Your Analysis Workflow**
- Visual: Right‑click context menu over a business dashboard + “Insights Board” with multi‑image notes and “Generate Summary Report.”
- Problem (quote):  
  > “If I could just ask, ‘What was the CAGR for the APAC region in Q3?’… I’d save hours every week.”
- Solution (short paragraph):  
  Audio Atlas eliminates tab‑hopping and manual data wrangling. David right‑clicks a chart in Chrome, asks precise questions, and gets referenced answers. Multiple visuals roll into a single session, then produce a shareable summary in seconds.
- Feature highlights:
  - Chrome Extension — right‑click any image → Analyze with Audio Atlas.
  - Multi‑Image Report Builder — accumulate findings, then generate a clean executive summary.
  - Traceable answers — references call out legends, series, and axes explicitly.
- Micro‑CTA: **Try the Analyst’s Workflow** (sample dashboard + pre‑seeded questions).

---

## 4) Technology & Trust — The Technical Showcase
**Purpose:** Speak to judges and technical users about why it’s innovative.

- Headline: **Powerful AI, Built for Privacy and Speed**
- Three Pillars (three‑column layout with icons):
  - **Inherent Privacy (On‑device):** Your data never leaves the device. Visuals and audio are analyzed locally using Chrome’s built‑in AI, so sensitive charts and recordings stay yours.
  - **Network‑Resilient UX (Offline):** Works even without internet. Demos run fully offline, so classrooms, labs, and fieldwork don’t block understanding.
  - **Creative & Economic Freedom (Zero Server Cost):** No server round‑trips or per‑query fees. Organizations deploy at scale without usage lock‑in; students get access without paywalls.
- Compact spec row (pills): **SvelteKit UI** • **On‑device multimodal** • **Voice I/O** • **Extension integration** • **Accessibility‑first**
- Validation cues (optional, subdued): Latency target < 800ms for common VQA • Local‑only toggle visible • Offline badge active when no network.

---

## 5) Final Call to Action — Close Strong
- Headline: **Ready to Give Your Data a Voice?**
- Primary CTA: **Try Audio Atlas Now** (scroll to hero upload)
- Secondary CTA: **Install the Chrome Extension**
- Support link (quiet): **See the 60‑Second Demo Script**
- Footer microcopy: Built for inherent privacy | Works offline | Free to use

---

## Implementation Guidance for Dev Team
- Information architecture: sticky yellow anchor bar linking `#what`, `#demo`, `#personas`, `#tech`, `#install`. Section order: Hero → How It Works → Personas → Tech & Trust → Final CTA. Max width 1100px; dotted borders `#E6DECE`; 12–16px radius.
- Components:
  - Hero: Title, subhead, primary/secondary CTAs, motion backdrop, proof chips.
  - Steps: `StepCard(icon, title, text, subpoint)`.
  - PersonaPanel: visual, quote, solution, feature bullets, micro‑CTA.
  - TechPillars: three PillarCards + SpecChips row.
  - FinalCTA: headline + two buttons + small demo link.
- Content rules: sentences ≤ 18 words; bullets start with verbs; avoid filler; pair claims with proof cues (on‑device badge, offline badge, references).
- Accessibility checklist: keyboard path to every CTA; focus rings; aria‑live on upload/answer; alt text; single `<h1>` in hero; semantic landmarks; contrast ≥ AA; language toggle announces target language.
- Performance & motion: defer animation; respect `prefers-reduced-motion`; hero animation ≤150KB; lazy‑load imagery; CSS parallax only.
- Measurement (optional): track hero upload, install clicks, persona micro‑CTAs; funnel (upload → first Q → answer).

### 60‑Second Judge Demo Script
1) Drop sample chart → ask “Which bar is highest?” (on‑device, instant).  
2) Toggle “Explain It Simpler”; show “Translate labels” on a diagram.  
3) Right‑click sample chart in Chrome → Analyze → ask “CAGR for APAC in Q3?”.  
4) Open Insights Board → “Generate Summary Report” → show offline badge.
