/**
 * AI Service Configuration
 * 
 * Manages configuration for fallback AI services when Chrome Built-in AI
 * is not available. Provides unified configuration for OpenAI, Anthropic,
 * and mock response services.
 */

export interface AIServiceConfig {
  openai: {
    apiKey: string | null;
    baseUrl: string;
    model: string;
    maxTokens: number;
  };
  anthropic: {
    apiKey: string | null;
    baseUrl: string;
    model: string;
    maxTokens: number;
  };
  google: {
    apiKey: string | null;
    baseUrl: string;
    model: string;
    maxTokens: number;
  };
  cohere: {
    apiKey: string | null;
    baseUrl: string;
    model: string;
    maxTokens: number;
  };
  mock: {
    enabled: boolean;
  };
}

/**
 * Default configuration for AI services
 */
export const defaultConfig: AIServiceConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini', // Good balance of capability and cost
    maxTokens: 1000,
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || null,
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-haiku-20240307', // Fast and cost-effective
    maxTokens: 1000,
  },
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || null,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.5-flash', // Latest model with excellent vision capabilities
    maxTokens: 1000,
  },
  cohere: {
    apiKey: import.meta.env.VITE_COHERE_API_KEY || null,
    baseUrl: 'https://api.cohere.ai/v2',
    model: 'command-r-plus-08-2024', // Current available model
    maxTokens: 1000,
  },
  mock: {
    enabled: import.meta.env.VITE_ENABLE_MOCK_RESPONSES === 'true',
  },
};

/**
 * Determines which AI service is available for fallback
 */
export function getAvailableFallbackService(): 'google' | 'openai' | 'anthropic' | 'cohere' | 'mock' | null {
  console.log('Checking available fallback services...');
  console.log('Environment variables:', {
    google: !!defaultConfig.google.apiKey,
    openai: !!defaultConfig.openai.apiKey,
    anthropic: !!defaultConfig.anthropic.apiKey,
    cohere: !!defaultConfig.cohere.apiKey,
    mock: defaultConfig.mock.enabled,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV
  });
  
  if (defaultConfig.google.apiKey) {
    console.log('Using Google Gemini as fallback service');
    return 'google';
  }
  if (defaultConfig.openai.apiKey) {
    console.log('Using OpenAI as fallback service');
    return 'openai';
  }
  if (defaultConfig.anthropic.apiKey) {
    console.log('Using Anthropic as fallback service');
    return 'anthropic';
  }
  if (defaultConfig.cohere.apiKey) {
    console.log('Using Cohere as fallback service');
    return 'cohere';
  }
  
  // In production, if no API keys are available, enable mock responses automatically
  if (import.meta.env.PROD && !defaultConfig.mock.enabled) {
    console.log('Production mode detected with no API keys - enabling mock responses as fallback');
    // Override the mock setting for production
    defaultConfig.mock.enabled = true;
    return 'mock';
  }
  
  if (defaultConfig.mock.enabled) {
    console.log('Using mock responses as fallback service');
    return 'mock';
  }
  
  console.warn('No fallback services available');
  return null;
}

/**
 * Mock responses for different types of queries
 */
export const mockResponses = {
  navigation: "I can see this appears to be a flowchart or diagram with various connected elements. However, since Chrome's Built-in AI is not available in your browser, I'm providing a sample response. To get detailed spatial navigation analysis, please use Chrome Canary with AI features enabled, or provide an API key for external AI services.",
  
  dataExtraction: "I can see this appears to be a chart or graph with data points. However, since Chrome's Built-in AI is not available in your browser, I'm providing a sample response. To get precise data extraction, please use Chrome Canary with AI features enabled, or provide an API key for external AI services.",
  
  summary: "I can see an image has been uploaded, but since Chrome's Built-in AI is not available in your browser, I'm providing a sample response. This appears to be a visual document that would benefit from AI analysis. To get a detailed summary, please use Chrome Canary with AI features enabled, or provide an API key for external AI services.",
  
  generic: "I can see an image has been uploaded. However, since Chrome's Built-in AI is not available in your browser, I'm unable to provide detailed analysis. To unlock the full capabilities of Audio Atlas, please use Chrome Canary with AI features enabled, or configure an external AI service by adding API keys to your .env file."
};