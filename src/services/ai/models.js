export async function askModel(question) {
  // Only use Groq API key
  const groqKey = import.meta.env.VITE_GROQ_API_KEY
  const groqModel = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant'

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
    
    console.log('Groq API request body:', requestBody)
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Groq API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error response:', errorText)
      throw new Error(`Groq API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Groq API response data:', data)
    
    return data.choices[0].message.content
  } catch (error) {
    console.error('Groq API Error:', error)
    throw new Error(`Model request failed: ${error.message}`)
  }
}