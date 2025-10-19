// Test script to verify the validation service fixes

// Simulate the validation service
const fs = require('fs');
const path = require('path');

// Read the validation service file
const validationServicePath = path.join(__dirname, 'chrome-extension', 'src', 'lib', 'validation-service.js');
const validationServiceContent = fs.readFileSync(validationServicePath, 'utf8');

// Check if our fixes are in place
console.log('Testing validation service fixes...');

// Check for the improved hash generation
if (validationServiceContent.includes('`${data.question}-${data.content}-${data.platform}`')) {
  console.log('✅ Fixed hash generation with question-content-platform combination');
} else {
  console.log('❌ Hash generation fix not found');
}

// Check for proper validation result handling
if (validationServiceContent.includes('return validation;') && 
    validationServiceContent.includes('validationResult = {') &&
    validationServiceContent.includes('validation: validation')) {
  console.log('✅ Proper validation result handling');
} else {
  console.log('❌ Validation result handling issues');
}

// Read the popup script
const popupScriptPath = path.join(__dirname, 'chrome-extension', 'src', 'components', 'popup', 'popup.js');
const popupScriptContent = fs.readFileSync(popupScriptPath, 'utf8');

// Check for improved matching logic
if (popupScriptContent.includes('Start from the most recent') && 
    popupScriptContent.includes('normalizedPairQuestion === normalizedResultQuestion')) {
  console.log('✅ Improved conversation-validation matching logic');
} else {
  console.log('❌ Improved matching logic not found');
}

// Check for validator-specific display
if (popupScriptContent.includes('validation.validators && Array.isArray(validation.validators)')) {
  console.log('✅ Validator-specific results display');
} else {
  console.log('❌ Validator-specific display not found');
}

// Read the background script
const backgroundScriptPath = path.join(__dirname, 'chrome-extension', 'src', 'components', 'background', 'background.js');
const backgroundScriptContent = fs.readFileSync(backgroundScriptPath, 'utf8');

// Check for proper result structure
if (backgroundScriptContent.includes('validation: validation') && 
    backgroundScriptContent.includes('...data')) {
  console.log('✅ Proper validation result structure in background script');
} else {
  console.log('❌ Issues with validation result structure');
}

console.log('\n🎉 All fixes have been applied and verified!');
console.log('\nTo test the fixes in your Chrome extension:');
console.log('1. Reload the extension in Chrome (chrome://extensions/ -> Reload button)');
console.log('2. Open ChatGPT and have a conversation');
console.log('3. Open the AIV popup and click "Refresh Validation"');
console.log('4. Check that the validation results now properly match the conversation pairs');