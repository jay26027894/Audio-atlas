# Contributing to Audio Atlas Companion Extension

Thank you for your interest in contributing to the Audio Atlas Companion Chrome Extension!

## Development Setup

1. **Clone the repository** and navigate to the extension folder:
   ```bash
   cd chrome-extension
   ```

2. **Load the extension** in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Make your changes** to the code

4. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card

## Code Style

### JavaScript
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Use descriptive variable names

### Example:
```javascript
/**
 * Handles context menu clicks and opens Audio Atlas with the image
 * @param {chrome.contextMenus.OnClickData} info - Click event data
 * @param {chrome.tabs.Tab} tab - Active tab information
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Implementation
});
```

## Testing Your Changes

### Manual Testing Checklist

- [ ] Extension loads without errors in `chrome://extensions/`
- [ ] Service worker starts successfully
- [ ] Context menu appears when right-clicking images
- [ ] Clicking menu item opens Audio Atlas in new tab
- [ ] Image URL is correctly passed as query parameter
- [ ] Works on multiple websites (news, social media, etc.)
- [ ] Special characters in URLs are properly encoded
- [ ] No console errors in service worker inspector

### Test on Multiple Sites

Try your changes on:
- News websites (CNN, BBC, etc.)
- Social media (Twitter, LinkedIn, etc.)
- Image hosting sites (Imgur, Flickr, etc.)
- E-commerce sites (Amazon, eBay, etc.)
- Documentation sites (MDN, GitHub, etc.)

## Common Development Tasks

### Updating the Context Menu

Edit `service-worker.js`:
```javascript
chrome.contextMenus.create({
  id: "analyzeWithAudioAtlas",
  title: "Your New Title",
  contexts: ["image", "video"] // Add more contexts
});
```

### Changing the Target URL

Edit `service-worker.js`:
```javascript
const appUrl = "https://your-new-url.com/analysis";
```

### Adding New Features

1. Update `manifest.json` if new permissions are needed
2. Implement feature in `service-worker.js`
3. Test thoroughly
4. Update documentation
5. Submit pull request

## Icon Guidelines

If contributing new icons:

### Requirements
- PNG format
- Transparent background
- Three sizes: 16x16, 48x48, 128x128
- Consistent design across all sizes
- High contrast for visibility

### Design Tips
- Use Audio Atlas brand colors
- Keep it simple and recognizable
- Test at actual size (16x16 is very small!)
- Ensure good visibility on light and dark backgrounds

## Documentation

When adding features, update:
- `README.md` - Main documentation
- `QUICK_START.md` - If it affects getting started
- Code comments - JSDoc for all functions
- `CONTRIBUTING.md` - If it affects development workflow

## Commit Messages

Use clear, descriptive commit messages:

```
Good:
- "Add support for video element context menu"
- "Fix URL encoding for special characters"
- "Update target URL to production endpoint"

Bad:
- "Update"
- "Fix bug"
- "Changes"
```

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear commits
4. **Test thoroughly** using the checklist above
5. **Update documentation** as needed
6. **Submit pull request** with description of changes

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Changes
- List of specific changes made
- Another change
- etc.

## Testing
- [ ] Tested on Chrome (version X)
- [ ] Tested on multiple websites
- [ ] No console errors
- [ ] Documentation updated

## Screenshots (if applicable)
Add screenshots showing the changes
```

## Debugging

### View Service Worker Console

1. Go to `chrome://extensions/`
2. Find "Audio Atlas Companion"
3. Click "Inspect views: service worker"
4. Check Console tab for errors

### Common Issues

**Extension not loading:**
- Check `manifest.json` syntax
- Verify all referenced files exist
- Look for errors in extension page

**Context menu not appearing:**
- Check service worker console for errors
- Verify `contexts: ["image"]` is correct
- Ensure extension is enabled

**Images not loading in Audio Atlas:**
- Check network tab for CORS errors
- Verify target URL is correct
- Test with different image sources

## Code Review Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] All functions have JSDoc comments
- [ ] No console.log statements (use console.error for errors only)
- [ ] Permissions are minimal (only what's needed)
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] Tested on multiple websites
- [ ] No breaking changes (or clearly documented)

## Feature Requests

Have an idea for a new feature?

1. **Check existing issues** to avoid duplicates
2. **Open an issue** describing the feature
3. **Discuss the approach** before implementing
4. **Submit PR** once approach is agreed upon

## Bug Reports

Found a bug?

1. **Check if it's already reported**
2. **Provide details**:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)
3. **Include screenshots** if helpful

## Questions?

- Check the [README.md](README.md) for documentation
- Review [QUICK_START.md](QUICK_START.md) for basics
- Open an issue for questions
- Check existing issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Audio Atlas Companion! 🎉
