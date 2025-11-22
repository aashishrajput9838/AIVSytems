export async function askModel(question) {
  // Only use Groq API key
  const groqKey = import.meta.env.VITE_GROQ_API_KEY
  const groqModel = import.meta.env.VITE_GROQ_MODEL || 'llama3-70b-8192'

  // Debug logging
  console.log('API Configuration:', {
    hasGroqKey: !!groqKey,
    groqModel
  })

  // Validate API key
  if (!groqKey) {
    // Fallback mock for local/dev without API key
    return `I'm a mock assistant. You asked: "${question}".`
  }

  // Use Groq
  console.log('Using Groq API')
  return await askGroqModel(question, groqKey, groqModel)
}

// Function to handle Groq API requests
async function askGroqModel(question, apiKey, model) {
  try {
    console.log('Making request to Groq API with model:', model)
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };
    
    console.log('Groq API request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Groq API response status:', response.status)
    
    if (!response.ok) {
      let errorMessage = `Groq API error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = await response.json()
        console.error('Groq API error response:', errorData)
        errorMessage = `Groq API error: ${errorData.error?.message || response.statusText}`
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        console.error('Could not parse error response:', parseError)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Groq API response data:', data)
    const text = data.choices[0]?.message?.content?.trim()
    
    return text || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('Groq API Error:', error)
    
    // Handle specific errors
    if (error.message && error.message.includes('429')) {
      throw new Error('API quota exceeded. Please check your API plan and billing details.')
    }
    
    // Handle authentication errors
    if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
      throw new Error('Groq API authentication failed. Please verify your API key is correct and active.')
    }
    
    // Handle other errors
    throw new Error(`Model request failed: ${error.message || 'Unknown error'}`)
  }
}