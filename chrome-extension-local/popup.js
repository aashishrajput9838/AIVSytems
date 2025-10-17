// popup.js for AIV Local Validator

document.addEventListener('DOMContentLoaded', function() {
  console.log('[AIV Local Popup] Popup loaded');
  loadConversationPairs();
});

// Load conversation pairs from content script
function loadConversationPairs() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      console.log('[AIV Local Popup] Requesting conversation pairs from tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getConversationPairs'
      }, function(response) {
        console.log('[AIV Local Popup] Received response from content script:', response);
        if (chrome.runtime.lastError) {
          console.error('[AIV Local Popup] Error getting conversation pairs:', chrome.runtime.lastError);
          displayNoResults();
        } else if (response.success && response.pairs) {
          console.log('[AIV Local Popup] Received conversation pairs:', response.pairs);
          displayConversationPairs(response.pairs);
        } else {
          console.log('[AIV Local Popup] No conversation pairs found');
          displayNoResults();
        }
      });
    }
  });
}

// Display conversation pairs in the popup with validation results
function displayConversationPairs(pairs) {
  const container = document.getElementById('validation-result-container');
  
  console.log('[AIV Local Popup] Displaying conversation pairs:', pairs);
  
  if (!pairs || pairs.length === 0) {
    console.log('[AIV Local Popup] No pairs to display');
    displayNoResults();
    return;
  }
  
  // Show only the last 5 pairs
  const displayPairs = pairs.slice(-5);
  console.log('[AIV Local Popup] Display pairs to show:', displayPairs);
  
  // Create HTML for conversation pairs
  let pairsHTML = '<div class="conversation-pairs">';
  
  displayPairs.forEach((pair, index) => {
    console.log(`[AIV Local Popup] Processing display pair ${index}:`, pair);
    
    // Check if response exists and log its properties
    if (pair.response) {
      console.log(`[AIV Local Popup] Pair ${index} response length:`, pair.response.length);
      console.log(`[AIV Local Popup] Pair ${index} response preview:`, pair.response.substring(0, 100));
    } else {
      console.log(`[AIV Local Popup] Pair ${index} has no response!`);
    }
    
    // Create the HTML for this conversation pair
    pairsHTML += `
      <div class="conversation-pair">
        <div class="question">
          <strong>Q:</strong> ${pair.question ? pair.question.substring(0, 100) : 'No question'}${pair.question && pair.question.length > 100 ? '...' : ''}
        </div>
        <div class="response">
          <strong>A:</strong> ${pair.response ? pair.response.substring(0, 200) : 'No response yet'}${pair.response && pair.response.length > 200 ? '...' : ''}
        </div>
    `;
    
    // Add validation information if available
    if (pair.validation) {
      const validation = pair.validation;
      const isValid = validation.isValid !== undefined ? validation.isValid : true;
      const confidence = validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) : 'N/A';
      
      pairsHTML += `
        <div class="validation-info ${isValid ? 'valid' : 'invalid'}">
          <div class="validation-status">
            Validation: <strong>${isValid ? 'PASSED' : 'FAILED'}</strong>
            ${confidence !== 'N/A' ? ` (Confidence: ${confidence}%)` : ''}
          </div>
      `;
      
      // Add issues if validation failed
      if (!isValid && validation.issues && validation.issues.length > 0) {
        pairsHTML += `
          <div class="validation-issues">
            Issues: ${validation.issues.join(', ')}
          </div>
        `;
      }
      
      // Add suggestions if available
      if (validation.suggestions && validation.suggestions.length > 0) {
        pairsHTML += `
          <div class="validation-suggestions">
            Suggestions: ${validation.suggestions.join(', ')}
          </div>
        `;
      }
      
      // Add validator details
      if (validation.validators && validation.validators.length > 0) {
        pairsHTML += `
          <div class="validator-details">
            <details>
              <summary>Validator Details</summary>
              <ul>
        `;
        
        validation.validators.forEach(validator => {
          const statusClass = validator.pass ? 'validator-pass' : 'validator-fail';
          pairsHTML += `
            <li class="${statusClass}">
              <strong>${validator.name}:</strong> 
              ${validator.pass ? 'PASS' : 'FAIL'} 
              (Score: ${(validator.score * 100).toFixed(1)}%)
              <br><small>${validator.details}</small>
            </li>
          `;
        });
        
        pairsHTML += `
              </ul>
            </details>
          </div>
        `;
      }
      
      pairsHTML += '</div>';
    } else if (pair.response) {
      // Only show pending validation if there's actually a response
      pairsHTML += `
        <div class="validation-info pending">
          <div class="validation-status">Validation: Pending</div>
        </div>
      `;
    }
    
    pairsHTML += '</div>';
  });
  
  pairsHTML += '</div>';
  
  console.log('[AIV Local Popup] Generated HTML:', pairsHTML);
  
  container.innerHTML = pairsHTML;
}

// Display no results message
function displayNoResults() {
  const container = document.getElementById('validation-result-container');
  container.innerHTML = '<div class="no-results">No conversations captured yet. Chat with an AI to see results here.</div>';
}