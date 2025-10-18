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
    background-color: #3b82f6; /* Blue for user */
    color: white;
    margin-left: auto;
    text-align: right;
  }

  .ai-message {
    background-color: #374151; /* Dark gray for AI */
    color: #f3f4f6;
    margin-right: auto;
    text-align: left;
  }

  .message-author {
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    opacity: 0.8;
  }

  .message-text {
    font-size: 0.95rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }
</style>
