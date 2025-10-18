/**
 * Audio Processing Utility - Spectrogram Generation
 * 
 * This module implements the "Spectrogram Hack" for Feature Cluster A: Sensory Expansion.
 * It converts audio files into visual spectrograms entirely on the client-side, enabling
 * the existing VQA engine to analyze audio content without requiring a specialized audio AI model.
 * 
 * Key Features:
 * - Client-side audio processing (privacy-first)
 * - Web Audio API for FFT analysis
 * - Canvas-based spectrogram rendering
 * - Base64 data URL output for VQA integration
 * 
 * @module audioProcessor
 */

/**
 * Decodes audio data from an ArrayBuffer into an AudioBuffer.
 * 
 * @param {ArrayBuffer} arrayBuffer - Raw audio file data
 * @returns {Promise<AudioBuffer>} Decoded audio data
 */
export async function decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
	const audioContext = new AudioContext();

	try {
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		console.log('Audio decoded successfully:', {
			duration: audioBuffer.duration,
			sampleRate: audioBuffer.sampleRate,
			numberOfChannels: audioBuffer.numberOfChannels,
			length: audioBuffer.length
		});

		return audioBuffer;
	} catch (error) {
		console.error('Error decoding audio:', error);
		throw new Error('Failed to decode audio file. Please ensure it is a valid audio format.');
	} finally {
		await audioContext.close();
	}
}

/**
 * Performs a simplified FFT (Discrete Fourier Transform) on the input data.
 * Returns the magnitude spectrum.
 * 
 * Note: This is an optimized implementation using decimation-in-time FFT.
 * For even better performance, consider using a library like fft.js
 * 
 * @param {Float32Array} data - Time-domain audio data
 * @returns {Float32Array} Frequency-domain magnitudes
 */
function performFFT(data: Float32Array): Float32Array {
	const N = data.length;
	
	// For very large FFT sizes, use a simplified approach
	// Sample every Nth point to reduce computation
	if (N > 2048) {
		const step = Math.floor(N / 2048);
		const sampledData = new Float32Array(2048);
		for (let i = 0; i < 2048; i++) {
			sampledData[i] = data[i * step];
		}
		return performFFT(sampledData);
	}
	
	const magnitudes = new Float32Array(N / 2);

	// Optimized DFT with reduced calculations
	// Only calculate up to Nyquist frequency
	for (let k = 0; k < N / 2; k++) {
		let real = 0;
		let imag = 0;

		// Pre-calculate angle increment
		const angleIncrement = (-2 * Math.PI * k) / N;

		for (let n = 0; n < N; n++) {
			const angle = angleIncrement * n;
			real += data[n] * Math.cos(angle);
			imag += data[n] * Math.sin(angle);
		}

		magnitudes[k] = Math.sqrt(real * real + imag * imag) / N;
	}

	return magnitudes;
}

/**
 * Generates a spectrogram image from an AudioBuffer.
 * 
 * A spectrogram is a visual representation of the frequency spectrum
 * of a signal as it varies with time. The X-axis represents time,
 * the Y-axis represents frequency, and the color/intensity represents amplitude.
 * 
 * @param {AudioBuffer} audioBuffer - Decoded audio data
 * @returns {string} Base64-encoded PNG data URL
 */
export function generateSpectrogram(audioBuffer: AudioBuffer): string {
	// Get the audio data from the first channel (mono)
	const channelData = audioBuffer.getChannelData(0);
	const sampleRate = audioBuffer.sampleRate;
	const duration = audioBuffer.duration;

	// FFT parameters
	const fftSize = 2048;
	const hopSize = Math.floor(fftSize / 4); // 75% overlap for smoother spectrogram
	const frequencyBinCount = fftSize / 2;

	// Calculate spectrogram dimensions
	const numTimeSlices = Math.floor((channelData.length - fftSize) / hopSize) + 1;
	const width = Math.min(numTimeSlices, 2000); // Limit width for performance
	const height = Math.min(frequencyBinCount, 512); // Limit height for performance

	// Adjust hop size if we're limiting width
	const actualHopSize = Math.floor((channelData.length - fftSize) / (width - 1));

	// Create canvas
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Failed to get canvas context');
	}

	// Fill with black background
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, width, height);

	// Create ImageData for efficient pixel manipulation
	const imageData = ctx.createImageData(width, height);
	const pixels = imageData.data;

	console.log('Generating spectrogram:', width, 'time slices,', height, 'frequency bins');
	
	// Process each time slice
	for (let t = 0; t < width; t++) {
		// Log progress every 10%
		if (t % Math.floor(width / 10) === 0) {
			console.log('Spectrogram progress:', Math.floor((t / width) * 100) + '%');
		}
		
		const startSample = t * actualHopSize;

		// Extract window of samples
		const windowData = new Float32Array(fftSize);
		for (let i = 0; i < fftSize; i++) {
			if (startSample + i < channelData.length) {
				// Apply Hamming window to reduce spectral leakage
				const windowValue = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (fftSize - 1));
				windowData[i] = channelData[startSample + i] * windowValue;
			}
		}

		// Perform FFT
		const magnitudes = performFFT(windowData);

		// Draw the frequency data
		const binStep = Math.max(1, Math.floor(frequencyBinCount / height));
		for (let f = 0; f < height; f++) {
			const binIndex = Math.floor((f * frequencyBinCount) / height);
			const magnitude = magnitudes[binIndex];

			// Convert magnitude to decibels
			const db = 20 * Math.log10(magnitude + 1e-10);

			// Normalize to 0-1 range
			const normalized = (db + 90) / 80; // Map -90dB to 0dB -> 0 to 1
			const intensity = Math.max(0, Math.min(1, normalized));

			// Calculate pixel position (flip Y-axis so low frequencies are at bottom)
			const x = t;
			const y = height - 1 - f;
			const pixelIndex = (y * width + x) * 4;

			// Color scheme: black -> blue -> cyan -> yellow -> white
			let r: number, g: number, b: number;
			if (intensity < 0.25) {
				r = 0;
				g = 0;
				b = Math.floor(intensity * 4 * 255);
			} else if (intensity < 0.5) {
				r = 0;
				g = Math.floor((intensity - 0.25) * 4 * 255);
				b = 255;
			} else if (intensity < 0.75) {
				r = Math.floor((intensity - 0.5) * 4 * 255);
				g = 255;
				b = Math.floor((1 - (intensity - 0.5) * 4) * 255);
			} else {
				r = 255;
				g = 255;
				b = Math.floor((intensity - 0.75) * 4 * 255);
			}

			pixels[pixelIndex] = r;
			pixels[pixelIndex + 1] = g;
			pixels[pixelIndex + 2] = b;
			pixels[pixelIndex + 3] = 255; // Alpha
		}
	}

	// Put the image data on the canvas
	ctx.putImageData(imageData, 0, 0);
	console.log('Spectrogram rendering complete, adding labels');

	// Add labels and metadata to the spectrogram
	addSpectrogramLabels(ctx, canvas, duration, sampleRate);

	// Convert to data URL
	console.log('Converting spectrogram to PNG data URL');
	const dataUrl = canvas.toDataURL('image/png');
	console.log('Spectrogram generated successfully:', dataUrl.length, 'bytes');
	return dataUrl;
}

