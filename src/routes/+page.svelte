<!-- Ping Pong–style Home Revamp -->

<script lang="ts">
  import { goto } from '$app/navigation';
  export let params: Record<string, string>;
  export let data: unknown;
  $: void params; $: void data;
</script>

<svelte:head>
  <title>Audio Atlas — Home</title>
  <meta name="description" content="A tiny‑mighty AI tool. Working with like‑minded people on projects that run, not walk." />
</svelte:head>

<div class="page">
  <!-- HERO: big typographic statement -->
  <section class="hero">
    <img src="/req/logo.png" alt="Audio Atlas logo" class="brand-badge" width="120" height="120" />
    <p class="lede">On‑device • Accessible • Fast</p>
    <h1 class="display">Give Your Data a Voice</h1>
    <p class="aside">Audio Atlas turns images, diagrams, maps, and audio into conversational answers—built for accessibility and built for speed, on your device.</p>
    <div class="cta-row">
      <button class="btn primary" on:click={() => goto('/upload')}>Upload Image or Audio to Start</button>
    </div>
    <div class="micro">Private by design — processed on your device.</div>
  </section>

  <!-- YELLOW STACK: punchy links/sections -->
  <!-- Homepage sections per blueprint -->
  <main class="content">
    <!-- How It Works -->
    <section class="section-card" id="how">
      <h2 class="section-title">How it works</h2>
      <div class="step-grid">
        <div class="step">
          <h3>1) Upload or Send</h3>
          <p>Drag an image, diagram, map, or audio — or right‑click any image in Chrome and choose <code>Analyze with Audio Atlas</code>.</p>
          <small>Analyst’s Workflow collects multiple assets into one session.</small>
        </div>
        <div class="step">
          <h3>2) Ask Anything</h3>
          <p>Ask in text or voice — “Which bar is highest?”, “Label the steps,” or “Where’s the peak frequency?”.</p>
          <small>“Explain It Simpler” and on‑the‑fly translation are one click away.</small>
        </div>
        <div class="step">
          <h3>3) Get Instant Answers</h3>
          <p>Responses are generated on‑device for privacy, speed, and reliability — even offline.</p>
          <small>Answers cite exact visual references (e.g., “Row 3, Column 2”).</small>
        </div>
      </div>
    </section>

    <!-- Personas -->
    <section class="section-card" id="personas">
      <h2 class="section-title">Why it matters</h2>
      <div class="personas">
        <!-- Anjali -->
        <article class="persona">
          <div class="visual placeholder" aria-hidden="true"><span>Krebs cycle (demo)</span></div>
          <div class="copy">
            <h3>Unlocking a World of Knowledge</h3>
            <blockquote>“It feels like the most important conversations in my field are happening in a language I’m not allowed to speak.”</blockquote>
            <p>Audio Atlas makes complex visuals speak. Upload a diagram, ask naturally, and get step‑wise, referenced explanations you can simplify or translate on the fly — moving from dependence to independent discovery.</p>
            <ul class="bullets">
              <li>Explain It Simpler — one‑click rewrite for clarity</li>
              <li>On‑the‑Fly Translation — detect and translate labels inline</li>
              <li>Voice‑first flow with captions and keyboard shortcuts</li>
            </ul>
          </div>
        </article>
        <!-- David -->
        <article class="persona">
          <div class="visual placeholder" aria-hidden="true"><span>Dashboard (demo)</span></div>
          <div class="copy">
            <h3>Supercharge Your Analysis Workflow</h3>
            <blockquote>“If I could just ask, ‘What was the CAGR for the APAC region in Q3?’… I’d save hours every week.”</blockquote>
            <p>Right‑click any chart in Chrome, ask precise questions, and get traceable answers. Collect multiple visuals into one session and generate a shareable summary in seconds.</p>
            <ul class="bullets">
              <li>Chrome Extension — right‑click → Analyze with Audio Atlas</li>
              <li>Multi‑Image Report Builder — accumulate findings, export summary</li>
              <li>Traceable answers — explicit references to legends, axes, series</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- Technology & Trust -->
    <section class="section-card" id="tech">
      <h2 class="section-title">Powerful AI, built for privacy and speed</h2>
      <div class="pillar-grid">
        <div class="pillar">
          <h3>Inherent Privacy</h3>
          <p>Your data never leaves the device. Visuals and audio are analyzed locally using Chrome’s built‑in AI.</p>
        </div>
        <div class="pillar">
          <h3>Network‑Resilient UX</h3>
          <p>Works even without internet. Demos run fully offline — great for classrooms, labs, or fieldwork.</p>
        </div>
        <div class="pillar">
          <h3>Creative & Economic Freedom</h3>
          <p>No server round‑trips or per‑query fees. Deploy at scale without lock‑in; keep access free for students.</p>
        </div>
      </div>
      <ul class="spec-chips">
        <li>SvelteKit UI</li><li>On‑device multimodal</li><li>Voice I/O</li><li>Extension integration</li><li>Accessibility‑first</li>
      </ul>
    </section>

    <!-- Final CTA -->
    <section class="final-cta" id="install">
      <h2 class="final-title">Ready to give your data a voice?</h2>
      <div class="cta">
        <button class="btn primary" on:click={() => goto('/upload')}>Try Audio Atlas Now</button>
      </div>
      <div class="micro-cta">
        <button class="ghost" type="button" on:click={() => goto('/analysis')}>Install the Chrome Extension</button>
      </div>
    </section>
  </main>

</div>

