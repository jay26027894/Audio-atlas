<!--
  Simplify Button Component
  
  Feature Cluster D: The Accessibility Multiplier
  Feature 2: "Explain It Simpler" Functionality
  
  This component provides a button to simplify the last AI response
  using the Rewriter API for better accessibility.
-->

<script lang="ts">
	import { conversationStore, getLastSimplifiableResponse } from '$lib/stores/conversationStore';
	import { simplifyText } from '$lib/utils/simplificationHelper';

	// State
	let isSimplifying = false;

	// Reactive: Check if we can simplify the last response
	$: lastSimplifiableResponse = getLastSimplifiableResponse($conversationStore);
	$: canSimplify = lastSimplifiableResponse !== null;

	/**
	 * Handle simplify button click
	 */
	async function handleSimplify() {
		if (!lastSimplifiableResponse) return;

		isSimplifying = true;

		try {
			// Simplify using Rewriter API
			const simplifiedText = await simplifyText(lastSimplifiableResponse);

			// Update the conversation store
			conversationStore.update((messages) => {
				const newMessages = [...messages];

				// Find the last unsimplified AI message
				for (let i = newMessages.length - 1; i >= 0; i--) {
					if (newMessages[i].author === 'ai' && !newMessages[i].simplified) {
						// Store original text
						newMessages[i].originalText = newMessages[i].text;
						// Replace with simplified version
						newMessages[i].text = simplifiedText;
						newMessages[i].simplified = true;
						break;
					}
				}

				return newMessages;
			});

			// Announce to screen readers
			announceToScreenReader('Explanation simplified');
		} catch (error) {
			console.error('Simplification failed:', error);
			alert('Simplification failed. Please try again.');
		} finally {
			isSimplifying = false;
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

{#if canSimplify}
	<button
		class="simplify-button"
		on:click={handleSimplify}
		disabled={isSimplifying}
		aria-label="Simplify the last explanation to make it easier to understand"
	>
		<span class="button-icon" aria-hidden="true">✨</span>
		<span class="button-text">
			{isSimplifying ? 'Simplifying...' : 'Explain It Simpler'}
		</span>
	</button>
{/if}

<style>

	.simplify-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
		border: none;
		border-radius: 24px;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 4px 6px rgba(245, 87, 108, 0.3);
		margin-top: 0.5rem;
	}

	.simplify-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(245, 87, 108, 0.4);
	}

	.simplify-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.button-icon {
		font-size: 1.125rem;
		animation: sparkle 2s ease-in-out infinite;
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.button-text {
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.simplify-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
