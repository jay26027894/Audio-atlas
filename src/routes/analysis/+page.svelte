<!--
  Analysis Page - Multi-Image Report Builder
  
  This page receives images from the Chrome Extension via URL query parameters,
  manages a multi-image analysis session, and generates summary reports using
  the on-device Writer API.
  
  Features:
  - Automatic image loading from URL parameter
  - Session-based findings management
  - Writer API integration for report generation
  - Multi-image workflow support
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { imageStore, fileMetadataStore } from '$lib/stores/imageStore';
  import { conversationStore } from '$lib/stores/conversationStore';
  import { sessionFindingsStore } from '$lib/stores/sessionStore';
  import ChatInterface from '$lib/components/ChatInterface.svelte';
  import UserInput from '$lib/components/UserInput.svelte';
  import StatusIndicator from '$lib/components/StatusIndicator.svelte';

  let imageUrl = '';
  let isLoadingImage = false;
  let loadError = '';
  let reportOutput = '';
  let isGeneratingReport = false;

  /**
   * Loads an image from a URL and stores it in the image store
   */
  async function loadImageFromUrl(url: string) {
    if (!url) return;

    isLoadingImage = true;
    loadError = '';

    try {
      console.log('Loading image from URL:', url);
      
      // Fetch the image
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Convert to ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Store in the image store
      imageStore.set(arrayBuffer);
      
      // Set metadata
      fileMetadataStore.set({
        type: 'image',
        fileName: url.split('/').pop() || 'external-image'
      });

      console.log('Image loaded successfully from URL');
    } catch (error) {
      console.error('Error loading image from URL:', error);
      loadError = error instanceof Error ? error.message : 'Failed to load image';
    } finally {
      isLoadingImage = false;
    }
  }

  /**
   * Adds a finding to the session findings store
   */
  function addFinding(text: string) {
    sessionFindingsStore.update(findings => [...findings, text]);
  }

  /**
   * Generates a summary report using the Writer API
   */
  async function generateSummaryReport() {
    const findings = $sessionFindingsStore;

    // 1. Feature detection
    if (!('ai' in self && 'writer' in (self as any).ai)) {
      alert("The Writer API is not available in this browser. Please use Chrome Canary with the Prompt API enabled.");
      return;
    }

    if (findings.length === 0) {
      alert("Please analyze at least one image to generate a report. Ask questions about the image to extract findings.");
      return;
    }

    isGeneratingReport = true;
    reportOutput = '';

    try {
      // 2. Create a writer instance
      const writer = await (self as any).ai.writer.create();

      // 3. Construct a clear prompt for the AI
      const prompt = `Generate a concise executive summary based on the following data points and observations: ${findings.join('. ')}.`;

      console.log('Generating report with Writer API...');

      // 4. Call the write method
      const result = await writer.write(prompt, {
        length: 'medium',
        format: 'plain-text'
      });

      // 5. Display the generated report
      reportOutput = result;
      console.log('Report generated successfully');

    } catch (error) {
      console.error("Error generating report with Writer API:", error);
      alert("Failed to generate the summary report. " + (error instanceof Error ? error.message : ''));
    } finally {
      isGeneratingReport = false;
    }
  }

  /**
   * Extracts findings from the conversation
   * This is called whenever the conversation updates
   */
  function extractFindingsFromConversation() {
    // Get all AI responses from the conversation
    const aiResponses = $conversationStore
      .filter(msg => msg.author === 'ai')
      .map(msg => msg.text);
    
    // Update the findings store with AI responses
    // In a more sophisticated implementation, you could parse and extract
    // key insights rather than storing full responses
    if (aiResponses.length > 0) {
      sessionFindingsStore.set(aiResponses);
    }
  }

  /**
   * Clears the current session and starts fresh
   */
  function startNewSession() {
    conversationStore.set([]);
    sessionFindingsStore.set([]);
    imageStore.set(null);
    fileMetadataStore.set(null);
    reportOutput = '';
    goto('/upload');
  }

  /**
   * On mount, check for imageUrl query parameter
   */
  onMount(() => {
    const params = new URLSearchParams($page.url.search);
    const urlParam = params.get('imageUrl');

    if (urlParam) {
      imageUrl = decodeURIComponent(urlParam);
      loadImageFromUrl(imageUrl);
    }
  });

  // Reactive statement to extract findings when conversation changes
  $: if ($conversationStore.length > 0) {
    extractFindingsFromConversation();
  }
</script>

<svelte:head>
  <title>Analysis — Audio Atlas</title>
  <meta name="description" content="Analyze images and generate reports with Audio Atlas" />
</svelte:head>

