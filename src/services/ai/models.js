import { GoogleGenerativeAI } from '@google/generative-ai'

export async function askModel(question) {
  // Only use Gemini API key
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash-002'

  // Debug logging
  console.log('API Configuration:', {
    hasGeminiKey: !!geminiKey,
    geminiModel
  })

  // Validate API key
  if (!geminiKey) {
    // Fallback mock for local/dev without API key
    return `I'm a mock assistant. You asked: "${question}".`
  }

  // Use Gemini
  console.log('Using Gemini API with key:', geminiKey.substring(0, 10) + '...')
  return await askGeminiModel(question, geminiKey, geminiModel)
}

// Function to handle Gemini API requests
async function askGeminiModel(question, apiKey, model) {
  // Check if API key has the correct format (Gemini keys start with "AIza")
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API Key format. Gemini API keys should start with "AIza".')
  }

  try {
    console.log('Making request to Gemini API with model:', model)
    
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

// Function to handle OpenAI API requests (placeholder for now)
async function askOpenAIModel(question, apiKey, model) {
  // For now, we'll just return a placeholder since we don't have OpenAI implementation yet
  return `I'm a mock assistant. You asked: "${question}". (OpenAI implementation not yet available)`
}