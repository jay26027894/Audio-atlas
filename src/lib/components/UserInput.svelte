<!--
  UserInput Component
  
  Provides the interface for user input via text or voice.
  This component is the primary interaction point for users to ask questions
  about the uploaded image.
  
  Features:
  - Text input with Enter key submission
  - Voice input toggle button
  - Disabled state when AI is processing
  - Integration with speech recognition and AI processing
  
  Accessibility:
  - Semantic form element
  - Clear labels for all inputs
  - Dynamic aria-label for microphone button based on state
  - Keyboard accessible
  - Visual and programmatic feedback for all states
-->

<script lang="ts">
  import { conversationStore, getLastSimplifiableResponse } from '$lib/stores/conversationStore';
  import { appStateStore } from '$lib/stores/appStateStore';
  import { imageStore } from '$lib/stores/imageStore';
  import { startListening, stopListening, speak } from '$lib/utils/speech';
  import { getAiResponse } from '$lib/utils/ai';
  import { isSimplificationRequest, handleSimplificationRequest } from '$lib/utils/simplificationHelper';
  import SimplifyButton from './SimplifyButton.svelte';

  /**
   * The current text input value
   */
  let inputText = '';

  /**
   * Whether voice input is currently active
   */
  let isListening = false;

  /**
   * Reactive statement to determine if input should be disabled
   */
  $: isDisabled = $appStateStore === 'processing' || $appStateStore === 'speaking';

  /**
   * Handles form submission (text input)
   */
  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!inputText.trim() || isDisabled) {
      return;
    }

    await processQuery(inputText);
    inputText = '';
  }

  /**
   * Toggles voice input on/off
   */
  function toggleVoiceInput() {
    if (isListening) {
      // Stop listening
      stopListening();
      isListening = false;
      appStateStore.set('idle');
    } else {
      // Start listening
      const success = startListening(handleVoiceTranscript);
      if (success) {
        isListening = true;
        appStateStore.set('listening');
      } else {
        alert('Voice input is not supported in your browser or microphone access was denied.');
      }
    }
  }

  /**
   * Handles the transcript from voice recognition
   */
  async function handleVoiceTranscript(transcript: string) {
    isListening = false;
    appStateStore.set('idle');

    if (transcript.trim()) {
      await processQuery(transcript);
    }
  }

  /**
   * Processes a user query (from text or voice input)
   * This is the core orchestration function that:
   * 1. Adds the user's message to the conversation
   * 2. Calls the AI with the image, prompt, and conversation history
   * 3. Adds the AI's response to the conversation
   * 4. Speaks the response aloud
   * 
   * Enhanced for Feature Cluster D: The Accessibility Multiplier
   * - Detects simplification requests
   * - Uses Rewriter API for "Explain It Simpler" functionality
   */
  async function processQuery(query: string) {
    try {
      // Feature Cluster D: Check if this is a simplification request
      if (isSimplificationRequest(query)) {
        const lastResponse = getLastSimplifiableResponse($conversationStore);
        
        if (lastResponse) {
          // Add user message
          conversationStore.update((messages) => [
            ...messages,
            { author: 'user', text: query, timestamp: Date.now() },
          ]);

          // Set state to processing
          appStateStore.set('processing');

          // Handle simplification using Rewriter API
          const result = await handleSimplificationRequest(query, lastResponse);

          if (result.success && result.simplifiedText) {
            // Add simplified response
            conversationStore.update((messages) => [
              ...messages,
              { author: 'ai' as const, text: result.simplifiedText as string, timestamp: Date.now(), simplified: true },
            ]);

            // Speak the simplified response
            appStateStore.set('speaking');
            await speak(result.simplifiedText);

            // Return to idle state
            appStateStore.set('idle');
            return;
          }
        }
      }

      // Standard processing flow
      // Add user message to conversation
      conversationStore.update((messages) => [
        ...messages,
        { author: 'user', text: query, timestamp: Date.now() },
      ]);

      // Set state to processing
      appStateStore.set('processing');

      // Get the image from the store
      const image = $imageStore;
      if (!image) {
        throw new Error('No image loaded');
      }

      // Get conversation history (excluding the message we just added)
      const history = $conversationStore.slice(0, -1);

      // Call the AI
      const response = await getAiResponse(image, query, history);

      // Add AI response to conversation
      conversationStore.update((messages) => [
        ...messages,
        { author: 'ai', text: response, timestamp: Date.now() },
      ]);

      // Speak the response aloud
      appStateStore.set('speaking');
      await speak(response);

      // Return to idle state
      appStateStore.set('idle');
    } catch (error) {
      console.error('Error processing query:', error);

      // Improved error handling with better user feedback
      let errorMessage = 'An error occurred while processing your request.';
      let isRetryable = true;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide specific guidance based on error type
        if (errorMessage.includes('Chrome Built-in AI is not available')) {
          errorMessage = `🔄 **Fallback Mode Active**\n\n${errorMessage}\n\n💡 **To enable full AI capabilities:**\n• Update to Chrome Canary\n• Or add API keys to your .env file\n• Mock responses are currently enabled for testing`;
        } else if (errorMessage.includes('No fallback AI service available')) {
          errorMessage = `⚠️ **No AI Services Available**\n\n${errorMessage}\n\n🔧 **Quick fixes:**\n• Create a .env file based on .env.example\n• Add your OpenAI or Anthropic API key\n• Or set VITE_ENABLE_MOCK_RESPONSES=true for testing`;
          isRetryable = false;
        } else if (errorMessage.includes('API error')) {
          errorMessage = `🔌 **API Connection Error**\n\n${errorMessage}\n\n🔄 This might be temporary - you can try again.`;
        }
      }

      conversationStore.update((messages) => [
        ...messages,
        { 
          author: 'ai', 
          text: errorMessage,
        },
      ]);
      
      // For non-retryable errors, also log guidance to console
      if (!isRetryable) {
        console.warn('\n🔧 Configuration Help:');
        console.warn('1. Copy .env.example to .env');
        console.warn('2. Add your AI service API keys');
        console.warn('3. Or set VITE_ENABLE_MOCK_RESPONSES=true');
        console.warn('4. Restart the development server');
      }

      // Return to idle state
      appStateStore.set('idle');
    }
  }