<div class="container">
  <header class="header">
    <h1 class="title">Multi-Image Analysis Session</h1>
    <p class="subtitle">Analyze images and generate comprehensive reports</p>
  </header>

  {#if isLoadingImage}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading image from URL...</p>
    </div>
  {:else if loadError}
    <div class="error-state">
      <p class="error-icon">⚠️</p>
      <p class="error-text">{loadError}</p>
      <button class="btn-secondary" on:click={() => goto('/upload')}>
        Upload Image Instead
      </button>
    </div>
  {:else if $imageStore}
    <main class="content">
      <div class="chat-section">
        <ChatInterface />
      </div>

      <aside class="sidebar">
        <div class="findings-panel">
          <h2 class="panel-title">Session Findings</h2>
          <p class="panel-description">
            Key insights extracted from your analysis
          </p>
          
          {#if $sessionFindingsStore.length === 0}
            <div class="empty-findings">
              <p>No findings yet. Start asking questions about the image.</p>
            </div>
          {:else}
            <ul class="findings-list">
              {#each $sessionFindingsStore as finding, index}
                <li class="finding-item">
                  <span class="finding-number">{index + 1}</span>
                  <span class="finding-text">{finding}</span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <div class="report-panel">
          <h2 class="panel-title">Generate Report</h2>
          <p class="panel-description">
            Create an executive summary from your findings
          </p>
          
          <button 
            class="btn-primary"
            on:click={generateSummaryReport}
            disabled={isGeneratingReport || $sessionFindingsStore.length === 0}
          >
            {isGeneratingReport ? 'Generating...' : 'Generate Summary Report'}
          </button>

          {#if reportOutput}
            <div class="report-output">
              <h3 class="report-title">Executive Summary</h3>
              <p class="report-text">{reportOutput}</p>
              <button 
                class="btn-secondary"
                on:click={() => navigator.clipboard.writeText(reportOutput)}
              >
                Copy to Clipboard
              </button>
            </div>
          {/if}
        </div>

        <div class="session-controls">
          <button class="btn-secondary" on:click={startNewSession}>
            Start New Session
          </button>
          <button class="btn-secondary" on:click={() => goto('/upload')}>
            Add Another Image
          </button>
        </div>
      </aside>
    </main>

    <footer class="footer">
      <UserInput />
      <StatusIndicator />
    </footer>
  {:else}
    <div class="empty-state">
      <p class="empty-icon">📸</p>
      <p class="empty-text">No image loaded</p>
      <button class="btn-primary" on:click={() => goto('/upload')}>
        Upload Image
      </button>
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: 100vh;
    background: #f8f5f2;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 2rem 1.5rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .title {
    margin: 0 0 0.5rem 0;
    font: 600 2rem 'Space Grotesk', system-ui, sans-serif;
    color: #2d2d2d;
  }

  .subtitle {
    margin: 0;
    color: #6b6b6b;
    font: 400 1rem 'Space Grotesk', system-ui, sans-serif;
  }

  .content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 1.5rem;
    padding: 0 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .chat-section {
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .findings-panel,
  .report-panel {
    background: #fff;
    border: 2px solid var(--chip);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .panel-title {
    margin: 0 0 0.5rem 0;
    font: 600 1.125rem 'Space Grotesk', system-ui, sans-serif;
    color: #2d2d2d;
  }

  .panel-description {
    margin: 0 0 1rem 0;
    font: 400 0.875rem 'Space Grotesk', system-ui, sans-serif;
    color: #6b6b6b;
  }

  .empty-findings {
    padding: 1rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .findings-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
  }

  .finding-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e7e2de;
  }

  .finding-number {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFC47E;
    color: #111;
    border-radius: 50%;
    font: 800 0.75rem 'Space Grotesk', system-ui, sans-serif;
  }

  .finding-text {
    flex: 1;
    font: 400 0.875rem 'Space Grotesk', system-ui, sans-serif;
    color: #4a4a4a;
    line-height: 1.5;
  }

  .report-output {
    margin-top: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e7e2de;
  }

  .report-title {
    margin: 0 0 0.75rem 0;
    font: 600 1rem 'Space Grotesk', system-ui, sans-serif;
    color: #2d2d2d;
  }

  .report-text {
    margin: 0 0 1rem 0;
    font: 400 0.875rem 'Space Grotesk', system-ui, sans-serif;
    color: #4a4a4a;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .session-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font: 600 0.875rem 'Space Grotesk', system-ui, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-primary {
    background: #FFC47E;
    color: #111;
  }

  .btn-primary:hover:not(:disabled) {
    background: #E6AF6F;
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #fff;
    color: #4a4a4a;
    border: 1px solid #e7e2de;
  }

  .btn-secondary:hover {
    background: #f9fafb;
    border-color: #FFC47E;
  }

  .footer {
    padding: 1rem 1.5rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .loading-state,
  .error-state,
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e7e2de;
    border-top-color: #FFC47E;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-icon,
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-text,
  .empty-text {
    font: 400 1.125rem 'Space Grotesk', system-ui, sans-serif;
    color: #6b6b6b;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 1024px) {
    .content {
      grid-template-columns: 1fr;
    }

    .sidebar {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .header {
      padding: 1.5rem 1rem 0.75rem;
    }

    .title {
      font-size: 1.5rem;
    }

    .content {
      padding: 0 1rem;
    }
  }
</style>
