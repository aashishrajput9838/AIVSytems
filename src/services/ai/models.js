import { GoogleGenerativeAI } from '@google/generative-ai'

export async function askModel(question) {
  // Use Gemini API key if available, otherwise fall back to OpenAI API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gemini-1.5-flash-002'

  // Debug logging
  console.log('API Configuration:', {
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT SET',
    model,
    hasGeminiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
    hasOpenAIKey: !!import.meta.env.VITE_OPENAI_API_KEY
  })

  // Validate API key
  if (!apiKey) {
    // Fallback mock for local/dev without API key
    return `I'm a mock assistant. You asked: "${question}".`
  }

  // Check if API key has the correct format (Gemini keys start with "AIza")
  // Only validate if we're actually using the Gemini key
  if (import.meta.env.VITE_GEMINI_API_KEY && apiKey === import.meta.env.VITE_GEMINI_API_KEY && !apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API Key format. Gemini API keys should start with "AIza".')
  }

  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model: model })

    // Generate content using the SDK
    const result = await geminiModel.generateContent(question)
    const response = await result.response
    const text = response.text()
    
    return text || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('Gemini API Error:', error)
    
    // Handle specific errors
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API Key: Please check your Gemini API key.')
    }
    
    if (error.message && error.message.includes('429')) {
      throw new Error('API quota exceeded. Please check your API plan and billing details.')
    }
    
    // Handle other errors
    throw new Error(`Model request failed: ${error.message || 'Unknown error'}`)
  }
}