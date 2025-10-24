<!--
  ChatInterface Component
  
  Displays the conversation history between the user and the AI.
  This component subscribes to the conversationStore and renders each message
  using the MessageBubble component.
  
  Features:
  - Automatic scrolling to the latest message
  - Responsive layout
  - Accessible to screen readers with aria-live announcements
  
  Accessibility:
  - aria-live="polite" ensures new messages are announced to screen readers
  - Semantic HTML with proper roles
  - High contrast and readable typography
-->

<script lang="ts">
  import { conversationStore } from '$lib/stores/conversationStore';
  import { appStateStore } from '$lib/stores/appStateStore';
  import MessageBubble from './MessageBubble.svelte';
  import { onMount, afterUpdate } from 'svelte';

  /**
   * Reference to the chat container for auto-scrolling
   */
  let chatContainer: HTMLElement;

  /**
   * Scrolls the chat container to the bottom to show the latest message
   */
  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  /**
   * Scroll to bottom when component mounts
   */
  onMount(() => {
    scrollToBottom();
  });

  /**
   * Scroll to bottom after each update (new message added)
   */
  afterUpdate(() => {
    scrollToBottom();
  });
</script>

<div class="chat-interface">
  <div
    class="chat-container"
    bind:this={chatContainer}
    role="log"
    aria-live="polite"
    aria-label="Conversation history"
  >
    {#if $conversationStore.length === 0}
      <div class="empty-state">
        <p class="empty-state-icon" aria-hidden="true">💬</p>
        <p class="empty-state-text">
          Ask a question about the image to start the conversation
        </p>
        <div class="example-queries">
          <p class="example-title">Try asking:</p>
          <ul class="example-list">
            <li>"Give me a high-level summary of this diagram"</li>
            <li>"What are the main data points in this chart?"</li>
            <li>"Describe the flow from start to finish"</li>
            <li>"What's the highest value shown?"</li>
          </ul>
        </div>
      </div>
    {:else}
      {#each $conversationStore as message (message)}
        <MessageBubble author={message.author} text={message.text} />
      {/each}
      
      <!-- Show typing indicator when AI is processing -->
      {#if $appStateStore === 'processing'}
        <div class="typing-indicator" role="status" aria-label="AI is thinking">
          <div class="typing-bubble">
            <div class="typing-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="typing-text">AI is analyzing...</span>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .chat-interface {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    border-radius: 16px;
    border: 2px solid var(--chip);
    box-shadow: 0 2px 0 #00000010;
  }

  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Custom scrollbar styling */
  .chat-container::-webkit-scrollbar {
    width: 8px;
  }

  .chat-container::-webkit-scrollbar-track {
    background: #fffef9;
    border-radius: 4px;
  }

  .chat-container::-webkit-scrollbar-thumb {
    background: #e6dece;
    border-radius: 4px;
  }

  .chat-container::-webkit-scrollbar-thumb:hover {
    background: #d7cdb8;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 2rem;
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state-text {
    font-size: 1.05rem;
    color: #6b6b6b;
    margin-bottom: 1.25rem;
  }

  .example-queries {
    background: #fffef9;
    padding: 1rem;
    border-radius: 12px;
    border: 2px dotted var(--chip);
    max-width: 520px;
    box-shadow: 0 2px 0 #00000008;
  }

  .example-title {
    font: 800 0.85rem 'Space Grotesk', system-ui, sans-serif;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #2d2d2d;
    margin: 0 0 0.5rem 0;
  }

  .example-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left;
  }

  .example-list li {
    padding: 0.45rem 0;
    color: #3a3a3a;
    font-size: 0.95rem;
    border-bottom: 1px dotted var(--chip);
  }

  .example-list li:last-child { border-bottom: none; }

  .example-list li::before {
    content: '→ ';
    color: var(--ink);
    font-weight: 800;
    margin-right: 0.5rem;
  }

  /* Typing Indicator Styles */
  .typing-indicator {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.5rem;
    animation: fadeIn 0.3s ease-in;
  }

  .typing-bubble {
    background: #fffef9;
    border: 2px dotted var(--chip);
    border-radius: 12px;
    padding: 0.6rem 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .typing-dots {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--ink);
    animation: bounce 1.4s infinite ease-in-out;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .typing-text {
    color: #9ca3af;
    font-size: 0.875rem;
    font-style: italic;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
