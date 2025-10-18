/**
 * Translation Helper - Language Detection and Translation
 * 
 * Feature Cluster D: The Accessibility Multiplier
 * Feature 1: On-the-Fly Label Translation
 * 
 * This module implements API chaining for accessibility:
 * 1. Language Detector API identifies non-English text
 * 2. Translator API converts labels to English
 * 3. Translated labels feed back into VQA pipeline
 * 
 * Purpose: Enable visually impaired users like Anjali to interact with
 * international research diagrams (e.g., German-labeled biochemistry diagrams)
 */

/**
 * Detects the language of a given text sample.
 * 
 * @param textSample - A sample of text from the diagram's labels
 * @returns Promise<string | null> - The BCP 47 language code (e.g., 'de') or null if detection fails
 */
export async function detectLabelLanguage(textSample: string): Promise<string | null> {
	// 1. Feature detection
	if (!('translation' in self && 'createDetector' in (self as any).translation)) {
		console.info('ℹ️ Translation API not available - this is expected in current Chrome versions.');
		console.info('📝 Translation features will be enabled when Chrome releases the Translation API.');
		return null;
	}

	try {
		// 2. Create a detector instance
		const detector = await (self as any).translation.createDetector();

		// 3. Detect the language
		const results = await detector.detect(textSample);

		console.log('Language detection results:', results);

		// 4. Return the most probable language code
		// The result is an array of languages ranked by probability
		if (results && results.length > 0) {
			return results[0].detectedLanguage;
		}

		return null;
	} catch (error) {
		console.info('Language detection not available yet:', error);
		return null;
	}
}

/**
 * Translates an array of text labels from a source language to English.
 * 
 * @param labels - The array of original text labels
 * @param sourceLang - The detected source language code (e.g., 'de')
 * @returns Promise<string[]> - A new array containing the translated labels
 */
export async function translateLabels(
	labels: string[],
	sourceLang: string
): Promise<string[]> {
	// 1. Feature detection
	if (!('translation' in self && 'createTranslator' in (self as any).translation)) {
		console.info('ℹ️ Translator API not available - this is expected in current Chrome versions.');
		return labels; // Return original labels if API is missing
	}

	try {
		console.log('Starting translation:', {
			labelCount: labels.length,
			sourceLanguage: sourceLang,
			targetLanguage: 'en'
		});

		// 2. Create a translator instance with specified source and target languages
		const translator = await (self as any).translation.createTranslator({
			sourceLanguage: sourceLang,
			targetLanguage: 'en'
		});

		// 3. Create an array of translation promises
		const translationPromises = labels.map((label) => translator.translate(label));

		// 4. Await all translations and return the result
		const translatedLabels = await Promise.all(translationPromises);

		console.log('Translation complete:', {
			original: labels,
			translated: translatedLabels
		});

		return translatedLabels;
	} catch (error) {
		console.info('Translation not available yet:', error);
		return labels; // Fallback to original labels on error
	}
}

/**
 * Complete translation workflow with API chaining
 * 
 * This function orchestrates the entire translation chain:
 * 1. Detect language from extracted labels
 * 2. Check if translation is needed
 * 3. Translate if necessary
 * 4. Return processed labels for VQA pipeline
 * 
 * @param extractedLabels - Labels extracted by VQA from diagram
 * @returns Promise<TranslationResult>
 */
export async function processLabelsForAccessibility(
	extractedLabels: string[]
): Promise<{
	labels: string[];
	wasTranslated: boolean;
	sourceLanguage: string | null;
	languageName: string;
}> {
	if (extractedLabels.length === 0) {
		return {
			labels: [],
			wasTranslated: false,
			sourceLanguage: null,
			languageName: 'Unknown'
		};
	}

	// Create text sample from first few labels
	const textSample = extractedLabels.slice(0, 5).join(' ');

	// Detect language (API Chain Step 1)
	const detectedLanguage = await detectLabelLanguage(textSample);

	// Language name mapping
	const languageNames: Record<string, string> = {
		de: 'German',
		fr: 'French',
		es: 'Spanish',
		it: 'Italian',
		pt: 'Portuguese',
		ja: 'Japanese',
		zh: 'Chinese',
		ko: 'Korean',
		ru: 'Russian',
		ar: 'Arabic',
		en: 'English'
	};

	const languageName = detectedLanguage
		? languageNames[detectedLanguage] || detectedLanguage.toUpperCase()
		: 'Unknown';

	// Check if translation is needed
	const needsTranslation = detectedLanguage && detectedLanguage !== 'en';

	// Translate if needed (API Chain Step 2)
	let finalLabels = extractedLabels;

	if (needsTranslation && detectedLanguage) {
		finalLabels = await translateLabels(extractedLabels, detectedLanguage);
	}

	return {
		labels: finalLabels,
		wasTranslated: needsTranslation || false,
		sourceLanguage: detectedLanguage,
		languageName
	};
}

/**
 * Helper function to determine if translation UI should be shown
 * 
 * @param detectedLanguage - Language code from detector
 * @returns Object with translation needed flag and language info
 */
export function shouldShowTranslationUI(detectedLanguage: string | null): {
	show: boolean;
	languageName: string;
} {
	const languageNames: Record<string, string> = {
		de: 'German',
		fr: 'French',
		es: 'Spanish',
		it: 'Italian',
		pt: 'Portuguese',
		ja: 'Japanese',
		zh: 'Chinese',
		ko: 'Korean',
		ru: 'Russian',
		ar: 'Arabic'
	};

	const show = detectedLanguage !== null && detectedLanguage !== 'en';
	const languageName = detectedLanguage
		? languageNames[detectedLanguage] || detectedLanguage.toUpperCase()
		: 'Unknown';

	return { show, languageName };
}
