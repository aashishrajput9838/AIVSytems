// verify-fixes.js - Script to verify that all fixes have been implemented correctly

console.log('=== AIV Systems Extension - Fix Verification ===');

// Check 1: No dynamic imports in background script
console.log('\n1. Checking for dynamic imports in background script...');
fetch(chrome.runtime.getURL('background.js'))
  .then(response => response.text())
  .then(content => {
    const hasDynamicImports = content.includes('import(');
    console.log('Dynamic imports found:', hasDynamicImports);
    if (!hasDynamicImports) {
      console.log('✅ PASS: No dynamic imports found in background script');
    } else {
      console.log('❌ FAIL: Dynamic imports still present in background script');
    }
  })
  .catch(error => {
    console.log('Error checking background script:', error);
  });

// Check 2: Validation service functionality
console.log('\n2. Testing validation service functionality...');
const testData = {
  role: 'assistant',
  content: 'This is a test message to verify validation service.',
  timestamp: new Date().toISOString(),
  url: 'https://test.example.com',
  platform: 'test'
};

// Simulate sending to background script
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: testData
}, function(response) {
  console.log('Validation response received:', response);
  if (response && response.success) {
    console.log('✅ PASS: Validation service is working');
  } else {
    console.log('❌ FAIL: Validation service not responding correctly');
  }
});

// Check 3: Content deduplication
console.log('\n3. Testing content deduplication...');
const duplicateData = {
  role: 'assistant',
  content: 'Duplicate test message',
  timestamp: new Date().toISOString(),
  url: 'https://test.example.com',
  platform: 'test'
};

// Send the same message twice
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: duplicateData
}, function(response1) {
  console.log('First validation response:', response1);
  
  // Send the same data again
  chrome.runtime.sendMessage({
    action: 'captureInteraction',
    data: duplicateData
  }, function(response2) {
    console.log('Second validation response:', response2);
    
    // Check if deduplication worked
    if (response1.result && response2.result) {
      if (response2.result.duplicate) {
        console.log('✅ PASS: Content deduplication is working');
      } else {
        console.log('⚠️  WARNING: Content deduplication may not be working properly');
      }
    }
  });
});

// Check 4: Debug window removal
console.log('\n4. Checking for debug window elements...');
// This would need to be run on an AI chat page
// For now, we'll just check if the debug helper has been simplified
fetch(chrome.runtime.getURL('debug-helper.js'))
  .then(response => response.text())
  .then(content => {
    const hasDebugPanel = content.includes('AIVDebugPanel') && content.includes('createDebugPanel');
    console.log('Debug panel code found:', hasDebugPanel);
    if (!hasDebugPanel) {
      console.log('✅ PASS: Debug panel code has been removed');
    } else {
      console.log('❌ FAIL: Debug panel code still present');
    }
  })
  .catch(error => {
    console.log('Error checking debug helper:', error);
  });

console.log('\n=== Verification Complete ===');
console.log('Please check the console output for detailed results.');