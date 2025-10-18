<!--
  API Status Indicator Component
  
  Shows the availability status of Chrome AI APIs
  Helps users understand which features are currently available
-->

<script lang="ts">
	import { onMount } from 'svelte';

	let apiStatus = {
		translation: false,
		rewriter: false,
		prompt: false
	};

	let showDetails = false;

	onMount(() => {
		checkAPIAvailability();
	});

	function checkAPIAvailability() {
		// Check Translation API
		apiStatus.translation =
			'translation' in self && 'createDetector' in (self as any).translation;

		// Check Rewriter API
		apiStatus.rewriter = 'ai' in self && 'rewriter' in (self as any).ai;

		// Check Prompt API (for VQA)
		apiStatus.prompt = 'ai' in self && 'languageModel' in (self as any).ai;
	}

	function toggleDetails() {
		showDetails = !showDetails;
	}
</script>

<div class="api-status-container">
	<button class="status-toggle" on:click={toggleDetails} aria-expanded={showDetails}>
		<span class="status-icon">
			{#if apiStatus.translation && apiStatus.rewriter && apiStatus.prompt}
				✅
			{:else if apiStatus.prompt}
				⚠️
			{:else}
				❌
			{/if}
		</span>
		<span class="status-text">Chrome AI APIs</span>
		<span class="toggle-arrow" class:expanded={showDetails}>▼</span>
	</button>

	{#if showDetails}
		<div class="status-details">
			<h3>API Availability</h3>

			<div class="api-item">
				<span class="api-name">Prompt API (VQA)</span>
				<span class="api-status" class:available={apiStatus.prompt}>
					{apiStatus.prompt ? '✅ Available' : '❌ Not Available'}
				</span>
			</div>

			<div class="api-item">
				<span class="api-name">Translation API</span>
				<span class="api-status" class:available={apiStatus.translation}>
					{apiStatus.translation ? '✅ Available' : '⏳ Coming Soon'}
				</span>
			</div>

			<div class="api-item">
				<span class="api-name">Rewriter API</span>
				<span class="api-status" class:available={apiStatus.rewriter}>
					{apiStatus.rewriter ? '✅ Available' : '⏳ Coming Soon'}
				</span>
			</div>

			{#if !apiStatus.translation || !apiStatus.rewriter}
				<div class="info-box">
					<p class="info-title">📝 Feature Cluster D Status</p>
					<p class="info-text">
						Translation and Rewriter APIs are currently in development by Chrome. These features
						are fully implemented in Audio Atlas and will activate automatically when Chrome
						releases these APIs.
					</p>
					{#if !apiStatus.rewriter}
						<details class="setup-details">
							<summary>How to enable Rewriter API (Chrome Canary)</summary>
							<ol>
								<li>Install Chrome Canary (version 128+)</li>
								<li>
									Navigate to <code>chrome://flags/#prompt-api-for-gemini-nano</code>
								</li>
								<li>Set to "Enabled"</li>
								<li>
									Go to <code>chrome://components/</code>
								</li>
								<li>Find "Gemini Nano" and click "Check for update"</li>
								<li>Wait for download (~1.5GB)</li>
								<li>Restart browser</li>
							</ol>
						</details>
					{/if}
				</div>
			{/if}

			<div class="current-features">
				<p class="features-title">✅ Currently Available Features:</p>
				<ul>
					<li>Visual Question Answering (VQA)</li>
					<li>Audio Analysis</li>
					<li>Speech Recognition & Synthesis</li>
					<li>Multi-image Sessions</li>
					<li>Report Generation (Writer API)</li>
					<li>Chrome Extension Integration</li>
				</ul>
			</div>
		</div>
	{/if}
</div>

<style>
	.api-status-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 1000;
	}

	.status-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: white;
		border: 2px solid #e5e5e5;
		border-radius: 24px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.status-toggle:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.status-icon {
		font-size: 1.25rem;
	}

	.status-text {
		font-weight: 600;
		color: #2d2d2d;
		font-size: 0.875rem;
	}

	.toggle-arrow {
		font-size: 0.75rem;
		transition: transform 0.2s;
		color: #666;
	}

	.toggle-arrow.expanded {
		transform: rotate(180deg);
	}

	.status-details {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border: 2px solid #e5e5e5;
		border-radius: 12px;
		padding: 1.5rem;
		min-width: 350px;
		max-width: 450px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
		animation: slideUp 0.2s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: #2d2d2d;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.api-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.api-item:last-of-type {
		border-bottom: none;
	}

	.api-name {
		font-weight: 500;
		color: #2d2d2d;
		font-size: 0.875rem;
	}

	.api-status {
		font-size: 0.875rem;
		color: #999;
	}

	.api-status.available {
		color: #22c55e;
		font-weight: 600;
	}

	.info-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		border-left: 4px solid #667eea;
	}

	.info-title {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: #2d2d2d;
		font-size: 0.875rem;
	}

	.info-text {
		margin: 0;
		font-size: 0.8125rem;
		color: #666;
		line-height: 1.5;
	}

	.setup-details {
		margin-top: 0.75rem;
		font-size: 0.8125rem;
	}

	.setup-details summary {
		cursor: pointer;
		font-weight: 600;
		color: #667eea;
		margin-bottom: 0.5rem;
	}

	.setup-details ol {
		margin: 0.5rem 0 0 1.25rem;
		padding: 0;
		color: #666;
		line-height: 1.6;
	}

	.setup-details li {
		margin-bottom: 0.25rem;
	}

	.setup-details code {
		background: #e5e7eb;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-family: 'Courier New', monospace;
	}

	.current-features {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 2px solid #f0f0f0;
	}

	.features-title {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: #22c55e;
		font-size: 0.875rem;
	}

	.current-features ul {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.8125rem;
		color: #666;
		line-height: 1.6;
	}

	.current-features li {
		margin-bottom: 0.25rem;
	}

	@media (max-width: 768px) {
		.api-status-container {
			bottom: 0.5rem;
			right: 0.5rem;
		}

		.status-details {
			right: auto;
			left: 0;
			min-width: 300px;
			max-width: calc(100vw - 2rem);
		}
	}
</style>
