# Troubleshooting Validation Process Issues

This guide helps diagnose and resolve issues where the validation process is not being triggered or completed.

## Common Symptoms

1. **No "Triggering validation" logs** in the browser console
2. **Validation shows as "Pending"** in the popup
3. **No "captureInteraction" messages** in the background script
4. **Conversation pairs appear** but no validation occurs

## Diagnostic Steps

### Step 1: Check Content Script Loading

1. Open the AI chat platform (ChatGPT, Gemini, etc.)
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Look for:
   ```
   AIV Systems Content Script loaded
   ```
   If you don't see this, the content script is not loading properly.

### Step 2: Verify Validation is Enabled

1. Click the AIV Systems extension icon
2. Ensure the toggle switch is ON
3. Check the console for:
   ```
   AIV Validation is enabled
   ```

### Step 3: Monitor Message Processing

1. In the browser console, look for these log messages:
   - `processMessage called with element`
   - `Extracted message data`
   - `addToConversationPairs called with`
   - `Triggering validation for assistant response`

2. If you see `processMessage` but not `Triggering validation`, the issue is in the conversation pairing logic.

### Step 4: Check Conversation Pairing

1. Look for these specific logs:
   - `Processing user message`
   - `Processing assistant message`
   - `Adding response to last pair`
   - `Triggering validation for completed pair`

2. If you see `Skipping response addition - conditions not met`, check the reasons:
   - `Last pair already has a response`
   - `New message has no content`

### Step 5: Verify Background Script Communication

1. In the background script console (chrome://extensions → inspect views), look for:
   - `Received message: Object` with `action: "captureInteraction"`
   - `Processing captureInteraction request`
   - `Calling validateInteraction`

2. If you don't see these messages, the content script is not sending validation requests.

## Common Issues and Solutions

### Issue 1: Content Script Not Detecting Messages

**Symptoms:**
- No `processMessage` logs
- Conversation pairs don't appear

**Solutions:**
1. Refresh the AI chat page
2. Reload the extension in `chrome://extensions`
3. Check that the URL matches supported platforms in manifest.json
4. Verify DOM selectors in `checkForNewMessages` function

### Issue 2: Validation Not Enabled

**Symptoms:**
- Messages are processed but validation is not triggered
- `Validation not enabled, skipping validation trigger` in logs

**Solutions:**
1. Toggle the extension OFF and ON again
2. Check `chrome.storage.local` for `aivValidationEnabled` value
3. Verify the toggle switch state in the popup

### Issue 3: Conversation Pairing Issues

**Symptoms:**
- `Skipping response addition - conditions not met`
- `Last pair already has a response`

**Solutions:**
1. Check if the conversationPairs array is being properly managed
2. Verify that responses are only added to pairs without existing responses
3. Ensure the timing of user and assistant messages is correct

### Issue 4: Network/API Issues

**Symptoms:**
- Validation requests are sent but fail
- `Error in validateInteraction` in background script
- Validation shows as "Pending" with no results

**Solutions:**
1. Ensure Firebase emulator is running (`firebase emulators:start`)
2. Check network connectivity to `http://127.0.0.1:5004`
3. Verify the API endpoint URL in background.js
4. Check Firebase logs for errors

## Debugging Commands

### Check Extension Storage
```javascript
// In the background script console
chrome.storage.local.get(['aivValidationEnabled'], function(result) {
  console.log('Validation enabled:', result.aivValidationEnabled);
});
```

### Test Direct Validation
```javascript
// In the background script console
validateInteraction({
  role: 'assistant',
  content: 'The Taj Mahal is a famous monument in India.',
  timestamp: new Date().toISOString(),
  url: 'https://chat.openai.com',
  platform: 'chatgpt'
}).then(result => console.log('Validation result:', result));
```

### Check Conversation Pairs
```javascript
// In the content script context (on an AI chat page)
console.log('Current conversation pairs:', conversationPairs);
```

## Advanced Debugging

### Add Breakpoints
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Inspect views" for the background script
4. Go to Sources tab
5. Add breakpoints in:
   - `validateInteraction` function
   - Message listener
   - Any function handling validation

### Monitor Network Requests
1. In Developer Tools, go to Network tab
2. Look for requests to `localhost:5004`
3. Check request/response details for errors

## When Validation Process Works Correctly

You should see this sequence in the logs:

1. **Content Script:**
   ```
   processMessage called with element: [div.element]
   Extracted message data: {role: "user", content: "what is tajmaahl ?", ...}
   addToConversationPairs called with: {role: "user", content: "what is tajmaahl ?", ...}
   Processing user message
   Added new question pair: {question: "what is tajmaahl ?", response: "", ...}
   ```

2. **Content Script (after assistant response):**
   ```
   processMessage called with element: [div.element]
   Extracted message data: {role: "assistant", content: "The Taj Mahal is a famous monument...", ...}
   addToConversationPairs called with: {role: "assistant", content: "The Taj Mahal is a famous monument...", ...}
   Processing assistant message
   Last pair: {question: "what is tajmaahl ?", response: "", ...}
   Adding response to last pair
   Triggering validation for completed pair
   triggerValidationForPair called with pair: {question: "what is tajmaahl ?", response: "The Taj Mahal is a famous monument...", ...}
   Triggering validation for assistant response: The Taj Mahal is a famous monument...
   ```

3. **Background Script:**
   ```
   Received message: {action: "captureInteraction", data: {…}}
   Processing captureInteraction request
   Calling validateInteraction
   validateInteraction called with data: {role: "assistant", content: "The Taj Mahal is a famous monument...", ...}
   Sending validation request to: http://127.0.0.1:5004/...
   Validation API response: {success: true, validation: {…}}
   Validation result: {id: ..., role: "assistant", content: "The Taj Mahal is a famous monument...", validation: {…}, ...}
   ```

4. **Content Script (response):**
   ```
   Background validation response: {success: true, result: {…}}
   ```

If you don't see this sequence, follow the diagnostic steps above to identify where the process is breaking down.