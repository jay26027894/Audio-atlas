<!-- Upload Page: prompts for image upload, then redirects to /chat when ready -->

<script lang="ts">
  import ImageUploader from '$lib/components/ImageUploader.svelte';
  import { imageStore } from '$lib/stores/imageStore';
  import { goto } from '$app/navigation';

  $: if ($imageStore) {
    goto('/chat');
  }
</script>

<svelte:head>
  <title>Upload — Audio Atlas</title>
  <meta name="description" content="Upload a chart, diagram, or map to start analyzing it with Audio Atlas." />
</svelte:head>

<div class="container">
  <header class="header">
    <h1 class="title">Upload visual data</h1>
    <p class="sub">Add a chart, diagram, or map to begin.</p>
  </header>

  <main class="content">
    <ImageUploader />
  </main>
</div>

<style>
  .container { min-height: 100vh; background: #f8f5f2; display: flex; flex-direction: column; }
  .header { padding: 3rem 1.5rem 0.5rem; max-width: 960px; margin: 0 auto; }
  .title { margin: 0 0 0.35rem 0; color: #1f1f1f; font-family: 'Space Grotesk', system-ui, sans-serif; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; font-size: 1.6rem; }
  .sub { margin: 0; color: #6d6d6d; font: 500 .95rem 'Space Grotesk', system-ui, sans-serif; }
  .content { flex: 1; padding: 1rem 1.5rem 3rem; max-width: 960px; margin: 0 auto; }
</style>
