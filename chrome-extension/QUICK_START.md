# Quick Start Guide - Audio Atlas Companion

Get started with the Audio Atlas Chrome Extension in 5 minutes.

## Prerequisites

- Google Chrome (latest version)
- Audio Atlas web app running (locally or deployed)

## Installation (2 minutes)

### Step 1: Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Navigate to and select the `chrome-extension` folder
5. Verify "Audio Atlas Companion" appears in your extensions list

### Step 2: Configure Target URL (Optional)

If using a deployed version of Audio Atlas:

1. Open `service-worker.js` in a text editor
2. Find line 20: `const appUrl = "http://localhost:5173/analysis";`
3. Replace with your URL: `const appUrl = "https://your-app.com/analysis";`
4. Save the file
5. Click the refresh icon on the extension in `chrome://extensions/`

## First Analysis (3 minutes)

### Step 1: Find an Image

1. Browse to any website with charts, graphs, or infographics
2. Example sites to try:
   - News articles with data visualizations
   - Research papers with diagrams
   - Business reports with charts
   - Social media infographics

### Step 2: Analyze the Image

1. **Right-click** on the image you want to analyze
2. Select **"Analyze Image with Audio Atlas"** from the context menu
3. Audio Atlas opens automatically in a new tab with the image loaded

### Step 3: Ask Questions

1. Type a question in the input field, for example:
   - "What are the main trends shown in this chart?"
   - "Summarize the key data points"
   - "What's the highest value?"
   
2. Press Enter or click Send
3. The AI analyzes the image and responds
4. Your findings appear in the sidebar automatically

### Step 4: Generate a Report (Optional)

1. Analyze one or more images to build up findings
2. Click **"Generate Summary Report"** in the sidebar
3. Review the AI-generated executive summary
4. Click **"Copy to Clipboard"** to use the report

## Common Use Cases

### Market Research Analyst
- Analyze competitor charts and graphs
- Extract key metrics from industry reports
- Generate summary reports for stakeholders

### Student/Researcher
- Analyze diagrams from research papers
- Extract data from scientific visualizations
- Create study notes from complex charts

### Business Professional
- Analyze sales charts and dashboards
- Extract insights from presentations
- Generate executive summaries

## Tips for Best Results

1. **Ask Specific Questions**: "What's the revenue in Q4?" vs "Tell me about this"
2. **Build Context**: Start with overview questions, then drill into details
3. **Use Multiple Images**: Analyze related images in one session
4. **Review Findings**: Check the sidebar to see what's been extracted
5. **Generate Reports**: Combine insights from multiple images

## Troubleshooting

### Extension not appearing?
- Check Developer mode is enabled
- Verify all files are in the folder
- Look for errors in `chrome://extensions/`

### Context menu not showing?
- Make sure you're right-clicking on an image
- Try a different image
- Check extension is enabled

### Image not loading?
- Verify Audio Atlas is running
- Check the URL in service-worker.js
- Try a different image (some may have CORS restrictions)

### Writer API not working?
- Use Chrome Canary
- Enable `chrome://flags/#prompt-api-for-gemini-nano`
- Download Gemini Nano in `chrome://components/`
- Restart browser

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ANALYSTS_WORKFLOW.md](../ANALYSTS_WORKFLOW.md) for advanced features
- Customize the extension for your workflow
- Add custom icons for a professional look

## Support

Need help?
- Check the troubleshooting section above
- Review the full README
- Inspect browser console for errors (F12)
- Verify all prerequisites are met

---

**Ready to analyze?** Right-click any image and select "Analyze Image with Audio Atlas"!
