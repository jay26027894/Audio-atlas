/**
 * Fallback AI Services
 * 
 * Provides alternative AI implementations when Chrome's Built-in AI is not available.
 * Supports OpenAI, Anthropic, and mock responses as fallback options.
 */

import { defaultConfig, getAvailableFallbackService, mockResponses } from './aiConfig';
import type { Message } from '$lib/stores/conversationStore';

/**
 * Converts ArrayBuffer image to base64 string for API transmission
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Detects query type for appropriate mock responses
 */
function detectQueryType(prompt: string): keyof typeof mockResponses {
  const lowerPrompt = prompt.toLowerCase();
  
  // Navigation queries
  const navigationKeywords = ['describe the path', 'inputs', 'outputs', 'trace', 'flow', 'connections', 'arrows'];
  if (navigationKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'navigation';
  }
  
  // Data extraction queries  
  const dataKeywords = ['value', 'highest', 'lowest', 'percentage', 'data point', 'exact', 'cagr'];
  if (dataKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'dataExtraction';
  }
  
  // Summary queries
  const summaryKeywords = ['summarize', 'summary', 'overview', 'describe this', 'explain this'];
  if (summaryKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'summary';
  }
  
  return 'generic';
}

/**
 * Fallback using OpenAI API
 */
async function getOpenAIResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[]
): Promise<string> {
  const config = defaultConfig.openai;
  
  if (!config.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Convert image to base64
  const base64Image = arrayBufferToBase64(image);
  
  // Build conversation history
  const messages: any[] = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant specialized in analyzing visual data such as charts, diagrams, maps, and graphs. Provide clear, accurate, and accessible descriptions.'
    }
  ];
  
  // Add conversation history
  conversationHistory.forEach(msg => {
    messages.push({
      role: msg.author === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  });
  
  // Add current query with image
  messages.push({
    role: 'user',
    content: [
      { type: 'text', text: prompt },
      { 
        type: 'image_url', 
        image_url: { 
          url: `data:image/png;base64,${base64Image}`
        }
      }
    ]
  });
  
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response from OpenAI';
}

/**
 * Fallback using Anthropic API
 */
async function getAnthropicResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[]
): Promise<string> {
  const config = defaultConfig.anthropic;
  
  if (!config.apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  // Convert image to base64
  const base64Image = arrayBufferToBase64(image);
  
  // Build conversation context
  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation:\\n';
    conversationHistory.forEach(msg => {
      const role = msg.author === 'user' ? 'User' : 'Assistant';
      conversationContext += `${role}: ${msg.text}\\n`;
    });
    conversationContext += '\\n';
  }
  
  const fullPrompt = conversationContext + prompt;
  
  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: fullPrompt,
            },
          ],
        },
      ],
      system: 'You are a helpful AI assistant specialized in analyzing visual data such as charts, diagrams, maps, and graphs. Provide clear, accurate, and accessible descriptions.',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.content[0]?.text || 'No response from Anthropic';
}

/**
 * Fallback using Cohere API
 */
async function getCohereResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[]
): Promise<string> {
  const config = defaultConfig.cohere;
  
  if (!config.apiKey) {
    throw new Error('Cohere API key not configured');
  }
  
  // Build conversation history in Cohere v2 format
  const messages = [];
  
  // Add system message
  messages.push({
    role: 'system',
    content: 'You are a helpful AI assistant specialized in analyzing visual data such as charts, diagrams, maps, and graphs. Since you cannot see the image directly, provide helpful analysis based on the context of the user\'s questions about visual content.'
  });
  
  // Add conversation history
  conversationHistory.forEach(msg => {
    messages.push({
      role: msg.author === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  });
  
  // Add current prompt with context about the image
  const imagePrompt = `I have uploaded an image for analysis. ${prompt}. Please provide helpful insights about what might be shown in the image based on the context of my question.`;
  messages.push({
    role: 'user',
    content: imagePrompt
  });
  
  const response = await fetch(`${config.baseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cohere API error details:', errorText);
    throw new Error(`Cohere API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  // Cohere v2 API returns content in message.content array
  return data.message?.content?.[0]?.text || 'No response from Cohere';
}

/**
 * Fallback using Google Gemini API
 */
async function getGoogleGeminiResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[]
): Promise<string> {
  const config = defaultConfig.google;
  
  if (!config.apiKey) {
    throw new Error('Google API key not configured');
  }
  
  // Convert image to base64
  const base64Image = arrayBufferToBase64(image);
  
  // Build conversation context
  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation context:\n';
    conversationHistory.forEach(msg => {
      const role = msg.author === 'user' ? 'User' : 'Assistant';
      conversationContext += `${role}: ${msg.text}\n`;
    });
    conversationContext += '\n';
  }
  
  const fullPrompt = conversationContext + prompt;
  
  const response = await fetch(`${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: fullPrompt
          },
          {
            inline_data: {
              mime_type: 'image/png',
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: config.maxTokens,
        temperature: 0.7,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Gemini API error details:', errorText);
    throw new Error(`Google Gemini API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Google Gemini';
}

/**
 * Mock response fallback
 */
async function getMockResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[]
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const queryType = detectQueryType(prompt);
  return mockResponses[queryType];
}

/**
 * Main fallback AI response function
 * Attempts available fallback services in order of preference
 */
export async function getFallbackAIResponse(
  image: ArrayBuffer,
  prompt: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const availableService = getAvailableFallbackService();
  
  if (!availableService) {
    throw new Error('No fallback AI service available. Please configure an API key or enable mock responses.');
  }
  
  try {
    switch (availableService) {
      case 'google':
        console.log('Using Google Gemini as fallback AI service');
        return await getGoogleGeminiResponse(image, prompt, conversationHistory);
        
      case 'openai':
        console.log('Using OpenAI as fallback AI service');
        return await getOpenAIResponse(image, prompt, conversationHistory);
        
      case 'anthropic':
        console.log('Using Anthropic as fallback AI service');
        return await getAnthropicResponse(image, prompt, conversationHistory);
        
      case 'cohere':
        console.log('Using Cohere as fallback AI service');
        return await getCohereResponse(image, prompt, conversationHistory);
        
      case 'mock':
        console.log('Using mock responses as fallback');
        return await getMockResponse(image, prompt, conversationHistory);
        
      default:
        throw new Error('Unknown fallback service');
    }
  } catch (error) {
    console.error(`Error with ${availableService} fallback:`, error);
    
    // If the primary fallback fails, try mock responses as last resort
    if (availableService !== 'mock' && defaultConfig.mock.enabled) {
      console.log('Primary fallback failed, using mock responses');
      return await getMockResponse(image, prompt, conversationHistory);
    }
    
    throw error;
  }
}