// Test script with realistic scenarios that might cause matching issues

// Scenario 1: Whitespace differences
const scenario1 = {
  conversationPairs: [
    {
      question: "what is rat ?",
      response: "Rats are small mammals with long tails, typically living in close association with humans. ",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt"
    }
  ],
  validationResults: [
    {
      id: 1234567890,
      role: "assistant",
      content: "Rats are small mammals with long tails, typically living in close association with humans.",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt",
      validation: {
        isValid: true,
        confidence: 0.95,
        issues: [],
        suggestions: ["This is a well-structured and accurate response."]
      },
      validatedAt: "2025-01-01T10:00:30Z"
    }
  ]
};

// Scenario 2: Newline differences
const scenario2 = {
  conversationPairs: [
    {
      question: "what is rat ?",
      response: "Rats are small mammals\nwith long tails,\ntypically living in close association with humans.",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt"
    }
  ],
  validationResults: [
    {
      id: 1234567890,
      role: "assistant",
      content: "Rats are small mammals with long tails, typically living in close association with humans.",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt",
      validation: {
        isValid: true,
        confidence: 0.95,
        issues: [],
        suggestions: ["This is a well-structured and accurate response."]
      },
      validatedAt: "2025-01-01T10:00:30Z"
    }
  ]
};

// Scenario 3: Special character encoding
const scenario3 = {
  conversationPairs: [
    {
      question: "what is rat ?",
      response: "Rats are small mammals with long tails, typically living in close association with humans.",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt"
    }
  ],
  validationResults: [
    {
      id: 1234567890,
      role: "assistant",
      content: "Rats are small mammals with long tails, typically living in close association with humans.",
      timestamp: "2025-01-01T10:00:00Z",
      url: "https://chat.openai.com",
      platform: "chatgpt",
      validation: {
        isValid: true,
        confidence: 0.95,
        issues: [],
        suggestions: ["This is a well-structured and accurate response."]
      },
      validatedAt: "2025-01-01T10:00:30Z"
    }
  ]
};

// Test matching logic
function testMatching(scenario, scenarioName) {
  console.log(`\n=== ${scenarioName} ===`);
  
  scenario.conversationPairs.forEach((pair, index) => {
    console.log(`\nConversation Pair ${index + 1}:`);
    console.log(`  Response: "${pair.response}"`);
    console.log(`  Response Length: ${pair.response.length}`);
    
    // Show validation results
    scenario.validationResults.forEach((result, resultIndex) => {
      console.log(`\n  Validation Result ${resultIndex + 1}:`);
      console.log(`    Content: "${result.content}"`);
      console.log(`    Content Length: ${result.content.length}`);
      
      // Current strict matching
      const strictMatch = result.content === pair.response && result.role === 'assistant';
      console.log(`    Strict Match: ${strictMatch}`);
      
      // Improved matching (trim whitespace)
      const improvedMatch = result.content.trim() === pair.response.trim() && result.role === 'assistant';
      console.log(`    Trim Match: ${improvedMatch}`);
      
      // Normalized matching (remove extra whitespace)
      const normalizeString = (str) => str.replace(/\s+/g, ' ').trim();
      const normalizedMatch = normalizeString(result.content) === normalizeString(pair.response) && result.role === 'assistant';
      console.log(`    Normalized Match: ${normalizedMatch}`);
    });
  });
}

// Run tests
console.log("=== Testing Realistic Matching Scenarios ===");
testMatching(scenario1, "Scenario 1: Trailing Whitespace");
testMatching(scenario2, "Scenario 2: Newline Characters");
testMatching(scenario3, "Scenario 3: Identical Content");

console.log("\n\n=== Solution Recommendation ===");
console.log("Update the matching logic in popup.js from:");
console.log("  validationInfo = validationResults.find(result => ");
console.log("    result.content === pair.response && ");
console.log("    result.role === 'assistant'");
console.log("  );");
console.log("");
console.log("To:");
console.log("  const normalizeString = (str) => str.replace(/\\s+/g, ' ').trim();");
console.log("  validationInfo = validationResults.find(result => {");
console.log("    const normalizedContent = normalizeString(result.content);");
console.log("    const normalizedResponse = normalizeString(pair.response);");
console.log("    return normalizedContent === normalizedResponse && result.role === 'assistant';");
console.log("  });");