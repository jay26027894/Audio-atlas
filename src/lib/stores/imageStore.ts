/**
 * Image Store
 * 
 * This store holds the currently loaded image data as an ArrayBuffer.
 * When an image is uploaded by the user, it is stored here and made available
 * to all components that need access to it (primarily the AI processing module).
 * 
 * Extended for Feature Cluster A: Now supports both images and audio files.
 * Audio files are converted to spectrograms before being stored.
 * 
 * Setting this store to a non-null value triggers the UI to transition from
 * the upload view to the chat interface view.
 * 
 * @module imageStore
 */

import { writable } from 'svelte/store';

/**
 * Metadata about the uploaded file
 */
export interface FileMetadata {
	type: 'image' | 'audio';
	fileName: string;
	audioDuration?: number;
	audioSampleRate?: number;
	audioChannels?: number;
}

/**
 * A writable store containing the image data as an ArrayBuffer, or null if no image is loaded.
 * 
 * @type {import('svelte/store').Writable<ArrayBuffer | null>}
 */
export const imageStore = writable<ArrayBuffer | null>(null);

/**
 * A writable store containing metadata about the uploaded file.
 * This helps the AI understand the context (e.g., if it's analyzing a spectrogram).
 * 
 * @type {import('svelte/store').Writable<FileMetadata | null>}
 */
export const fileMetadataStore = writable<FileMetadata | null>(null);
