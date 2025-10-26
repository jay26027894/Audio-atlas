<!--
  Main Layout Component
  
  Wraps all pages, imports global styles, and provides site header + favicon.
-->

<script lang="ts">
  import '../app.css';
  import APIStatusIndicator from '$lib/components/APIStatusIndicator.svelte';
  
  // External props from SvelteKit - marked as used even though they're not directly referenced
  export const params: Record<string, string> = {};
  export const data: unknown = undefined;
</script>

<svelte:head>
  <!-- Favicon / App Icons: expects file at static/req/logo.png -->
  <link rel="icon" href="/req/logo.png" type="image/png" />
  <link rel="apple-touch-icon" href="/req/logo.png" />
  <meta name="theme-color" content="#fffbf1" />
  <!-- Fonts to match homepage -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="layout-container">
  <header class="site-header">
    <a href="/" class="brand" aria-label="Audio Atlas home">
      <img src="/req/logo.png" alt="Audio Atlas logo" class="brand-mark" width="40" height="40" loading="eager" />
      <span class="brand-text">Audio Atlas</span>
    </a>
  </header>

  <slot />
  
  <APIStatusIndicator />
</div>

<style>
  :root {
    --ink:#151515; 
    --cream:#FFF78A; 
    --yellow:#FFC47E; 
    --line:#0f0f0f; 
    --chip:#FFE382;
    --ring:#60a5fa;
  }

  .layout-container {
    background: #f8f5f2;
    color: #2d2d2d;
    min-height: 100vh;
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    overflow-x: hidden;
  }

  .site-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
  }

  .brand { 
    display: inline-flex; 
    align-items: center; 
    gap: .6rem; 
    color: inherit; 
    text-decoration: none; 
    border: 2px solid #0f0f0f; 
    background: #fff; 
    border-radius: 999px; 
    padding: .35rem .6rem .35rem .35rem;
  }

  .brand-mark { display:block; border-radius: 999px; }
  .brand-text { font: 800 .95rem 'Space Grotesk', system-ui, sans-serif; letter-spacing: .05em; }

  :global(*) { box-sizing: border-box; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    margin: 0; padding: 0; font-synthesis: none; text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }

  /* Visually hidden utility */
  :global(.sr-only) {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
</style>
