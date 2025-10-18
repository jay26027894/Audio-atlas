# Audio Atlas - Complete Setup Guide

This guide will walk you through setting up Audio Atlas for development and testing, including enabling Chrome's Built-in AI features.

## Prerequisites

### 1. Node.js and npm
- **Required Version**: Node.js v18 or higher
- **Check your version**:
  ```bash
  node --version
  npm --version
  ```
- **Download**: https://nodejs.org/

### 2. Chrome Canary or Chrome Dev
Audio Atlas requires Chrome's experimental AI features, which are currently only available in Chrome Canary or Chrome Dev channels.

- **Chrome Canary**: https://www.google.com/chrome/canary/
- **Chrome Dev**: https://www.google.com/chrome/dev/

**Note**: Regular Chrome stable does not yet support these features.

## Step 1: Enable Chrome AI Features

### Enable Required Flags

1. Open Chrome Canary or Chrome Dev
2. Navigate to `chrome://flags`
3. Search for and enable the following flags:

   - **Optimization Guide On Device Model**
     - Flag: `#optimization-guide-on-device-model`
     - Set to: **Enabled**

   - **Prompt API for Gemini Nano**
     - Flag: `#prompt-api-for-gemini-nano`
     - Set to: **Enabled**

   - **Summarization API for Gemini Nano** (Optional)
     - Flag: `#summarization-api-for-gemini-nano`
     - Set to: **Enabled**

4. Click **Relaunch** to restart Chrome

### Download the AI Model

After enabling the flags and restarting Chrome:

1. Open DevTools (F12 or Ctrl+Shift+I / Cmd+Option+I)
2. Go to the **Console** tab
3. Run the following command:
   ```javascript
   await window.ai.languageModel.create();
   ```
4. This will trigger the download of the Gemini Nano model
5. Wait for the download to complete (this may take several minutes)
6. You'll see a success message when ready

### Verify AI Availability

To confirm everything is working:

```javascript
// Check if AI is available
const capabilities = await window.ai.languageModel.capabilities();
console.log(capabilities);
// Should show: { available: "readily" }
```

## Step 2: Clone and Install

### Clone the Repository

```bash
git clone <repository-url>
cd audio-atlas
```

### Install Dependencies

```bash
npm install
```

This will install all required packages including:
- SvelteKit
- TypeScript
- Tailwind CSS
- Vite
- ESLint and Prettier

## Step 3: Run the Development Server

### Start the Dev Server

```bash
npm run dev
```

You should see output similar to:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Open in Browser

1. Open Chrome Canary or Chrome Dev
2. Navigate to `http://localhost:5173`
3. You should see the Audio Atlas interface

## Step 4: Test the Application

### Basic Functionality Test

1. **Upload an Image**:
   - Click "Choose File" or drag and drop an image
   - Use a chart, diagram, or graph for best results

2. **Ask a Question**:
   - Type a question in the input field
   - Try: "Give me a high-level summary of this image"
   - Press Enter or click the submit button

3. **Test Voice Input**:
   - Click the microphone button (🎤)
   - Grant microphone permissions if prompted
   - Speak your question clearly
   - The app will transcribe and process your query

4. **Test Text-to-Speech**:
   - After asking a question, the AI response should be spoken aloud
   - Ensure your system volume is on

### Example Test Queries

For a **flowchart or diagram**:
- "Describe the main flow from start to finish"
- "What are the inputs to this process?"
- "Walk me through each step"

For a **chart or graph**:
- "What's the highest value shown?"
- "Give me the data for Q3"
- "What trend do you see?"

For a **map**:
- "Describe the route from A to B"
- "What are the major landmarks?"

## Step 5: Development Workflow

### Code Formatting

Format all code:
```bash
npm run format
```

### Linting

Check for code issues:
```bash
npm run lint
```

### Type Checking

Run TypeScript type checking:
```bash
npm run check
```

Watch mode for continuous checking:
```bash
npm run check:watch
```

## Step 6: Building for Production

### Create Production Build

```bash
npm run build
```

This creates optimized files in the `/build` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Troubleshooting

### Issue: "Chrome Built-in AI is not available"

**Solutions**:
1. Ensure you're using Chrome Canary or Chrome Dev
2. Verify all flags are enabled in `chrome://flags`
3. Restart Chrome after enabling flags
4. Download the AI model using the console command
5. Check `chrome://components` to see if "Optimization Guide On Device Model" is present

### Issue: "Speech Recognition not supported"

**Solutions**:
1. Ensure you're using a Chromium-based browser
2. Grant microphone permissions when prompted
3. Check browser console for specific error messages

### Issue: "Text-to-Speech not working"

**Solutions**:
1. Check system volume
2. Ensure browser has permission to play audio
3. Try a different browser if the issue persists

### Issue: Image upload fails

**Solutions**:
1. Ensure the file is a valid image format (PNG, JPG, GIF, etc.)
2. Check browser console for error messages
3. Try a smaller image file

### Issue: AI responses are slow

**Possible Causes**:
1. First query after model download may be slower
2. Large images take longer to process
3. Complex queries require more processing time

**This is normal** - on-device processing takes a few seconds.

### Issue: Dependencies fail to install

**Solutions**:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Ensure you're using Node.js v18 or higher

## Browser Compatibility

### Supported Browsers
- ✅ Chrome Canary (with AI flags enabled)
- ✅ Chrome Dev (with AI flags enabled)

### Unsupported Browsers
- ❌ Chrome Stable (AI features not yet available)
- ❌ Firefox
- ❌ Safari
- ❌ Edge (even Chromium-based)

**Note**: This is experimental technology. Browser support will expand as Chrome's Built-in AI features become stable.

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant updates during development. Changes to Svelte components will reflect immediately without full page reload.

### DevTools
Use Chrome DevTools to:
- Inspect component state
- Monitor network requests (should be none for AI!)
- Check console for errors
- Test accessibility with Lighthouse

### Accessibility Testing
1. Use keyboard only (Tab, Enter, Space)
2. Enable a screen reader (NVDA, JAWS, or VoiceOver)
3. Test with high contrast mode
4. Verify all ARIA labels are correct

## Next Steps

Once you have the application running:

1. **Read the Architecture Documentation**: See `ARCHITECTURE.md` for detailed technical information
2. **Explore the Code**: All code is heavily commented for clarity
3. **Customize**: Modify components and styles to suit your needs
4. **Contribute**: See `CONTRIBUTING.md` for contribution guidelines

## Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Review the `ARCHITECTURE.md` for implementation details
3. Open an issue in the repository with:
   - Your Chrome version
   - Steps to reproduce the issue
   - Console error messages
   - Screenshots if applicable

## Success Checklist

Before considering your setup complete, verify:

- ✅ Chrome Canary/Dev installed
- ✅ AI flags enabled and Chrome restarted
- ✅ Gemini Nano model downloaded
- ✅ Dependencies installed (`node_modules` present)
- ✅ Dev server running (`npm run dev`)
- ✅ Application loads in browser
- ✅ Image upload works
- ✅ AI responses are generated
- ✅ Text-to-speech works
- ✅ Voice input works (optional, requires microphone)

## Congratulations!

You're now ready to explore Audio Atlas and experience the future of accessible visual data interaction!

---

**Audio Atlas** - *Transforming Visual Data into Conversational Knowledge*
