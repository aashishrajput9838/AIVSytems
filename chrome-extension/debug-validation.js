// Debug script to help diagnose validation issues

console.log("=== AIV Systems Extension Debug Script ===");

// Check if the extension is properly loaded
console.log("1. Checking if content script is loaded...");
if (typeof window.aivContentScriptLoaded !== 'undefined') {
  console.log("   ✓ Content script is loaded");
} else {
  console.log("   ✗ Content script is NOT loaded");
}

// Check if validation is enabled
console.log("\n2. Checking validation status...");
chrome.storage.local.get(['aivValidationEnabled'], function(result) {
  const isEnabled = result.aivValidationEnabled || false;
  console.log(`   Validation enabled: ${isEnabled}`);
  
  // Check background script connection
  console.log("\n3. Testing background script connection...");
  chrome.runtime.sendMessage({
    action: 'testMessage',
    data: { message: 'Debug test' }
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.log("   ✗ Background script connection failed:", chrome.runtime.lastError.message);
    } else {
      console.log("   ✓ Background script connection successful");
      console.log("   Response:", response);
    }
    
    // Check if we can get validation results
    console.log("\n4. Testing validation results retrieval...");
    chrome.runtime.sendMessage({
      action: 'getValidationResults'
    }, function(validationResponse) {
      if (chrome.runtime.lastError) {
        console.log("   ✗ Failed to retrieve validation results:", chrome.runtime.lastError.message);
      } else {
        console.log("   ✓ Successfully retrieved validation results");
        if (validationResponse.success && validationResponse.results) {
          console.log(`   Number of validation results: ${validationResponse.results.length}`);
          if (validationResponse.results.length > 0) {
            console.log("   Latest validation result:");
            console.log("   - Content:", validationResponse.results[validationResponse.results.length - 1].content.substring(0, 50) + "...");
            console.log("   - Valid:", validationResponse.results[validationResponse.results.length - 1].validation?.isValid);
          }
        } else {
          console.log("   No validation results found");
        }
      }
      
      // Check content script communication
      console.log("\n5. Testing content script communication...");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'getConversationPairs'
          }, function(response) {
            if (chrome.runtime.lastError) {
              console.log("   ✗ Content script communication failed:", chrome.runtime.lastError.message);
            } else {
              console.log("   ✓ Content script communication successful");
              if (response.success && response.pairs) {
                console.log(`   Number of conversation pairs: ${response.pairs.length}`);
                if (response.pairs.length > 0) {
                  console.log("   Latest conversation pair:");
                  console.log("   - Question:", response.pairs[response.pairs.length - 1].question);
                  console.log("   - Response:", response.pairs[response.pairs.length - 1].response.substring(0, 50) + "...");
                }
              } else {
                console.log("   No conversation pairs found");
              }
            }
            
            console.log("\n=== Debug Script Complete ===");
            console.log("\nNext steps:");
            console.log("1. If validation results are missing, make sure you've interacted with an AI chat");
            console.log("2. If conversation pairs are missing, make sure validation is enabled");
            console.log("3. Check the browser console for any error messages");
            console.log("4. Make sure the Firebase emulator is running (firebase emulators:start)");
          });
        } else {
          console.log("   ✗ No active tab found");
          console.log("\n=== Debug Script Complete ===");
        }
      });
    });
  });
});