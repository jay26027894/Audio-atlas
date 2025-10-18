# Audio Atlas - Architecture Documentation

## Overview

Audio Atlas is built using a modern, reactive architecture that prioritizes accessibility, privacy, and performance. This document provides a deep dive into the architectural decisions and implementation details.

## Architecture Principles

### 1. Client-Side Only Processing
All AI processing happens on-device using Chrome's Gemini Nano model. No data is ever transmitted to external servers, ensuring:
- **Privacy**: Sensitive data never leaves the user's device
- **Performance**: No network latency for AI operations
- **Reliability**: Works offline after initial load
- **Cost**: Zero server infrastructure costs

### 2. Reactive State Management
Uses Svelte's store system for centralized, reactive state management:
- Single source of truth for application state
- Automatic UI updates when state changes
- Clean separation of concerns
- Easy to test and maintain

### 3. Accessibility-First Design
Every component is built with accessibility as a primary concern:
- WCAG 2.1 Level AA compliance
- Full keyboard navigation support
- Screen reader optimized with ARIA attributes
- Voice input and output integration
- High contrast visual design

## Component Architecture

### Component Hierarchy

```
+page.svelte (Root)
├── ImageUploader.svelte
├── ChatInterface.svelte
│   └── MessageBubble.svelte (multiple instances)
├── UserInput.svelte
└── StatusIndicator.svelte
```

### Component Responsibilities

#### ImageUploader
- **Purpose**: Handle image file selection and upload
- **Features**: Drag-and-drop, file input, validation
- **State**: Updates `imageStore` when image is loaded
- **Accessibility**: Keyboard operable, screen reader announcements

#### ChatInterface
- **Purpose**: Display conversation history
- **Features**: Auto-scroll, empty state, message rendering
- **State**: Subscribes to `conversationStore`
- **Accessibility**: ARIA live region for new messages

#### MessageBubble
- **Purpose**: Render individual chat messages
- **Features**: Visual distinction between user/AI messages
- **Props**: `author`, `text`
- **Accessibility**: Semantic HTML with proper roles

#### UserInput
- **Purpose**: Accept user queries via text or voice
- **Features**: Text input, voice button, form submission
- **State**: Updates `conversationStore`, triggers AI processing
- **Accessibility**: Dynamic ARIA labels, keyboard accessible

#### StatusIndicator
- **Purpose**: Provide real-time feedback on app state
- **Features**: Visual and screen reader announcements
- **State**: Subscribes to `appStateStore`
- **Accessibility**: ARIA live="assertive" for immediate announcements

## State Management

### Store Architecture

```typescript
// imageStore.ts
imageStore: Writable<ArrayBuffer | null>
- Holds uploaded image data
- Triggers UI transition when set

// conversationStore.ts
conversationStore: Writable<Message[]>
- Holds complete chat history
- Enables conversational context

// appStateStore.ts
appStateStore: Writable<AppState>
- Tracks current app state
- Synchronizes UI components
```

### State Flow

```
User Action
    ↓
Component Event Handler
    ↓
Store Update
    ↓
Reactive Subscriptions
    ↓
UI Updates
```

## AI Integration

### Chrome Built-in AI API Usage

```typescript
// 1. Check availability
const capabilities = await window.ai.languageModel.capabilities();

// 2. Create session
const session = await window.ai.languageModel.create({
  systemPrompt: "..."
});

// 3. Make multimodal request
const response = await session.prompt({
  text: enhancedPrompt,
  image: imageArrayBuffer
});

// 4. Clean up
session.destroy();
```

### Prompt Engineering Strategy

The application uses intelligent prompt engineering to serve different user needs:

#### Navigational Queries (Anjali Persona)
**Detection**: Keywords like "describe the path", "trace the cycle", "walk me through"

**System Instruction**:
```
System: You are an expert at interpreting diagrams, flowcharts, and maps. 
Your task is to trace the connections and describe the sequence of events 
or spatial relationships shown in the image in a clear, step-by-step manner. 
Follow the arrows and connections logically.
```

#### Data Extraction Queries (David Persona)
**Detection**: Keywords like "CAGR", "value", "highest", "Q3", "percentage"

**System Instruction**:
```
System: You are a data extraction expert. When asked for specific data points, 
values, labels, or trends from a chart or graph, respond with the precise 
information. If possible, provide structured data in your response.
```

#### Conversational Context
All queries include the full conversation history to enable follow-up questions:

