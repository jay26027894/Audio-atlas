/**
 * Text Cleaning Utility
 * 
 * Removes markdown formatting from AI responses to ensure clean, plain text output
 */

/**
 * Removes markdown formatting from text
 */
export function cleanMarkdownFormatting(text: string): string {
  if (!text) return text;
  
  // Remove markdown formatting
  return text
    // Remove bold formatting (**text** or __text__)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    
    // Remove italic formatting (*text* or _text_)
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_(?!_)([^_]+)_(?!_)/g, '$1')
    
    // Remove strikethrough (~~text~~)
    .replace(/~~(.*?)~~/g, '$1')
    
    // Remove code formatting (`text`)
    .replace(/`([^`]+)`/g, '$1')
    
    // Remove remaining asterisks that might be used for bullet points or emphasis
    .replace(/^\s*\*+\s*/gm, '• ')
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    
    // Trim whitespace
    .trim();
}

/**
 * Cleans up structured text by removing markdown while preserving structure
 */
export function cleanStructuredText(text: string): string {
  if (!text) return text;
  
  return text
    // Clean markdown formatting first
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_(?!_)([^_]+)_(?!_)/g, '$1')
    
    // Convert markdown bullet points to clean bullet points
    .replace(/^\s*[-*+]\s+/gm, '• ')
    
    // Clean up asterisks used for bullet points
    .replace(/^\s*\*+\s+/gm, '• ')
    
    // Preserve line breaks and structure
    .replace(/\n\s*\n/g, '\n\n')
    
    .trim();
}