</script>

<div class="user-input-container">
  <div class="input-section">
    <!-- Feature Cluster D: Simplify Button -->
    <SimplifyButton />
    
    <form on:submit={handleSubmit} class="input-form">
      <label for="query-input" class="sr-only">
        Ask a question about the image
      </label>

      <div class="input-group">
        <input
          id="query-input"
          type="text"
          bind:value={inputText}
          placeholder="Ask a question about the image..."
          disabled={isDisabled}
          class="text-input"
          aria-label="Query input"
        />
        
        <button
          type="button"
          on:click={toggleVoiceInput}
          disabled={isDisabled}
          class="control-btn voice-btn {isListening ? 'listening' : ''}"
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          title={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          {isListening ? '⏹️' : '🎤'}
        </button>

        <button
          type="submit"
          disabled={isDisabled || !inputText.trim()}
          class="control-btn submit-btn"
          aria-label="Submit query"
          title="Submit query"
        >
          ➤
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .user-input-container {
    padding: 1rem 0;
  }

  .input-section {
    max-width: 800px;
    margin: 0 auto;
  }

  .input-form {
    width: 100%;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background: white;
    border: 2px solid #eee;
    border-radius: 0.75rem;
    padding: 0.5rem;
    transition: all 0.3s ease;
  }

  .input-group:focus-within {
    border-color: #a67c6a;
    box-shadow: 0 0 0 3px rgba(166, 124, 106, 0.1);
  }

  .text-input {
    flex: 1;
    padding: 0.875rem 1rem;
    border: none;
    background: transparent;
    color: #2d2d2d;
    font-size: 1rem;
    font-family: 'Space Grotesk', sans-serif;
    outline: none;
  }

  .text-input::placeholder {
    color: #999;
    font-weight: 400;
  }

  .text-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .control-btn {
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .voice-btn {
    background: #f5f5f5;
    color: #666;
  }

  .voice-btn:hover:not(:disabled) {
    background: #e5e5e5;
    color: #333;
  }

  .voice-btn.listening {
    background: #ff6b6b;
    color: white;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .submit-btn {
    background: #a67c6a;
    color: white;
  }

  .submit-btn:hover:not(:disabled) {
    background: #956b5a;
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
  }

  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Screen reader only class */
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

  /* Animations */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .input-group {
      gap: 0.25rem;
      padding: 0.375rem;
    }

    .control-btn {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 1rem;
    }

    .text-input {
      padding: 0.75rem 0.875rem;
      font-size: 0.95rem;
    }
  }
</style>
