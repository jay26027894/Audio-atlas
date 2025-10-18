# Audio Atlas - Testing Guide

This guide provides comprehensive testing procedures for Audio Atlas to ensure all features work correctly and meet accessibility standards.

## Prerequisites for Testing

- Chrome Canary or Chrome Dev with AI features enabled
- Microphone access (for voice input testing)
- Screen reader software (for accessibility testing):
  - **Windows**: NVDA (free) or JAWS
  - **macOS**: VoiceOver (built-in)
  - **Linux**: Orca
- Sample images for testing (charts, diagrams, maps)

## Manual Testing Checklist

### 1. Image Upload Testing

#### File Input Method
- [ ] Click "Choose File" button
- [ ] Select a valid image file (PNG, JPG, GIF)
- [ ] Verify image loads successfully
- [ ] Check status announcement for screen readers
- [ ] Verify UI transitions to chat interface

#### Drag-and-Drop Method
- [ ] Drag an image file over the drop zone
- [ ] Verify visual feedback (border color change)
- [ ] Drop the file
- [ ] Verify image loads successfully
- [ ] Check status announcement

#### Error Handling
- [ ] Try uploading a non-image file
- [ ] Verify appropriate error message
- [ ] Try uploading a very large image (>10MB)
- [ ] Verify handling of corrupted image files

### 2. Text Input Testing

#### Basic Text Input
- [ ] Type a question in the input field
- [ ] Press Enter to submit
- [ ] Verify query appears in chat
- [ ] Verify AI response is generated
- [ ] Verify response is displayed
- [ ] Verify response is spoken aloud

#### Alternative Submission
- [ ] Type a question
- [ ] Click the submit button (➤)
- [ ] Verify same behavior as Enter key

#### Input Validation
- [ ] Try submitting empty input
- [ ] Verify submit button is disabled
- [ ] Type whitespace only
- [ ] Verify submit button remains disabled

#### State Management
- [ ] Submit a query
- [ ] Verify input is disabled during processing
- [ ] Verify input is re-enabled after response
- [ ] Verify input is cleared after submission

### 3. Voice Input Testing

#### Basic Voice Input
- [ ] Click microphone button (🎤)
- [ ] Grant microphone permissions if prompted
- [ ] Verify button changes to stop icon (⏹️)
- [ ] Speak a clear question
- [ ] Verify transcription appears
- [ ] Verify query is processed
- [ ] Verify response is generated

#### Voice Input States
- [ ] Verify "listening" status indicator appears
- [ ] Verify status is announced to screen readers
- [ ] Click stop button while listening
- [ ] Verify listening stops
- [ ] Verify status returns to idle

#### Error Handling
- [ ] Deny microphone permissions
- [ ] Verify appropriate error message
- [ ] Test in browser without speech recognition support
- [ ] Verify graceful degradation

### 4. AI Response Testing

#### Summary Queries
Test with a complex diagram:
- [ ] "Give me a high-level summary of this diagram"
- [ ] "What is this image showing?"
- [ ] "Describe this chart"
- [ ] Verify responses are comprehensive
- [ ] Verify responses are accurate

#### Navigational Queries (Anjali Persona)
Test with a flowchart or process diagram:
- [ ] "Describe the path from start to finish"
- [ ] "What are the inputs to this process?"
- [ ] "Walk me through each step"
- [ ] "Trace the main loop"
- [ ] Verify responses follow spatial relationships
- [ ] Verify step-by-step descriptions

#### Data Extraction Queries (David Persona)
Test with a chart or graph:
- [ ] "What's the highest value shown?"
- [ ] "Give me the data for Q3"
- [ ] "What was the CAGR?"
- [ ] "What are the exact percentages?"
- [ ] Verify responses contain precise data
- [ ] Verify numerical accuracy

#### Follow-up Questions
- [ ] Ask an initial question
- [ ] Ask a follow-up referencing the previous response
- [ ] Example: "What about that step?" or "Tell me more about that"
- [ ] Verify AI understands the context
- [ ] Verify coherent conversation flow

#### Error Handling
- [ ] Test with AI features disabled
- [ ] Verify clear error message
- [ ] Verify app doesn't crash
- [ ] Verify state returns to idle

### 5. Text-to-Speech Testing

#### Basic TTS
- [ ] Submit a query
- [ ] Verify response is spoken aloud
- [ ] Verify speech is clear and understandable
- [ ] Verify speech rate is appropriate
- [ ] Verify speech completes before returning to idle

#### TTS Controls
- [ ] Submit multiple queries in succession
- [ ] Verify previous speech is cancelled
- [ ] Verify only latest response is spoken

#### TTS Availability
- [ ] Test in browser without speech synthesis
- [ ] Verify graceful degradation
- [ ] Verify text response still displays

### 6. Conversation History Testing

#### Message Display
- [ ] Submit multiple queries
- [ ] Verify all messages appear in order
- [ ] Verify user messages are right-aligned and blue
- [ ] Verify AI messages are left-aligned and gray
- [ ] Verify message bubbles are readable

#### Auto-scrolling
- [ ] Submit enough queries to fill the chat area
- [ ] Verify auto-scroll to latest message
- [ ] Verify smooth scrolling behavior

#### Empty State
- [ ] Load app with new image
- [ ] Verify empty state message appears
- [ ] Verify example queries are shown
- [ ] Verify empty state is helpful

### 7. Keyboard Navigation Testing

