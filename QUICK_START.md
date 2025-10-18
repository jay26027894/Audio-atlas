# Audio Atlas - Quick Start Guide

Get Audio Atlas running in 5 minutes! ⚡

## Prerequisites

✅ **Chrome Canary** or **Chrome Dev** (not regular Chrome)  
✅ **Node.js v18+** installed

## Step 1: Enable Chrome AI (2 minutes)

1. Open Chrome Canary/Dev
2. Go to `chrome://flags`
3. Enable these two flags:
   - `#optimization-guide-on-device-model` → **Enabled**
   - `#prompt-api-for-gemini-nano` → **Enabled**
4. Click **Relaunch**
5. Open DevTools Console (F12) and run:
   ```javascript
   await window.ai.languageModel.create();
   ```
6. Wait for model download (may take a few minutes)

## Step 2: Install and Run (2 minutes)

```bash
# Clone and navigate
cd audio-atlas

# Install dependencies
npm install

# Start development server
npm run dev
```

## Step 3: Test It! (1 minute)

1. Open `http://localhost:5173` in Chrome Canary/Dev
2. Upload a chart or diagram
3. Ask: *"Give me a summary of this image"*
4. Listen to the AI response! 🎉

## Quick Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run format   # Format code
npm run lint     # Lint code
npm run check    # Type check
```

## Sample Test Queries

### For Charts/Graphs:
- *"What's the highest value?"*
- *"Give me the data for Q3"*
- *"What trend do you see?"*

### For Diagrams/Flowcharts:
- *"Walk me through the process"*
- *"Describe the main flow"*
- *"What are the inputs and outputs?"*

## Troubleshooting

### "AI not available" error?
- Ensure you're using Chrome Canary/Dev
- Check flags are enabled at `chrome://flags`
- Restart Chrome after enabling flags
- Download model in console: `await window.ai.languageModel.create()`

### Voice input not working?
- Grant microphone permissions
- Check browser console for errors
- Ensure you're using Chrome (not Firefox/Safari)

### No audio output?
- Check system volume
- Ensure browser can play audio
- Check browser console for errors

## Project Structure

```
audio-atlas/
├── src/
│   ├── lib/
│   │   ├── components/    # UI components
│   │   ├── stores/        # State management
│   │   └── utils/         # AI & speech utilities
│   ├── routes/            # Pages
│   └── app.css            # Global styles
├── README.md              # Full documentation
├── SETUP_GUIDE.md         # Detailed setup
└── ARCHITECTURE.md        # Technical details
```

## Key Features

✨ **On-Device AI** - All processing happens in your browser  
🔒 **Privacy-First** - No data sent to servers  
🎤 **Voice Input** - Ask questions with your voice  
🔊 **Audio Output** - Responses spoken aloud  
♿ **Accessible** - Full keyboard & screen reader support  
📱 **Offline** - Works without internet (after initial load)

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- 🧪 Read [TESTING.md](TESTING.md) for testing procedures
- 🤝 Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Review [TESTING.md](TESTING.md) for troubleshooting
- Open an issue on GitHub

---

**You're ready to go! Upload an image and start exploring! 🚀**

**Audio Atlas** - *Transforming Visual Data into Conversational Knowledge*