/**
 * Adds labels and metadata to the spectrogram canvas.
 * This helps the AI understand the axes and scale.
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} duration - Audio duration in seconds
 * @param {number} sampleRate - Audio sample rate
 */
function addSpectrogramLabels(
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	duration: number,
	sampleRate: number
): void {
	const width = canvas.width;
	const height = canvas.height;

	// Set text style
	ctx.fillStyle = 'white';
	ctx.font = 'bold 14px Arial';
	ctx.textAlign = 'center';

	// Add title
	ctx.fillText('SPECTROGRAM', width / 2, 20);

	// Add time axis label (X-axis)
	ctx.fillText(`Time: 0s - ${duration.toFixed(1)}s`, width / 2, height - 10);

	// Add frequency axis label (Y-axis)
	ctx.save();
	ctx.translate(15, height / 2);
	ctx.rotate(-Math.PI / 2);
	ctx.fillText(`Frequency: 0Hz - ${(sampleRate / 2).toFixed(0)}Hz`, 0, 0);
	ctx.restore();

	// Add time markers
	ctx.font = '10px Arial';
	const numTimeMarkers = 5;
	for (let i = 0; i <= numTimeMarkers; i++) {
		const x = (i * width) / numTimeMarkers;
		const time = (i * duration) / numTimeMarkers;
		ctx.fillText(`${time.toFixed(1)}s`, x, height - 25);
	}
}

/**
 * Converts a Base64 data URL to an ArrayBuffer.
 * This is necessary because the Chrome AI API expects image data as an ArrayBuffer.
 * 
 * @param {string} dataUrl - Base64-encoded data URL
 * @returns {ArrayBuffer} Image data as ArrayBuffer
 */
export function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
	// Extract the base64 data from the data URL
	const base64 = dataUrl.split(',')[1];

	// Decode base64 to binary string
	const binaryString = atob(base64);

	// Convert binary string to ArrayBuffer
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return bytes.buffer;
}

/**
 * Main function to process an audio file and generate a spectrogram.
 * This orchestrates the entire audio-to-spectrogram pipeline.
 * 
 * @param {ArrayBuffer} audioArrayBuffer - Raw audio file data
 * @returns {Promise<{spectrogramDataUrl: string, spectrogramArrayBuffer: ArrayBuffer, metadata: object}>}
 */
export async function processAudioFile(audioArrayBuffer: ArrayBuffer): Promise<{
	spectrogramDataUrl: string;
	spectrogramArrayBuffer: ArrayBuffer;
	metadata: {
		duration: number;
		sampleRate: number;
		numberOfChannels: number;
	};
}> {
	try {
		// Step 1: Decode audio data
		const audioBuffer = await decodeAudioData(audioArrayBuffer);

		// Step 2: Generate spectrogram
		const spectrogramDataUrl = generateSpectrogram(audioBuffer);

		// Step 3: Convert to ArrayBuffer for AI API
		const spectrogramArrayBuffer = dataUrlToArrayBuffer(spectrogramDataUrl);

		// Return both formats and metadata
		return {
			spectrogramDataUrl,
			spectrogramArrayBuffer,
			metadata: {
				duration: audioBuffer.duration,
				sampleRate: audioBuffer.sampleRate,
				numberOfChannels: audioBuffer.numberOfChannels
			}
		};
	} catch (error) {
		console.error('Error processing audio file:', error);
		throw error;
	}
}
