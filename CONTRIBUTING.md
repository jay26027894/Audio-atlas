# Contributing to Audio Atlas

Thank you for your interest in contributing to Audio Atlas! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and collaborative environment. We welcome contributions from developers of all skill levels and backgrounds.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear title**: Summarize the issue in one line
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: How to recreate the issue
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**:
   - Chrome version (Canary/Dev)
   - Operating system
   - Node.js version
7. **Screenshots**: If applicable
8. **Console errors**: Any error messages from the browser console

### Suggesting Enhancements

We welcome feature suggestions! Please open an issue with:

1. **Clear title**: Summarize the enhancement
2. **Use case**: Why is this feature needed?
3. **Proposed solution**: How should it work?
4. **Alternatives considered**: Other approaches you've thought about
5. **Additional context**: Any other relevant information

### Pull Requests

We actively welcome pull requests! Here's how to submit one:

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/audio-atlas.git
cd audio-atlas
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names:
- `feature/voice-commands` for new features
- `fix/speech-recognition-error` for bug fixes
- `docs/setup-guide-update` for documentation
- `refactor/ai-module-cleanup` for refactoring

#### 3. Make Your Changes

Follow the coding standards outlined below.

#### 4. Test Your Changes

```bash
# Run type checking
npm run check

# Run linting
npm run lint

# Format code
npm run format

# Test manually in browser
npm run dev
```

#### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add batch image processing"
git commit -m "fix: resolve speech recognition timeout"
git commit -m "docs: update setup guide with troubleshooting"
git commit -m "refactor: simplify AI prompt construction"
```

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

#### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- **Clear title**: Summarize the changes
- **Description**: Explain what and why
- **Related issues**: Link to any related issues
- **Testing**: How you tested the changes
- **Screenshots**: If UI changes are involved

## Coding Standards

### TypeScript

- **Use TypeScript**: All `.ts` files must use TypeScript
- **Strict mode**: Enable strict type checking
- **Type annotations**: Provide explicit types for function parameters and return values
- **No `any`**: Avoid using `any` type unless absolutely necessary
- **Interfaces**: Use interfaces for object shapes

Example:
```typescript
// Good
function processQuery(query: string, history: Message[]): Promise<string> {
  // ...
}

// Avoid
function processQuery(query, history) {
  // ...
}
```

### Svelte Components

- **TypeScript in scripts**: Use `<script lang="ts">`
- **Props typing**: Type all component props
- **Reactive statements**: Use `$:` for derived values
- **Comments**: Add JSDoc comments for complex logic

Example:
```svelte
<script lang="ts">
  /**
   * The message text to display
   */
  export let text: string;
  
  /**
   * The author of the message
   */
  export let author: 'user' | 'ai';
</script>
```

### Code Style

- **Indentation**: 2 spaces (enforced by Prettier)
- **Quotes**: Single quotes for strings
- **Semicolons**: Not required (Prettier handles this)
- **Line length**: 100 characters max
- **Naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for components and types
  - `UPPER_CASE` for constants

### Comments and Documentation

- **JSDoc comments**: For all exported functions and types
- **Inline comments**: For complex logic
- **Component documentation**: At the top of each `.svelte` file
- **Explain why, not what**: Comments should explain the reasoning, not just describe the code

Example:
```typescript
/**
 * Constructs an enhanced prompt with system instructions based on query type.
 * 
 * This function implements intelligent prompt engineering to serve different
 * user personas (Anjali for navigation, David for data extraction).
 * 
 * @param userPrompt - The original user query
 * @param conversationHistory - Previous messages for context
 * @returns The enhanced prompt with system instructions
 */
function constructEnhancedPrompt(
  userPrompt: string,
  conversationHistory: Message[]
): string {
  // Implementation
}
```

### Accessibility Requirements

All contributions must maintain or improve accessibility:

- **Keyboard navigation**: All interactive elements must be keyboard accessible
- **ARIA attributes**: Use appropriate ARIA roles, states, and properties
- **Screen reader testing**: Test with a screen reader (NVDA, JAWS, VoiceOver)
- **Focus indicators**: Ensure visible focus indicators
- **Semantic HTML**: Use proper HTML elements
- **Color contrast**: Maintain WCAG AA contrast ratios

### Testing

While we don't currently have automated tests, please:

1. **Manual testing**: Test your changes thoroughly in Chrome Canary/Dev
2. **Cross-browser**: Test in both Chrome Canary and Chrome Dev if possible
3. **Accessibility testing**: Use keyboard only, test with screen reader
4. **Edge cases**: Test error conditions and edge cases
5. **Performance**: Ensure changes don't degrade performance

## Project Structure

Understanding the project structure helps with contributions:

```
audio-atlas/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores/         # State management
│   │   └── utils/          # Utility functions
│   ├── routes/             # SvelteKit routes
│   ├── app.css             # Global styles
│   └── app.html            # HTML template
├── static/                 # Static assets
├── docs/                   # Documentation
└── [config files]          # Various config files
```

### Where to Add Features

- **New components**: `src/lib/components/`
- **State management**: `src/lib/stores/`
- **AI logic**: `src/lib/utils/ai.ts`
- **Speech logic**: `src/lib/utils/speech.ts`
- **Styling**: Component-level styles or `src/app.css`
- **Documentation**: Root level `.md` files

## Development Workflow

### Setting Up Development Environment

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open Chrome Canary/Dev with AI enabled
4. Make changes and test

### Before Submitting PR

```bash
# Format code
npm run format

# Check types
npm run check

# Lint code
npm run lint

# Test in browser
npm run dev
```

### Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- **Automated testing**: Unit tests, integration tests
- **Accessibility improvements**: Enhanced screen reader support
- **Error handling**: Better error messages and recovery
- **Performance optimization**: Faster image processing

### Medium Priority
- **UI enhancements**: Improved visual design
- **Additional features**: Multi-image support, export functionality
- **Documentation**: Tutorials, examples, guides
- **Browser compatibility**: Graceful degradation for unsupported browsers

### Low Priority
- **Internationalization**: Multi-language support
- **Themes**: Light mode, custom themes
- **Advanced features**: Batch processing, collaborative features

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read the `ARCHITECTURE.md` for technical details
3. Open a new issue with the "question" label
4. Reach out to maintainers

## Recognition

All contributors will be:
- Listed in the project's contributors
- Credited in release notes
- Acknowledged in the README (for significant contributions)

## License

By contributing to Audio Atlas, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Audio Atlas and helping make the web more accessible! 🎉

**Audio Atlas** - *Transforming Visual Data into Conversational Knowledge*
