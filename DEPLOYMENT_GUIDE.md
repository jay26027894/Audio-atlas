# Deployment Guide - Analyst's Workflow

Complete guide for deploying the Audio Atlas Companion Chrome Extension and the enhanced web application with the Analyst's Workflow feature.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Chrome Extension Deployment](#chrome-extension-deployment)
3. [Web Application Deployment](#web-application-deployment)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### For Chrome Extension

- Google Chrome browser (latest version)
- Chrome Developer account (for Web Store publishing)
- Extension icons (16x16, 48x48, 128x128 PNG files)

### For Web Application

- Node.js 18+ and npm
- SvelteKit application running
- Domain name (for production deployment)
- SSL certificate (for HTTPS)

### For Writer API

- Chrome Canary browser
- Prompt API enabled: `chrome://flags/#prompt-api-for-gemini-nano`
- Gemini Nano model downloaded

## Chrome Extension Deployment

### Step 1: Prepare Extension Files

1. **Navigate to extension directory**:
   ```bash
   cd chrome-extension
   ```

2. **Create custom icons** (replace placeholders):
   - Design 16x16, 48x48, and 128x128 PNG icons
   - Use Audio Atlas brand colors
   - Save as `icon16.png`, `icon48.png`, `icon128.png`

3. **Update target URL** in `service-worker.js`:
   ```javascript
   // Change from localhost to production URL
   const appUrl = "https://your-audio-atlas-domain.com/analysis";
   ```

4. **Verify manifest.json**:
   ```json
   {
     "manifest_version": 3,
     "name": "Audio Atlas Companion",
     "version": "1.0",
     "description": "Send images directly to Audio Atlas for analysis.",
     "permissions": ["contextMenus", "tabs"],
     "background": {
       "service_worker": "service-worker.js"
     },
     "icons": {
       "16": "icon16.png",
       "48": "icon48.png",
       "128": "icon128.png"
     }
   }
   ```

### Step 2: Test Locally

1. **Load unpacked extension**:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select `chrome-extension` folder

2. **Test functionality**:
   - Right-click on various images
   - Verify context menu appears
   - Check that Audio Atlas opens correctly
   - Test URL encoding with special characters

3. **Inspect service worker**:
   - Click "Inspect views: service worker"
   - Check console for errors
   - Verify logs show correct behavior

### Step 3: Package Extension

1. **Create ZIP file**:
   ```bash
   # From chrome-extension directory
   zip -r audio-atlas-companion.zip . -x "*.git*" -x "*.DS_Store"
   ```

   Or manually:
   - Select all files in `chrome-extension/` folder
   - Create ZIP archive named `audio-atlas-companion.zip`

2. **Verify ZIP contents**:
   - manifest.json
   - service-worker.js
   - icon16.png
   - icon48.png
   - icon128.png
   - README.md (optional, for documentation)

### Step 4: Publish to Chrome Web Store (Optional)

1. **Create Chrome Web Store account**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Upload extension**:
   - Click "New Item"
   - Upload `audio-atlas-companion.zip`
   - Fill in store listing details

3. **Store listing information**:
   ```
   Name: Audio Atlas Companion
   
   Summary: Send images directly to Audio Atlas for AI-powered analysis
   
   Description:
   Audio Atlas Companion seamlessly integrates image analysis into your browser workflow. 
   Right-click any image on the web and instantly analyze it with Audio Atlas's AI-powered 
   visual question answering system.
   
   Features:
   - One-click image analysis from any webpage
   - Multi-image session management
   - AI-powered report generation
   - Privacy-first, on-device processing
   
   Category: Productivity
   Language: English
   ```

4. **Add screenshots**:
   - Context menu in action
   - Analysis interface
   - Report generation
   - Minimum 1280x800 or 640x400

5. **Privacy policy** (required):
   ```
   Audio Atlas Companion Privacy Policy
   
   Data Collection: This extension does not collect, store, or transmit any user data.
   
   Permissions:
   - contextMenus: To add right-click menu option for images
   - tabs: To open Audio Atlas in a new tab
   
   Image Handling: Image URLs are passed to Audio Atlas for analysis. 
   No images are stored or transmitted to third-party servers.
   
   Contact: [your-email@domain.com]
   ```

6. **Submit for review**:
   - Review all information
   - Submit for publication
   - Wait for approval (typically 1-3 days)

### Step 5: Distribute Unpacked (Alternative)

If not publishing to Web Store:

1. **Host ZIP file**:
   - Upload to GitHub releases
   - Host on your website
   - Share via cloud storage

2. **Provide installation instructions**:
   ```markdown
   ## Installation
   
   1. Download `audio-atlas-companion.zip`
   2. Extract to a folder
   3. Open Chrome and go to `chrome://extensions/`
   4. Enable "Developer mode"
   5. Click "Load unpacked"
   6. Select the extracted folder
   ```

## Web Application Deployment

### Step 1: Prepare Web Application

1. **Ensure analysis route exists**:
   ```bash
   # Verify file exists
   ls src/routes/analysis/+page.svelte
   ```

2. **Verify session store**:
   ```bash
   # Verify file exists
   ls src/lib/stores/sessionStore.ts
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # Navigate to http://localhost:5173/analysis?imageUrl=<test-url>
   ```

### Step 2: Build for Production

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build application**:
   ```bash
   npm run build
   ```

3. **Preview build**:
   ```bash
   npm run preview
   ```

4. **Test analysis route**:
   - Navigate to preview URL + `/analysis?imageUrl=<test-url>`
   - Verify image loads
   - Test Writer API functionality
   - Check responsive layout

### Step 3: Deploy to Hosting Platform

#### Option A: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure**:
   - Framework: SvelteKit
   - Build command: `npm run build`
   - Output directory: `.svelte-kit`

4. **Set environment variables** (if needed):
   ```bash
   vercel env add VARIABLE_NAME
   ```

#### Option B: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `build`

#### Option C: Custom Server

1. **Build application**:
   ```bash
   npm run build
   ```

2. **Copy build files** to server:
   ```bash
   scp -r build/* user@server:/var/www/audio-atlas/
   ```

3. **Configure web server** (Nginx example):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       root /var/www/audio-atlas;
       try_files $uri $uri/ /index.html;
     }
     
     location /analysis {
       root /var/www/audio-atlas;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. **Enable HTTPS**:
   ```bash
   certbot --nginx -d your-domain.com
   ```

### Step 4: Configure CORS (if needed)

If images fail to load due to CORS:

1. **Add CORS headers** (Nginx):
   ```nginx
   add_header Access-Control-Allow-Origin *;
   add_header Access-Control-Allow-Methods "GET, OPTIONS";
   ```

2. **Or use SvelteKit hooks** (`src/hooks.server.ts`):
   ```typescript
   export async function handle({ event, resolve }) {
     const response = await resolve(event);
     response.headers.set('Access-Control-Allow-Origin', '*');
     return response;
   }
   ```

## Configuration

### Update Extension Target URL

After deploying web app, update extension:

1. **Edit `service-worker.js`**:
   ```javascript
   const appUrl = "https://your-actual-domain.com/analysis";
   ```

2. **Reload extension**:
   - Go to `chrome://extensions/`
   - Click refresh icon

3. **Test with production URL**:
   - Right-click an image
   - Verify it opens production site

### Environment Variables

If using environment variables:

1. **Create `.env` file**:
   ```env
   PUBLIC_APP_URL=https://your-domain.com
   ```

2. **Use in code**:
   ```typescript
   import { PUBLIC_APP_URL } from '$env/static/public';
   ```

3. **Set in hosting platform**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

## Testing

### Extension Testing

1. **Test on multiple websites**:
   - [ ] News sites (CNN, BBC)
   - [ ] Social media (Twitter, LinkedIn)
   - [ ] Image hosting (Imgur, Flickr)
   - [ ] E-commerce (Amazon, eBay)
   - [ ] Documentation (GitHub, MDN)

2. **Test edge cases**:
   - [ ] Images with special characters in URL
   - [ ] Very large images
   - [ ] SVG images
   - [ ] Data URLs
   - [ ] CORS-restricted images

3. **Test functionality**:
   - [ ] Context menu appears
   - [ ] New tab opens
   - [ ] Image loads in Audio Atlas
   - [ ] Analysis works correctly
   - [ ] Findings are captured
   - [ ] Report generation works

### Web Application Testing

1. **Test analysis route**:
   - [ ] Direct URL access works
   - [ ] Query parameter parsing
   - [ ] Image fetching
   - [ ] ArrayBuffer conversion
   - [ ] Store integration

2. **Test Writer API**:
   - [ ] Feature detection
   - [ ] Writer creation
   - [ ] Report generation
   - [ ] Error handling
   - [ ] Loading states

3. **Test UI**:
   - [ ] Responsive layout
   - [ ] Findings panel
   - [ ] Report panel
   - [ ] Session controls
   - [ ] Loading states
   - [ ] Error states

### Integration Testing

1. **End-to-end workflow**:
   - [ ] Right-click image → opens Audio Atlas
   - [ ] Image loads automatically
   - [ ] Ask questions → get responses
   - [ ] Findings appear in sidebar
   - [ ] Generate report → summary appears
   - [ ] Copy to clipboard works

2. **Multi-image workflow**:
   - [ ] Analyze first image
   - [ ] Add second image
   - [ ] Findings accumulate
   - [ ] Generate combined report

## Troubleshooting

### Extension Issues

**Extension not loading:**
- Check manifest.json syntax
- Verify all files exist
- Check Chrome version compatibility

**Context menu not appearing:**
- Verify extension is enabled
- Check service worker console
- Test on different websites

**Wrong URL opening:**
- Check `appUrl` in service-worker.js
- Verify URL encoding
- Test with simple image first

### Web Application Issues

**Analysis route 404:**
- Verify route file exists
- Check build output
- Review server configuration

**Images not loading:**
- Check CORS headers
- Verify image URL is accessible
- Test with different image sources
- Check network tab for errors

**Writer API not working:**
- Verify Chrome Canary
- Check Prompt API flag
- Confirm Gemini Nano downloaded
- Restart browser

### Performance Issues

**Slow image loading:**
- Optimize image sizes
- Check network speed
- Consider image proxy

**Slow report generation:**
- Reduce findings count
- Check model is downloaded
- Monitor browser resources

## Monitoring

### Extension Analytics (Optional)

If adding analytics:

1. **Add to manifest.json**:
   ```json
   "permissions": ["storage"]
   ```

2. **Track usage**:
   ```javascript
   chrome.storage.local.get(['usageCount'], (result) => {
     const count = (result.usageCount || 0) + 1;
     chrome.storage.local.set({ usageCount: count });
   });
   ```

### Web Application Analytics

Add analytics to track:
- Analysis route visits
- Image load success rate
- Report generation count
- Error rates

Example with Google Analytics:
```typescript
// In analysis/+page.svelte
onMount(() => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_path: '/analysis'
    });
  }
});
```

## Rollback Plan

If issues occur:

### Extension Rollback

1. **Revert to previous version**:
   - Update version in manifest.json
   - Restore previous service-worker.js
   - Reload extension

2. **Unpublish from Web Store** (if needed):
   - Go to Developer Dashboard
   - Select extension
   - Click "Unpublish"

### Web Application Rollback

1. **Revert deployment**:
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   netlify rollback
   ```

2. **Restore previous build**:
   ```bash
   git checkout <previous-commit>
   npm run build
   # Deploy
   ```

## Maintenance

### Regular Updates

1. **Monitor Chrome updates** for API changes
2. **Update dependencies** regularly
3. **Test on new Chrome versions**
4. **Review user feedback**
5. **Fix bugs promptly**

### Version Management

Use semantic versioning:
- **1.0.0** → Initial release
- **1.0.1** → Bug fixes
- **1.1.0** → New features
- **2.0.0** → Breaking changes

Update in manifest.json:
```json
"version": "1.0.1"
```

## Support

### User Support

Provide support channels:
- GitHub Issues
- Email support
- Documentation links
- FAQ page

### Developer Support

- Contributing guide
- Code documentation
- Development setup guide
- API reference

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Icons created
- [ ] URLs configured
- [ ] CORS configured (if needed)
- [ ] Environment variables set

### Extension Deployment

- [ ] Icons replaced
- [ ] Target URL updated
- [ ] Tested locally
- [ ] ZIP created
- [ ] Published/distributed

### Web App Deployment

- [ ] Build successful
- [ ] Preview tested
- [ ] Deployed to hosting
- [ ] HTTPS enabled
- [ ] Analysis route working

### Post-Deployment

- [ ] Extension tested with production URL
- [ ] End-to-end workflow tested
- [ ] Analytics configured (optional)
- [ ] Monitoring set up
- [ ] Support channels ready

---

**Deployment Complete!** 🚀

Users can now right-click any image and analyze it with Audio Atlas.
