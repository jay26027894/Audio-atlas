// Popup logic for Audio Atlas extension
const DEFAULT_BASE_URL = "https://audio-atlas.vercel.app";

function normalizeBase(url) {
  try {
    // Remove trailing slash for consistency
    return url.replace(/\/$/, "");
  } catch {
    return DEFAULT_BASE_URL;
  }
}

async function getBaseUrl() {
  try {
    const { baseUrl } = await chrome.storage.sync.get({ baseUrl: DEFAULT_BASE_URL });
    return baseUrl || DEFAULT_BASE_URL;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

function openUrl(url) {
  chrome.tabs.create({ url });
}

async function init() {
  const baseUrlEl = document.getElementById("baseUrl");
  const openAppBtn = document.getElementById("openApp");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const imageUrlInput = document.getElementById("imageUrl");
  const openSettingsBtn = document.getElementById("openSettings");

  const baseUrl = normalizeBase(await getBaseUrl());
  baseUrlEl.textContent = baseUrl;

  openAppBtn.addEventListener("click", () => {
    openUrl(baseUrl);
  });

  analyzeBtn.addEventListener("click", () => {
    const imageUrl = imageUrlInput.value.trim();
    if (!imageUrl) return;
    const analysisUrl = `${baseUrl}/analysis?imageUrl=${encodeURIComponent(imageUrl)}`;
    openUrl(analysisUrl);
  });

  imageUrlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") analyzeBtn.click();
  });

  openSettingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
}

document.addEventListener("DOMContentLoaded", init);
