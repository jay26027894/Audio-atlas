# Fallback AI Services

Audio Atlas now includes fallback AI services for when Chrome's Built-in AI is not available in your browser.

## How It Works

1. **Primary**: Chrome Built-in AI (requires Chrome Canary with AI features enabled)
2. **Fallback 1**: OpenAI API (if API key provided)
3. **Fallback 2**: Anthropic Claude API (if API key provided)  
4. **Fallback 3**: Mock responses (for testing and demonstration)

## Configuration

### Option 1: Mock Responses (Default)
No configuration needed. Mock responses are enabled by default in `.env`.

### Option 2: OpenAI API
1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   VITE_ENABLE_MOCK_RESPONSES=false
   ```
3. Restart the development server

### Option 3: Anthropic Claude API
1. Copy `.env.example` to `.env`
2. Add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   VITE_ENABLE_MOCK_RESPONSES=false
   ```
3. Restart the development server

## Error Messages

The application now provides helpful error messages and guidance when AI services are unavailable:

- **🔄 Fallback Mode Active**: Chrome AI unavailable, using alternative service
- **⚠️ No AI Services Available**: No fallback configured, provides setup instructions
- **🔌 API Connection Error**: External API temporarily unavailable

## For Developers

The fallback system is implemented in:
- `src/lib/utils/aiConfig.ts` - Configuration management
- `src/lib/utils/fallbackAI.ts` - External API implementations  
- `src/lib/utils/ai.ts` - Main AI orchestration with fallbacks
- `src/lib/components/UserInput.svelte` - Enhanced error handling

## Testing

To test different fallback scenarios:

1. **Test Chrome AI**: Use Chrome Canary with AI features enabled
2. **Test OpenAI**: Add OpenAI API key and disable Chrome AI
3. **Test Anthropic**: Add Anthropic API key and disable other services  
4. **Test Mock**: Set `VITE_ENABLE_MOCK_RESPONSES=true` and remove API keys