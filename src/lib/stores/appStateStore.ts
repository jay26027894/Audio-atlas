/**
 * Application State Store
 * 
 * This store manages the global UI state of the application, tracking what
 * the app is currently doing. This synchronizes different parts of the UI,
 * for example:
 * - Disabling the input button while the AI is processing a response
 * - Showing a "listening" indicator when voice input is active
 * - Announcing state changes to screen readers via the StatusIndicator component
 * 
 * The state transitions follow this flow:
 * - idle -> listening -> idle (voice input)
 * - idle -> processing -> speaking -> idle (AI query/response)
 * 
 * @module appStateStore
 */

import { writable } from 'svelte/store';

/**
 * Represents the possible states of the application.
 * 
 * - 'idle': The app is ready for user input
 * - 'listening': The app is actively listening for voice input
 * - 'processing': The AI is processing a query
 * - 'speaking': The AI response is being read aloud via text-to-speech
 */
export type AppState = 'idle' | 'listening' | 'processing' | 'speaking';

/**
 * A writable store containing the current application state.
 * Defaults to 'idle' when the application first loads.
 * 
 * @type {import('svelte/store').Writable<AppState>}
 */
export const appStateStore = writable<AppState>('idle');
