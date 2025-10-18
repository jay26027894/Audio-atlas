# Changelog

All notable changes to Audio Atlas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-16

### Added
- Initial release of Audio Atlas
- Image upload via drag-and-drop and file selection
- Multimodal AI integration using Chrome's Gemini Nano
- Text-based query input
- Voice-based query input using Web Speech API
- Text-to-speech responses for accessibility
- Conversational context for follow-up questions
- Intelligent prompt engineering for two user personas:
  - Spatial/relational navigation for diagrams
  - Precision data extraction for charts
- Full keyboard navigation support
- Screen reader optimized with ARIA attributes
- High-contrast dark theme
- Real-time status indicators
- Comprehensive documentation:
  - README.md with project overview
  - ARCHITECTURE.md with technical details
  - SETUP_GUIDE.md with installation instructions
  - CONTRIBUTING.md with contribution guidelines
- MIT License

### Technical Details
- Built with SvelteKit and TypeScript
- Styled with Tailwind CSS
- On-device AI processing (no server required)
- Privacy-first architecture
- Offline-capable after initial load
- WCAG 2.1 Level AA accessibility compliance

### Components
- ImageUploader: Handles image file upload
- ChatInterface: Displays conversation history
- MessageBubble: Renders individual messages
- UserInput: Text and voice input interface
- StatusIndicator: Real-time app state feedback

### Utilities
- ai.ts: Chrome Built-in AI API wrapper
- speech.ts: Web Speech API wrapper

### State Management
- imageStore: Uploaded image data
- conversationStore: Chat history
- appStateStore: Application state

---

## Future Releases

### Planned for v1.1.0
- [ ] Multi-image comparison
- [ ] Export conversation history
- [ ] Improved error messages
- [ ] Performance optimizations
- [ ] Additional example queries

### Planned for v1.2.0
- [ ] Batch image processing
- [ ] Custom voice profiles
- [ ] IndexedDB for conversation persistence
- [ ] Service worker for full offline support

### Planned for v2.0.0
- [ ] Collaborative features
- [ ] Advanced data visualization
- [ ] Plugin system for extensibility
- [ ] Mobile app versions

---

**Audio Atlas** - *Transforming Visual Data into Conversational Knowledge*
