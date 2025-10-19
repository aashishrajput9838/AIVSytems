// popup.js

// Utility function to escape HTML special characters
function escapeHtml(text) {
  if (!text) return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load the toggle state when the popup opens
document.addEventListener('DOMContentLoaded', function() {
  console.log('[AIV Popup] Popup loaded');
  chrome.storage.local.get(['aivValidationEnabled'], function(result) {
    const isEnabled = result.aivValidationEnabled !== undefined ? result.aivValidationEnabled : true;
    console.log('[AIV Popup] Initial toggle state:', isEnabled);
    document.getElementById('toggle').checked = isEnabled;
    updateStatus(isEnabled);
    
    // Load conversation pairs when popup opens (without triggering validation)
    loadConversationPairsWithoutValidation();
  });
});

// Toggle switch event listener
document.getElementById('toggle').addEventListener('change', function() {
  const isEnabled = this.checked;
  console.log('[AIV Popup] Toggle changed to:', isEnabled);
  
  // Save the toggle state
  chrome.storage.local.set({aivValidationEnabled: isEnabled}, function() {
    console.log('[AIV Popup] AIV Validation is ' + (isEnabled ? 'enabled' : 'disabled'));
  });
  
  // Update the status display
  updateStatus(isEnabled);
  
  // Send message to content script to enable/disable validation
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      console.log('[AIV Popup] Sending toggle message to tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleValidation',
        enabled: isEnabled
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error('[AIV Popup] Error sending message to content script:', chrome.runtime.lastError);
        } else {
          console.log('[AIV Popup] Response from content script:', response);
        }
      });
    }
  });
});

// Refresh validation results button - now triggers validation
document.getElementById('refreshResults').addEventListener('click', function() {
  triggerValidation();
});

// Clear validation results button
document.getElementById('clearResults').addEventListener('click', function() {
  clearValidationResults();
});

// Update status display
function updateStatus(isEnabled) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = isEnabled ? 'Validation is ON' : 'Validation is OFF';
  statusElement.className = isEnabled ? 'status active' : 'status inactive';
}

// Load conversation pairs from content script WITHOUT triggering validation
function loadConversationPairsWithoutValidation(retryCount = 0) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      console.log('[AIV Popup] Requesting conversation pairs from tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getConversationPairs'
      }, function(response) {
        console.log('[AIV Popup] Received response from content script:', response);
        if (chrome.runtime.lastError) {
          console.error('[AIV Popup] Error getting conversation pairs:', chrome.runtime.lastError);
          displayNoResults();
        } else if (response && response.success && response.pairs) {
          console.log('[AIV Popup] Received conversation pairs:', response.pairs);
          // Get validation results from background script
          chrome.runtime.sendMessage({
            action: 'getValidationResults'
          }, function(validationResponse) {
            console.log('[AIV Popup] Received validation results:', validationResponse);
            if (chrome.runtime.lastError) {
              console.error('[AIV Popup] Error getting validation results:', chrome.runtime.lastError);
              displayConversationPairs(response.pairs, []); // Display without validation
            } else if (validationResponse && validationResponse.success && validationResponse.results) {
              // If we have conversation pairs but no validation results, and this is a retry attempt
              if (response.pairs.length > 0 && validationResponse.results.length === 0 && retryCount < 3) {
                console.log(`[AIV Popup] No validation results yet, retrying in 1 second (attempt ${retryCount + 1})`);
                setTimeout(() => {
                  loadConversationPairsWithoutValidation(retryCount + 1);
                }, 1000);
                return;
              }
              displayConversationPairs(response.pairs, validationResponse.results);
            } else {
              displayConversationPairs(response.pairs, []); // Display without validation
            }
          });
        } else {
          console.log('[AIV Popup] No conversation pairs found');
          displayNoResults();
        }
      });
    }
  });
}

