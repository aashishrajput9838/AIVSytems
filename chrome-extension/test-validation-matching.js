// Test script to check validation result matching logic

// Simulated conversation pair (similar to what would be captured by the extension)
const conversationPair = {
  question: "what is tajmaahl ?",
  response: "The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
  timestamp: "2025-10-17T02:00:00.000Z",
  url: "https://chat.openai.com",
  platform: "chatgpt"
};

// Simulated validation result (similar to what would be returned by the AIV System)
const validationResult = {
  id: 1729123456789,
  role: "assistant",
  content: "The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
  timestamp: "2025-10-17T02:00:00.000Z",
  url: "https://chat.openai.com",
  platform: "chatgpt",
  validation: {
    isValid: true,
    confidence: 0.95,
    issues: [],
    suggestions: ["This is a well-structured and accurate response."]
  },
  validatedAt: "2025-10-17T02:00:30.000Z"
};

// Test the matching logic used in popup.js
function testMatchingLogic() {
  console.log("=== Testing Validation Result Matching Logic ===\n");
  
  console.log("Conversation Pair Response:");
  console.log(`"${conversationPair.response}"\n`);
  
  console.log("Validation Result Content:");
  console.log(`"${validationResult.content}"\n`);
  
  // Check if they are exactly the same
  const exactMatch = conversationPair.response === validationResult.content;
  console.log(`Exact match: ${exactMatch}`);
  
  if (!exactMatch) {
    console.log("\nDifferences found:");
    if (conversationPair.response.length !== validationResult.content.length) {
      console.log(`- Length difference: ${conversationPair.response.length} vs ${validationResult.content.length}`);
    }
    
    // Check for whitespace differences
    const trimmedConversation = conversationPair.response.trim();
    const trimmedValidation = validationResult.content.trim();
    const trimmedMatch = trimmedConversation === trimmedValidation;
    console.log(`- Trimmed match: ${trimmedMatch}`);
    
    if (!trimmedMatch) {
      // Character by character comparison
      for (let i = 0; i < Math.min(conversationPair.response.length, validationResult.content.length); i++) {
        if (conversationPair.response[i] !== validationResult.content[i]) {
          console.log(`- First difference at position ${i}: '${conversationPair.response[i]}' vs '${validationResult.content[i]}'`);
          break;
        }
      }
    }
  }
  
  // Test the actual matching logic from popup.js
  console.log("\n=== Testing Popup Matching Logic ===");
  const validationInfo = validationResult.content === conversationPair.response && 
                         validationResult.role === 'assistant';
  
  console.log(`Matching result: ${validationInfo}`);
  
  if (validationInfo) {
    console.log("\n✓ Validation result would be correctly matched and displayed");
    console.log(`  Status: ${validationResult.validation.isValid ? 'PASSED' : 'FAILED'}`);
    console.log(`  Confidence: ${(validationResult.validation.confidence * 100).toFixed(1)}%`);
  } else {
    console.log("\n✗ Validation result would NOT be matched");
    console.log("  The popup would show 'Validation: Pending' for this conversation pair");
  }
}

// Test with a case that might fail due to minor differences
function testWithPotentialIssues() {
  console.log("\n\n=== Testing with Potential Issues ===");
  
  // Simulate a case where there might be minor differences
  const conversationPairWithExtraSpace = {
    ...conversationPair,
    response: conversationPair.response + " " // Extra space at the end
  };
  
  console.log("Conversation Pair Response (with extra space):");
  console.log(`"${conversationPairWithExtraSpace.response}"\n`);
  
  const matchWithExtraSpace = validationResult.content === conversationPairWithExtraSpace.response && 
                              validationResult.role === 'assistant';
  
  console.log(`Matching result with extra space: ${matchWithExtraSpace}`);
  
  if (!matchWithExtraSpace) {
    console.log("This demonstrates why validation might show as 'Pending'");
    console.log("Even a single extra space would prevent the match");
  }
}

// Run the tests
testMatchingLogic();
testWithPotentialIssues();

console.log("\n\n=== Recommendations ===");
console.log("1. Check the browser console for any errors when using the extension");
console.log("2. Verify that the content script is correctly capturing the full response");
console.log("3. Ensure that validation is being triggered for completed conversation pairs");
console.log("4. Check that validation results are being stored with the exact same content");