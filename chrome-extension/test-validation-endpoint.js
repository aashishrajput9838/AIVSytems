// Test script to verify the validation endpoint is working
const apiEndpoint = 'http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse';

async function testValidationEndpoint() {
  console.log('Testing validation endpoint at:', apiEndpoint);
  
  const testData = {
    role: 'assistant',
    content: 'The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
    timestamp: new Date().toISOString(),
    url: 'https://chat.openai.com',
    platform: 'chatgpt'
  };
  
  try {
    console.log('Sending test data:', testData);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Validation successful!');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Check if we have validation data
      if (result.validation) {
        console.log('Validation details:');
        console.log('- isValid:', result.validation.isValid);
        console.log('- confidence:', result.validation.confidence);
        console.log('- issues:', result.validation.issues || 'None');
        console.log('- suggestions:', result.validation.suggestions || 'None');
      }
    } else {
      const errorText = await response.text();
      console.error('Validation failed with status:', response.status);
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Error testing validation endpoint:', error.message);
    console.error('This might indicate:');
    console.error('1. Firebase emulator is not running');
    console.error('2. Network connectivity issues');
    console.error('3. Firewall blocking the connection');
  }
}

// Run the test
console.log('=== AIV System Validation Endpoint Test ===');
testValidationEndpoint().then(() => {
  console.log('\n=== Test Complete ===');
  console.log('\nNext steps:');
  console.log('1. If the test failed, make sure the Firebase emulator is running:');
  console.log('   - Open a terminal in your Firebase project directory');
  console.log('   - Run: firebase emulators:start');
  console.log('   - Wait for "All emulators ready" message');
  console.log('2. If the test succeeded, the issue is likely in the extension code');
  console.log('3. Refresh the AI chat page and try asking a question again');
});