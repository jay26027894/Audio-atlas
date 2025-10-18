/**
 * Simplification Helper - Rewriter API Integration
 * 
 * Feature Cluster D: The Accessibility Multiplier
 * Feature 2: "Explain It Simpler" Functionality
 * 
 * This module implements API chaining for accessibility:
 * 1. Prompt API generates technical explanation
 * 2. User requests simplification
 * 3. Rewriter API transforms response with 'more-casual' tone
 * 
 * Purpose: Provide layered understanding of complex scientific diagrams
 * for visually impaired users like Anjali, allowing them to drill down
 * from technical to accessible explanations.
 */

/**
 * Patterns that indicate a simplification request
 */
const SIMPLIFICATION_PATTERNS = [
	/explain.*simpler/i,
	/make.*simpler/i,
	/simplify/i,
	/easier.*understand/i,
	/less.*technical/i,
	/plain.*english/i,
	/eli5/i, // "Explain Like I'm 5"
	/dumb.*down/i,
	/layman.*terms/i,
	/break.*down/i,
	/more.*casual/i,
	/can you make that/i
];

/**
 * Detects if user is requesting a simplified explanation
 * 
 * @param userInput - User's query text
 * @returns boolean - True if simplification is requested
 */
export function isSimplificationRequest(userInput: string): boolean {
	return SIMPLIFICATION_PATTERNS.some((pattern) => pattern.test(userInput));
}

/**
 * Simplifies a given text using the Rewriter API.
 * 
 * @param textToSimplify - The text to be made simpler
 * @returns Promise<string> - The rewritten, simpler text
 */
export async function simplifyText(textToSimplify: string): Promise<string> {
	// 1. Feature detection
	if (!('ai' in self && 'rewriter' in (self as any).ai)) {
		console.info('ℹ️ Rewriter API not available - this is expected in current Chrome versions.');
		console.info('📝 To enable Rewriter API:');
		console.info('   1. Use Chrome Canary (version 128+)');
		console.info('   2. Enable chrome://flags/#prompt-api-for-gemini-nano');
		console.info('   3. Download Gemini Nano in chrome://components/');
		console.info('   4. Restart browser');
		return textToSimplify; // Return original text if API is missing
	}

	try {
		console.log('Simplifying text with Rewriter API:', {
			originalLength: textToSimplify.length,
			preview: textToSimplify.substring(0, 100) + '...'
		});

		// 2. Create a rewriter instance
		const rewriter = await (self as any).ai.rewriter.create();

		// 3. Rewrite the text, using the 'tone' option for simplification
		const simplerText = await rewriter.rewrite(textToSimplify, {
			tone: 'more-casual'
		});

		console.log('Simplification complete:', {
			originalLength: textToSimplify.length,
			simplifiedLength: simplerText.length,
			preview: simplerText.substring(0, 100) + '...'
		});

		return simplerText;
	} catch (error) {
		console.info('Rewriter API not available yet:', error);
		return textToSimplify; // Fallback to original text on error
	}
}

/**
 * Enhanced simplification with context for better accessibility
 * 
 * @param textToSimplify - Original technical explanation
 * @param topic - Optional topic being explained (e.g., "Krebs cycle")
 * @returns Promise<string> - Simplified explanation with helpful framing
 */
export async function simplifyWithContext(
	textToSimplify: string,
	topic?: string
): Promise<string> {
	try {
		// First, simplify the technical text
		const simplified = await simplifyText(textToSimplify);

		// Add helpful framing for accessibility
		let contextualizedText = simplified;

		if (topic) {
			contextualizedText = `Let me explain ${topic} in simpler terms:\n\n${simplified}`;
		}

		// Add a helpful closing for audio users
		contextualizedText +=
			'\n\nWould you like me to explain any specific part in more detail?';

		return contextualizedText;
	} catch (error) {
		console.error('Error in contextual simplification:', error);
		return textToSimplify;
	}
}

/**
 * Complete simplification workflow
 * 
 * This function handles the entire simplification chain:
 * 1. Verify this is a simplification request
 * 2. Get the previous AI response
 * 3. Simplify using Rewriter API
 * 4. Return simplified text
 * 
 * @param userInput - User's simplification request
 * @param lastAIResponse - The previous AI response to simplify
 * @returns Promise<SimplificationResult>
 */
export async function handleSimplificationRequest(
	userInput: string,
	lastAIResponse: string | null
): Promise<{
	success: boolean;
	simplifiedText?: string;
	error?: string;
}> {
	// Step 1: Verify this is a simplification request
	if (!isSimplificationRequest(userInput)) {
		return {
			success: false,
			error: 'Not a simplification request'
		};
	}

	// Step 2: Check if there's a previous response to simplify
	if (!lastAIResponse) {
		return {
			success: false,
			error: 'No previous response to simplify'
		};
	}

	// Step 3: Simplify using Rewriter API
	const simplifiedText = await simplifyText(lastAIResponse);

	return {
		success: true,
		simplifiedText
	};
}
