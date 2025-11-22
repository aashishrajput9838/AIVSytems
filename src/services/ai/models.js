import { GoogleGenerativeAI } from '@google/generative-ai'

export async function askModel(question) {
  // Check for OpenRouter API key first, then Gemini, then OpenAI
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  const apiKey = openRouterKey || geminiKey || openaiKey
  const model = import.meta.env.VITE_OPENROUTER_MODEL || import.meta.env.VITE_OPENAI_MODEL || 'gemini-1.5-flash-002'

  // Debug logging
  console.log('API Configuration:', {
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT SET',
    model,
    hasOpenRouterKey: !!openRouterKey,
    hasGeminiKey: !!geminiKey,
    hasOpenAIKey: !!openaiKey
  })

  // Validate API key
  if (!apiKey) {
    // Fallback mock for local/dev without API key
    return `I'm a mock assistant. You asked: "${question}".`
  }

  // Check if we're using OpenRouter
  if (openRouterKey) {
    console.log('Using OpenRouter API with key:', openRouterKey.substring(0, 10) + '...')
    return await askOpenRouterModel(question, openRouterKey, model)
  }

  // Check if API key has the correct format (Gemini keys start with "AIza")
  // Only validate if we're actually using the Gemini key
  if (geminiKey && apiKey === geminiKey && !apiKey.startsWith('AIza')) {
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

// New function to handle OpenRouter API requests
async function askOpenRouterModel(question, apiKey, model) {
  try {
    console.log('Making request to OpenRouter API with model:', model)
    
    // Check if API key starts with "sk-or-v1-" as expected for OpenRouter
    if (!apiKey.startsWith('sk-or-v1-')) {
      throw new Error('Invalid OpenRouter API Key format. OpenRouter API keys should start with "sk-or-v1-".')
    }
    
    const requestBody = {
      model: model || 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };
    
    console.log('OpenRouter API request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin, // Optional, for including your app on openrouter.ai rankings
        'X-Title': 'AIV Systems' // Optional, for including your app on openrouter.ai rankings
      },
      body: JSON.stringify(requestBody)
    })

    console.log('OpenRouter API response status:', response.status)
    console.log('OpenRouter API response headers:', [...response.headers.entries()])
    
    if (!response.ok) {
      let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = await response.json()
        console.error('OpenRouter API error response:', errorData)
        errorMessage = `OpenRouter API error: ${errorData.error?.message || response.statusText}`
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        console.error('Could not parse error response:', parseError)
      }
      
      // If it's a 401 error, provide more specific guidance
      if (response.status === 401) {
        throw new Error(`OpenRouter API authentication failed. Please check your API key. Error: ${errorMessage}`)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('OpenRouter API response data:', data)
    const text = data.choices[0]?.message?.content?.trim()
    
    return text || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    
    // Handle specific errors
    if (error.message && error.message.includes('429')) {
      throw new Error('API quota exceeded. Please check your API plan and billing details.')
    }
    
    // Handle authentication errors
    if (error.message && error.message.includes('401')) {
      throw new Error('OpenRouter API authentication failed. Please verify your API key is correct and active.')
    }
    
    // Handle other errors
    throw new Error(`Model request failed: ${error.message || 'Unknown error'}`)
  }
}