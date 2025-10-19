# AIV Systems Chrome Extension - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Error sending message to content script"

**Problem**: This error occurs when the popup cannot communicate with the content script running on the webpage.

**Causes and Solutions**:

1. **Content Script Not Loaded**
   - **Cause**: The content script may not be injected into the page
   - **Solution**: 
     - Check that you're on a supported AI chat platform
     - Refresh the page after enabling the extension
     - Verify the extension has permission for the website

2. **Permissions Issue**
   - **Cause**: Missing required permissions in manifest.json
   - **Solution**: 
     - Ensure "tabs" permission is included in manifest.json
     - Reload the extension after making changes

3. **Timing Issue**
   - **Cause**: Message sent before content script is ready
   - **Solution**: 
     - Wait a few seconds after enabling validation
     - Refresh the AI chat page

### Issue 2: "Error triggering validation"

**Problem**: This error occurs when trying to manually trigger validation.

**Causes and Solutions**:

1. **No Assistant Messages Found**
   - **Cause**: The extension couldn't find any assistant messages to validate
   - **Solution**: 
     - Make sure you've had a conversation with the AI
     - Check that messages are visible on the page
     - Try refreshing the page

2. **Content Script Communication Failure**
   - **Cause**: Same as Issue 1
   - **Solution**: Follow the solutions for Issue 1

## Step-by-Step Troubleshooting

### Step 1: Verify Extension Installation
1. Go to `chrome://extensions`
2. Find "AIV Systems Validator"
3. Ensure it's enabled (toggle is ON)
4. Click the refresh icon if you see any errors

### Step 2: Check Permissions
1. In `chrome://extensions`, click "Details" for the extension
2. Verify these permissions are granted:
   - Access to chat websites (chat.openai.com, chatgpt.com, etc.)
   - Ability to read and change data on those sites

### Step 3: Test on Supported Platform
1. Navigate to a supported AI chat platform:
   - ChatGPT (chat.openai.com or chatgpt.com)
   - Google Gemini (gemini.google.com)
   - Groq (groq.com)
   - Claude (claude.ai)
   - Microsoft Copilot (copilot.microsoft.com)
2. Refresh the page after navigating

### Step 4: Enable Validation
1. Click the AIV Systems extension icon
2. Toggle "Enable Validation" to ON
3. Wait 2-3 seconds for the content script to initialize

### Step 5: Test Manual Validation
1. Have a conversation with the AI (ask a question and get a response)
2. Click "Validate Latest Response" in the popup
3. Wait 2-3 seconds for results to appear

## Debugging Information

### Check Content Script Loading
1. On the AI chat page, press F12 to open Developer Tools
2. Go to the Console tab
3. Type `window.aivContentScriptLoaded` and press Enter
4. If it returns `true`, the content script is loaded
5. If it returns `undefined`, the content script is not loaded

### Check for Errors
1. In Developer Tools Console, look for any error messages
2. Check the background script:
   - Go to `chrome://extensions`
   - Click "Inspect views" next to the AIV Systems extension
   - Check the Console tab for errors

### Test Message Passing
1. In the website's console, run:
   ```javascript
   chrome.runtime.sendMessage({
     action: 'testMessage',
     data: 'Hello from test'
   }, (response) => {
     console.log('Response:', response);
   });
   ```
2. You should see "Response: Object" with success message

## Quick Fixes

### Fix 1: Refresh Everything
1. Refresh the AI chat page
2. Toggle the extension OFF and then ON again
3. Wait 3 seconds
4. Try validating again

### Fix 2: Check Backend
1. Ensure the AIV System backend is running
2. Check that `http://127.0.0.1:5004` is accessible
3. Verify the Firebase emulator is running

### Fix 3: Reload Extension
1. Go to `chrome://extensions`
2. Find AIV Systems Validator
3. Click the refresh icon
4. Try again

## If Problems Persist

1. **Check Extension Version**: Ensure you're using the latest version
2. **Clear Cache**: Clear browser cache and reload extension
3. **Reinstall Extension**: Remove and reinstall the extension
4. **Check Console Logs**: Provide console logs when reporting issues

## Contact Support

If you continue to experience issues:

1. Take a screenshot of the error messages
2. Note which AI platform you're using
3. Check console logs in both the webpage and extension
4. Contact support with this information

## Supported Platforms

The extension works with:
- ChatGPT (chat.openai.com and chatgpt.com)
- Google Gemini (gemini.google.com)
- Groq (groq.com)
- Claude (claude.ai)
- Microsoft Copilot (copilot.microsoft.com)

Other AI platforms may work but are not officially supported.