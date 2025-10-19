// Test script to check Firebase emulator connection
const apiEndpoint = 'http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse';

async function testConnection() {
  console.log('Testing connection to Firebase emulator at:', apiEndpoint);
  
  try {
    // Test if the endpoint is accessible
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Connection test result:');
    console.log('- Status:', response.status);
    console.log('- Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('- Result: SUCCESS - Emulator is running and accessible');
    } else {
      console.log('- Result: FAILED - Emulator responded with error');
      const errorText = await response.text();
      console.log('- Error Details:', errorText);
    }
  } catch (error) {
    console.log('- Result: FAILED - Could not connect to emulator');
    console.log('- Error:', error.message);
    
    // Check if it's a network error
    if (error.message.includes('fetch') || error.message.includes('network')) {
      console.log('- Suggestion: Make sure the Firebase emulator is running');
      console.log('- To start the emulator, run: firebase emulators:start');
    }
  }
}

// Also test with a simple POST request
async function testValidationEndpoint() {
  console.log('\nTesting validation endpoint with sample data...');
  
  const sampleData = {
    role: 'assistant',
    content: 'The Taj Mahal is a famous monument in India.',
    timestamp: new Date().toISOString(),
    url: 'https://chat.openai.com',
    platform: 'chatgpt'
  };
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    });
    
    console.log('Validation test result:');
    console.log('- Status:', response.status);
    console.log('- Status Text:', response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('- Result: SUCCESS - Validation endpoint is working');
      console.log('- Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('- Result: FAILED - Validation endpoint responded with error');
      const errorText = await response.text();
      console.log('- Error Details:', errorText);
    }
  } catch (error) {
    console.log('- Result: FAILED - Could not connect to validation endpoint');
    console.log('- Error:', error.message);
  }
}

// Run the tests
console.log('=== Firebase Emulator Connection Test ===');
testConnection().then(() => {
  return testValidationEndpoint();
}).then(() => {
  console.log('\n=== Test Complete ===');
  console.log('If you see "FAILED" results above, make sure the Firebase emulator is running.');
  console.log('To start the emulator:');
  console.log('1. Open a terminal in your Firebase project directory');
  console.log('2. Run: firebase emulators:start');
  console.log('3. Wait for the emulator to start (look for "All emulators ready" message)');
  console.log('4. Try using the extension again');
});