// Trigger validation of the latest response
function triggerValidation() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      console.log('[AIV Popup] Triggering validation for tab:', tabs[0].id);
      
      // Show loading state on the refresh button
      const refreshBtn = document.getElementById('refreshResults');
      const originalContent = refreshBtn.innerHTML;
      refreshBtn.innerHTML = '<span class="spinner"></span> Validating...';
      refreshBtn.disabled = true;
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'triggerValidation'
      }, function(response) {
        // Restore button state after validation
        setTimeout(() => {
          refreshBtn.innerHTML = originalContent;
          refreshBtn.disabled = false;
        }, 500);
        
        if (chrome.runtime.lastError) {
          console.error('[AIV Popup] Error triggering validation:', chrome.runtime.lastError);
          // Show error to user
          const container = document.getElementById('validation-result-container');
          container.innerHTML = `
            <div class="error-message">
              <strong>Error:</strong> ${chrome.runtime.lastError.message}
              <br><br>Please make sure:
              <ul>
                <li>The AIV System backend is running</li>
                <li>You're on a supported AI chat platform</li>
                <li>The extension is properly loaded</li>
              </ul>
            </div>
          `;
        } else {
          console.log('[AIV Popup] Validation triggered:', response);
          // Wait a moment for validation to complete, then load results
          setTimeout(() => {
            loadConversationPairsWithoutValidation();
          }, 3000); // Wait 3 seconds for validation to complete
        }
      });
    }
  });
}

