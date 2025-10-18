# Troubleshooting Validation Issues in AIV Systems Extension

This guide helps diagnose and resolve issues where validation shows as "Pending" instead of completing with PASSED/FAILED status.

## Common Causes and Solutions

### 1. Firebase Emulator Not Running

**Symptoms:**
- Validation shows as "Pending" indefinitely
- No errors in the popup UI
- Browser console shows network errors

**Solution:**
1. Open a terminal in your Firebase project directory
2. Run: `firebase emulators:start`
3. Wait for the message "All emulators ready"
4. Try using the extension again

**Verification:**
- The emulator should be accessible at `http://127.0.0.1:5004`
- You can test with the provided test script: `node test-firebase-connection.js`

### 2. Network/Firewall Issues

**Symptoms:**
- Validation shows as "Pending" 
- Browser console shows network timeout errors
- Test script shows connection failures

**Solution:**
1. Check your firewall settings
2. Ensure port 5004 is not blocked
3. Try accessing `http://127.0.0.1:5004` directly in your browser
4. If using a corporate network, contact your IT department

### 3. Content Matching Issues

**Symptoms:**
- Conversation pairs are displayed but validation shows "Pending"
- Validation results exist in the background but aren't matched
- Test matching script shows mismatches

**Solution:**
1. Check for whitespace differences between conversation responses and validation content
2. Verify that the content script is capturing the exact response text
3. Look for encoding issues or special characters

### 4. Extension Not Properly Loaded

**Symptoms:**
- No conversation pairs appear
- Console shows "Extension context invalidated" errors
- Debug script shows connection failures

**Solution:**
1. Reload the extension in `chrome://extensions`
2. Ensure "Developer mode" is enabled
3. Check that all required files are present
4. Look for errors in the extension's background page console

## Diagnostic Steps

### Step 1: Check Browser Console

1. Open the AI chat platform (ChatGPT, Gemini, etc.)
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Look for any error messages related to:
   - Content script loading
   - Network requests to the validation endpoint
   - Message passing between content script and background script

### Step 2: Run Debug Script

1. Open the debug page: `debug-validation.html`
2. Click "Run Debug"
3. Check the results for:
   - Content script loading status
   - Background script connection
   - Conversation pairs retrieval
   - Validation results retrieval

### Step 3: Test Firebase Connection

1. Run: `node test-firebase-connection.js`
2. Check if the connection is successful
3. Verify that the validation endpoint responds correctly

### Step 4: Check Extension Storage

1. Go to `chrome://extensions`
2. Find the AIV Systems extension
3. Click "Inspect views" for the background page
4. In the console, run:
   ```javascript
   chrome.storage.local.get(['aivValidationEnabled'], console.log)
   ```
5. Verify that validation is enabled

## Manual Testing

### Test Validation Endpoint Directly

Use this curl command to test the validation endpoint:

```bash
curl -X POST http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse \
  -H "Content-Type: application/json" \
  -d '{
    "role": "assistant",
    "content": "The Taj Mahal is a famous monument in India.",
    "timestamp": "2025-10-17T10:00:00Z",
    "url": "https://chat.openai.com",
    "platform": "chatgpt"
  }'
```

### Test Conversation Pair Matching

Create a simple HTML file with this JavaScript to test matching:

```javascript
// Simulate conversation pair and validation result
const pair = {
  question: "what is tajmaahl ?",
  response: "The Taj Mahal is a famous monument in India, located in Agra."
};

const validationResult = {
  role: "assistant",
  content: "The Taj Mahal is a famous monument in India, located in Agra.",
  validation: {
    isValid: true,
    confidence: 0.95
  }
};

// Test matching logic
const match = validationResult.content === pair.response && validationResult.role === 'assistant';
console.log("Match result:", match);
```

## Advanced Debugging

### Enable Verbose Logging

Add this to your content script to get more detailed logs:

```javascript
// Add at the beginning of content.js
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log('[AIV Debug]', message, data || '');
  }
}

// Use throughout the code
debugLog('Processing message', messageData);
```

### Check Message Passing

In the background script, add logging to see if messages are received:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Received message:', request);
  // ... existing code
});
```

## Common Error Messages and Solutions

### "Extension context invalidated"

**Cause:** Extension was reloaded or updated while the content script was running

**Solution:** Refresh the AI chat page

### "Could not establish connection. Receiving end does not exist."

**Cause:** Background script is not listening for messages

**Solution:** 
1. Reload the extension
2. Check for JavaScript errors in the background page
3. Verify the message listener is properly registered

### "NetworkError when attempting to fetch resource"

**Cause:** Unable to connect to Firebase emulator

**Solution:**
1. Ensure Firebase emulator is running
2. Check network/firewall settings
3. Verify the API endpoint URL is correct

## Prevention Tips

1. **Always start the Firebase emulator** before using the extension
2. **Check the browser console** regularly for errors
3. **Reload the extension** after making code changes
4. **Refresh AI chat pages** after enabling validation
5. **Use the debug tools** to verify functionality

## When to Contact Support

If you've tried all the above steps and are still experiencing issues:

1. Save the browser console output
2. Include the output from the debug script
3. Note which AI platform you're using
4. Describe the exact steps you took
5. Contact the development team with this information