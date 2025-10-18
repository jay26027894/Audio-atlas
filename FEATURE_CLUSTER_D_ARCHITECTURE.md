# Feature Cluster D: Architecture Diagram

## Complete API Chaining Workflows

---

## Translation Workflow (Feature 1)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRANSLATION API CHAIN                            │
└─────────────────────────────────────────────────────────────────────┘

User uploads diagram with German labels
         │
         ▼
┌─────────────────────────────────────┐
│  VQA Engine (Prompt API)            │
│  Extracts text labels               │
│  Output: ["Mitochondrium",          │
│           "Zellkern",               │
│           "Zytoplasma"]             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Language Detector API              │◄─── API CHAIN STEP 1
│  Analyzes text sample               │
│  Output: 'de' (German)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Conditional Logic                  │
│  if (language !== 'en')             │
│    → Show Translation Banner        │
└──────────────┬──────────────────────┘
               │
               ▼ (User clicks "Translate")
┌─────────────────────────────────────┐
│  Translator API                     │◄─── API CHAIN STEP 2
│  Translates each label              │
│  Input: ["Mitochondrium", ...]      │
│  Output: ["Mitochondrion",          │
│           "Cell nucleus",           │
│           "Cytoplasm"]              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Enhanced VQA Pipeline              │◄─── API CHAIN STEP 3
│  Uses translated labels             │
│  All responses in English           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Speech Synthesis                   │
│  Speaks English descriptions        │
│  Accessible to Anjali               │
└─────────────────────────────────────┘
```

---

## Simplification Workflow (Feature 2)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SIMPLIFICATION API CHAIN                           │
└─────────────────────────────────────────────────────────────────────┘

User asks: "What is the Krebs cycle?"
         │
         ▼
┌─────────────────────────────────────┐
│  Prompt API (VQA Engine)            │◄─── API CHAIN STEP 1
│  Generates technical response       │
│  Output: "The Krebs cycle, also     │
│  known as the citric acid cycle,    │
│  is a series of chemical reactions  │
│  used by aerobic organisms to       │
│  release stored energy through      │
│  the oxidation of acetyl-CoA..."    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Conversation Store                 │
│  Saves response as lastAIResponse   │
│  Shows "Explain It Simpler" button  │
└──────────────┬──────────────────────┘
               │
               ▼ (User says "explain it simpler")
┌─────────────────────────────────────┐
│  Pattern Matching                   │
│  Detects simplification request     │
│  Retrieves lastAIResponse           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Rewriter API                       │◄─── API CHAIN STEP 2
│  Rewrites with tone: 'more-casual'  │
│  Input: Technical explanation       │
│  Output: "The Krebs cycle is        │
│  basically how your cells turn      │
│  food into energy. Think of it      │
│  like a factory assembly line..."   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Conversation Store Update          │
│  Replaces technical with simple     │
│  Marks as simplified: true          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Speech Synthesis                   │◄─── API CHAIN STEP 3
│  Speaks simplified explanation      │
│  Accessible to Anjali               │
└─────────────────────────────────────┘
```

---

## File Structure & Responsibilities

```
audio-atlas/
│
├── src/lib/utils/
│   ├── translationHelper.ts          ◄─── Feature 1 Core Logic
│   │   ├── detectLabelLanguage()     │    Language Detector API
│   │   ├── translateLabels()         │    Translator API
│   │   └── processLabelsForAccessibility()
│   │
│   └── simplificationHelper.ts       ◄─── Feature 2 Core Logic
│       ├── isSimplificationRequest() │    Pattern matching
│       ├── simplifyText()            │    Rewriter API
│       └── handleSimplificationRequest()
│
├── src/lib/components/
│   ├── TranslationBanner.svelte      ◄─── Feature 1 UI
│   │   └── Shows when non-English detected
│   │
│   ├── SimplifyButton.svelte         ◄─── Feature 2 UI
│   │   └── Triggers simplification
│   │
│   └── UserInput.svelte              ◄─── Enhanced with both features
│       ├── Detects simplification requests
│       └── Includes SimplifyButton
│
└── src/lib/stores/
    └── conversationStore.ts          ◄─── Enhanced for Feature 2
        ├── simplified flag
        ├── originalText field
        └── getLastSimplifiableResponse()
```

---

## Data Flow: Translation

