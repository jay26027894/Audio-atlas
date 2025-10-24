<!--
  MessageBubble Component
  
  A presentational component that displays a single message in the chat interface.
  Messages are visually distinguished by author (user vs AI) through different
  colors and alignment.
  
  Props:
  - author: 'user' | 'ai' - Determines the styling and alignment of the message
  - text: string - The message content to display
  
  Accessibility:
  - Uses semantic HTML with appropriate ARIA roles
  - High contrast colors for readability
  - Clear visual distinction between user and AI messages
-->

<script lang="ts">
  /**
   * The author of the message: 'user' for user queries, 'ai' for AI responses
   */
  export let author: 'user' | 'ai';

  /**
   * The text content of the message
   */
  export let text: string;
</script>

<div
  class="message-bubble {author === 'user' ? 'user-message' : 'ai-message'}"
  role="article"
  aria-label="{author === 'user' ? 'User' : 'AI'} message"
>
  <div class="message-author">
    {author === 'user' ? 'You' : 'Audio Atlas'}
  </div>
  <div class="message-text">
    {text}
  </div>
</div>

<style>
  .message-bubble {
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    max-width: 80%;
    word-wrap: break-word;
  }

.user-message {
    background: #ffffff;
    color: #2d2d2d;
    margin-left: auto;
    text-align: left;
    border: 2px solid var(--chip);
    box-shadow: 0 2px 0 #00000008;
  }

  .ai-message {
    background: #fffef9;
    color: #2d2d2d;
    margin-right: auto;
    text-align: left;
    border: 2px dotted var(--chip);
    box-shadow: 0 2px 0 #00000005;
  }

.message-author {
    font: 800 0.7rem 'Space Grotesk', system-ui, sans-serif;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
    color: #6d6d6d;
  }

  .message-text {
    font: 400 0.98rem 'Space Grotesk', system-ui, sans-serif;
    line-height: 1.6;
    white-space: pre-wrap;
    color: #2d2d2d;
  }
</style>