<style>
:root { --ink:#151515; --cream:#fffbf1; --yellow:#ffd21f; --line:#0f0f0f; --chip:#e6dece; }
  .page{background:var(--cream)}

  /* HERO */
  .hero{max-width:1100px;margin:0 auto;padding:6rem 1.25rem 3rem;text-align:center}
  .lede{font:600 1.75rem 'Playfair Display',serif;color:var(--ink);font-style:italic;margin:0 0 .75rem}
  .display{margin:0;color:var(--ink);font-family:'Playfair Display',serif;font-weight:700;line-height:1.1;letter-spacing:-.5px}
  .display{font-size:clamp(2.2rem,5vw,4rem)}
  .aside{margin:.5rem 0 0;color:#6d6d6d;font:500 .95rem 'Space Grotesk',system-ui,sans-serif}
  .cta-row{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.75rem}
  .micro{margin-top:.35rem;color:#6d6d6d;font:500 .95rem 'Space Grotesk',system-ui,sans-serif}

  /* CONTENT CARDS */
  .content { max-width: 1000px; margin: 0 auto; padding: 2rem 1.25rem 0; }
  .section-card { background:#ffffff; border:2px solid var(--chip); border-radius:16px; padding:1.25rem 1.25rem 1rem; margin:1rem 0; box-shadow:0 2px 0 #00000010 }
  .section-title { margin:0 0 .75rem 0; color:#1f1f1f; font:800 1.35rem 'Space Grotesk', system-ui, sans-serif; letter-spacing:.04em; text-transform:uppercase }

  /* Apply "footnotes" sans look to How/Why sections */
  #how .section-title,
  #tech .section-title { font-family:'Space Grotesk',system-ui,sans-serif; text-transform:uppercase; letter-spacing:.15em; font-weight:900; font-size:1.4rem }
  #how .step h3 { font-family:'Space Grotesk',system-ui,sans-serif; text-transform:uppercase; letter-spacing:.15em; font-weight:900 }
  #tech .pillar h3 { font-family:'Space Grotesk',system-ui,sans-serif; text-transform:uppercase; letter-spacing:.15em; font-weight:900 }
  .feature-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:.75rem; padding-left:1rem; }
  .feature-grid li { background:#fffef9; border:2px dotted var(--chip); border-radius:14px; padding:.7rem .85rem; color:#2e2e2e; font:600 .98rem 'Space Grotesk', system-ui, sans-serif; }
  .howto { padding-left:1.25rem; color:#3d3d3d; line-height:1.7; }
  .howto code { background:#fff2b340; padding:.08rem .4rem; border-radius:6px; border:1px solid var(--chip); font-family:'JetBrains Mono', monospace; font-size:.85em; }
  .hint { margin-top:.6rem; color:#6b6b6b; font-size:.95rem; font-style:italic }
  .stack { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:.6rem; padding:0; margin:0; list-style:none; }
  .stack li { background:#fffef9; border:2px dotted var(--chip); border-radius:12px; padding:.55rem .8rem; color:#2e2e2e; font:600 .95rem 'Space Grotesk', system-ui, sans-serif; }

  .btn { border: 2px solid var(--line); background: #fff; color: #111; border-radius: 12px; padding: .8rem 1.1rem; cursor: pointer; font: 800 1rem 'Space Grotesk', system-ui, sans-serif; letter-spacing:.04em }
  .btn:hover { transform: translateY(-1px); }
  .btn.primary { background: #111; color: #ffd21f; border-color: #111; }
  .btn.primary:hover { background: #000; }
  .cta { display:flex; justify-content:center; padding-top:.5rem; }

  /* Steps */
  .step-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.75rem}
  .step{background:#fffef9;border:2px dotted var(--chip);border-radius:14px;padding:.9rem}
  .step h3{margin:0 0 .25rem 0;font:700 1.05rem 'Space Grotesk',system-ui,sans-serif}
  .step p{margin:.25rem 0;color:#2e2e2e}
  .step small{color:#6b6b6b}
  .ghost{color:#111;text-decoration:underline;background:none;border:0;padding:0;font:inherit;cursor:pointer}

  /* Personas */
  .personas{display:grid;grid-template-columns:1fr;gap:1rem}
  @media (min-width: 900px){.personas{grid-template-columns:1fr 1fr}}
  .persona{display:grid;grid-template-columns:1fr;gap:.75rem;background:#ffffff;border:2px solid var(--chip);border-radius:16px;padding:1rem}
  .persona .visual{height:160px;background:#f6efe0;border:2px dashed var(--chip);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#6b6b6b;font-weight:700}
  .persona h3{margin:.25rem 0 .25rem 0}
  .persona blockquote{margin:.25rem 0;color:#494949;font-style:italic}
  .bullets{margin:.25rem 0 0 1.1rem}
  .micro-cta{margin-top:.5rem}

  /* Pillars */
  .pillar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.75rem}
  .pillar{background:#fffef9;border:2px dotted var(--chip);border-radius:14px;padding:.85rem}
  .pillar h3{margin:0 0 .25rem 0}
  .spec-chips{list-style:none;display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0 0;padding:0}
  .spec-chips li{background:#fffef9;border:2px dotted var(--chip);border-radius:999px;padding:.35rem .6rem;font-weight:700}

  /* Final CTA */
  .final-cta{background:#ffffff;border:2px solid var(--chip);border-radius:16px;padding:1.25rem;margin:1.25rem 0;text-align:center}
  .final-title{margin:0 0 .5rem 0;font:800 1.4rem 'Space Grotesk',system-ui,sans-serif}

  @media (max-width: 768px) {
    .display { font-size: 2.25rem; }
  }

  .brand-badge{ display:block; margin:0 auto .5rem; border-radius:999px; box-shadow:0 2px 0 #00000010; }

  /* Anchor offset for smooth scroll */
  #how, #personas, #tech, #install { scroll-margin-top: 80px; }
</style>
