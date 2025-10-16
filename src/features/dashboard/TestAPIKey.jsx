import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

export default function TestAPIKey() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testAPIKey = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      const baseUrl = 'https://api.groq.com/openai/v1'
      
      console.log('Testing with API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET')
      
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      setTestResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (error) {
      setTestResult({
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">API Key Test</h3>
        <Button onClick={testAPIKey} disabled={loading}>
          {loading ? 'Testing...' : 'Test API Key'}
        </Button>
        
        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}