// background.js - Background script for AIV Systems Chrome Extension

// Import the validation service
importScripts('validation-service.js');

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  console.log('Sender:', sender);
  
  if (request.action === 'captureInteraction') {
    console.log('Processing captureInteraction request');
    console.log('Request data:', request.data);
    
    // Validate the interaction
    validateInteraction(request.data)
      .then(result => {
        console.log('Validation completed:', result);
        sendResponse({ success: true, result: result });
      })
      .catch(error => {
        console.error('Validation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep message channel open for async response
  } 
  else if (request.action === 'getValidationResults') {
    console.log('getValidationResults request received');
    console.log('Current validation results count:', aivValidationService.validationResults.length);
    console.log('Current validation results:', aivValidationService.validationResults);
    
    sendResponse({
      success: true,
      results: aivValidationService.validationResults
    });
    return true;
  }
  else if (request.action === 'clearValidationResults') {
    aivValidationService.validationResults = [];
    aivValidationService.processedContentHashes.clear();
    sendResponse({ success: true });
    return true;
  }
});

// Validate an interaction with the AIV System
async function validateInteraction(data) {
  console.log('Calling validateInteraction');
  console.log('validateInteraction called with data:', data);
  
  // CRITICAL FIX: Prevent processing if question and response are identical
  if (data.question && data.content && data.question.trim() === data.content.trim()) {
    console.log('Skipping validation - question and response are identical');
    return {
      validation: {
        isValid: false,
        confidence: 0,
        issues: ['Question and response are identical'],
        suggestions: ['This appears to be a processing error'],
        error: 'Identical question and response'
      },
      validatedAt: new Date().toISOString(),
      error: true
    };
  }
  
  try {
    // Validate the response using the AIV System
    const result = await aivValidationService.validateResponse(data);
    console.log('Validation result:', result);
    
    // Add to validation results array
    aivValidationService.validationResults.push({
      ...data,
      validation: result,
      validatedAt: new Date().toISOString()
    });
    
    // Keep only the last 10 results
    if (aivValidationService.validationResults.length > 10) {
      aivValidationService.validationResults = aivValidationService.validationResults.slice(-10);
    }
    
    console.log('Added validation result to results array');
    return result;
  } catch (error) {
    console.error('Error validating interaction:', error);
    throw error;
  }
}

// Listen for tab updates to detect when user visits supported platforms
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedPlatforms = [
      'https://chat.openai.com',
      'https://chatgpt.com',
      'https://gemini.google.com',
      'https://groq.com',
      'https://claude.ai',
      'https://copilot.microsoft.com'
    ];
    
    const isSupported = supportedPlatforms.some(platform => 
      tab.url.startsWith(platform)
    );
    
    if (isSupported) {
      console.log('Tab with supported platform loaded:', tab.url);
    }
  }
});

console.log('AIV Systems Background Script loaded');

// Add listener for when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('AIV Systems Chrome Extension installed');
  // Set default values
  chrome.storage.local.set({aivValidationEnabled: true});
});