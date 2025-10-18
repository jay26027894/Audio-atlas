/**
 * Conversation Store
 * 
 * This store manages the complete chat history between the user and the AI.
 * Each message is stored as an object with an 'author' field ('user' or 'ai')
 * and a 'text' field containing the message content.
 * 
 * The conversation history is critical for enabling contextual follow-up questions.
 * When a user asks a follow-up question like "What about that step?", the entire
 * conversation history is passed to the AI model so it can understand the reference.
 * 
 * This is a key feature that enables the "Interactive Conversational Context"
 * capability described in the project requirements.
 * 
 * @module conversationStore
 */

import { writable } from 'svelte/store';

/**
 * Represents a single message in the conversation.
 */
export interface Message {
  /** The author of the message: 'user' for user queries, 'ai' for AI responses */
  author: 'user' | 'ai';
  /** The text content of the message */
  text: string;
  /** Whether this message has been simplified (for Feature Cluster D) */
  simplified?: boolean;
  /** Original text before simplification (for Feature Cluster D) */
  originalText?: string;
  /** Timestamp of the message */
  timestamp?: number;
}

/**
 * A writable store containing an array of all messages in the conversation.
 * Messages are added in chronological order.
 * 
 * Enhanced for Feature Cluster D: The Accessibility Multiplier
 * - Tracks simplified state for "Explain It Simpler" functionality
 * - Stores original text to allow toggling between technical and simple
 * 
 * @type {import('svelte/store').Writable<Message[]>}
 */
export const conversationStore = writable<Message[]>([]);

/**
 * Helper function to get the last AI response that can be simplified
 * 
 * @param messages - Current conversation messages
 * @returns The last unsimplified AI response or null
 */
export function getLastSimplifiableResponse(messages: Message[]): string | null {
	for (let i = messages.length - 1; i >= 0; i--) {
		if (messages[i].author === 'ai' && !messages[i].simplified) {
			return messages[i].text;
		}
	}
	return null;
}
