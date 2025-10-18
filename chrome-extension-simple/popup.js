// popup.js for AIV Chat Validator

document.addEventListener('DOMContentLoaded', function() {
  console.log('[AIV Simple Popup] Popup loaded');
  loadValidationResults();
});

// Load validation results from storage
function loadValidationResults() {
  chrome.storage.local.get(['aivValidationResults'], function(result) {
    console.log('[AIV Simple Popup] Retrieved validation results:', result);
    if (result.aivValidationResults && result.aivValidationResults.length > 0) {
      displayValidationResults(result.aivValidationResults);
    } else {
      displayNoResults();
    }
  });
}

// Display validation results
function displayValidationResults(results) {
  const container = document.getElementById('validation-result-container');
  
  // Show only the last 5 results
  const displayResults = results.slice(-5);
  
  let html = '<div class="conversation-pairs">';
  
  displayResults.forEach((result, index) => {
    const pair = result.pair;
    
    html += `
      <div class="conversation-pair">
        <div class="question">
          <strong>Q:</strong> ${pair.question.substring(0, 100)}${pair.question.length > 100 ? '...' : ''}
        </div>
        <div class="response">
          <strong>A:</strong> ${pair.response.substring(0, 200)}${pair.response.length > 200 ? '...' : ''}
        </div>
    `;
    
    // Add validation information
    if (result.validation) {
      const validation = result.validation;
      const isValid = validation.isValid !== undefined ? validation.isValid : true;
      const confidence = validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) : 'N/A';
      
      html += `
        <div class="validation-info ${isValid ? 'valid' : 'invalid'}">
          <div class="validation-status">
            Validation: <strong>${isValid ? 'PASSED' : 'FAILED'}</strong>
            ${confidence !== 'N/A' ? ` (Confidence: ${confidence}%)` : ''}
          </div>
      `;
      
      // Add issues if validation failed
      if (!isValid && validation.issues && validation.issues.length > 0) {
        html += `
          <div class="validation-issues">
            Issues: ${validation.issues.join(', ')}
          </div>
        `;
      }
      
      // Add suggestions if available
      if (validation.suggestions && validation.suggestions.length > 0) {
        html += `
          <div class="validation-suggestions">
            Suggestions: ${validation.suggestions.join(', ')}
          </div>
        `;
      }
      
      html += '</div>';
    } else {
      html += `
        <div class="validation-info pending">
          <div class="validation-status">Validation: Pending</div>
        </div>
      `;
    }
    
    html += '</div>';
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// Display no results message
function displayNoResults() {
  const container = document.getElementById('validation-result-container');
  container.innerHTML = '<div class="no-results">No conversations captured yet. Chat with an AI to see results here.</div>';
}