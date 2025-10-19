// test-firebase-function.js - Simple script to test if the Firebase function is running

async function testFirebaseFunction() {
  // Using the emulator URL
  const functionUrl = 'http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse';
  
  const testPayload = {
    role: "assistant",
    content: "Artificial intelligence is a branch of computer science that aims to create software or machines that exhibit human-like intelligence.",
    timestamp: new Date().toISOString(),
    url: "http://localhost",
    platform: "test"
  };

  try {
    console.log("Testing Firebase Function at", functionUrl);
    
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Firebase Function is working! Response:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Function returned error status ${response.status}: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error("Failed to connect to Firebase Function:", error.message);
    console.log("Please make sure the Firebase emulator is running:");
    console.log("1. Keep the emulator terminal window open");
    console.log("2. Try this test again");
    return false;
  }
}

// Run the test
testFirebaseFunction();