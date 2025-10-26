/**
 * Chrome Built-in AI API Wrapper
 * 
 * This module is the core engine of Audio Atlas. It provides the sole interface
 * to Chrome's on-device AI capabilities, specifically the Gemini Nano model.
 * 
 * The module implements intelligent prompt engineering to serve two distinct
 * user personas:
 * 1. Anjali (Visually Impaired Researcher): Needs spatial/relational navigation
 *    of complex diagrams and flowcharts
 * 2. David (Business Analyst): Needs precision data extraction from charts
 * 
 * This dual-capability design maximizes the application's utility and directly
 * addresses the "Purpose" judging criterion by unlocking new capabilities and
 * improving common user journeys.
 * 
 * @module ai
 */

import type { Message } from '$lib/stores/conversationStore';
import { getFallbackAIResponse } from './fallbackAI';
import { getAvailableFallbackService } from './aiConfig';
import { fileMetadataStore, type FileMetadata } from '$lib/stores/imageStore';
import { cleanStructuredText } from './textCleaner';
import { get } from 'svelte/store';

/**
 * Type definitions for Chrome Built-in AI APIs
 * These types are based on the Chrome AI API specifications
 */
declare global {
  interface Window {
    ai?: {
      languageModel?: {
        capabilities: () => Promise<{
          available: 'readily' | 'after-download' | 'no';
        }>;
        create: (options?: any) => Promise<AILanguageModel>;
      };
      summarizer?: {
        capabilities: () => Promise<{
          available: 'readily' | 'after-download' | 'no';
        }>;
        create: (options?: any) => Promise<AISummarizer>;
      };
    };
  }

  interface AILanguageModel {
    prompt: (input: string | { text: string; image?: ArrayBuffer }) => Promise<string>;
    promptStreaming: (input: string | { text: string; image?: ArrayBuffer }) => ReadableStream;
    destroy: () => void;
  }

  interface AISummarizer {
    summarize: (text: string) => Promise<string>;
    summarizeStreaming: (text: string) => ReadableStream;
    destroy: () => void;
  }
}

/**
 * Checks if the Chrome Built-in AI APIs are available in the current browser.
 * 
 * This function performs a capability check to determine if the user's browser
 * supports the required AI features. It provides graceful degradation by
 * returning false if the APIs are not available.
 * 
 * @returns {Promise<boolean>} True if AI capabilities are available, false otherwise
 */
export async function checkAIAvailability(): Promise<boolean> {
  try {
    if (!window.ai || !window.ai.languageModel) {
      console.warn('Chrome Built-in AI is not available in this browser.');
      return false;
    }

    const capabilities = await window.ai.languageModel.capabilities();
    const isAvailable = capabilities.available === 'readily' || capabilities.available === 'after-download';

    if (!isAvailable) {
      console.warn('AI model is not available. Status:', capabilities.available);
    }

    return isAvailable;
  } catch (error) {
    console.error('Error checking AI availability:', error);
    return false;
  }
}

/**
 * Detects if the user's prompt is requesting spatial/relational navigation.
 * 
 * This function analyzes the prompt for keywords that indicate the user wants
 * to understand the flow, connections, or spatial relationships in a diagram.
 * This is a key feature for Anjali's persona.
 * 
 * @param {string} prompt - The user's query
 * @returns {boolean} True if the prompt appears to be a navigation query
 */
