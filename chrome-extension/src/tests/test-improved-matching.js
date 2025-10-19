// Test the improved matching logic

// Test data with various scenarios
const testData = [
  {
    name: "Exact Match",
    pair: {
      response: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: true
  },
  {
    name: "Trailing Whitespace",
    pair: {
      response: "Rats are small mammals with long tails, typically living in close association with humans. "
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: true
  },
  {
    name: "Leading Whitespace",
    pair: {
      response: " Rats are small mammals with long tails, typically living in close association with humans."
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: true
  },
  {
    name: "Extra Spaces",
    pair: {
      response: "Rats  are   small    mammals with long tails, typically living in close association with humans."
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: true
  },
  {
    name: "Newlines",
    pair: {
      response: "Rats are small mammals\nwith long tails,\ntypically living in close association with humans."
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: true
  },
  {
    name: "Completely Different",
    pair: {
      response: "Dogs are loyal animals."
    },
    result: {
      content: "Rats are small mammals with long tails, typically living in close association with humans."
    },
    expected: false
  }
];

// Normalize string function (same as in popup.js)
const normalizeString = (str) => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

// Calculate similarity function (same as in popup.js)
function calculateSimilarity(str1, str2) {
  if (!str1 && !str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  
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
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Test the improved matching logic
function testImprovedMatching() {
  console.log("=== Testing Improved Matching Logic ===\n");
  
  let passedTests = 0;
  let totalTests = testData.length;
  
  testData.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    console.log(`  Pair Response: "${test.pair.response}"`);
    console.log(`  Result Content: "${test.result.content}"`);
    
    // Apply the improved matching logic
    const normalizedPairResponse = normalizeString(test.pair.response);
    const normalizedResultContent = normalizeString(test.result.content);
    
    let isMatch = false;
    
    // Check for exact match first
    if (normalizedResultContent === normalizedPairResponse) {
      isMatch = true;
    } else {
      // Check if one contains the other
      if (normalizedResultContent.includes(normalizedPairResponse) || 
          normalizedPairResponse.includes(normalizedResultContent)) {
        // Only consider it a match if the similarity is high enough
        const similarity = calculateSimilarity(normalizedResultContent, normalizedPairResponse);
        isMatch = similarity > 0.8;
      }
    }
    
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Actual: ${isMatch}`);
    console.log(`  Result: ${isMatch === test.expected ? 'PASS' : 'FAIL'}`);
    
    if (isMatch === test.expected) {
      passedTests++;
    }
    
    console.log("");
  });
  
  console.log(`=== Test Results: ${passedTests}/${totalTests} passed ===`);
  
  if (passedTests === totalTests) {
    console.log("✅ All tests passed! The improved matching logic should resolve the validation display issue.");
  } else {
    console.log("❌ Some tests failed. The matching logic may need further refinement.");
  }
}

// Run the test
testImprovedMatching();