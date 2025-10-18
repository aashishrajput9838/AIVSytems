// Test file to verify conversation pairs handling
console.log('=== Conversation Pairs Test ===');

// Test data
const testPairs = [
  {
    question: "What is the capital of France?",
    response: "The capital of France is Paris.",
    timestamp: "2023-01-01T10:00:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  },
  {
    question: "Who wrote Romeo and Juliet?",
    response: "Romeo and Juliet was written by William Shakespeare.",
    timestamp: "2023-01-01T10:05:00Z",
    url: "https://chat.openai.com",
    platform: "chatgpt"
  }
];

const testValidationResults = [
  {
    role: "assistant",
    content: "The capital of France is Paris.",
    validation: {
      isValid: true,
      confidence: 0.95,
      issues: [],
      suggestions: []
    }
  },
  {
    role: "assistant",
    content: "Romeo and Juliet was written by William Shakespeare.",
    validation: {
      isValid: true,
      confidence: 0.92,
      issues: [],
      suggestions: []
    }
  }
];

console.log('Test Pairs:', testPairs);
console.log('Test Validation Results:', testValidationResults);

// Simulate the display function
function simulateDisplayConversationPairs(pairs, validationResults) {
  console.log('\n=== Simulating Display Function ===');
  
  if (!pairs || pairs.length === 0) {
    console.log('No conversation pairs to display');
    return;
  }
  
  console.log(`Displaying ${pairs.length} conversation pairs:`);
  
  pairs.forEach((pair, index) => {
    console.log(`\nPair ${index + 1}:`);
    console.log(`  Q: ${pair.question}`);
    console.log(`  A: ${pair.response}`);
    
    // Find validation result
    let validationInfo = null;
    if (validationResults && validationResults.length > 0) {
      const normalizeString = (str) => {
        if (!str) return '';
        return str.replace(/\s+/g, ' ').trim();
      };
      
      const normalizedPairResponse = normalizeString(pair.response || '');
      
      validationInfo = validationResults.find(result => {
        if (result.role !== 'assistant') return false;
        
        const normalizedResultContent = normalizeString(result.content || '');
        
        // Check for exact match first
        if (normalizedResultContent === normalizedPairResponse) return true;
        
        // Check if one contains the other
        if (normalizedResultContent.includes(normalizedPairResponse) || 
            normalizedPairResponse.includes(normalizedResultContent)) {
          return true;
        }
        
        return false;
      });
    }
    
    if (validationInfo && validationInfo.validation) {
      const validation = validationInfo.validation;
      const isValid = validation.isValid !== undefined ? validation.isValid : true;
      const confidence = validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) : 'N/A';
      
      console.log(`  Validation: ${isValid ? 'PASSED' : 'FAILED'} (Confidence: ${confidence}%)`);
      
      if (!isValid && validation.issues && validation.issues.length > 0) {
        console.log(`  Issues: ${validation.issues.join(', ')}`);
      }
      
      if (validation.suggestions && validation.suggestions.length > 0) {
        console.log(`  Suggestions: ${validation.suggestions.join(', ')}`);
      }
    } else {
      console.log('  Validation: Pending');
    }
  });
}

// Run the simulation
simulateDisplayConversationPairs(testPairs, testValidationResults);

console.log('\n=== Test Complete ===');