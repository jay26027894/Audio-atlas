<!--
  Translation Banner Component
  
  Feature Cluster D: The Accessibility Multiplier
  Feature 1: On-the-Fly Label Translation
  
  This component displays a banner when non-English labels are detected,
  offering to translate them for better accessibility.
-->

<script lang="ts">
	import { translateLabels, shouldShowTranslationUI } from '$lib/utils/translationHelper';

	// Props
	export let detectedLanguage: string | null;
	export let extractedLabels: string[] = [];
	export let onLabelsTranslated: (labels: string[]) => void;

	// State
	let isTranslating = false;
	let translationComplete = false;

	// Reactive: Determine if we should show the UI
	$: translationUI = shouldShowTranslationUI(detectedLanguage);
	$: showBanner = translationUI.show && !translationComplete && extractedLabels.length > 0;

	/**
	 * Handle translation button click
	 */
	async function handleTranslate() {
		if (!detectedLanguage) return;

		isTranslating = true;

		try {
			const translatedLabels = await translateLabels(extractedLabels, detectedLanguage);

			// Pass translated labels back to parent
			onLabelsTranslated(translatedLabels);

			// Mark as complete
			translationComplete = true;

			// Announce to screen readers
			announceToScreenReader('Labels translated to English successfully');
		} catch (error) {
			console.error('Translation failed:', error);
			alert('Translation failed. Please try again.');
		} finally {
			isTranslating = false;
		}
	}

	/**
	 * Announce to screen readers for accessibility
	 */
	function announceToScreenReader(message: string) {
		const announcement = document.createElement('div');
		announcement.setAttribute('role', 'status');
		announcement.setAttribute('aria-live', 'polite');
		announcement.className = 'sr-only';
		announcement.textContent = message;
		document.body.appendChild(announcement);
		setTimeout(() => announcement.remove(), 1000);
	}
</script>

{#if showBanner}
	<div class="translation-banner" role="alert" aria-live="polite">
		<div class="banner-content">
			<span class="language-icon" aria-hidden="true">🌐</span>
			<div class="banner-text">
				<p class="banner-title">Non-English Labels Detected</p>
				<p class="banner-subtitle">
					This diagram contains {translationUI.languageName} labels ({extractedLabels.length}
					labels). Translate them to English for better accessibility?
				</p>
			</div>
			<button
				class="translate-button"
				on:click={handleTranslate}
				disabled={isTranslating}
				aria-label="Translate {translationUI.languageName} labels to English"
			>
				{isTranslating ? 'Translating...' : 'Translate to English'}
			</button>
		</div>
	</div>
{/if}

<!-- Screen reader only class -->
<style>
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

	.translation-banner {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 1.25rem;
		margin-bottom: 1rem;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.banner-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.language-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.banner-text {
		flex: 1;
	}

	.banner-title {
		margin: 0 0 0.25rem 0;
		color: white;
		font-weight: 600;
		font-size: 1rem;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.banner-subtitle {
		margin: 0;
		color: rgba(255, 255, 255, 0.95);
		font-size: 0.875rem;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		line-height: 1.4;
	}

	.translate-button {
		background: white;
		color: #667eea;
		border: none;
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.translate-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.translate-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.banner-content {
			flex-direction: column;
			text-align: center;
		}

		.translate-button {
			width: 100%;
		}
	}
</style>
