export async function askModel(question) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.groq.com/openai/v1'
  const model = import.meta.env.VITE_OPENAI_MODEL || 'llama-3.1-8b-instant'
  const organization = import.meta.env.VITE_OPENAI_ORG

  if (!apiKey) {
    // Fallback mock for local/dev without API key
    return `I'm a mock assistant. You asked: "${question}".`
  }

  // retry with exponential backoff on 429/5xx
  const maxRetries = 3
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(organization ? { 'OpenAI-Organization': organization } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Answer concisely.' },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
      }),
    })

    if (resp.ok) {
      const data = await resp.json()
      return data?.choices?.[0]?.message?.content?.trim() || ''
    }

    // Rate limit or transient error: retry
    if (resp.status === 429 || (resp.status >= 500 && resp.status < 600)) {
      if (attempt < maxRetries) {
        const retryAfter = Number(resp.headers.get('retry-after')) || (2 ** attempt) * 1000
        await new Promise(r => setTimeout(r, retryAfter))
        continue
      }
    }

    const text = await resp.text().catch(() => '')
    throw new Error(`Model request failed: ${resp.status} ${text}`)
  }
}
