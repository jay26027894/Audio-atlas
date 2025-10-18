<!--
  StatusIndicator Component
  
  Provides real-time feedback on the application's current state to users,
  especially important for screen reader users who need to know when the
  application is processing their request or speaking a response.
  
  This component subscribes to the appStateStore and displays different
  messages based on the current state (idle, listening, processing, speaking).
  
  Accessibility:
  - Uses aria-live="assertive" to immediately announce state changes
  - Visually hidden but accessible to screen readers
  - Critical for keeping visually impaired users informed of background activity
-->

<script lang="ts">
  import { appStateStore } from '$lib/stores/appStateStore';

  /**
   * Maps application states to user-friendly status messages
   */
  const statusMessages = {
    idle: '',
    listening: 'Listening for your voice input...',
    processing: 'Processing your query with AI...',
    speaking: 'Speaking response...',
  };

  /**
   * Reactive statement to get the current status message
   */
  $: statusMessage = statusMessages[$appStateStore];
  $: showVisualIndicator = $appStateStore !== 'idle';
</script>

<!-- Screen reader announcement (always present but visually hidden) -->
<div
  class="sr-only"
  aria-live="assertive"
  aria-atomic="true"
  role="status"
>
  {statusMessage}
</div>

<!-- Visual indicator (shown when not idle) -->
{#if showVisualIndicator}
  <div class="visual-status" role="status" aria-label="Application status">
    <div class="status-icon">
      {#if $appStateStore === 'listening'}
        🎤
      {:else if $appStateStore === 'processing'}
        ⚙️
      {:else if $appStateStore === 'speaking'}
        🔊
      {/if}
    </div>
    <span class="status-text">{statusMessage}</span>
  </div>
{/if}

<style>
  /* Screen reader only class - visually hidden but accessible */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .visual-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #1f2937;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
    border: 1px solid #374151;
  }

  .status-icon {
    font-size: 1.25rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
