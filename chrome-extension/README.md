# Audio Atlas Companion - Chrome Extension

A lightweight Chrome Extension that enables seamless image analysis by integrating directly into your browser's context menu. Right-click any image on the web and send it to Audio Atlas for instant AI-powered analysis.

## Features

- **Context Menu Integration**: Right-click any image to analyze it with Audio Atlas
- **Seamless Workflow**: Automatically opens Audio Atlas with the selected image
- **Privacy-First**: Only passes the image URL, no data collection
- **Zero Configuration**: Works out of the box once installed

## Installation

### For Development

1. **Navigate to the extension directory**:
   ```bash
   cd chrome-extension
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or click the three-dot menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**:
   - Click "Load unpacked"
   - Select the `chrome-extension` folder from this project

5. **Verify installation**:
   - You should see "Audio Atlas Companion" in your extensions list
   - The extension icon will appear in your toolbar (if icons are provided)

### For Production

1. **Package the extension**:
   - Zip the entire `chrome-extension` folder
   - Ensure all files (manifest.json, service-worker.js, icons) are included

2. **Publish to Chrome Web Store** (optional):
   - Follow [Chrome Web Store publishing guidelines](https://developer.chrome.com/docs/webstore/publish/)

## Usage

### Analyzing Images from the Web

1. **Browse any webpage** with images
2. **Right-click on any image** you want to analyze
3. **Select "Analyze Image with Audio Atlas"** from the context menu
4. **Audio Atlas opens automatically** in a new tab with the image loaded
5. **Start asking questions** about the image to extract insights

### Multi-Image Analysis Workflow

The extension is designed to support the "Analyst's Workflow" - analyzing multiple images and generating comprehensive reports:

1. **Analyze first image**: Right-click and send to Audio Atlas
2. **Extract findings**: Ask questions and gather insights
3. **Analyze additional images**: Use the extension to send more images
4. **Generate report**: Click "Generate Summary Report" to create an executive summary using the Writer API

## Configuration

### Changing the Target URL

By default, the extension points to `http://localhost:5173/analysis` for development. To change this:

1. Open `service-worker.js`
2. Locate the `appUrl` constant:
   ```javascript
   const appUrl = "http://localhost:5173/analysis";
   ```
3. Update it to your production URL:
   ```javascript
   const appUrl = "https://your-audio-atlas-app.com/analysis";
   ```
4. Reload the extension in `chrome://extensions/`

### Adding Custom Icons

The extension currently uses placeholder icons. To add custom icons:

1. Create three PNG images:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

2. Replace the placeholder files in the `chrome-extension` folder

3. Reload the extension

**Recommended Icon Design**:
- Use the Audio Atlas brand colors
- Keep it simple and recognizable at small sizes
- Ensure good contrast for visibility

## Technical Details

### Manifest V3

This extension uses Manifest V3, the latest Chrome extension platform:
- **Service Worker**: Background script runs only when needed
- **Declarative Permissions**: Only requests necessary permissions
- **Modern APIs**: Uses latest Chrome extension APIs

### Permissions

The extension requests minimal permissions:
- **contextMenus**: To add the right-click menu item
- **tabs**: To open new tabs with the analysis URL

### Data Privacy

- **No data collection**: The extension doesn't collect or store any user data
- **URL passing only**: Only the image URL is passed to Audio Atlas
- **Client-side processing**: All analysis happens in the Audio Atlas web app

## Troubleshooting

### Extension Not Appearing

1. Verify Developer Mode is enabled
2. Check that all required files are present
3. Look for errors in `chrome://extensions/`
4. Try removing and re-adding the extension

### Context Menu Not Showing

1. Ensure you're right-clicking on an actual image element
2. Check the browser console for errors (F12 → Console)
3. Verify the extension is enabled in `chrome://extensions/`

### Images Not Loading in Audio Atlas

1. Check that the target URL is correct in `service-worker.js`
2. Ensure Audio Atlas web app is running
3. Verify CORS settings allow image loading
4. Check browser console for network errors

### CORS Issues

Some images may be blocked due to CORS policies. Solutions:
- Use images from CORS-friendly sources
- Configure your Audio Atlas server to handle CORS
- For development, use a CORS proxy or browser extension

## Development

### File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── service-worker.js      # Background script with context menu logic
├── icon16.png            # Small icon (toolbar)
├── icon48.png            # Medium icon (extension management)
├── icon128.png           # Large icon (Chrome Web Store)
└── README.md             # This file
```

### Testing

1. **Load the extension** in Developer Mode
2. **Open the Extensions page** and click "Inspect views: service worker"
3. **Check the console** for any errors
4. **Test the context menu** on various websites
5. **Verify image loading** in Audio Atlas

### Debugging

Enable verbose logging:
```javascript
// In service-worker.js, add console.log statements
console.log("Context menu clicked:", info);
console.log("Opening URL:", urlWithImage);
```

View logs in the service worker inspector:
- Go to `chrome://extensions/`
- Click "Inspect views: service worker" under Audio Atlas Companion

## Integration with Audio Atlas

The extension integrates with the Audio Atlas web application through URL parameters:

```
http://localhost:5173/analysis?imageUrl=<encoded-image-url>
```

The `/analysis` route:
1. Extracts the `imageUrl` parameter
2. Fetches the image from the URL
3. Converts it to an ArrayBuffer
4. Stores it in the image store
5. Enables the chat interface for analysis

## Future Enhancements

Potential improvements for future versions:

- **Batch Selection**: Select multiple images at once
- **Screenshot Capture**: Capture and analyze screenshots
- **Offline Support**: Cache images for offline analysis
- **Custom Prompts**: Pre-configured analysis templates
- **History**: Track previously analyzed images
- **Annotations**: Mark up images before analysis

## Support

For issues, questions, or contributions:
- Check the main Audio Atlas documentation
- Review the troubleshooting section above
- Inspect browser console for errors
- Verify all files are present and correctly configured

## License

This extension is part of the Audio Atlas project and shares the same license.
