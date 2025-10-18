// Test script to check the matching logic between conversation pairs and validation results

// Simulate conversation pairs (what the content script captures)
const conversationPairs = [
  {
    question: "what is rat ?",
    response: "Rats are small mammals with long tails, typically living in close association with humans.",
    timestamp: "2025-01-01T10:00:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  }
];

// Simulate validation results (what the background script stores)
const validationResults = [
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
];

// Current matching logic (strict)
function currentMatchingLogic(pairs, results) {
  console.log("=== Current Matching Logic (Strict) ===");
  
  pairs.forEach((pair, index) => {
    console.log(`\nConversation Pair ${index + 1}:`);
    console.log(`  Question: "${pair.question}"`);
    console.log(`  Response: "${pair.response}"`);
    console.log(`  Response Length: ${pair.response.length}`);
    
    // Current logic from popup.js
    const validationInfo = results.find(result => 
      result.content === pair.response && 
      result.role === 'assistant'
    );
    
    if (validationInfo) {
      console.log(`  Match Found: YES`);
      console.log(`  Validation Status: ${validationInfo.validation.isValid ? 'PASSED' : 'FAILED'}`);
      console.log(`  Confidence: ${(validationInfo.validation.confidence * 100).toFixed(1)}%`);
    } else {
      console.log(`  Match Found: NO`);
      console.log(`  Result: Validation will show as "Pending"`);
      
      // Let's see why it didn't match
      results.forEach((result, resultIndex) => {
        console.log(`\n  Comparing with Validation Result ${resultIndex + 1}:`);
        console.log(`    Content: "${result.content}"`);
        console.log(`    Content Length: ${result.content.length}`);
        console.log(`    Role Match: ${result.role === 'assistant'} (expected: assistant, actual: ${result.role})`);
        console.log(`    Content Match: ${result.content === pair.response}`);
        
        if (result.content !== pair.response) {
          console.log(`    Differences:`);
          // Character by character comparison
          const maxLength = Math.max(pair.response.length, result.content.length);
          for (let i = 0; i < maxLength; i++) {
            if (pair.response[i] !== result.content[i]) {
              console.log(`      Position ${i}: '${pair.response[i]}' vs '${result.content[i]}'`);
              break;
            }
          }
        }
      });
    }
  });
}

// Improved matching logic (more flexible)
function improvedMatchingLogic(pairs, results) {
  console.log("\n\n=== Improved Matching Logic (Flexible) ===");
  
  pairs.forEach((pair, index) => {
    console.log(`\nConversation Pair ${index + 1}:`);
    console.log(`  Question: "${pair.question}"`);
    console.log(`  Response: "${pair.response}"`);
    
    // Improved logic - trim whitespace and compare
    const validationInfo = results.find(result => {
      const pairResponseTrimmed = pair.response.trim();
      const resultContentTrimmed = result.content.trim();
      return resultContentTrimmed === pairResponseTrimmed && result.role === 'assistant';
    });
    
    if (validationInfo) {
      console.log(`  Match Found: YES (with improved logic)`);
      console.log(`  Validation Status: ${validationInfo.validation.isValid ? 'PASSED' : 'FAILED'}`);
      console.log(`  Confidence: ${(validationInfo.validation.confidence * 100).toFixed(1)}%`);
    } else {
      console.log(`  Match Found: NO (even with improved logic)`);
    }
  });
}

// Even more improved matching logic (fuzzy)
function fuzzyMatchingLogic(pairs, results) {
  console.log("\n\n=== Fuzzy Matching Logic ===");
  
  pairs.forEach((pair, index) => {
    console.log(`\nConversation Pair ${index + 1}:`);
    console.log(`  Question: "${pair.question}"`);
    console.log(`  Response: "${pair.response}"`);
    
    // Fuzzy logic - check if content is contained within each other or very similar
    const validationInfo = results.find(result => {
      if (result.role !== 'assistant') return false;
      
      const pairResponseTrimmed = pair.response.trim();
      const resultContentTrimmed = result.content.trim();
      
      // Check for exact match first
      if (resultContentTrimmed === pairResponseTrimmed) return true;
      
      // Check if one contains the other
      if (resultContentTrimmed.includes(pairResponseTrimmed) || 
          pairResponseTrimmed.includes(resultContentTrimmed)) return true;
      
      // Check if they're very similar (90% similarity)
      const similarity = calculateSimilarity(pairResponseTrimmed, resultContentTrimmed);
      return similarity > 0.9;
    });
    
    if (validationInfo) {
      console.log(`  Match Found: YES (with fuzzy logic)`);
      console.log(`  Validation Status: ${validationInfo.validation.isValid ? 'PASSED' : 'FAILED'}`);
      console.log(`  Confidence: ${(validationInfo.validation.confidence * 100).toFixed(1)}%`);
    } else {
      console.log(`  Match Found: NO (even with fuzzy logic)`);
    }
  });
}

// Simple similarity function
function calculateSimilarity(str1, str2) {
  // For simplicity, we'll use a basic approach
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(shorter, longer);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Run the tests
console.log("=== Testing Conversation Pair and Validation Result Matching ===");
currentMatchingLogic(conversationPairs, validationResults);
improvedMatchingLogic(conversationPairs, validationResults);
fuzzyMatchingLogic(conversationPairs, validationResults);

console.log("\n\n=== Recommendations ===");
console.log("1. The current strict matching logic may fail due to:");
console.log("   - Extra whitespace at the beginning or end of responses");
console.log("   - Minor differences in formatting or punctuation");
console.log("   - Different encoding or special characters");
console.log("\n2. Consider updating the matching logic in popup.js to be more flexible");
console.log("3. Test with actual conversation data from your extension");