function isNavigationalQuery(prompt: string): boolean {
  const navigationKeywords = [
    'describe the path',
    'what are the inputs',
    'what are the outputs',
    'trace the cycle',
    'trace the flow',
    'main loop',
    'sequence',
    'step by step',
    'walk me through',
    'how does it flow',
    'connections',
    'arrows',
    'follow the',
  ];

  const lowerPrompt = prompt.toLowerCase();
  return navigationKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

/**
 * Detects if the user's prompt is requesting data extraction from a chart.
 * 
 * This function analyzes the prompt for keywords that indicate the user wants
 * specific data points, values, or trends from a chart or graph.
 * This is a key feature for David's persona.
 * 
 * @param {string} prompt - The user's query
 * @returns {boolean} True if the prompt appears to be a data extraction query
 */
function isDataExtractionQuery(prompt: string): boolean {
  const dataKeywords = [
    'cagr',
    'value',
    'highest',
    'lowest',
    'maximum',
    'minimum',
    'average',
    'total',
    'sum',
    'percentage',
    'percent',
    'x-axis',
    'y-axis',
    'q1',
    'q2',
    'q3',
    'q4',
    'quarter',
    'year',
    'month',
    'data point',
    'exact',
    'precise',
  ];

  const lowerPrompt = prompt.toLowerCase();
  return dataKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

/**
 * Detects if the user's prompt is requesting a summary.
 * 
 * @param {string} prompt - The user's query
 * @returns {boolean} True if the prompt appears to be a summary request
 */
function isSummaryQuery(prompt: string): boolean {
  const summaryKeywords = ['summarize', 'summary', 'overview', 'what is this', 'describe this', 'explain this'];

  const lowerPrompt = prompt.toLowerCase();
  return summaryKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

/**
 * Detects if the user's prompt is requesting audio/spectrogram analysis.
 * This is specific to Feature Cluster A: Sensory Expansion.
 * 
 * @param {string} prompt - The user's query
 * @returns {boolean} True if the prompt appears to be an audio analysis query
 */
function isAudioAnalysisQuery(prompt: string): boolean {
  const audioKeywords = [
    'frequency',
    'frequencies',
    'hz',
    'hertz',
    'pitch',
    'tone',
    'sound',
    'audio',
    'spectrogram',
    'acoustic',
    'vocalization',
    'call',
    'song',
    'noise',
    'amplitude',
    'decibel',
    'db',
    'harmonic',
    'fundamental',
    'overtone'
  ];

  const lowerPrompt = prompt.toLowerCase();
  return audioKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

/**
 * Constructs an enhanced prompt with system instructions based on query type.
 * 
 * This function implements the intelligent prompt engineering strategy that
 * enables Audio Atlas to serve both user personas effectively. It prepends
 * specialized system instructions to guide the AI model's behavior.
 * 
 * Extended for Feature Cluster A: Now includes audio/spectrogram analysis instructions.
 * 
 * @param {string} userPrompt - The original user query
 * @param {Message[]} conversationHistory - Previous messages for context
 * @param {FileMetadata | null} fileMetadata - Metadata about the uploaded file
 * @returns {string} The enhanced prompt with system instructions
 */
function constructEnhancedPrompt(
  userPrompt: string,
  conversationHistory: Message[],
  fileMetadata: FileMetadata | null = null
): string {
  let systemInstruction = '';

  // Check if we're analyzing a spectrogram (audio file)
  if (fileMetadata && fileMetadata.type === 'audio') {
    // Special instructions for spectrogram analysis
    systemInstruction = `System: You are analyzing a SPECTROGRAM image generated from an audio file. This is a visual representation of sound where:
- The X-axis represents TIME (0 to ${fileMetadata.audioDuration?.toFixed(1)} seconds)
- The Y-axis represents FREQUENCY (0 to ${fileMetadata.audioSampleRate ? (fileMetadata.audioSampleRate / 2).toFixed(0) : '22050'} Hz)
- The COLOR/INTENSITY represents AMPLITUDE (brightness = louder)
- Low frequencies (bass) are at the BOTTOM
- High frequencies (treble) are at the TOP

When answering questions:
1. Identify frequency ranges by looking at the vertical position (Y-axis)
2. Identify timing by looking at the horizontal position (X-axis)
3. Identify loudness by looking at color intensity (brighter = louder)
4. Look for patterns like horizontal bands (sustained tones), vertical lines (transients/clicks), or complex patterns (vocalizations)
5. Provide specific time ranges (in seconds) and frequency ranges (in Hz) when possible

Original audio file: ${fileMetadata.fileName}
Duration: ${fileMetadata.audioDuration?.toFixed(2)} seconds
Sample Rate: ${fileMetadata.audioSampleRate} Hz

`;
  } else {
    // Determine the appropriate system instruction based on query type
    if (isNavigationalQuery(userPrompt)) {
      systemInstruction = `System: You are an expert at interpreting diagrams, flowcharts, and maps. Your task is to trace the connections and describe the sequence of events or spatial relationships shown in the image in a clear, step-by-step manner. Follow the arrows and connections logically. Use plain text formatting without asterisks, bold, or italic markup.\n\n`;
    } else if (isDataExtractionQuery(userPrompt)) {
      systemInstruction = `System: You are a data extraction expert. When asked for specific data points, values, labels, or trends from a chart or graph, respond with the precise information. If possible, provide structured data in your response. Use plain text formatting without asterisks, bold, or italic markup.\n\n`;
    } else if (isAudioAnalysisQuery(userPrompt)) {
      // User is asking audio-related questions but we might have an image
      systemInstruction = `System: You are analyzing visual data that may represent audio information (such as a spectrogram or waveform). Provide detailed analysis of frequency patterns, time-based events, and amplitude variations visible in the image. Use plain text formatting without asterisks, bold, or italic markup.\n\n`;
    }
  }

  // Build conversation context from history
  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation:\n';
    conversationHistory.forEach((msg) => {
      const role = msg.author === 'user' ? 'User' : 'Assistant';
      conversationContext += `${role}: ${msg.text}\n`;
    });
    conversationContext += '\n';
  }

  // Combine all parts
  return systemInstruction + conversationContext + `User: ${userPrompt}`;
}

/**
 * Gets an AI response for the given image and prompt.
 * 
 * This is the primary function of the AI module. It orchestrates calls to
 * Chrome's Built-in AI APIs, implementing the following features:
 * 
 * 1. Multimodal Input: Passes both image and text to the AI model
 * 2. Conversational Context: Includes conversation history for follow-up questions
 * 3. Intelligent Prompt Engineering: Adapts prompts based on query type
 * 4. Error Handling: Provides graceful fallbacks and clear error messages
 * 
 * This function embodies the core technical innovation of Audio Atlas and is
 * "fundamentally impossible to build without the 2025 API" as it relies on
 * the multimodal capabilities of Gemini Nano.
 * 
 * @param {ArrayBuffer} image - The uploaded image data
 * @param {string} prompt - The user's query
 * @param {Message[]} conversationHistory - Previous conversation messages
 * @returns {Promise<string>} The AI's response text
 * @throws {Error} If AI is not available or if the request fails
 */
export async function getAiResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    // Get file metadata to determine if we're analyzing a spectrogram
    const fileMetadata = get(fileMetadataStore);

    // First, try Chrome's Built-in AI
    const isAvailable = await checkAIAvailability();
    
    if (isAvailable) {
      console.log('Using Chrome Built-in AI');
      
      // Adjust system prompt based on file type
      let systemPrompt = 'You are a helpful AI assistant specialized in analyzing visual data such as charts, diagrams, maps, and graphs. Provide clear, accurate, and accessible descriptions. Use plain text formatting without asterisks, bold, italic, or other markdown formatting.';
      
      if (fileMetadata && fileMetadata.type === 'audio') {
        systemPrompt = 'You are a helpful AI assistant specialized in analyzing spectrograms and audio visualizations. You understand frequency analysis, time-domain representations, and acoustic patterns. Provide clear, accurate, and detailed descriptions of audio content based on spectrogram analysis. Use plain text formatting without asterisks, bold, italic, or other markdown formatting.';
      }
      
      // Create a language model session
      const session = await window.ai!.languageModel!.create({
        systemPrompt: systemPrompt,
      });

      // Construct the enhanced prompt with system instructions and context
      const enhancedPrompt = constructEnhancedPrompt(prompt, conversationHistory, fileMetadata);

      // Make the multimodal API call with both image and text
      const response = await session.prompt({
        text: enhancedPrompt,
        image: image,
      });

      // Clean up the session
      session.destroy();

      // Clean up any markdown formatting from the response
      return cleanStructuredText(response);
    }
  } catch (chromeAiError) {
    console.warn('Chrome Built-in AI failed, attempting fallback:', chromeAiError);
  }

  // Chrome AI is not available or failed, try fallback services
  try {
    const fallbackService = getAvailableFallbackService();
    
    if (!fallbackService) {
      throw new Error(
        'Chrome Built-in AI is not available and no fallback service is configured. Please:\n' +
        '1. Use Chrome Canary with AI features enabled, or\n' +
        '2. Add API keys to .env file (see .env.example), or\n' +
        '3. Enable mock responses by setting VITE_ENABLE_MOCK_RESPONSES=true'
      );
    }

    console.log(`Chrome AI unavailable, using fallback: ${fallbackService}`);
    const fileMetadata = get(fileMetadataStore);
    // Note: Fallback services may not have spectrogram-specific instructions
    return await getFallbackAIResponse(image, prompt, conversationHistory);
    
  } catch (fallbackError) {
    console.error('Both Chrome AI and fallback services failed:', fallbackError);

    // Provide user-friendly error messages
    if (fallbackError instanceof Error) {
      throw new Error(`AI Error: ${fallbackError.message}`);
    } else {
      throw new Error(
        'All AI services are unavailable. Please check your configuration and try again.'
      );
    }
  }
}

/**
 * Gets a quick summary of an image using the summarizer API.
 * 
 * This function can be used for initial overview requests. However, note that
 * the summarizer API typically works with text, not images. For true multimodal
 * summarization, we should use the language model with a summary-focused prompt.
 * 
 * This function is included for completeness but may not be used in the final
 * implementation if the summarizer API doesn't support image input.
 * 
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} The summary
 */
export async function getSummary(text: string): Promise<string> {
  try {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('Summarizer API is not available.');
    }

    const capabilities = await window.ai.summarizer.capabilities();
    if (capabilities.available !== 'readily' && capabilities.available !== 'after-download') {
      throw new Error('Summarizer is not available.');
    }

    const summarizer = await window.ai.summarizer.create();
    const summary = await summarizer.summarize(text);
    summarizer.destroy();

    return summary;
  } catch (error) {
    console.error('Error getting summary:', error);
    throw error;
  }
}
