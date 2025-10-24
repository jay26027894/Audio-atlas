/**
 * Audio Atlas Companion - Service Worker
 *
 * - Creates a context menu on images to analyze with Audio Atlas.
 * - Uses a configurable base URL stored in chrome.storage.sync (defaults to http://localhost:5173).
 */

const DEFAULT_BASE_URL = "https://audio-atlas.vercel.app";

// Ensure a sane default is set on install and create context menu.
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const { baseUrl } = await chrome.storage.sync.get({ baseUrl: DEFAULT_BASE_URL });
    if (!baseUrl) {
      await chrome.storage.sync.set({ baseUrl: DEFAULT_BASE_URL });
    }
  } catch (e) {
    // storage might fail if unavailable; continue with defaults
    console.warn("Audio Atlas Companion: storage not available, using defaults", e);
  }

  chrome.contextMenus.create({
    id: "analyzeWithAudioAtlas",
    title: "Analyze image with Audio Atlas",
    contexts: ["image"]
  });

  console.log("Audio Atlas Companion: Installed and context menu created");
});

// When the context menu is clicked, open the analysis page with the image URL.
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "analyzeWithAudioAtlas" || !info.srcUrl) return;

  let baseUrl = DEFAULT_BASE_URL;
  try {
    const stored = await chrome.storage.sync.get({ baseUrl: DEFAULT_BASE_URL });
    baseUrl = stored.baseUrl || DEFAULT_BASE_URL;
  } catch (e) {
    console.warn("Audio Atlas Companion: could not read baseUrl, using default", e);
  }

  // Normalize base URL and build analysis URL
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const appUrl = `${normalizedBase}/analysis`;
  const urlWithImage = `${appUrl}?imageUrl=${encodeURIComponent(info.srcUrl)}`;

  console.log("Audio Atlas Companion: Opening analysis with image:", info.srcUrl);
  chrome.tabs.create({ url: urlWithImage });
});
