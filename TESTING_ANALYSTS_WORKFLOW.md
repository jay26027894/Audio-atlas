# Testing Guide - Analyst's Workflow

Comprehensive testing guide for the Analyst's Workflow feature cluster, covering Chrome Extension, Analysis Route, and Writer API integration.

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Chrome Extension Tests](#chrome-extension-tests)
3. [Analysis Route Tests](#analysis-route-tests)
4. [Writer API Tests](#writer-api-tests)
5. [Integration Tests](#integration-tests)
6. [Performance Tests](#performance-tests)
7. [Security Tests](#security-tests)
8. [User Acceptance Tests](#user-acceptance-tests)

## Test Environment Setup

### Prerequisites

- [ ] Chrome Canary installed
- [ ] Developer mode enabled in `chrome://extensions/`
- [ ] Prompt API flag enabled: `chrome://flags/#prompt-api-for-gemini-nano`
- [ ] Gemini Nano model downloaded in `chrome://components/`
- [ ] Audio Atlas web app running locally
- [ ] Extension loaded unpacked

### Verification

```bash
# 1. Start web app
npm run dev

# 2. Verify it's running
# Open http://localhost:5173

# 3. Verify extension is loaded
# Open chrome://extensions/
# Look for "Audio Atlas Companion"

# 4. Verify Writer API
# Open DevTools Console
# Run: 'ai' in self && 'writer' in self.ai
# Should return: true
```

## Chrome Extension Tests

### Test 1: Extension Loading

**Objective**: Verify extension loads without errors

**Steps**:
1. Open `chrome://extensions/`
2. Locate "Audio Atlas Companion"
3. Check for error messages

**Expected Result**:
- ✅ Extension appears in list
- ✅ Status shows "Enabled"
- ✅ No error messages
- ✅ Service worker status: "Active"

**Actual Result**: _____________

---

### Test 2: Service Worker Initialization

**Objective**: Verify service worker starts correctly

**Steps**:
1. Go to `chrome://extensions/`
2. Find "Audio Atlas Companion"
3. Click "Inspect views: service worker"
4. Check Console tab

**Expected Result**:
- ✅ Console shows: "Audio Atlas Companion: Context menu item created"
- ✅ No error messages
- ✅ Service worker is running

**Actual Result**: _____________

---

### Test 3: Context Menu Creation

**Objective**: Verify context menu appears on images

**Steps**:
1. Navigate to a webpage with images (e.g., https://www.bbc.com/news)
2. Right-click on any image
3. Look for "Analyze Image with Audio Atlas" option

**Expected Result**:
- ✅ Context menu appears
- ✅ "Analyze Image with Audio Atlas" option is visible
- ✅ Option only appears on images (not on text)

**Actual Result**: _____________

---

### Test 4: URL Encoding

**Objective**: Verify special characters are properly encoded

**Test URLs**:
```
https://example.com/image with spaces.jpg
https://example.com/image?param=value&other=123
https://example.com/image#fragment
```

**Steps**:
1. Create test HTML with image URLs containing special characters
2. Right-click image
3. Select "Analyze Image with Audio Atlas"
4. Check opened URL in address bar

**Expected Result**:
- ✅ URL is properly encoded
- ✅ Special characters converted to %XX format
- ✅ No URL parsing errors

**Actual Result**: _____________

---

### Test 5: New Tab Creation

**Objective**: Verify new tab opens with correct URL

**Steps**:
1. Right-click any image
2. Select "Analyze Image with Audio Atlas"
3. Observe new tab

**Expected Result**:
- ✅ New tab opens
- ✅ URL is: `http://localhost:5173/analysis?imageUrl=<encoded-url>`
- ✅ Tab loads successfully

**Actual Result**: _____________

---

## Analysis Route Tests

### Test 6: Route Accessibility

**Objective**: Verify analysis route is accessible

**Steps**:
1. Navigate to `http://localhost:5173/analysis`
2. Observe page load

**Expected Result**:
- ✅ Page loads without errors
- ✅ Shows "No image loaded" state
- ✅ "Upload Image" button is visible

**Actual Result**: _____________

---

### Test 7: Query Parameter Parsing

**Objective**: Verify imageUrl parameter is parsed correctly

**Steps**:
1. Navigate to: `http://localhost:5173/analysis?imageUrl=https://picsum.photos/800/600`
2. Observe page behavior

**Expected Result**:
- ✅ Loading spinner appears
- ✅ Image fetches from URL
- ✅ Image loads in interface
- ✅ Chat interface becomes active

**Actual Result**: _____________

---

### Test 8: Image Fetching

**Objective**: Verify images are fetched and converted correctly

**Test Images**:
```
https://picsum.photos/800/600 (Random image)
https://via.placeholder.com/600x400 (Placeholder)
https://httpbin.org/image/jpeg (Test image)
```

**Steps**:
1. For each test image:
   - Navigate to `/analysis?imageUrl=<encoded-url>`
   - Observe loading and display

**Expected Result**:
- ✅ Image fetches successfully
- ✅ Converts to ArrayBuffer
- ✅ Stores in imageStore
- ✅ Displays in chat interface

**Actual Result**: _____________

---

### Test 9: Error Handling - Invalid URL

**Objective**: Verify error handling for invalid URLs

**Test URLs**:
```
http://invalid-domain-that-does-not-exist.com/image.jpg
https://httpbin.org/status/404
https://httpbin.org/status/500
```

**Steps**:
1. Navigate to `/analysis?imageUrl=<invalid-url>`
2. Observe error handling

**Expected Result**:
- ✅ Error message displays
- ✅ User-friendly error text
- ✅ "Upload Image Instead" button appears
- ✅ No console errors (only warnings)

**Actual Result**: _____________

---

### Test 10: CORS Handling

**Objective**: Verify CORS-restricted images are handled gracefully

**Test URL**:
```
https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png
```

**Steps**:
1. Navigate to `/analysis?imageUrl=<cors-restricted-url>`
2. Observe behavior

**Expected Result**:
- ✅ CORS error caught
- ✅ Error message displays
- ✅ Suggests alternative action
- ✅ App doesn't crash

**Actual Result**: _____________

---

## Writer API Tests

### Test 11: Feature Detection

**Objective**: Verify Writer API availability is detected

**Steps**:
1. Load analysis page with an image
2. Open DevTools Console
3. Run: `'ai' in self && 'writer' in self.ai`

**Expected Result**:
- ✅ Returns `true` in Chrome Canary with flags enabled
- ✅ Returns `false` in regular Chrome

**Actual Result**: _____________

---

### Test 12: Writer Instance Creation

**Objective**: Verify writer instance can be created

**Steps**:
1. Load analysis page with image
2. Ask a question to generate findings
3. Click "Generate Summary Report"
4. Observe console logs

**Expected Result**:
- ✅ Writer instance created successfully
- ✅ No errors in console
- ✅ "Generating..." button state shows

**Actual Result**: _____________

---

### Test 13: Report Generation - Single Finding

**Objective**: Verify report generation with one finding

**Steps**:
1. Load image via extension
2. Ask: "What is shown in this image?"
3. Wait for AI response
4. Click "Generate Summary Report"
5. Observe generated report

**Expected Result**:
- ✅ Report generates successfully
- ✅ Report contains relevant summary
- ✅ Report appears in output area
- ✅ Generation takes 1-3 seconds

**Actual Result**: _____________

---

### Test 14: Report Generation - Multiple Findings

**Objective**: Verify report generation with multiple findings

**Steps**:
1. Load first image
2. Ask 3-4 questions
3. Load second image (via extension or "Add Another Image")
4. Ask 3-4 more questions
5. Click "Generate Summary Report"

**Expected Result**:
- ✅ All findings accumulated
- ✅ Report combines insights from both images
- ✅ Summary is coherent and comprehensive
- ✅ No findings lost

**Actual Result**: _____________

---

### Test 15: Report Generation - Empty Findings

**Objective**: Verify error handling when no findings exist

**Steps**:
1. Load analysis page with image
2. Don't ask any questions
3. Click "Generate Summary Report"

**Expected Result**:
- ✅ Alert shows: "Please analyze at least one image..."
- ✅ Report doesn't generate
- ✅ Button remains enabled
- ✅ No console errors

**Actual Result**: _____________

---

### Test 16: Copy to Clipboard

**Objective**: Verify copy functionality works

**Steps**:
1. Generate a report
2. Click "Copy to Clipboard"
3. Paste in a text editor (Ctrl+V)

**Expected Result**:
- ✅ Report text is copied
- ✅ Paste shows full report
- ✅ Formatting preserved (if any)

**Actual Result**: _____________

---

## Integration Tests

### Test 17: End-to-End Workflow - Single Image

**Objective**: Complete workflow from extension to report

**Steps**:
1. Browse to https://www.bbc.com/news
2. Find a chart or graph
3. Right-click → "Analyze Image with Audio Atlas"
4. Wait for image to load
5. Ask: "What are the main data points?"
6. Ask: "What trends are visible?"
7. Click "Generate Summary Report"
8. Click "Copy to Clipboard"

**Expected Result**:
- ✅ Extension opens Audio Atlas
- ✅ Image loads automatically
- ✅ Questions answered correctly
- ✅ Findings appear in sidebar
- ✅ Report generates successfully
- ✅ Report can be copied

**Actual Result**: _____________

---

### Test 18: End-to-End Workflow - Multiple Images

**Objective**: Multi-image analysis workflow

**Steps**:
1. Analyze first image (via extension)
2. Ask 2-3 questions
3. Click "Add Another Image"
4. Right-click second image → analyze
5. Ask 2-3 more questions
6. Verify findings from both images in sidebar
7. Generate report
8. Verify report includes insights from both images

**Expected Result**:
- ✅ Findings accumulate across images
- ✅ Session state maintained
- ✅ Report combines all insights
- ✅ No data loss

**Actual Result**: _____________

---

### Test 19: Session Management

**Objective**: Verify session controls work correctly

**Steps**:
1. Analyze an image and generate findings
2. Click "Start New Session"
3. Verify findings cleared
4. Analyze new image
5. Verify new findings appear

**Expected Result**:
- ✅ "Start New Session" clears findings
- ✅ Redirects to upload page
- ✅ New session starts fresh
- ✅ No residual data

**Actual Result**: _____________

---

### Test 20: Store Integration

**Objective**: Verify Svelte stores update correctly

**Steps**:
1. Open DevTools
2. Load image via extension
3. Monitor store updates in console
4. Ask questions
5. Observe sessionFindingsStore updates

**Expected Result**:
- ✅ imageStore updates when image loads
- ✅ conversationStore updates with messages
- ✅ sessionFindingsStore updates with AI responses
- ✅ Reactive UI updates occur

**Actual Result**: _____________

---

## Performance Tests

### Test 21: Image Loading Performance

**Objective**: Measure image loading time

**Test Images**:
- Small: 100KB
- Medium: 500KB
- Large: 2MB

**Steps**:
1. For each image size:
   - Note start time
   - Load via extension
   - Note end time when image appears

**Expected Result**:
- ✅ Small: < 500ms
- ✅ Medium: < 1s
- ✅ Large: < 3s
- ✅ No UI freezing

**Actual Result**: _____________

---

### Test 22: Report Generation Performance

**Objective**: Measure report generation time

**Test Cases**:
- 1 finding
- 5 findings
- 10 findings
- 20 findings

**Steps**:
1. For each case:
   - Generate findings
   - Click "Generate Summary Report"
   - Measure time to completion

**Expected Result**:
- ✅ 1 finding: < 2s
- ✅ 5 findings: < 3s
- ✅ 10 findings: < 4s
- ✅ 20 findings: < 5s

**Actual Result**: _____________

---

### Test 23: Memory Usage

**Objective**: Verify no memory leaks

**Steps**:
1. Open DevTools → Performance Monitor
2. Analyze 10 images in sequence
3. Generate 10 reports
4. Monitor memory usage

**Expected Result**:
- ✅ Memory usage stable
- ✅ No continuous growth
- ✅ Garbage collection occurs
- ✅ No memory leaks

**Actual Result**: _____________

---

## Security Tests

### Test 24: XSS Prevention

**Objective**: Verify no XSS vulnerabilities

**Test URLs**:
```
http://localhost:5173/analysis?imageUrl=javascript:alert('xss')
http://localhost:5173/analysis?imageUrl=<script>alert('xss')</script>
```

**Steps**:
1. Navigate to test URLs
2. Observe behavior

**Expected Result**:
- ✅ No script execution
- ✅ URL sanitized
- ✅ Error shown (invalid URL)
- ✅ No security warnings

**Actual Result**: _____________

---

### Test 25: Data Privacy

**Objective**: Verify no data leakage

**Steps**:
1. Open DevTools → Network tab
2. Analyze an image
3. Generate a report
4. Monitor network requests

**Expected Result**:
- ✅ No unexpected network requests
- ✅ No data sent to external servers
- ✅ Only image fetch request visible
- ✅ No analytics or tracking

**Actual Result**: _____________

---

### Test 26: Permission Validation

**Objective**: Verify extension uses minimal permissions

**Steps**:
1. Open `chrome://extensions/`
2. Click "Details" on Audio Atlas Companion
3. Review permissions

**Expected Result**:
- ✅ Only "contextMenus" permission
- ✅ Only "tabs" permission
- ✅ No host permissions
- ✅ No storage permissions

**Actual Result**: _____________

---

## User Acceptance Tests

### Test 27: Usability - First Time User

**Objective**: Verify first-time user can use feature

**Steps**:
1. Give extension to someone unfamiliar
2. Ask them to analyze an image
3. Observe without helping

**Expected Result**:
- ✅ User finds context menu easily
- ✅ User understands what happens
- ✅ User can ask questions
- ✅ User can generate report

**Actual Result**: _____________

---

### Test 28: Accessibility

**Objective**: Verify accessibility features work

**Steps**:
1. Use keyboard navigation only
2. Use screen reader (if available)
3. Check color contrast
4. Verify ARIA labels

**Expected Result**:
- ✅ Keyboard navigation works
- ✅ Screen reader announces elements
- ✅ Sufficient color contrast
- ✅ ARIA labels present

**Actual Result**: _____________

---

### Test 29: Mobile Responsiveness

**Objective**: Verify UI works on mobile (if applicable)

**Steps**:
1. Open DevTools
2. Toggle device toolbar
3. Test various screen sizes
4. Test touch interactions

**Expected Result**:
- ✅ Layout adapts to screen size
- ✅ All elements accessible
- ✅ Touch targets adequate size
- ✅ No horizontal scrolling

**Actual Result**: _____________

---

### Test 30: Error Recovery

**Objective**: Verify users can recover from errors

**Steps**:
1. Trigger various errors:
   - Invalid image URL
   - CORS error
   - Network timeout
   - Writer API unavailable
2. Observe recovery options

**Expected Result**:
- ✅ Clear error messages
- ✅ Recovery actions provided
- ✅ App doesn't crash
- ✅ User can continue working

**Actual Result**: _____________

---

## Test Summary

### Test Results

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| Chrome Extension | 5 | ___ | ___ | |
| Analysis Route | 5 | ___ | ___ | |
| Writer API | 6 | ___ | ___ | |
| Integration | 4 | ___ | ___ | |
| Performance | 3 | ___ | ___ | |
| Security | 3 | ___ | ___ | |
| User Acceptance | 4 | ___ | ___ | |
| **TOTAL** | **30** | ___ | ___ | |

### Critical Issues

List any critical issues found:

1. _______________________________
2. _______________________________
3. _______________________________

### Non-Critical Issues

List any non-critical issues:

1. _______________________________
2. _______________________________
3. _______________________________

### Recommendations

Based on testing:

1. _______________________________
2. _______________________________
3. _______________________________

## Sign-Off

**Tested By**: _______________________  
**Date**: _______________________  
**Version**: 1.0  
**Status**: ☐ Pass ☐ Fail ☐ Pass with Issues

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Automated Testing (Future)

### Unit Tests

```typescript
// Example unit test for sessionStore
import { sessionFindingsStore, addFinding, clearFindings } from '$lib/stores/sessionStore';

describe('sessionStore', () => {
  it('should add findings', () => {
    addFinding('Test finding');
    // Assert finding was added
  });

  it('should clear findings', () => {
    clearFindings();
    // Assert findings are empty
  });
});
```

### Integration Tests

```typescript
// Example integration test
import { render } from '@testing-library/svelte';
import AnalysisPage from '$routes/analysis/+page.svelte';

describe('Analysis Page', () => {
  it('should load image from URL parameter', async () => {
    // Mock URL parameter
    // Render component
    // Assert image loads
  });
});
```

### E2E Tests (Playwright)

```typescript
// Example E2E test
import { test, expect } from '@playwright/test';

test('analyst workflow', async ({ page }) => {
  // Navigate to analysis page with image URL
  await page.goto('/analysis?imageUrl=...');
  
  // Wait for image to load
  await expect(page.locator('img')).toBeVisible();
  
  // Ask a question
  await page.fill('input', 'What is shown?');
  await page.click('button[type="submit"]');
  
  // Wait for response
  await expect(page.locator('.ai-message')).toBeVisible();
  
  // Generate report
  await page.click('text=Generate Summary Report');
  
  // Verify report appears
  await expect(page.locator('.report-output')).toBeVisible();
});
```

---

**Testing Complete!** 🎉

All tests should pass before deploying to production.
