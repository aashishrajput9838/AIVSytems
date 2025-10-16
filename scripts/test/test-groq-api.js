// Simple test script to verify Groq API key
async function testGroqAPI() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const baseUrl = 'https://api.groq.com/openai/v1';
  
  console.log('Testing Groq API with key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT SET');
  
  if (!apiKey) {
    console.error('No API key found');
    return;
  }
  
  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Test Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Test Successful! Available models:', data.data?.length || 0);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Test Failed:', response.status, errorData);
    }
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

// Run the test
testGroqAPI();