# Installation Guide - Audio Atlas Companion

Step-by-step installation instructions for the Audio Atlas Companion Chrome Extension.

## Prerequisites

Before installing, ensure you have:

- [ ] **Google Chrome** (latest version) or **Chrome Canary** (for Writer API)
- [ ] **Audio Atlas web app** running (locally or deployed)
- [ ] **5 minutes** of time

## Installation Steps

### Step 1: Download the Extension

**Option A: From Source**
```bash
# If you have the full Audio Atlas repository
cd audio-atlas/chrome-extension
```

**Option B: Download ZIP**
- Download the extension folder
- Extract to a location you'll remember

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More Tools → Extensions

### Step 3: Enable Developer Mode

1. Look for the **Developer mode** toggle in the top-right corner
2. Click to enable it
3. You should see additional options appear:
   - Load unpacked
   - Pack extension
   - Update

### Step 4: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to the `chrome-extension` folder
3. Select the folder and click **"Select Folder"** or **"Open"**

### Step 5: Verify Installation

The extension should now appear in your extensions list:

- ✅ Name: "Audio Atlas Companion"
- ✅ Version: 1.0
- ✅ Status: Enabled
- ✅ No error messages

### Step 6: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Audio Atlas Companion"
3. Click the pin icon to keep it visible

## Configuration

### Update Target URL (If Needed)

If you're using a deployed version of Audio Atlas:

1. Open the `service-worker.js` file in a text editor
2. Find line 20:
   ```javascript
   const appUrl = "http://localhost:5173/analysis";
   ```
3. Replace with your production URL:
   ```javascript
   const appUrl = "https://your-audio-atlas-domain.com/analysis";
   ```
4. Save the file
5. Go back to `chrome://extensions/`
6. Click the refresh icon on the extension card

### Add Custom Icons (Optional)

The extension comes with placeholder icons. To add custom icons:

1. Create three PNG images:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

2. Replace the existing placeholder files

3. Reload the extension in `chrome://extensions/`

## Verification

### Test the Extension

1. **Navigate to any webpage** with images (e.g., https://www.bbc.com/news)

2. **Right-click on an image**

3. **Look for the menu option**: "Analyze Image with Audio Atlas"

4. **Click the option**

5. **Verify**:
   - ✅ New tab opens
   - ✅ URL is: `http://localhost:5173/analysis?imageUrl=...`
   - ✅ Audio Atlas loads
   - ✅ Image appears in the interface

### Check Service Worker

1. Go to `chrome://extensions/`
2. Find "Audio Atlas Companion"
3. Click **"Inspect views: service worker"**
4. Check the Console tab for:
   - ✅ "Audio Atlas Companion: Context menu item created"
   - ✅ No error messages

## Troubleshooting

### Extension Not Appearing

**Problem**: Extension doesn't show up in the list

**Solutions**:
1. Verify Developer mode is enabled
2. Check that you selected the correct folder
3. Look for error messages in the extensions page
4. Try removing and re-adding the extension

### Context Menu Not Showing

**Problem**: Right-click menu option doesn't appear

**Solutions**:
1. Verify extension is enabled (toggle should be blue)
2. Make sure you're right-clicking on an actual image element
3. Try a different website
4. Check the service worker console for errors
5. Reload the extension

### Extension Shows Errors

**Problem**: Red error messages appear

**Solutions**:
1. Check that all files are present:
   - manifest.json
   - service-worker.js
   - icon16.png, icon48.png, icon128.png
2. Verify manifest.json syntax is correct
3. Check service worker console for specific errors
4. Try removing and re-adding the extension

### Images Not Loading in Audio Atlas

**Problem**: Extension opens Audio Atlas but image doesn't load

**Solutions**:
1. Verify Audio Atlas web app is running
2. Check the target URL in service-worker.js
3. Look for CORS errors in browser console (F12)
4. Try with a different image
5. Check network tab for failed requests

### Service Worker Inactive

**Problem**: Service worker shows as "inactive"

**Solutions**:
1. Click on the service worker link to activate it
2. Reload the extension
3. Restart Chrome
4. Check for JavaScript errors in the service worker console

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Audio Atlas Companion"
3. Click **"Remove"**
4. Confirm removal

## Next Steps

Now that the extension is installed:

1. **Read the Quick Start**: See `QUICK_START.md` for a 5-minute tutorial
2. **Try analyzing an image**: Right-click any image on the web
3. **Generate your first report**: Analyze multiple images and create a summary
4. **Read the full README**: See `README.md` for complete documentation

## Support

### Common Questions

**Q: Do I need Chrome Canary?**  
A: Only if you want to use the Writer API for report generation. The extension works in regular Chrome, but report generation requires Chrome Canary with the Prompt API enabled.

**Q: Can I use this with a deployed Audio Atlas?**  
A: Yes! Just update the `appUrl` in `service-worker.js` to point to your deployed URL.

**Q: Does this work on mobile?**  
A: No, Chrome extensions are desktop-only.

**Q: Is my data safe?**  
A: Yes! The extension doesn't collect or store any data. It only passes image URLs to Audio Atlas.

### Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the full README.md
3. Check the browser console for errors (F12)
4. Verify all prerequisites are met
5. Try with a fresh installation

### Reporting Bugs

Found a bug? Please report it with:

- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if helpful)

## Advanced Configuration

### Development Mode

If you're developing or testing:

1. Keep Developer mode enabled
2. Use the service worker inspector for debugging
3. Check console logs for detailed information
4. Reload extension after each code change

### Production Deployment

For production use:

1. Replace placeholder icons with branded icons
2. Update target URL to production domain
3. Test thoroughly on multiple websites
4. Consider publishing to Chrome Web Store

See `DEPLOYMENT_GUIDE.md` in the main project for full deployment instructions.

## Updates

To update the extension:

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test the changes

## Chrome Web Store Installation (Future)

Once published to the Chrome Web Store:

1. Visit the extension's Web Store page
2. Click "Add to Chrome"
3. Confirm the installation
4. The extension installs automatically

No manual configuration needed for Web Store installations!

---

## Installation Checklist

- [ ] Chrome browser installed
- [ ] Extension folder downloaded/located
- [ ] Opened chrome://extensions/
- [ ] Enabled Developer mode
- [ ] Loaded unpacked extension
- [ ] Extension appears in list
- [ ] No error messages
- [ ] Service worker active
- [ ] Context menu tested
- [ ] Image analysis tested
- [ ] Ready to use!

---

**Installation Complete!** 🎉

You can now right-click any image on the web and analyze it with Audio Atlas.

**Next**: Read `QUICK_START.md` for a 5-minute tutorial on using the extension.
