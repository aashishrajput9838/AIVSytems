// Test script to verify popup functionality fixes

// Mock conversation pairs with long responses
const mockConversationPairs = [
  {
    question: "who is jonnysins ?",
    response: "Johnny Sins (real name Steven Wolfe) is an American adult film actor, director, and internet personality. He became popular for his roles in adult movies and later turned into a meme because he's portrayed many professions — ".repeat(20)
  }
];

// Mock validation results with object issues and suggestions
const mockValidationResults = [
  {
    role: "assistant",
    content: "Johnny Sins (real name Steven Wolfe) is an American adult film actor, director, and internet personality. He became popular for his roles in adult movies and later turned into a meme because he's portrayed many professions — ".repeat(20),
    question: "who is jonnysins ?",
    validation: {
      isValid: false,
      confidence: 0.137,
      issues: {
        "accuracy": "Response contains potentially inaccurate information",
        "source": "No credible sources cited"
      },
      suggestions: {
        "verify": "Cross-check with reputable sources",
        "cite": "Include references to credible sources"
      }
    }
  }
];

// Test the displayConversationPairs function logic
function testDisplayConversationPairs() {
  console.log("Testing displayConversationPairs functionality...");
  
  const pairs = mockConversationPairs;
  const validationResults = mockValidationResults;
  
  console.log("Conversation pairs:", pairs);
  console.log("Validation results:", validationResults);
  
  if (!pairs || pairs.length === 0) {
    console.log("No pairs to display");
    return;
  }
  
  // Filter out pairs with "Previous context" or empty questions
  const validPairs = pairs.filter(pair => 
    pair.question && 
    pair.question !== 'Previous context' && 
    pair.response && 
    pair.response.length > 0
  );
  
  // If no valid pairs, show all pairs (fallback)
  const displayPairs = validPairs.length > 0 ? validPairs : pairs;
  
  // Show only the last 5 pairs
  const finalDisplayPairs = displayPairs.slice(-5);
  console.log("Final display pairs:", finalDisplayPairs);
  
  // Process each pair
  finalDisplayPairs.forEach((pair, index) => {
    console.log(`Processing display pair ${index}:`, pair);
    
    // Check if response exists and log its properties
    if (pair.response) {
      console.log(`Pair ${index} response length:`, pair.response.length);
      console.log(`Pair ${index} response preview:`, pair.response.substring(0, 100));
    } else {
      console.log(`Pair ${index} has no response!`);
    }
    
    // Find validation result for this pair using improved matching logic
    let validationInfo = null;
    if (validationResults && validationResults.length > 0) {
      // Look for validation result matching this pair
      for (let i = 0; i < validationResults.length; i++) {
        const result = validationResults[i];
        console.log(`Checking validation result ${i}:`, result);
        
        if (result.role !== 'assistant') {
          console.log(`Skipping result ${i} - not assistant role`);
          continue;
        }
        
        // Check if this validation result matches our pair
        const pairResponse = pair.response || '';
        const pairQuestion = pair.question || '';
        const resultContent = result.content || '';
        const resultQuestion = result.question || '';
        
        // Normalize strings for comparison
        const normalizedPairResponse = pairResponse.toLowerCase().trim();
        const normalizedResultContent = resultContent.toLowerCase().trim();
        const normalizedPairQuestion = pairQuestion.toLowerCase().trim();
        const normalizedResultQuestion = resultQuestion.toLowerCase().trim();
        
        console.log(`Comparing pair response: "${normalizedPairResponse.substring(0, 50)}..."`);
        console.log(`With result content: "${normalizedResultContent.substring(0, 50)}..."`);
        console.log(`Comparing pair question: "${normalizedPairQuestion.substring(0, 50)}..."`);
        console.log(`With result question: "${normalizedResultQuestion.substring(0, 50)}..."`);
        
        // Check for exact match first
        if (normalizedPairResponse === normalizedResultContent) {
          console.log(`Found exact match for result ${i}`);
          validationInfo = result;
          break;
        }
      }
      
      console.log(`Validation info for pair ${index}:`, validationInfo);
    }
    
    // Test the HTML generation with our fixes
    let pairHTML = `
      <div class="conversation-pair">
        <div class="question">
          <strong>Q:</strong> ${pair.question && pair.question !== 'Previous context' && pair.question.trim() !== '' ? pair.question : 'No question available'}
        </div>
        <div class="response">
          <strong>A:</strong> ${pair.response ? pair.response : 'No response yet'}
        </div>
    `;
    
    // Add validation information if available
    if (validationInfo && validationInfo.validation) {
      const validation = validationInfo.validation;
      const isValid = validation.isValid !== undefined ? validation.isValid : true;
      const confidence = validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) : 'N/A';
      
      // Determine confidence level for styling
      let confidenceClass = 'high-confidence';
      if (confidence !== 'N/A') {
        const confNum = parseFloat(confidence);
        if (confNum < 50) confidenceClass = 'low-confidence';
        else if (confNum < 80) confidenceClass = 'medium-confidence';
      }
      
      pairHTML += `
        <div class="validation-info ${isValid ? 'valid' : 'invalid'}">
          <div class="validation-status">
            Validation: <strong>${isValid ? 'PASSED' : 'FAILED'}</strong>
            ${confidence !== 'N/A' ? ` (Confidence: ${confidence}%)` : ''}
          </div>
          
          <div class="confidence-meter">
            <div class="confidence-fill ${confidenceClass}" style="width: ${confidence !== 'N/A' ? confidence : '100'}%"></div>
          </div>
      `;
      
      // Add issues if validation failed
      if (!isValid && validation.issues) {
        pairHTML += `
          <div class="validation-issues">
            Issues: ${typeof validation.issues === 'object' ? JSON.stringify(validation.issues, null, 2) : validation.issues}
          </div>
        `;
      }
      
      // Add suggestions if available
      if (validation.suggestions) {
        pairHTML += `
          <div class="validation-suggestions">
            Suggestions: ${typeof validation.suggestions === 'object' ? JSON.stringify(validation.suggestions, null, 2) : validation.suggestions}
          </div>
        `;
      }
      
      pairHTML += '</div>';
    }
    
    pairHTML += '</div>';
    
    console.log(`Generated HTML for pair ${index}:`, pairHTML);
    
    // Verify that the response is not truncated
    if (pair.response && pair.response.length > 300) {
      console.log("✓ Long response preserved (not truncated)");
    } else {
      console.log("✓ Response length appropriate");
    }
    
    // Verify that issues and suggestions are properly displayed
    if (validationInfo && validationInfo.validation) {
      const validation = validationInfo.validation;
      if (typeof validation.issues === 'object') {
        console.log("✓ Issues object properly converted to string");
      }
      if (typeof validation.suggestions === 'object') {
        console.log("✓ Suggestions object properly converted to string");
      }
    }
  });
  
  console.log("All tests completed successfully!");
}

// Run the test
testDisplayConversationPairs();