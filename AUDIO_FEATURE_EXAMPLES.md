# Feature Cluster A: Sensory Expansion - Example Queries

## Overview

This document provides example queries for testing the audio-to-spectrogram analysis feature. These queries are designed around the Elena persona (Bio-Acoustics Researcher) but can be adapted for various audio analysis use cases.

---

## Elena's Example Queries (Bio-Acoustics Research)

### Whale Song Analysis

**Query 1: Detection**
```
Is a humpback whale song present in this clip? If so, between which seconds does the primary motif appear?
```

**Query 2: Frequency Analysis**
```
Identify the dominant frequency range of the calls after the 15-second mark.
```

**Query 3: Noise Detection**
```
Are there any signs of boat engine noise in the lower frequency bands?
```

**Query 4: Pattern Recognition**
```
Describe the repeating patterns in the spectrogram. How many distinct vocalizations can you identify?
```

**Query 5: Temporal Analysis**
```
At what times do the loudest vocalizations occur? List them in seconds.
```

---

## General Audio Analysis Queries

### Music Analysis

**Query 1: Instrument Detection**
```
What instruments can you identify based on their frequency signatures?
```

**Query 2: Rhythm Analysis**
```
Describe the rhythmic patterns visible in the spectrogram.
```

**Query 3: Frequency Range**
```
What is the frequency range of the main melody?
```

### Speech Analysis

**Query 1: Speaker Detection**
```
How many different speakers can you identify based on frequency patterns?
```

**Query 2: Pitch Analysis**
```
What is the approximate pitch range of the speaker's voice?
```

**Query 3: Silence Detection**
```
Identify any silent periods longer than 2 seconds.
```

### Environmental Sound Analysis

**Query 1: Sound Source**
```
What type of environmental sounds are present in this recording?
```

**Query 2: Noise Analysis**
```
Is there any background noise? If so, what frequency range does it occupy?
```

**Query 3: Event Detection**
```
Identify any sudden loud events or transients in the audio.
```

---

## Technical Analysis Queries

### Frequency Domain

**Query 1: Fundamental Frequency**
```
What is the fundamental frequency of the primary sound source?
```

**Query 2: Harmonics**
```
Are there visible harmonics? If so, at what frequencies?
```

**Query 3: Frequency Modulation**
```
Is there any frequency modulation visible? Describe the pattern.
```

### Time Domain

**Query 1: Duration**
```
What is the total duration of the audio, and when do the main events occur?
```

**Query 2: Onset Detection**
```
Identify the onset times of all major sound events.
```

**Query 3: Temporal Patterns**
```
Describe any temporal patterns or rhythms visible in the spectrogram.
```

### Amplitude Analysis

**Query 1: Loudness**
```
Which sections of the audio are the loudest based on the spectrogram intensity?
```

**Query 2: Dynamic Range**
```
What is the approximate dynamic range of this audio?
```

**Query 3: Amplitude Envelope**
```
Describe the amplitude envelope over time.
```

---

## Follow-Up Conversation Examples

### Initial Query
```
What can you tell me about this audio recording?
```

### Follow-Up 1
```
Focus on the frequency range between 500 Hz and 2000 Hz. What patterns do you see?
```

### Follow-Up 2
```
Are there any sudden changes or discontinuities in that frequency range?
```

### Follow-Up 3
```
Compare the first 10 seconds to the last 10 seconds. What differences do you notice?
```

---

## Testing Checklist

Use these queries to verify the feature is working correctly:

- [ ] **Basic Detection**: Can identify presence/absence of sounds
- [ ] **Frequency Analysis**: Can identify frequency ranges accurately
- [ ] **Temporal Analysis**: Can identify timing of events
- [ ] **Pattern Recognition**: Can describe repeating patterns
- [ ] **Noise Detection**: Can identify background noise
- [ ] **Comparative Analysis**: Can compare different sections
- [ ] **Follow-Up Context**: Maintains context across multiple queries
- [ ] **Technical Terminology**: Understands audio/acoustic terms

---

## Tips for Best Results

1. **Be Specific**: Ask about specific time ranges or frequency bands
2. **Use Technical Terms**: The AI is trained to understand audio terminology
3. **Ask Follow-Ups**: Build on previous answers for deeper analysis
4. **Reference Axes**: Mention time (X-axis) or frequency (Y-axis) explicitly
5. **Visual Cues**: Ask about colors, patterns, or intensity variations

---

## Sample Audio Files for Testing

### Recommended Test Files

1. **Whale Songs**: Complex vocalizations with harmonics
2. **Bird Calls**: Short, distinct frequency patterns
3. **Music**: Multi-instrument recordings
4. **Speech**: Human voice recordings
5. **Environmental**: Nature sounds, urban noise
6. **Synthetic**: Pure tones, sweeps, chirps

### Where to Find Test Audio

- **Freesound.org**: Free sound effects and recordings
- **Xeno-canto.org**: Bird vocalizations
- **Watkins Marine Mammal Sound Database**: Whale and dolphin sounds
- **LibriVox**: Public domain speech recordings

---

## Expected AI Responses

The AI should be able to:

✅ Identify frequency ranges (e.g., "200-800 Hz")
✅ Identify timing (e.g., "between 5.2 and 7.8 seconds")
✅ Describe patterns (e.g., "horizontal bands indicate sustained tones")
✅ Detect intensity variations (e.g., "brighter areas show louder sounds")
✅ Recognize common audio features (e.g., "harmonic structure suggests a musical instrument")
✅ Provide contextual analysis based on conversation history

---

## Troubleshooting

### If the AI doesn't understand audio terminology:

- Try rephrasing using visual terms (e.g., "bright areas" instead of "loud sounds")
- Reference the spectrogram explicitly (e.g., "looking at the spectrogram...")
- Use comparative language (e.g., "higher on the image" instead of "higher frequency")

### If timing is inaccurate:

- The spectrogram labels show the time range
- Reference specific positions (e.g., "at the left edge" = start of audio)
- Ask for relative timing (e.g., "in the first half")

### If frequency analysis is vague:

- Ask for specific frequency values
- Reference the Y-axis labels on the spectrogram
- Use frequency bands (e.g., "bass frequencies below 250 Hz")

---

**Feature Cluster A: Sensory Expansion** - Transforming Audio into Visual Conversations
