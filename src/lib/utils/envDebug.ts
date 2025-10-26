/**
 * Environment Variable Debug Utility
 * 
 * Helps debug environment variable issues in production
 */

export function debugEnvironmentVariables() {
  console.log('=== Environment Variables Debug ===');
  
  // Check for each expected environment variable
  const envVars = {
    'VITE_GOOGLE_API_KEY': import.meta.env.VITE_GOOGLE_API_KEY,
    'VITE_OPENAI_API_KEY': import.meta.env.VITE_OPENAI_API_KEY,
    'VITE_ANTHROPIC_API_KEY': import.meta.env.VITE_ANTHROPIC_API_KEY,
    'VITE_COHERE_API_KEY': import.meta.env.VITE_COHERE_API_KEY,
    'VITE_ENABLE_MOCK_RESPONSES': import.meta.env.VITE_ENABLE_MOCK_RESPONSES,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
    'MODE': import.meta.env.MODE
  };

  for (const [key, value] of Object.entries(envVars)) {
    console.log(`${key}:`, value ? `${String(value).substring(0, 10)}...` : 'undefined');
  }
  
  console.log('=== End Environment Debug ===');
  
  return envVars;
}

export function getEnvironmentInfo() {
  return {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    hasGoogleKey: !!import.meta.env.VITE_GOOGLE_API_KEY,
    hasOpenAIKey: !!import.meta.env.VITE_OPENAI_API_KEY,
    hasAnthropicKey: !!import.meta.env.VITE_ANTHROPIC_API_KEY,
    hasCohereKey: !!import.meta.env.VITE_COHERE_API_KEY,
    mockEnabled: import.meta.env.VITE_ENABLE_MOCK_RESPONSES === 'true'
  };
}