#### Tab Order
- [ ] Use Tab key to navigate through all interactive elements
- [ ] Verify logical tab order:
  1. Image upload area (if visible)
  2. Text input field
  3. Microphone button
  4. Submit button
- [ ] Verify focus indicators are visible
- [ ] Verify focus indicators are high contrast

#### Keyboard Shortcuts
- [ ] Focus text input and press Enter
- [ ] Verify query is submitted
- [ ] Focus image upload area and press Enter/Space
- [ ] Verify file picker opens

#### Focus Management
- [ ] Submit a query
- [ ] Verify focus remains on input field
- [ ] Verify user can immediately type next query

### 8. Screen Reader Testing

#### NVDA/JAWS (Windows)
- [ ] Enable screen reader
- [ ] Navigate to Audio Atlas
- [ ] Verify page title is announced
- [ ] Verify heading structure is logical
- [ ] Tab through all elements
- [ ] Verify all elements have appropriate labels
- [ ] Upload an image
- [ ] Verify upload success is announced
- [ ] Submit a query
- [ ] Verify processing status is announced
- [ ] Verify AI response is announced
- [ ] Verify speaking status is announced

#### VoiceOver (macOS)
- [ ] Enable VoiceOver (Cmd+F5)
- [ ] Perform same tests as NVDA/JAWS
- [ ] Verify rotor navigation works
- [ ] Verify form controls are properly labeled

#### ARIA Attributes
- [ ] Inspect elements in DevTools
- [ ] Verify aria-label on buttons
- [ ] Verify aria-live regions exist
- [ ] Verify aria-live="polite" on chat container
- [ ] Verify aria-live="assertive" on status indicator
- [ ] Verify role attributes are appropriate

### 9. Visual Design Testing

#### Color Contrast
- [ ] Use browser DevTools or online tool
- [ ] Verify all text meets WCAG AA standards (4.5:1)
- [ ] Verify focus indicators are visible (3:1)
- [ ] Test in high contrast mode

#### Responsive Design
- [ ] Test at different viewport sizes
- [ ] Verify layout adapts appropriately
- [ ] Verify text remains readable
- [ ] Verify buttons remain accessible

#### Dark Theme
- [ ] Verify dark theme is applied
- [ ] Verify all text is readable
- [ ] Verify no white backgrounds
- [ ] Verify consistent color scheme

### 10. Performance Testing

#### Load Time
- [ ] Measure initial page load time
- [ ] Verify page loads in < 2 seconds
- [ ] Check for any blocking resources

#### AI Response Time
- [ ] Submit a query
- [ ] Measure time to first response
- [ ] Verify response time is reasonable (< 10 seconds)
- [ ] Test with different image sizes

#### Memory Usage
- [ ] Open DevTools Performance tab
- [ ] Submit multiple queries
- [ ] Check for memory leaks
- [ ] Verify memory usage is stable

### 11. Error Scenario Testing

#### Network Errors
- [ ] Disable network connection
- [ ] Verify app still works (offline capability)
- [ ] Verify no network requests for AI processing

#### Browser Compatibility
- [ ] Test in Chrome Canary
- [ ] Test in Chrome Dev
- [ ] Test in unsupported browser (e.g., Firefox)
- [ ] Verify appropriate error messages

#### Edge Cases
- [ ] Upload extremely large image
- [ ] Submit extremely long query
- [ ] Submit query with special characters
- [ ] Submit query in different language
- [ ] Rapid-fire multiple queries

## Automated Testing (Future)

### Unit Tests
```bash
# To be implemented
npm run test:unit
```

### Integration Tests
```bash
# To be implemented
npm run test:integration
```

### E2E Tests
```bash
# To be implemented
npm run test:e2e
```

## Accessibility Audit Tools

### Lighthouse
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Run audit
5. Verify score is 90+

### axe DevTools
1. Install axe DevTools extension
2. Open extension
3. Run scan
4. Verify no critical issues

### WAVE
1. Install WAVE extension
2. Open extension
3. Run evaluation
4. Verify no errors

## Test Data

### Sample Images for Testing

#### Flowcharts/Diagrams
- Process flow diagrams
- System architecture diagrams
- Biological pathways (e.g., Krebs cycle)
- Network diagrams

#### Charts/Graphs
- Bar charts with clear labels
- Line graphs with multiple series
- Pie charts with percentages
- Scatter plots with data points

#### Maps
- Geographic maps with routes
- Mind maps
- Organizational charts

### Sample Queries

#### General
- "What is this image showing?"
- "Give me a summary"
- "Describe this in detail"

#### Navigational
- "Walk me through the process"
- "What are the steps from A to B?"
- "Describe the main flow"

#### Data Extraction
- "What's the highest value?"
- "Give me the numbers for each category"
- "What's the trend over time?"

## Bug Reporting

When you find a bug during testing:

1. **Document the issue**:
   - What you were doing
   - What you expected
   - What actually happened
   - Steps to reproduce

2. **Gather information**:
   - Chrome version
   - Operating system
   - Console errors
   - Screenshots

3. **Report the bug**:
   - Open an issue on GitHub
   - Use the bug report template
   - Include all gathered information

## Testing Sign-off

Before considering testing complete:

- [ ] All manual tests passed
- [ ] Accessibility audit score 90+
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] Documentation is accurate
- [ ] All features work as expected

## Continuous Testing

During development:
- Test after every significant change
- Run linting and type checking regularly
- Test in both Chrome Canary and Chrome Dev
- Test with real users when possible

---

**Audio Atlas** - *Transforming Visual Data into Conversational Knowledge*
