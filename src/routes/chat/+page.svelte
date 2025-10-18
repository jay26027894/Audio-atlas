<!-- Chat Page: displays conversation UI; redirects to /upload if no image loaded -->

<script lang="ts">
  import ChatInterface from '$lib/components/ChatInterface.svelte';
  import UserInput from '$lib/components/UserInput.svelte';
  import StatusIndicator from '$lib/components/StatusIndicator.svelte';
  import { imageStore } from '$lib/stores/imageStore';
  import { goto } from '$app/navigation';

  $: if (!$imageStore) {
    goto('/upload');
  }
</script>

<svelte:head>
  <title>Chat — Audio Atlas</title>
  <meta name="description" content="Ask questions about your uploaded visual and get clear answers." />
</svelte:head>

<div class="container">
  <main class="content">
    <ChatInterface />
  </main>

  <footer class="footer">
    <UserInput />
    <StatusIndicator />
  </footer>
</div>

<style>
  .container { min-height: 100vh; background: #f8f5f2; display: flex; flex-direction: column; }
  .content { flex: 1; display: flex; padding: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  .footer { padding: 1rem 1.5rem 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }

  /* Inherit homepage heading style inside chat UI */
  :global(.content h1),
  :global(.content h2),
  :global(.content h3) {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: .15em;
    font-weight: 900;
  }

  @media (max-width: 768px) {
    .content { padding: 1rem; }
    .footer { padding: 0.75rem 1rem 1.5rem; }
  }
</style>
