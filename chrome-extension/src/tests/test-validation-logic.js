// Test script for validation display logic
// This simulates the matching of conversation pairs with validation results

// Simulated conversation pairs
const conversationPairs = [
  {
    question: "What is the Taj Mahal?",
    response: "The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    timestamp: "2025-10-16T10:00:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  },
  {
    question: "What is the capital of France?",
    response: "The capital of France is Paris, which is also its largest city.",
    timestamp: "2025-10-16T10:05:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  },
  {
    question: "What is photosynthesis?",
    response: "Photosynthesis is the process by which plants convert light energy into chemical energy.",
    timestamp: "2025-10-16T10:10:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  }
];

// Simulated validation results
const validationResults = [
  {
    id: 1,
    role: "assistant",
    content: "The Taj Mahal is a famous monument in India, located in Agra. It is a white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    timestamp: "2025-10-16T10:00:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt",
    validation: {
      isValid: true,
      confidence: 0.955,
      issues: [],
      suggestions: ["This is a well-structured and accurate response."]
    },
    validatedAt: "2025-10-16T10:00:30Z"
  },
  {
    id: 2,
    role: "assistant",
    content: "The capital of France is Paris, which is also its largest city.",
    timestamp: "2025-10-16T10:05:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt",
    validation: {
      isValid: false,
      confidence: 0.723,
      issues: ["Response lacks detail about Paris"],
      suggestions: ["Include more information about Paris such as its population, location, or landmarks."]
    },
    validatedAt: "2025-10-16T10:05:30Z"
  }
  // Note: No validation result for the third pair (photosynthesis) to simulate pending validation
];

// Function to match conversation pairs with validation results
function matchPairsWithValidation(pairs, results) {
  return pairs.map(pair => {
    // Find validation result for this pair
    let validationInfo = null;
    if (results && results.length > 0) {
      validationInfo = results.find(result => 
        result.content === pair.response && 
        result.role === 'assistant'
      );
    }
    
    return {
      ...pair,
      validation: validationInfo ? validationInfo.validation : null,
      validatedAt: validationInfo ? validationInfo.validatedAt : null
    };
  });
}

// Test the matching logic
console.log("=== Testing Validation Matching Logic ===\n");

const matchedPairs = matchPairsWithValidation(conversationPairs, validationResults);

matchedPairs.forEach((pair, index) => {
  console.log(`Conversation Pair ${index + 1}:`);
  console.log(`  Question: ${pair.question}`);
  console.log(`  Response: ${pair.response.substring(0, 50)}...`);
  
  if (pair.validation) {
    const isValid = pair.validation.isValid;
    const confidence = (pair.validation.confidence * 100).toFixed(1);
    
    console.log(`  Validation Status: ${isValid ? 'PASSED' : 'FAILED'}`);
    console.log(`  Confidence: ${confidence}%`);
    
    if (!isValid && pair.validation.issues.length > 0) {
      console.log(`  Issues: ${pair.validation.issues.join(', ')}`);
    }
    
    if (pair.validation.suggestions && pair.validation.suggestions.length > 0) {
      console.log(`  Suggestions: ${pair.validation.suggestions.join(', ')}`);
    }
  } else {
    console.log(`  Validation Status: Pending`);
  }
  
  console.log(""); // Empty line for readability
});

// Test edge cases
console.log("=== Testing Edge Cases ===\n");

// Test with empty validation results
const pairsWithoutValidation = matchPairsWithValidation(conversationPairs, []);
console.log("Pairs with no validation results:");
pairsWithoutValidation.forEach((pair, index) => {
  console.log(`  Pair ${index + 1}: ${pair.validation ? 'Has validation' : 'No validation (Pending)'}`);
});

// Test with null validation results
const pairsWithNullValidation = matchPairsWithValidation(conversationPairs, null);
console.log("\nPairs with null validation results:");
pairsWithNullValidation.forEach((pair, index) => {
  console.log(`  Pair ${index + 1}: ${pair.validation ? 'Has validation' : 'No validation (Pending)'}`);
});

console.log("\n=== Test Complete ===");