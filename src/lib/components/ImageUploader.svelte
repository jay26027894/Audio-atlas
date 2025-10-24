<!--
  ImageUploader Component
  
  Handles image and audio file upload through both file selection and drag-and-drop.
  Extended for Feature Cluster A: Sensory Expansion.
  
  Images: Uploaded directly as ArrayBuffer
  Audio: Converted to spectrogram, then uploaded as image ArrayBuffer
  
  Features:
  - File input with visual drop zone
  - Drag-and-drop support with visual feedback
  - Audio-to-spectrogram conversion (client-side)
  - Keyboard accessible (can be activated with Enter/Space)
  - Screen reader announcements for upload status
  
  Accessibility:
  - Fully keyboard operable
  - ARIA live region for status announcements
  - Clear focus indicators
  - Semantic HTML with proper labels
-->

<script lang="ts">
  import { imageStore, fileMetadataStore } from '$lib/stores/imageStore';
  import { processAudioFile } from '$lib/utils/audioProcessor';

  /**
   * Tracks whether the user is currently dragging a file over the drop zone
   */
  let isDragging = false;

  /**
   * Status message for screen readers
   */
  let statusMessage = '';

  /**
   * Reference to the file input element
   */
  let fileInput: HTMLInputElement;

  /**
   * Tracks if we're currently processing an audio file
   */
  let isProcessingAudio = false;

  /**
   * Handles file selection from the file input
   */
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      await processFile(file);
    }
  }

  /**
   * Handles drag over event to show visual feedback
   */
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  /**
   * Handles drag leave event to remove visual feedback
   */
  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
  }

  /**
   * Handles file drop event
   */
  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('audio/'))) {
      await processFile(file);
    } else {
      statusMessage = 'Please drop an image or audio file';
      setTimeout(() => {
        statusMessage = '';
      }, 3000);
    }
  }

  /**
   * Processes the selected or dropped file
   * Reads the file as an ArrayBuffer and stores it in the imageStore
   * For audio files, generates a spectrogram first
   */
  async function processFile(file: File) {
    try {
      const isAudio = file.type.startsWith('audio/');
      const isImage = file.type.startsWith('image/');

      // Validate file type
      if (!isImage && !isAudio) {
        statusMessage = 'Please select an image or audio file';
        return;
      }

      // Disallow SVG for now (some AI backends reject it)
      if (file.type === 'image/svg+xml') {
        statusMessage = 'SVG is not supported. Please upload PNG, JPG, or WEBP.';
        setTimeout(() => (statusMessage = ''), 3000);
        return;
      }

      if (isAudio) {
        // Process audio file: generate spectrogram
        isProcessingAudio = true;
        statusMessage = 'Processing audio file and generating spectrogram...';

        try {
          // Read file as ArrayBuffer
          const audioArrayBuffer = await file.arrayBuffer();

          // Generate spectrogram
          const result = await processAudioFile(audioArrayBuffer);

          // Store the spectrogram image in the imageStore
          imageStore.set(result.spectrogramArrayBuffer);

          // Store metadata
          fileMetadataStore.set({
            type: 'audio',
            fileName: file.name,
            audioDuration: result.metadata.duration,
            audioSampleRate: result.metadata.sampleRate,
            audioChannels: result.metadata.numberOfChannels
          });

          // Announce success
          statusMessage = `Audio file processed successfully. Spectrogram generated from ${result.metadata.duration.toFixed(1)} seconds of audio. You can now ask questions about it.`;

          console.log('Audio processed successfully:', {
            fileName: file.name,
            duration: result.metadata.duration,
            sampleRate: result.metadata.sampleRate
          });
        } catch (audioError) {
          console.error('Error processing audio:', audioError);
          statusMessage = 'Error processing audio file. Please ensure it is a valid audio format.';
          throw audioError;
        } finally {
          isProcessingAudio = false;
        }
      } else {
        // Process image file: existing functionality
        const arrayBuffer = await file.arrayBuffer();

        // Store in the imageStore
        imageStore.set(arrayBuffer);

        // Store metadata
        fileMetadataStore.set({
          type: 'image',
          fileName: file.name
        });

        // Announce success to screen readers
        statusMessage = 'Image loaded successfully. You can now ask questions about it.';

        console.log('Image uploaded successfully:', file.name);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      statusMessage = 'Error loading file. Please try again.';
      isProcessingAudio = false;
    }
  }

  /**
   * Handles keyboard activation of the drop zone
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  }
</script>

<div class="uploader-container">
  <div class="upload-section">
    <div
      class="drop-zone {isDragging ? 'dragging' : ''}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:keydown={handleKeyDown}
      role="button"
      tabindex="0"
      aria-label="Upload image by clicking or dragging and dropping"
    >
      <div class="upload-content">
        <div class="upload-icon" aria-hidden="true">{isProcessingAudio ? '🎵' : '📊'}</div>
        <h3 class="upload-title">{isProcessingAudio ? 'Processing Audio...' : 'Upload Visual or Audio Data'}</h3>
        <p class="upload-description">
          {#if isProcessingAudio}
            Generating spectrogram from your audio file...
          {:else}
            Drop your chart, diagram, graph, or audio file here to start the analysis
          {/if}
        </p>

        <label for="file-input-hidden" class="upload-button" class:disabled={isProcessingAudio}>
          {isProcessingAudio ? 'Processing...' : 'Choose File'}
        </label>

        <input
          id="file-input-hidden"
          type="file"
          accept="image/*,audio/wav,audio/mpeg,audio/ogg,audio/flac,audio/x-m4a,audio/mp4"
          on:change={handleFileSelect}
          bind:this={fileInput}
          class="file-input-hidden"
          aria-label="Select an image or audio file to upload"
        />

        <div class="supported-formats">
          <span class="format-item">PNG</span>
          <span class="format-item">JPG</span>
          <span class="format-item">WEBP</span>
          <span class="format-item">WAV</span>
          <span class="format-item">MP3</span>
          <span class="format-item">OGG</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Screen reader announcement region -->
  <div
    class="sr-only"
    aria-live="polite"
    aria-atomic="true"
    role="status"
  >
    {statusMessage}
  </div>
</div>

<style>
  .uploader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 2rem;
  }

  .upload-section {
    width: 100%;
    max-width: 500px;
  }

.drop-zone {
    border: 2px dashed var(--chip);
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
    background: #ffffff;
    box-shadow: 0 2px 0 #00000008;
  }

  .drop-zone:hover,
  .drop-zone:focus {
    border-color: var(--line);
    background: #fffef9;
  }

  .drop-zone.dragging {
    border-color: var(--line);
    background: #fffef2;
    transform: translateY(-1px);
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

.upload-icon {
    font-size: 3rem;
    color: #111;
    margin-bottom: 0.5rem;
  }

  .upload-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d2d2d;
    margin: 0;
  }

  .upload-description {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

.upload-button {
    background: #FFC47E;
    color: #111;
    border: 2px solid #FFC47E;
    padding: 0.8rem 1.4rem;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: transform 0.15s ease;
    margin-top: 0.5rem;
    letter-spacing: .04em;
  }

  .upload-button:hover {
    background: #E6AF6F;
    transform: translateY(-1px);
  }

  .upload-button.disabled {
    background: #ccc;
    cursor: not-allowed;
    pointer-events: none;
  }

  .file-input-hidden {
    display: none;
  }

  .supported-formats {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

.format-item {
    padding: 0.25rem 0.5rem;
    background: #fffef9;
    border: 2px dotted var(--chip);
    border-radius: 999px;
    font-size: 0.75rem;
    color: #2d2d2d;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
  }

  /* Screen reader only class */
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

  /* Responsive Design */
  @media (max-width: 768px) {
    .uploader-container {
      padding: 1rem;
    }

    .drop-zone {
      padding: 2rem 1rem;
    }

    .upload-title {
      font-size: 1.1rem;
    }

    .upload-description {
      font-size: 0.9rem;
    }
  }
</style>
