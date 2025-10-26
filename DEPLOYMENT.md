# Deployment Instructions for Audio Atlas

## Environment Variables Setup

### For Vercel Deployment

Your Audio Atlas app requires environment variables to work properly in production. Here's how to set them up:

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your `audio-atlas` project

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add the following variables:

   ```
   Name: VITE_GOOGLE_API_KEY
   Value: AIzaSyCGjV1aBmN3H3OXVKIPR1Yjhb0vIiYgjhI
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_ENABLE_MOCK_RESPONSES
   Value: true
   Environment: Production, Preview, Development
   ```

3. **Redeploy**
   - After adding the environment variables, trigger a new deployment by:
     - Making a small commit and push to your repository, OR
     - Go to Deployments tab and click "Redeploy" on the latest deployment

### Alternative: Using Vercel CLI

If you have the Vercel CLI installed:

```bash
# Set environment variables via CLI
vercel env add VITE_GOOGLE_API_KEY
# Enter your API key when prompted

vercel env add VITE_ENABLE_MOCK_RESPONSES
# Enter: true

# Redeploy
vercel --prod
```

### Testing the Deployment

After setting up the environment variables:

1. Visit your deployed site
2. Open browser developer tools (F12)
3. Look for the debug output in the console - you should see:
   ```
   === Environment Variables Debug ===
   VITE_GOOGLE_API_KEY: AIzaSyCGjV... (truncated)
   VITE_ENABLE_MOCK_RESPONSES: true
   ```

### Fallback Behavior

The app will work in the following priority order:
1. **Chrome Built-in AI** (if available in Chrome Canary)
2. **Google Gemini API** (if API key is provided)
3. **Mock Responses** (as last resort for demo purposes)

## Security Notes

- Never commit API keys to your repository
- The `.env` file is properly ignored by git
- Environment variables in Vercel are encrypted and secure
- API keys are only exposed to the client-side application (which is normal for this type of app)

## Troubleshooting

If you still see "no fallback service is configured" errors:

1. Verify environment variables are set in Vercel dashboard
2. Make sure you've redeployed after adding the variables
3. Check the browser console for debug output
4. Ensure variable names are exactly: `VITE_GOOGLE_API_KEY` and `VITE_ENABLE_MOCK_RESPONSES`