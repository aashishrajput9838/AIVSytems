# AIV Systems Chrome Extension - Testing Guide

This guide provides instructions for testing the AIV Systems Chrome Extension, particularly focusing on the duplicate prevention and validation display features.

## Prerequisites

1. AIV Systems Chrome Extension installed and loaded in Chrome
2. AIV System backend running (Firebase Emulator or deployed functions)
3. Access to AI chat platforms (ChatGPT, Gemini, etc.)

## Test 1: Basic Functionality

1. Enable the extension by toggling the switch in the popup
2. Navigate to ChatGPT (chat.openai.com) or another supported platform
3. Ask a question: "What is the Taj Mahal?"
4. Wait for the response
5. Open the extension popup and verify:
   - The question-response pair appears in the "Recent Conversations" section
   - Only one instance of the conversation appears
   - Validation status is displayed (may show "Pending" initially)

## Test 2: Validation Display

1. Ensure the AIV System backend is running
2. Ask a question and wait for the response
3. Open the extension popup and verify:
   - Validation status changes from "Pending" to "PASSED" or "FAILED"
   - Confidence score is displayed as a percentage
   - Valid responses show green styling
   - Invalid responses show red styling with issues and suggestions
   - Pending validations show yellow styling

## Test 3: Duplicate Prevention

1. With the extension still enabled, ask the same question again: "What is the Taj Mahal?"
2. Wait for the response
3. Open the extension popup and verify:
   - No additional conversation pairs are added
   - Still only shows one instance of the "Taj Mahal" question
   - The duplicate note at the bottom confirms filtering is active

## Test 4: Unique Conversations

1. Ask a different question: "What is the capital of France?"
2. Wait for the response
3. Open the extension popup and verify:
   - Both the "Taj Mahal" and "France" conversations appear
   - Total of 2 unique conversation pairs displayed
   - Each pair shows appropriate validation information

## Test 5: Multiple Duplicates

1. Ask the "Taj Mahal" question 3-5 more times
2. Wait for responses each time
3. Open the extension popup and verify:
   - Still only shows 2 conversation pairs (Taj Mahal and France)
   - No additional duplicates appear despite multiple submissions
   - Validation information remains consistent

## Test 6: Clear Functionality

1. Click the "Clear" button in the extension popup
2. Verify:
   - All conversation pairs are removed
   - "No conversations yet" message appears
   - Ask a new question and verify it appears correctly with validation

## Test 7: Validation Trigger

1. Ensure you have at least one conversation pair
2. Click "Validate Latest Response"
3. Verify:
   - Validation is triggered for the latest response
   - Results appear in the AIV System backend
   - Popup refreshes to show updated validation information

## Test 8: Extension Toggle

1. Toggle the extension OFF
2. Ask a new question
3. Verify:
   - No new conversation pairs are captured
   - Toggle back ON and verify normal functionality resumes

## Expected Behavior Summary

- **Duplicate Questions**: Only one instance of each unique question should appear
- **Duplicate Pairs**: Only unique question-response pairs should be stored and displayed
- **Validation Display**: Each conversation pair should show validation status with appropriate styling
- **Memory Management**: Extension should maintain only the last 10 conversation pairs
- **Real-time Processing**: New conversations should appear immediately after being processed
- **UI Updates**: Popup should refresh automatically when new conversations are captured

## Validation Display Specific Tests

### Valid Responses
1. Ask a well-structured question with a comprehensive answer
2. Verify:
   - Validation status shows "PASSED"
   - Green styling is applied
   - High confidence score is displayed
   - Suggestions may be shown for further improvement

### Invalid Responses
1. Ask a question that might elicit an incomplete or inaccurate response
2. Verify:
   - Validation status shows "FAILED"
   - Red styling is applied
   - Lower confidence score is displayed
   - Specific issues are listed
   - Actionable suggestions are provided

### Pending Validations
1. Ask a question and immediately open the popup before validation completes
2. Verify:
   - Validation status shows "Pending"
   - Yellow styling is applied
   - Status updates to final result when validation completes

### No Validation Results
1. Test with AIV System backend offline
2. Verify:
   - Conversation pairs still display
   - Validation status shows "Pending"
   - No errors in UI

## Troubleshooting

### If duplicates still appear:
1. Check browser console for errors (Ctrl+Shift+J)
2. Verify extension is fully reloaded after code changes
3. Clear browser cache and reload extension
4. Check that content.js is not being loaded multiple times

### If no conversations appear:
1. Ensure validation is enabled in the popup
2. Verify you're on a supported AI platform
3. Check that the content script is loaded (look for console logs)
4. Verify the AIV System backend is accessible

### If validation fails:
1. Ensure Firebase Emulator is running or functions are deployed
2. Check network connectivity to the validation endpoint
3. Verify API endpoint configuration in background.js

### If validation display is not working:
1. Check that popup.js is correctly retrieving validation results
2. Verify background.js is properly storing validation results
3. Ensure content.js is sending validation requests
4. Check browser console for JavaScript errors

## Test Files

This directory includes test files to help with verification:

- `test-duplicate-prevention.html`: Simulated chat interface for testing
- `test-duplicate-logic.js`: Standalone test of duplicate prevention logic
- `test-validation-display.html`: Simulated interface for validation display testing
- `test-validation-logic.js`: Standalone test of validation matching logic

## Manual Testing on Real Platforms

1. **ChatGPT**: Test with various question types (factual, creative, technical)
2. **Google Gemini**: Verify compatibility with different response formats
3. **Groq**: Test with fast response scenarios
4. **Claude**: Check handling of longer, more detailed responses
5. **Copilot**: Verify functionality with Microsoft's AI platform

## Performance Considerations

- Extension should not significantly impact browser performance
- DOM observation should be efficient and not cause page lag
- Memory usage should remain stable even after extended use
- Network requests should not block UI interactions
- Validation display should not cause UI freezing

## Edge Cases to Test

1. Very short questions/responses
2. Very long questions/responses
3. Questions with special characters
4. Responses with code blocks or formatted text
5. Rapid question submission
6. Page refreshes during conversation
7. Multiple tabs with different AI platforms
8. Network connectivity issues during validation
9. AIV System backend offline
10. Mixed valid/invalid/pending validations