# Content Script Debugging Guide

## Common Issues and Solutions

### 1. Content Script Not Loading

**Symptoms**:
- "Error sending message to content script" in popup
- Content script functions not available in web pages
- No messages being captured from AI chats

**Solutions**:

1. **Check Manifest Configuration**:
   - Ensure content scripts are properly declared in manifest.json
   - Verify the matches patterns are correct for target websites
   - Confirm all required JavaScript files are listed

2. **Verify File Paths**:
   - Make sure all content script files exist in the extension directory
   - Check that file names match exactly (case-sensitive)
   - Ensure no missing dependencies

3. **Check Console for Errors**:
   - Open Developer Tools on the target website (F12)
   - Look for JavaScript errors in the Console tab
   - Check if content scripts are being blocked by CSP

### 2. Content Script Loading but Not Communicating

**Symptoms**:
- Content script loads but messages aren't received by background script
- "Could not establish connection" errors
- Functions work but no data is sent/received

**Solutions**:

1. **Verify Message Listeners**:
   - Ensure `chrome.runtime.onMessage.addListener` is properly set up
   - Check that `sendResponse` is called appropriately
   - Make sure `return true` is used for async responses

2. **Check Permissions**:
   - Ensure "tabs" permission is included in manifest.json
   - Verify host permissions match target websites
   - Confirm activeTab permission is declared if needed

3. **Debug Message Passing**:
   - Add console.log statements in message handlers
   - Verify message formats match between sender and receiver
   - Test with simple messages before complex data

## Debugging Steps

### Step 1: Verify Extension Installation
1. Go to `chrome://extensions`
2. Ensure the extension is enabled
3. Check that all files are present in the extension directory
4. Look for any error messages in the extension details

### Step 2: Check Content Script Injection
1. Navigate to a supported AI chat platform
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Type `window.aivContentScriptLoaded` and press Enter
5. If it returns `true`, the content script is loaded
6. If it returns `undefined`, the content script is not loaded

### Step 3: Test Message Passing
1. In the website's console, run:
   ```javascript
   chrome.runtime.sendMessage({
     action: 'testMessage',
     data: 'Hello from test'
   }, (response) => {
     console.log('Response:', response);
   });
   ```
2. Check the background script console for the received message
3. Verify that a response is sent back

### Step 4: Check for Errors
1. In the website's console, look for any error messages
2. Check the background script console for errors
3. Look for CSP (Content Security Policy) violations
4. Check for JavaScript syntax errors

## Testing with Test Page

1. Load the `test-content-script.html` file in Chrome
2. Open Developer Tools (F12)
3. Check the Console tab for messages:
   - "Content script is loaded" or "Content script is NOT loaded"
   - "Response from extension:" with test data
4. Check the background script console for:
   - "Test message received:" with the test data

## Common Fixes

### 1. Add Missing Permissions
If messages aren't being sent/received, try adding these permissions to manifest.json:
```json
{
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "tabs"
  ]
}
```

### 2. Fix Content Script Loading
Ensure the content script is properly declared in manifest.json:
```json
{
  "content_scripts": [
    {
      "matches": [
        "https://supported-website.com/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}
```

### 3. Proper Message Handling
In content scripts, ensure proper message handling:
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'someAction') {
    // Process the request
    sendResponse({ success: true, data: 'response data' });
    return true; // Required for async responses
  }
});
```

### 4. Background Script Message Handling
In background script, handle messages properly:
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'someAction') {
    // Process the request
    sendResponse({ success: true, data: 'response data' });
    return true; // Required for async responses
  }
});
```

## Additional Troubleshooting

### Content Security Policy Issues
If you see CSP errors, you may need to adjust the manifest:
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Race Conditions
If content script functions aren't available immediately:
```javascript
// Wait for content script to load
function waitForContentScript(maxAttempts = 50) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      if (typeof window.aivContentScriptLoaded !== 'undefined') {
        resolve();
      } else if (attempts++ < maxAttempts) {
        setTimeout(check, 100);
      } else {
        reject(new Error('Content script not loaded'));
      }
    };
    check();
  });
}
```

## Testing Checklist

- [ ] Extension is properly installed and enabled
- [ ] All content script files exist and are correctly named
- [ ] Manifest.json has correct content script declaration
- [ ] Required permissions are included
- [ ] Content script loads on target websites
- [ ] Message passing works between content script and background script
- [ ] No JavaScript errors in console
- [ ] No CSP violations
- [ ] Test page works correctly