/**
 * Audio Atlas Companion - Service Worker
 * 
 * This service worker creates a context menu item that appears when users
 * right-click on images. It enables seamless transfer of image URLs to the
 * Audio Atlas web application for analysis.
 */

// 1. Create the context menu item upon installation.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeWithAudioAtlas",
    title: "Analyze Image with Audio Atlas",
    contexts: ["image"] // This ensures the option only appears on images.
  });
  
  console.log("Audio Atlas Companion: Context menu item created");
});

// 2. Listen for a click on the context menu item.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeWithAudioAtlas" && info.srcUrl) {
    // The base URL of the Audio Atlas web application.
    // Update this URL to match your deployment or use localhost for development
    const appUrl = "http://localhost:5173/analysis";
    
    // Construct the new URL with the image source as a query parameter.
    // It's crucial to encode the component to handle special characters.
    const urlWithImage = `${appUrl}?imageUrl=${encodeURIComponent(info.srcUrl)}`;
    
    console.log("Audio Atlas Companion: Opening analysis with image:", info.srcUrl);
    
    // Create a new tab and navigate to the constructed URL.
    chrome.tabs.create({ url: urlWithImage });
  }
});