```
┌──────────────────┐
│  User Action     │
│  Upload diagram  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  VQA Extraction                                          │
│  extractedLabels = ["Mitochondrium", "Zellkern", ...]   │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  processLabelsForAccessibility(extractedLabels)          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. textSample = labels.slice(0, 5).join(' ')      │  │
│  │  2. language = detectLabelLanguage(textSample)     │  │
│  │     → Language Detector API                        │  │
│  │     → Returns: 'de'                                │  │
│  │                                                     │  │
│  │  3. if (language !== 'en')                         │  │
│  │     translatedLabels = translateLabels(labels, 'de')│ │
│  │     → Translator API                               │  │
│  │     → Returns: ["Mitochondrion", ...]             │  │
│  └────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Return {                                                │
│    labels: translatedLabels,                             │
│    wasTranslated: true,                                  │
│    sourceLanguage: 'de',                                 │
│    languageName: 'German'                                │
│  }                                                       │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  UI Update                                               │
│  - Show TranslationBanner                                │
│  - Use translated labels in VQA                          │
│  - Speak English descriptions                            │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow: Simplification

```
┌──────────────────┐
│  User Action     │
│  "Explain it     │
│   simpler"       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  processQuery(query)                                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. if (isSimplificationRequest(query))            │  │
│  │     → Pattern matching                             │  │
│  │     → Returns: true                                │  │
│  │                                                     │  │
│  │  2. lastResponse = getLastSimplifiableResponse()   │  │
│  │     → Retrieves from conversation store            │  │
│  │     → Returns: "Citrate is converted..."          │  │
│  └────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  handleSimplificationRequest(query, lastResponse)        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. Verify simplification request                  │  │
│  │  2. Check lastResponse exists                      │  │
│  │  3. simplifiedText = simplifyText(lastResponse)    │  │
│  │     → Rewriter API                                 │  │
│  │     → tone: 'more-casual'                          │  │
│  │     → Returns: "Citrate changes into..."          │  │
│  └────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Return {                                                │
│    success: true,                                        │
│    simplifiedText: "Citrate changes into..."             │
│  }                                                       │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Conversation Store Update                               │
│  - Add simplified response                               │
│  - Mark as simplified: true                              │
│  - Speak simplified text                                 │
└──────────────────────────────────────────────────────────┘
```

---

## API Integration Points

### Chrome Translation APIs

```typescript
// Language Detection
const detector = await translation.createDetector();
const results = await detector.detect(textSample);
const language = results[0].detectedLanguage; // 'de', 'fr', 'es', etc.

// Translation
const translator = await translation.createTranslator({
  sourceLanguage: 'de',
  targetLanguage: 'en'
});
const translated = await translator.translate("Mitochondrium");
// Returns: "Mitochondrion"
```

### Chrome Rewriter API

```typescript
// Simplification
const rewriter = await ai.rewriter.create();
const simplified = await rewriter.rewrite(technicalText, {
  tone: 'more-casual'
});
// Input: "Citrate is converted into isocitrate by the enzyme aconitase..."
// Output: "Citrate changes into isocitrate with help from an enzyme..."
```

---

## Error Handling & Fallbacks

```
┌─────────────────────────────────────────────────────────┐
│  Feature Detection                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Translation APIs                                       │
│  if (!('translation' in self)) {                        │
│    → Return original labels                             │
│    → Hide translation banner                            │
│  }                                                      │
│                                                         │
│  Rewriter API                                           │
│  if (!('ai' in self && 'rewriter' in ai)) {             │
│    → Return original text                               │
│    → Hide simplify button                               │
│  }                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Graceful Degradation                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Translation Fails                                      │
│  try {                                                  │
│    translatedLabels = await translateLabels(...)        │
│  } catch (error) {                                      │
│    → Use original labels                                │
│    → Log error                                          │
│    → Continue with workflow                             │
│  }                                                      │
│                                                         │
│  Simplification Fails                                   │
│  try {                                                  │
│    simplified = await simplifyText(...)                 │
│  } catch (error) {                                      │
│    → Use original technical text                        │
│    → Log error                                          │
│    → Continue with workflow                             │
│  }                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Experience Flows

### Translation UX

```
1. User uploads diagram
   └─► VQA extracts labels
       └─► Language detected: German
           └─► 🌐 Banner appears: "Non-English labels detected (German)"
               └─► User clicks "Translate to English"
                   └─► ⏳ "Translating..."
                       └─► ✅ Labels translated
                           └─► Banner disappears
                               └─► User asks questions in English
```

### Simplification UX

```
1. User asks question
   └─► AI responds (technical)
       └─► ✨ "Explain It Simpler" button appears
           └─► User clicks button OR says "explain it simpler"
               └─► ⏳ "Simplifying..."
                   └─► ✅ Simplified response replaces technical
                       └─► 🔊 Simplified version spoken aloud
                           └─► Button disappears (already simplified)
```

---

## Performance Considerations

### Translation

- **Parallel Processing**: All labels translated simultaneously using `Promise.all()`
- **Caching**: Detected language cached to avoid re-detection
- **Batch Size**: Processes up to 100 labels efficiently

### Simplification

- **On-Demand**: Only processes when user requests
- **Session Storage**: Stores last response in memory
- **Quick Response**: Rewriter API typically responds in 1-2 seconds

---

## Accessibility Features

### Screen Reader Support

```
Translation Banner:
- role="alert" for immediate announcement
- aria-live="polite" for non-intrusive updates
- Clear button labels

Simplify Button:
- aria-label="Simplify the last explanation..."
- Visual and audio feedback
- Keyboard accessible
```

### Voice Command Support

```
Supported Commands:
- "Explain it simpler"
- "Make that simpler"
- "Less technical please"
- "Plain English"
- "ELI5" (Explain Like I'm 5)
```

---

## Summary

Feature Cluster D demonstrates **sophisticated API orchestration** through two intelligent chains:

1. **Translation Chain**: VQA → Language Detector → Translator → Enhanced VQA
2. **Simplification Chain**: Prompt API → Rewriter → Speech Synthesis

This architecture showcases mastery of the Chrome AI API suite while solving real accessibility challenges for visually impaired STEM students.

**Key Achievement**: Goes beyond isolated API usage to demonstrate intelligent integration and conditional workflows.
