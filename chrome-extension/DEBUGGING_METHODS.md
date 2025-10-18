# Chrome Extension Debugging Methods

## Overview
Chrome extensions can be debugged using several methods. This guide explains all available approaches to help you troubleshoot your AIV Systems extension.

## Method 1: Extension Popup Debugging

### Steps:
1. Right-click the AIV Systems extension icon in the Chrome toolbar
2. Select **"Inspect"** or **"Inspect popup"**
3. The Developer Tools window opens with tabs:
   - **Console**: Shows JavaScript errors and log messages
   - **Elements**: Inspect the popup's HTML structure
   - **Sources**: Set breakpoints and debug JavaScript
   - **Network**: Monitor network requests

### What You Can Do:
- See `console.log()` messages from popup.js
- Set breakpoints in popup.js
- Inspect the toggle switch and button functionality
- Monitor network requests to your AIV System

## Method 2: Content Script Debugging

### Steps:
1. Navigate to chat.openai.com or another supported AI platform
2. Press **F12** or **Ctrl+Shift+I** to open Developer Tools
3. The console now shows messages from your content script

### What You Can See:
- Messages like "AIV Validation enabled"
- "Processing message: user/assistant ..."
- Any errors in content.js
- Debug panel logs (new feature)

### New Debug Panel Feature:
When you visit an AI chat page, a debug panel will appear in the top-right corner with:
- Real-time logs
- Test buttons:
  - "Test Detection" - Checks for messages on the page
  - "Test User Msg" - Sends a test user message
  - "Test Assistant Msg" - Sends a test AI response
  - "Clear Logs" - Clears the debug panel

## Method 3: Background Script Debugging

### Steps:
1. Go to `chrome://extensions`
2. Enable **"Developer mode"** (toggle in top right)
3. Find your AIV Systems extension
4. Click **"Inspect views"** next to the background page
5. A new Developer Tools window opens for the background script

### What You Can Do:
- See messages sent from content script to background
- Monitor Firebase communication attempts
- Check for errors in background.js
- Debug message handling

## Method 4: Network Tab Monitoring

### Steps:
1. Open Developer Tools on any page (F12)
2. Go to the **Network** tab
3. Perform actions with the extension enabled
4. Look for:
   - Requests to Firebase
   - Requests to your AIV System backend
   - Any failed requests (shown in red)

## Method 5: Storage Inspection

### Steps:
1. Open Developer Tools
2. Go to the **Application** tab
3. Expand **"Storage"** → **"Local Storage"**
4. Look for your extension's storage entries
5. Check if `aivValidationEnabled` is properly set

## Method 6: Extension Error Checking

### Steps:
1. Go to `chrome://extensions`
2. Look for any **error badges** or **warnings** next to your extension
3. Check the extension's **Details** page for:
   - Errors
   - Warnings
   - Permission issues

## Quick Debugging Checklist

### Immediate Checks:
- [ ] Extension icon appears in toolbar
- [ ] Toggle switch works in popup
- [ ] Status changes to "Validation is ON"
- [ ] No errors in popup console

### Content Script Checks:
- [ ] Debug panel appears on AI chat pages
- [ ] Console shows "AIV Systems Content Script loaded"
- [ ] No JavaScript errors in console
- [ ] Test buttons in debug panel work

### Background Script Checks:
- [ ] Background console shows received messages
- [ ] No errors in background console
- [ ] Firebase communication attempts visible

## Common Debugging Scenarios

### Scenario 1: Extension Appears Enabled But Does Nothing

**Check:**
1. Popup console - Look for initialization messages
2. Content script console - Should show "Content Script loaded"
3. Debug panel - Should appear on AI pages
4. Background script - Should show communication attempts

### Scenario 2: Messages Not Being Captured

**Check:**
1. Click "Test Detection" in debug panel
2. Console should show found message elements
3. Ask a question and watch for "Processing message" logs
4. Check Network tab for communication attempts

### Scenario 3: Validation Not Working

**Check:**
1. Background script console for Firebase attempts
2. Network tab for requests to your AIV System
3. Popup console for errors when clicking dashboard button

## Advanced Debugging Techniques

### 1. Forced Message Detection
In the content script console, run:
```javascript
// Force check for messages
checkForNewMessages(document.body);
```

### 2. Manual Message Sending
In any console, run:
```javascript
// Send a test message directly
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: {
    role: 'assistant',
    content: 'Test message',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    platform: 'debug'
  }
});
```

### 3. Storage State Check
In any console, run:
```javascript
// Check if validation is enabled
chrome.storage.local.get(['aivValidationEnabled'], console.log);
```

## Troubleshooting Tips

### If Nothing Appears in Console:
1. Make sure Developer Tools is open **before** interacting with the extension
2. Refresh the page after opening Developer Tools
3. Check if the extension is properly loaded in `chrome://extensions`

### If Debug Panel Doesn't Appear:
1. Check that you're on a supported AI platform
2. Verify the content script is loaded (check Sources tab)
3. Look for JavaScript errors that might prevent panel creation

### If Test Buttons Don't Work:
1. Check popup console for communication errors
2. Verify the extension has proper permissions
3. Ensure background script is running

## Quick Reference

### Essential Keyboard Shortcuts:
- **F12** or **Ctrl+Shift+I**: Open Developer Tools
- **Ctrl+R** or **F5**: Refresh page
- **Ctrl+Shift+R**: Hard refresh (bypasses cache)

### Key Log Messages to Look For:
```
AIV Systems Content Script loaded
AIV Validation enabled
Processing message: user - ...
Processing message: assistant - ...
Successfully sent data to Firebase
```

### URLs to Test On:
- https://chat.openai.com
- https://chatgpt.com
- https://gemini.google.com
- https://groq.com
- https://claude.ai
- https://copilot.microsoft.com

This comprehensive debugging guide should help you identify and resolve any issues with your AIV Systems Chrome Extension. The new debug panel feature provides real-time feedback directly on the pages where your extension operates.