// Display conversation pairs in the popup with validation results
function displayConversationPairs(pairs, validationResults) {
  const container = document.getElementById('validation-result-container');
  
  console.log('[AIV Popup] Displaying conversation pairs:', pairs);
  console.log('[AIV Popup] Validation results:', validationResults);
  
  if (!pairs || pairs.length === 0) {
    console.log('[AIV Popup] No pairs to display');
    displayNoResults();
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
  console.log('[AIV Popup] Final display pairs:', finalDisplayPairs);
  
  // Create HTML for conversation pairs
  let pairsHTML = '<div class="conversation-pairs">';
  
  finalDisplayPairs.forEach((pair, index) => {
    console.log(`[AIV Popup] Processing display pair ${index}:`, pair);
    
    // CRITICAL FIX: Skip pairs where question and response are identical
    if (pair.question && pair.response && pair.question.trim() === pair.response.trim()) {
      console.log(`[AIV Popup] Skipping pair ${index} - question and response are identical`);
      return; // Skip this pair
    }
    
    // CRITICAL FIX: Skip pairs that contain JavaScript code
    const questionContainsJS = pair.question && (
      pair.question.includes('window.') || pair.question.includes('function(') || 
      pair.question.includes('()=>') || pair.question.includes('document.') ||
      pair.question.includes('var ') || pair.question.includes('let ') || 
      pair.question.includes('const ') || pair.question.includes('return ')
    );
    
    const responseContainsJS = pair.response && (
      pair.response.includes('window.') || pair.response.includes('function(') || 
      pair.response.includes('()=>') || pair.response.includes('document.') ||
      pair.response.includes('var ') || pair.response.includes('let ') || 
      pair.response.includes('const ') || pair.response.includes('return ')
    );
    
    if (questionContainsJS || responseContainsJS) {
      console.log(`[AIV Popup] Skipping pair ${index} - contains JavaScript code`);
      return; // Skip this pair
    }
    
    // Check if response exists and log its properties
    if (pair.response) {
      console.log(`[AIV Popup] Pair ${index} response length:`, pair.response.length);
      console.log(`[AIV Popup] Pair ${index} response preview:`, pair.response.substring(0, 100));
    } else {
      console.log(`[AIV Popup] Pair ${index} has no response!`);
    }
    
    // Find validation result for this pair using improved matching logic
    let validationInfo = null;
    if (validationResults && validationResults.length > 0) {
      // Look for validation result matching this pair
      for (let i = validationResults.length - 1; i >= 0; i--) { // Start from the most recent
        const result = validationResults[i];
        console.log(`[AIV Popup] Checking validation result ${i}:`, result);
        
        if (result.role !== 'assistant') {
          console.log(`[AIV Popup] Skipping result ${i} - not assistant role`);
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
        
        console.log(`[AIV Popup] Comparing pair response: "${normalizedPairResponse.substring(0, 50)}..."`);
        console.log(`[AIV Popup] With result content: "${normalizedResultContent.substring(0, 50)}..."`);
        console.log(`[AIV Popup] Comparing pair question: "${normalizedPairQuestion.substring(0, 50)}..."`);
        console.log(`[AIV Popup] With result question: "${normalizedResultQuestion.substring(0, 50)}..."`);
        
        // Check for exact match first
        if (normalizedPairResponse === normalizedResultContent && 
            normalizedPairQuestion === normalizedResultQuestion) {
          console.log(`[AIV Popup] Found exact match for result ${i}`);
          validationInfo = result;
          break;
        }
        
        // Check if responses match (even if questions don't)
        if (normalizedPairResponse === normalizedResultContent) {
          console.log(`[AIV Popup] Found response match for result ${i}`);
          validationInfo = result;
          break;
        }
        
        // Check if one contains the other (for partial matches)
        if (normalizedPairResponse.includes(normalizedResultContent) || 
            normalizedResultContent.includes(normalizedPairResponse)) {
          console.log(`[AIV Popup] Found partial match for result ${i}`);
          validationInfo = result;
          break;
        }
        
        // Check for similarity (at least 80% similar)
        const similarity = calculateSimilarity(normalizedPairResponse, normalizedResultContent);
        console.log(`[AIV Popup] Similarity between pair and result ${i}:`, similarity);
        if (similarity > 0.8) {
          console.log(`[AIV Popup] Found similarity match for result ${i}`);
          validationInfo = result;
          break;
        }
      }
      
      // If still no match, use the most recent validation result
      if (!validationInfo && validationResults.length > 0) {
        console.log(`[AIV Popup] Using most recent validation result`);
        validationInfo = validationResults[validationResults.length - 1];
      }
      
      console.log(`[AIV Popup] Validation info for pair ${index}:`, validationInfo);
    }
    
    // Create the HTML for this conversation pair
    pairsHTML += `
      <div class="conversation-pair">
        <div class="question">
          <strong>Q:</strong> ${pair.question && pair.question !== 'Previous context' && pair.question.trim() !== '' ? escapeHtml(pair.question) : 'No question available'}
        </div>
        <div class="response">
          <strong>A:</strong> ${pair.response ? escapeHtml(pair.response) : 'No response yet'}
        </div>
    `;
    
    // Debug: Log the full response content
    console.log(`[AIV Popup] Full response content for pair ${index}:`, pair.response);
    console.log(`[AIV Popup] Response content length:`, pair.response ? pair.response.length : 0);
    
    // Debug: Check for special characters
    if (pair.response) {
      const specialChars = pair.response.match(/[\u0000-\u001F\u007F-\u009F]/g);
      if (specialChars) {
        console.log(`[AIV Popup] Found special characters in response:`, specialChars);
      }
      
      // Check if response contains any null characters
      if (pair.response.includes('\0')) {
        console.log(`[AIV Popup] Response contains null characters, which may cause truncation`);
      }
      
      // Log escaped version for comparison
      console.log(`[AIV Popup] Escaped response preview:`, escapeHtml(pair.response).substring(0, 100));
    }
    
    // Add validation information if available
    if (validationInfo && validationInfo.validation) {
      const validation = validationInfo.validation;
      console.log(`[AIV Popup] Validation object for pair ${index}:`, validation);
      const isValid = validation.isValid !== undefined ? validation.isValid : true;
      const confidence = validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) : 'N/A';
      
      // Determine confidence level for styling
      let confidenceClass = 'high-confidence';
      if (confidence !== 'N/A') {
        const confNum = parseFloat(confidence);
        if (confNum < 50) confidenceClass = 'low-confidence';
        else if (confNum < 80) confidenceClass = 'medium-confidence';
      }
      
      pairsHTML += `
        <div class="validation-info ${isValid ? 'valid' : 'invalid'}">
          <div class="validation-status">
            Validation: <strong>${isValid ? 'PASSED' : 'FAILED'}</strong>
            ${confidence !== 'N/A' ? ` (Confidence: ${confidence}%)` : ''}
          </div>
          
          <div class="confidence-meter">
            <div class="confidence-fill ${confidenceClass}" style="width: ${confidence !== 'N/A' ? confidence : '100'}%"></div>
          </div>
      `;
      
      // Add validation criteria with actual validator results
      if (validation.validators && Array.isArray(validation.validators)) {
        console.log(`[AIV Popup] Found ${validation.validators.length} validators:`, validation.validators);
        pairsHTML += `
          <div class="validation-criteria">
            <strong>Validation Criteria:</strong>
            <ul>
        `;
        
        // Sort validators to ensure consistent display order
        const sortedValidators = [...validation.validators].sort((a, b) => {
          const order = [
            'error_keywords',
            'response_length',
            'sensitive_keywords',
            'professional_claims',
            'personal_relationship_validation',
            'personal_characteristic_validation',
            'factual_accuracy'
          ];
          
          const indexA = order.indexOf(a.name);
          const indexB = order.indexOf(b.name);
          
          // If both are in our order list, sort by that order
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // If only one is in our order list, it comes first
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          
          // If neither is in our order list, sort alphabetically
          return a.name.localeCompare(b.name);
        });
        
        sortedValidators.forEach(validator => {
          const score = typeof validator.score === 'number' ? (validator.score * 100).toFixed(1) + '%' : 'N/A';
          pairsHTML += `<li>${validator.name.replace(/_/g, ' ')}: ${score} ${validator.pass ? 'Pass' : 'Fail'}</li>`;
        });
        
        pairsHTML += `
            </ul>
          </div>
        `;
      } else {
        console.log(`[AIV Popup] No validators array found, using fallback display`);
        // Fallback to generic criteria display
        pairsHTML += `
          <div class="validation-criteria">
            <strong>Validation Criteria:</strong>
            <ul>
              <li>Error Keywords: ${validation.errorKeywords !== undefined ? (typeof validation.errorKeywords === 'number' ? (validation.errorKeywords * 100).toFixed(1) + '%' : (validation.errorKeywords ? '✓ Pass' : '✗ Fail')) : (validation.error_keywords !== undefined ? (typeof validation.error_keywords === 'number' ? (validation.error_keywords * 100).toFixed(1) + '%' : (validation.error_keywords ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Response Length: ${validation.responseLength !== undefined ? (typeof validation.responseLength === 'number' ? (validation.responseLength * 100).toFixed(1) + '%' : (validation.responseLength ? '✓ Pass' : '✗ Fail')) : (validation.response_length !== undefined ? (typeof validation.response_length === 'number' ? (validation.response_length * 100).toFixed(1) + '%' : (validation.response_length ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Sensitive Keywords: ${validation.sensitiveKeywords !== undefined ? (typeof validation.sensitiveKeywords === 'number' ? (validation.sensitiveKeywords * 100).toFixed(1) + '%' : (validation.sensitiveKeywords ? '✓ Pass' : '✗ Fail')) : (validation.sensitive_keywords !== undefined ? (typeof validation.sensitive_keywords === 'number' ? (validation.sensitive_keywords * 100).toFixed(1) + '%' : (validation.sensitive_keywords ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Professional Claims: ${validation.professionalClaims !== undefined ? (typeof validation.professionalClaims === 'number' ? (validation.professionalClaims * 100).toFixed(1) + '%' : (validation.professionalClaims ? '✓ Pass' : '✗ Fail')) : (validation.professional_claims !== undefined ? (typeof validation.professional_claims === 'number' ? (validation.professional_claims * 100).toFixed(1) + '%' : (validation.professional_claims ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Personal Relationship: ${validation.personalRelationship !== undefined ? (typeof validation.personalRelationship === 'number' ? (validation.personalRelationship * 100).toFixed(1) + '%' : (validation.personalRelationship ? '✓ Pass' : '✗ Fail')) : (validation.personal_relationship !== undefined ? (typeof validation.personal_relationship === 'number' ? (validation.personal_relationship * 100).toFixed(1) + '%' : (validation.personal_relationship ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Personal Characteristic: ${validation.personalCharacteristic !== undefined ? (typeof validation.personalCharacteristic === 'number' ? (validation.personalCharacteristic * 100).toFixed(1) + '%' : (validation.personalCharacteristic ? '✓ Pass' : '✗ Fail')) : (validation.personal_characteristic !== undefined ? (typeof validation.personal_characteristic === 'number' ? (validation.personal_characteristic * 100).toFixed(1) + '%' : (validation.personal_characteristic ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
              <li>Factual Accuracy: ${validation.factualAccuracy !== undefined ? (typeof validation.factualAccuracy === 'number' ? (validation.factualAccuracy * 100).toFixed(1) + '%' : (validation.factualAccuracy ? '✓ Pass' : '✗ Fail')) : (validation.factual_accuracy !== undefined ? (typeof validation.factual_accuracy === 'number' ? (validation.factual_accuracy * 100).toFixed(1) + '%' : (validation.factual_accuracy ? '✓ Pass' : '✗ Fail')) : (validation.confidence !== undefined ? (validation.confidence * 100).toFixed(1) + '%' : 'N/A'))}</li>
            </ul>
          </div>
        `;
      }
      
      // Add reasons for validation pass/fail
      if (isValid) {
        // For passed validations, show positive reasons
        let reasons = [];
        if (validation.issues && validation.issues.length === 0) {
          reasons.push("Response is factually accurate");
        }
        if (validation.suggestions && validation.suggestions.length === 0) {
          reasons.push("No improvements suggested");
        }
        if (confidence !== 'N/A' && parseFloat(confidence) > 80) {
          reasons.push("High confidence score");
        }
        if (validation.reasons && Array.isArray(validation.reasons)) {
          reasons = reasons.concat(validation.reasons);
        }
        
        // Add reason based on confidence level
        if (confidence !== 'N/A') {
          const confNum = parseFloat(confidence);
          if (confNum > 90) {
            reasons.push("Very high accuracy");
          } else if (confNum > 70) {
            reasons.push("Good accuracy");
          } else if (confNum > 50) {
            reasons.push("Moderate accuracy");
          }
        }
        
        if (reasons.length > 0) {
          pairsHTML += `
            <div class="validation-reasons">
              Reasons: ${reasons.join(', ')}
            </div>
          `;
        } else {
          pairsHTML += `
            <div class="validation-reasons">
              Reasons: Response meets validation criteria
            </div>
          `;
        }
      } else {
        // Add issues if validation failed
        if (validation.issues && validation.issues.length > 0) {
          pairsHTML += `
            <div class="validation-issues">
              Issues: ${Array.isArray(validation.issues) ? validation.issues.join(', ') : JSON.stringify(validation.issues, null, 2)}
            </div>
          `;
        } else if (validation.issues) {
          // Handle case where issues is an object
          pairsHTML += `
            <div class="validation-issues">
              Issues: ${typeof validation.issues === 'object' ? JSON.stringify(validation.issues, null, 2) : validation.issues}
            </div>
          `;
        }
      }
      
      // Add suggestions if available
      if (validation.suggestions && validation.suggestions.length > 0) {
        pairsHTML += `
          <div class="validation-suggestions">
            Suggestions: ${Array.isArray(validation.suggestions) ? validation.suggestions.join(', ') : JSON.stringify(validation.suggestions)}
          </div>
        `;
      } else if (validation.suggestions) {
        // Handle case where suggestions is an object
        pairsHTML += `
          <div class="validation-suggestions">
            Suggestions: ${typeof validation.suggestions === 'object' ? JSON.stringify(validation.suggestions, null, 2) : validation.suggestions}
          </div>
        `;
      }
      
      pairsHTML += '</div>';
    } else if (pair.response) {
      // Only show pending validation if there's actually a response
      pairsHTML += `
        <div class="validation-info pending">
          <div class="validation-status">
            <span class="spinner"></span>
            Validation: In Progress
          </div>
          <div class="confidence-meter">
            <div class="confidence-fill" style="width: 0%"></div>
          </div>
          <div class="validation-criteria">
            <strong>Validation Criteria:</strong>
            <ul>
              <li>Factual Accuracy: Checking factual correctness of statements</li>
              <li>Source Reliability: Evaluating source credibility</li>
              <li>Logical Consistency: Checking logical coherence</li>
              <li>Completeness: Assessing response thoroughness</li>
            </ul>
          </div>
        </div>
      `;
    }
    
    pairsHTML += '</div>';
  });
  
  pairsHTML += '</div>';
  
  console.log('[AIV Popup] Generated HTML:', pairsHTML);
  
  container.innerHTML = pairsHTML;
}

// Simple similarity calculation
function calculateSimilarity(str1, str2) {
  // Handle edge cases
  if (!str1 && !str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(shorter, longer);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance calculation for string similarity
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

// Display no results message
function displayNoResults() {
  const container = document.getElementById('validation-result-container');
  container.innerHTML = `
    <div class="no-results">
      <svg viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17V16H9V14H11V13H9V11H11V7H13V11H15V13H13V14H15V16H13V17H11M15,9V7H9V9H15Z"/>
      </svg>
      <div>No conversations yet</div>
      <div style="font-size: 12px; margin-top: 5px;">Enable validation and interact with an AI chat</div>
    </div>
  `;
}

// Clear validation results
function clearValidationResults() {
  chrome.runtime.sendMessage({
    action: 'clearValidationResults'
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error('[AIV Popup] Error clearing validation results:', chrome.runtime.lastError);
    } else if (response && response.success) {
      displayNoResults();
    }
  });
}

// Add debugging for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('[AIV Popup] Storage changed:', changes, namespace);
  if (namespace === 'local' && changes.aivValidationEnabled) {
    document.getElementById('toggle').checked = changes.aivValidationEnabled.newValue;
    updateStatus(changes.aivValidationEnabled.newValue);
  }
});