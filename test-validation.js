// Simple test script to verify Firebase functions are working
async function testValidation() {
  const testRequest = {
    role: 'assistant',
    content: 'The Earth is round and orbits the Sun.',
    timestamp: new Date().toISOString(),
    url: 'https://chatgpt.com/',
    platform: 'chatgpt'
  };

  try {
    console.log('Sending test request to validation service...');
    console.log('Request:', testRequest);

    const response = await fetch('http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Validation result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

// Run the test
testValidation();