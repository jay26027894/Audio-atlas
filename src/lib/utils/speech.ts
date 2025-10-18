/**
 * Web Speech API Wrapper
 * 
 * This module encapsulates all functionality related to the Web Speech API,
 * providing both speech-to-text (SpeechRecognition) and text-to-speech
 * (SpeechSynthesis) capabilities.
 * 
 * These features are critical for the accessibility mission of Audio Atlas,
 * enabling users like Anjali to interact with visual data through voice
 * commands and receive audio feedback.
 * 
 * @module speech
 */

// Minimal type shims for browsers without TS lib types for SpeechRecognition
// These keep svelte-check/TS happy without bringing extra types.
// Note: Implementations use runtime feature detection and cast to any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognition = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionEvent = any;

/**
 * Speech recognition instance (singleton pattern)
 */
let recognition: SpeechRecognition | null = null;

/**
 * Callback function to be called when speech recognition produces a final transcript
 */
let onTranscriptCallback: ((transcript: string) => void) | null = null;

/**
 * Initializes the speech recognition service.
 * 
 * This function sets up the SpeechRecognition API with appropriate configuration:
 * - continuous: false (stops after one phrase)
 * - interimResults: false (only final results)
 * - lang: 'en-US' (English language)
 * 
 * @returns {boolean} True if initialization was successful, false if the API is not available
 */
export function initializeSpeechRecognition(): boolean {
  // Check if the browser supports the Speech Recognition API
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Speech Recognition API is not supported in this browser.');
    return false;
  }

  // Create a new recognition instance
  recognition = new SpeechRecognition();
  recognition.continuous = false; // Stop after one phrase
  recognition.interimResults = false; // Only return final results
  recognition.lang = 'en-US';

  // Set up event handlers
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    console.log('Speech recognized:', transcript);

    // Call the registered callback with the transcript
    if (onTranscriptCallback) {
      onTranscriptCallback(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
  };

  return true;
}

/**
 * Starts listening for voice input.
 * 
 * This function begins the speech recognition process. The user must grant
 * microphone permissions for this to work. When speech is recognized, the
 * registered callback function will be invoked with the transcript.
 * 
 * @param {(transcript: string) => void} callback - Function to call with the recognized text
 * @returns {boolean} True if listening started successfully, false otherwise
 */
export function startListening(callback: (transcript: string) => void): boolean {
  if (!recognition) {
    const initialized = initializeSpeechRecognition();
    if (!initialized) {
      return false;
    }
  }

  onTranscriptCallback = callback;

  try {
    recognition!.start();
    console.log('Started listening for voice input');
    return true;
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    return false;
  }
}

/**
 * Stops listening for voice input.
 * 
 * This function stops the speech recognition process if it is currently active.
 */
export function stopListening(): void {
  if (recognition) {
    try {
      recognition.stop();
      console.log('Stopped listening for voice input');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }
}

/**
 * Speaks the given text aloud using the browser's text-to-speech engine.
 * 
 * This function is the primary audio feedback mechanism for users like Anjali.
 * It uses the SpeechSynthesis API to convert text responses from the AI into
 * spoken audio, making the application fully accessible to visually impaired users.
 * 
 * The function returns a Promise that resolves when the speech has finished,
 * allowing the calling code to update the application state appropriately.
 * 
 * @param {string} text - The text to speak aloud
 * @returns {Promise<void>} A promise that resolves when speech is complete
 */
export function speak(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if the browser supports the Speech Synthesis API
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API is not supported in this browser.');
      reject(new Error('Speech Synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Set up event handlers
    utterance.onend = () => {
      console.log('Finished speaking');
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      reject(event);
    };

    // Speak the utterance
    window.speechSynthesis.speak(utterance);
    console.log('Started speaking:', text.substring(0, 50) + '...');
  });
}

/**
 * Cancels any ongoing speech.
 * 
 * This function immediately stops any text-to-speech output that is currently
 * playing, which can be useful if the user wants to interrupt the AI's response.
 */
export function cancelSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    console.log('Cancelled ongoing speech');
  }
}
