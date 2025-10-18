# Immediate Troubleshooting Guide for Validation Issues

This guide provides immediate steps to resolve the "Validation: Pending" issue you're experiencing.

## Quick Fix Steps

### Step 1: Restart the Extension
1. Go to `chrome://extensions`
2. Find "AIV Systems Validator"
3. Click the reload button (circular arrow)
4. Toggle the extension OFF and then ON again
5. Refresh your ChatGPT page

### Step 2: Verify Firebase Emulator is Running
1. Open a terminal/command prompt
2. Navigate to your Firebase project directory
3. Run: `firebase emulators:start`
4. Wait for the message "All emulators ready"

### Step 3: Test the Validation Endpoint
1. Run the test script: `node test-validation-endpoint.js`
2. Check if it shows "Validation successful!"

### Step 4: Check Browser Console
1. Open ChatGPT
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Ask a question and get a response
5. Look for these specific log messages:
   - `AIV Systems Content Script loaded`
   - `processMessage called with element`
   - `addToConversationPairs called with`
   - `Triggering validation for assistant response`

## What Should Happen

When everything is working correctly, you should see this sequence in the browser console:

```
AIV Systems Content Script loaded
processMessage called with element: [div.element]
Extracted message data: {role: "user", content: "what is rat ?", ...}
addToConversationPairs called with: {role: "user", content: "what is rat ?", ...}
Processing user message
Added new question pair: {question: "what is rat ?", response: "", ...}

// After getting the response:
processMessage called with element: [div.element]
Extracted message data: {role: "assistant", content: "Rats are small mammals...", ...}
addToConversationPairs called with: {role: "assistant", content: "Rats are small mammals...", ...}
Processing assistant message
Last pair: {question: "what is rat ?", response: "", ...}
New response: Rats are small mammals...
Condition check - lastPair.response: 
Condition check - messageData.content: Rats are small mammals...
Condition check - isValidationEnabled: true
Adding response to last pair
Triggering validation for completed pair
triggerValidationForPair called with pair: {question: "what is rat ?", response: "Rats are small mammals...", ...}
Triggering validation for assistant response: Rats are small mammals...
Full message data: {role: "assistant", content: "Rats are small mammals...", ...}

// In background script console:
Received message: {action: "captureInteraction", data: {...}}
Processing captureInteraction request
Calling validateInteraction
validateInteraction called with data: {role: "assistant", content: "Rats are small mammals...", ...}
Sending validation request to: http://127.0.0.1:5004/...
Validation API response status: 200
Validation API response: {success: true, validation: {...}}
Validation result: {id: ..., role: "assistant", content: "Rats are small mammals...", validation: {...}, ...}
```

## Common Issues and Solutions

### Issue 1: Content Script Not Loading
**Symptoms:** No "AIV Systems Content Script loaded" message
**Solution:** 
1. Reload the extension
2. Refresh the ChatGPT page
3. Check that the URL matches supported platforms

### Issue 2: Validation Not Enabled
**Symptoms:** "Validation not enabled, skipping validation trigger"
**Solution:**
1. Toggle the extension OFF/ON
2. Check that the switch in the popup is ON

### Issue 3: Firebase Emulator Not Running
**Symptoms:** Network errors in background script
**Solution:**
1. Run `firebase emulators:start`
2. Wait for "All emulators ready"

### Issue 4: Network/Firewall Issues
**Symptoms:** Connection timeouts or errors
**Solution:**
1. Check firewall settings
2. Ensure port 5004 is not blocked
3. Try accessing `http://127.0.0.1:5004` directly in browser

## Quick Verification Commands

### Test Firebase Connection
```bash
# Test if emulator is accessible
curl -X GET http://127.0.0.1:5004/

# Test validation endpoint
curl -X POST http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse \
  -H "Content-Type: application/json" \
  -d '{"role":"assistant","content":"Test response","timestamp":"2025-01-01T00:00:00Z","url":"https://chat.openai.com","platform":"chatgpt"}'
```

### Check Extension Storage
```javascript
// In background script console
chrome.storage.local.get(['aivValidationEnabled'], console.log)
```

## If Problems Persist

1. **Clear browser cache** and reload extension
2. **Check for JavaScript errors** in both content script and background script consoles
3. **Verify file integrity** - ensure all extension files are present and not corrupted
4. **Try a different AI platform** (Gemini, Claude) to see if the issue is platform-specific

## Emergency Reset

If nothing else works:

1. Uninstall the extension completely
2. Close all browser windows
3. Restart your computer
4. Reinstall the extension from scratch
5. Ensure Firebase emulator is running
6. Test with a simple question

The validation should no longer show as "Pending" once these issues are resolved.