/**
 * Session Store
 * 
 * This store manages the multi-image analysis session state.
 * It holds the findings extracted from each analyzed image during the session.
 * 
 * Features:
 * - Stores text-based findings from image analysis
 * - Persists across multiple image analyses in a session
 * - Used by the Writer API to generate summary reports
 * 
 * @module sessionStore
 */

import { writable } from 'svelte/store';

/**
 * A writable store containing an array of findings from the current session.
 * Each finding is a text string representing a key insight or data point
 * extracted from the analyzed images.
 * 
 * @type {import('svelte/store').Writable<string[]>}
 */
export const sessionFindingsStore = writable<string[]>([]);

/**
 * Helper function to add a finding to the session
 * 
 * @param {string} finding - The finding text to add
 */
export function addFinding(finding: string): void {
	sessionFindingsStore.update(findings => [...findings, finding]);
}

/**
 * Helper function to clear all findings from the session
 */
export function clearFindings(): void {
	sessionFindingsStore.set([]);
}

/**
 * Helper function to remove a specific finding by index
 * 
 * @param {number} index - The index of the finding to remove
 */
export function removeFinding(index: number): void {
	sessionFindingsStore.update(findings => 
		findings.filter((_, i) => i !== index)
	);
}
