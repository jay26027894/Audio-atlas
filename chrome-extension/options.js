const DEFAULT_BASE_URL = "https://audio-atlas.vercel.app";

function normalizeBase(url) {
  return url.replace(/\/$/, "");
}

function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = isError ? "#ef4444" : "";
}

async function load() {
  try {
    const { baseUrl } = await chrome.storage.sync.get({ baseUrl: DEFAULT_BASE_URL });
    document.getElementById("baseUrl").value = baseUrl || DEFAULT_BASE_URL;
  } catch (e) {
    setStatus("Could not read settings; using defaults.");
    document.getElementById("baseUrl").value = DEFAULT_BASE_URL;
  }
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function save() {
  const input = document.getElementById("baseUrl");
  const value = input.value.trim();
  if (!isValidUrl(value)) {
    setStatus("Enter a valid http(s) URL.", true);
    input.focus();
    return;
  }
  await chrome.storage.sync.set({ baseUrl: normalizeBase(value) });
  setStatus("Saved.");
}

async function resetDefault() {
  await chrome.storage.sync.set({ baseUrl: DEFAULT_BASE_URL });
  await load();
  setStatus("Reset to default.");
}

async function openBase() {
  const value = document.getElementById("baseUrl").value.trim() || DEFAULT_BASE_URL;
  chrome.tabs.create({ url: normalizeBase(value) });
}

function init() {
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("reset").addEventListener("click", resetDefault);
  document.getElementById("open").addEventListener("click", openBase);
  load();
}

document.addEventListener("DOMContentLoaded", init);