```typescript
const enhancedPrompt = `
${systemInstruction}

Previous conversation:
User: [previous query]
Assistant: [previous response]

User: [current query]
`;
```

## Speech Integration

### Speech-to-Text (SpeechRecognition API)

```typescript
// Initialize
recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Start listening
recognition.start();

// Handle results
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  callback(transcript);
};
```

### Text-to-Speech (SpeechSynthesis API)

```typescript
// Create utterance
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';
utterance.rate = 1.0;
utterance.pitch = 1.0;
utterance.volume = 1.0;

// Speak
window.speechSynthesis.speak(utterance);

// Wait for completion
utterance.onend = () => resolve();
```

## User Flow

### Complete Interaction Flow

```
1. User lands on page
   ↓
2. ImageUploader is displayed
   ↓
3. User uploads image (drag-and-drop or file select)
   ↓
4. Image is read as ArrayBuffer
   ↓
5. imageStore is updated
   ↓
6. UI reactively switches to ChatInterface + UserInput
   ↓
7. User submits query (text or voice)
   ↓
8. appStateStore → 'processing'
   ↓
9. AI processes query with image and conversation history
   ↓
10. Response is added to conversationStore
    ↓
11. ChatInterface displays new message
    ↓
12. appStateStore → 'speaking'
    ↓
13. Response is spoken aloud via TTS
    ↓
14. appStateStore → 'idle'
    ↓
15. User can ask follow-up questions (repeat from step 7)
```

## Error Handling

### AI Availability Check
```typescript
if (!window.ai || !window.ai.languageModel) {
  throw new Error('Chrome Built-in AI is not available');
}
```

### Graceful Degradation
- Clear error messages displayed to user
- Errors added to conversation as AI messages
- Application state reset to 'idle'
- No crashes or undefined behavior

### Browser Compatibility
- Feature detection for all APIs
- Informative messages when features are unavailable
- Guidance for enabling required Chrome flags

## Performance Considerations

### Image Handling
- Images stored as ArrayBuffer for efficient memory usage
- No unnecessary copies or conversions
- Direct passing to AI API

### Conversation History
- Full history passed to AI for context
- Efficient array operations
- No pagination needed (reasonable conversation lengths)

### Auto-scrolling
- Uses native scrollTop for performance
- Triggered only on updates
- Smooth scrolling via CSS

## Security Considerations

### Data Privacy
- All processing happens on-device
- No external API calls for AI functionality
- No telemetry or analytics
- No cookies or local storage (except session state)

### Input Validation
- File type validation for images
- Text input sanitization
- Error handling for malformed data

### XSS Prevention
- Svelte's automatic escaping
- No innerHTML usage
- Safe text rendering

## Testing Strategy

### Unit Testing
- Test individual utility functions
- Mock browser APIs
- Test store logic

### Integration Testing
- Test component interactions
- Test state flow
- Test AI integration

### Accessibility Testing
- Screen reader testing
- Keyboard navigation testing
- ARIA attribute validation
- Color contrast verification

### Browser Testing
- Chrome Canary/Dev with AI enabled
- Fallback behavior in unsupported browsers

## Deployment

### Build Process
```bash
npm run build
```

### Output
- Static files in `/build` directory
- Can be deployed to any static hosting
- No server-side rendering required

### Hosting Options
- GitHub Pages
- Vercel
- Netlify
- Any static file server

## Future Architecture Enhancements

### Potential Improvements
1. **IndexedDB Integration**: Persist conversation history across sessions
2. **Service Worker**: Full offline support with caching
3. **Web Workers**: Offload heavy processing
4. **Streaming Responses**: Use streaming API for real-time feedback
5. **Multi-image Support**: Compare multiple images simultaneously
6. **Export Functionality**: Save conversations and data

### Scalability
- Current architecture scales to millions of users
- Zero server costs regardless of usage
- Each user's device handles their own processing

## Conclusion

Audio Atlas demonstrates how modern web technologies and on-device AI can create powerful, accessible, and privacy-respecting applications. The architecture is designed to be:

- **Maintainable**: Clear separation of concerns, well-documented code
- **Extensible**: Easy to add new features and capabilities
- **Performant**: Efficient state management and rendering
- **Accessible**: Built with accessibility as a core principle
- **Private**: All processing happens on-device

This architecture serves as a reference implementation for building accessible AI applications using Chrome's Built-in AI capabilities.
