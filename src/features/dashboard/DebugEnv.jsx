import { useState, useEffect } from 'react'

export default function DebugEnv() {
  const [envInfo, setEnvInfo] = useState({})

  useEffect(() => {
    // Check environment variables
    const info = {
      VITE_GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
      VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
      VITE_OPENAI_BASE_URL: import.meta.env.VITE_OPENAI_BASE_URL,
      VITE_OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL,
      hasGroqKey: !!import.meta.env.VITE_GROQ_API_KEY,
      hasOpenAIKey: !!import.meta.env.VITE_OPENAI_API_KEY,
      groqKeyValid: import.meta.env.VITE_GROQ_API_KEY && import.meta.env.VITE_GROQ_API_KEY.startsWith('gsk_'),
    }
    setEnvInfo(info)
    console.log('Environment Variables Debug:', info)
  }, [])

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800">Environment Variables Debug</h3>
      <pre className="mt-2 text-sm text-yellow-700 overflow-auto">
        {JSON.stringify(envInfo, null, 2)}
      </pre>
    </div>
  )
}