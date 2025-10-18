/**
 * Text Sanitizer Utilities
 *
 * Removes lightweight Markdown from AI responses so that:
 * - Screen readers and TTS don’t read out asterisks/backticks
 * - Bulleted lists render/sound clean
 */

/** Strip basic markdown emphasis/links/code while preserving text. */
export function stripMarkdownBasic(input: string): string {
  let s = input;

  // Links: [text](url) -> text
  s = s.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // Inline code: `code` -> code
  s = s.replace(/`([^`]+)`/g, '$1');

  // Bold/italic: **text** -> text, *text* -> text, __text__ -> text, _text_ -> text
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/__([^_]+)__/g, '$1');
  s = s.replace(/_([^_]+)_/g, '$1');

  // Fenced code blocks: ```...``` -> plain content
  s = s.replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ''));

  return s;
}

/** Convert markdown-ish lists and headings into clean, readable text for UI. */
export function sanitizeForDisplay(input: string): string {
  const stripped = stripMarkdownBasic(input);
  const lines = stripped.split(/\r?\n/);
  const out: string[] = [];

  for (let line of lines) {
    const original = line;
    const trimmed = line.trim();

    // Headings: leading # -> remove hashes
    line = trimmed.replace(/^#{1,6}\s*/g, '');

    // Bullets: * item or - item -> • item
    line = line.replace(/^\s*[*-]\s+/g, '• ');

    // Ordered list: 1. item -> 1) item
    line = line.replace(/^\s*(\d+)\.\s+/g, '$1) ');

    // Collapse excessive asterisks left over (safety)
    line = line.replace(/\*{1,}/g, '');

    // Keep empty lines
    if (line.length === 0 && original.length > 0) {
      out.push('');
    } else {
      out.push(line);
    }
  }

  return out.join('\n');
}

/** Further tweak text for speech output: remove bullets and add pauses. */
export function sanitizeForSpeech(input: string): string {
  const display = sanitizeForDisplay(input);
  const lines = display.split(/\r?\n/);
  const spoken: string[] = [];

  for (let line of lines) {
    const l = line.replace(/^•\s*/, ' - '); // bullet -> dash phrase
    spoken.push(l);
  }

  // Reduce multiple blank lines
  return spoken.join('\n').replace(/\n{3,}/g, '\n\n');
}
