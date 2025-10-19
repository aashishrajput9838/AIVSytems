// test-api.js - Simple script to test if the AIV System API is running

async function testApi() {
  const testPayload = {
    question: "What is artificial intelligence?",
    response: "Artificial intelligence is a branch of computer science that aims to create software or machines that exhibit human-like intelligence.",
    platform: "test",
    timestamp: new Date().toISOString(),
    url: "http://localhost"
  };

  try {
    console.log("Testing AIV System API at http://localhost:5178/api/validate");
    
    const response = await fetch("http://localhost:5178/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log("API is working! Response:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`API returned error status ${response.status}: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error("Failed to connect to API:", error.message);
    console.log("Please make sure the AIV System API is running at http://localhost:5178");
    return false;
  }
}

// Run the test
testApi();