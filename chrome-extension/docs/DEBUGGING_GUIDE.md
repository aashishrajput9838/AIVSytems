# AIV Systems Chrome Extension Debugging Guide

## Overview
This guide helps you troubleshoot issues with the AIV Systems Chrome Extension not capturing and validating AI chat responses.

## Common Issues and Solutions

### 1. Extension Not Capturing Messages

#### Check if Content Script is Running
1. Navigate to a supported AI platform (e.g., chat.openai.com)
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Go to the "Console" tab
4. Look for log messages like:
   - "AIV Validation enabled"
   - "Injecting content script for supported platform"

#### Check Content Script Sources
1. In Developer Tools, go to the "Sources" tab
2. Expand "Content scripts"
3. Look for your extension's content script (content.js)

### 2. Validation Not Enabled

#### Verify Toggle State
1. Click the AIV Systems extension icon
2. Ensure the toggle switch is ON
3. Check that the status shows "Validation is ON"

#### Check Storage
1. In Developer Tools, go to the "Application" tab
2. Expand "Storage" → "Local Storage"
3. Look for your extension's storage key
4. Verify that `aivValidationEnabled` is set to `true`

### 3. Message Detection Issues

#### ChatGPT Specific Debugging
1. On chat.openai.com, open Developer Tools
2. Go to the "Elements" tab
3. Look for messages with these attributes:
   - `data-message-author-role="user"`
   - `data-message-author-role="assistant"`
   - Classes like `.agent-turn`, `.user-turn`

#### Force Detection
1. In the Console tab, run:
   ```javascript
   // This will trigger message detection
   document.dispatchEvent(new Event('DOMContentLoaded'));
   ```

### 4. Background Script Issues

#### Check Background Script
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Find your AIV Systems extension
4. Click "Inspect views" next to the background page
5. Check the Console tab for errors

### 5. Network and API Issues

#### Check Network Requests
1. In Developer Tools, go to the "Network" tab
2. Look for requests to Firebase or your AIV System
3. Check for any failed requests (red entries)

## Debugging Steps

### Step 1: Enable Verbose Logging
1. Open the extension popup
2. Keep the Developer Tools console open
3. Toggle validation ON and OFF
4. Check for log messages

### Step 2: Test Message Detection
1. Navigate to chat.openai.com
2. Open Developer Tools
3. Go to Console tab
4. Run this test code:
   ```javascript
   // Test if we can find message elements
   const messages = document.querySelectorAll('[data-message-author-role]');
   console.log('Found messages:', messages.length);
   messages.forEach((msg, index) => {
     console.log(`Message ${index}:`, {
       role: msg.getAttribute('data-message-author-role'),
       content: msg.textContent.trim().substring(0, 100) + '...'
     });
   });
   ```

### Step 3: Manual Trigger
1. In the Console tab on chat.openai.com, run:
   ```javascript
   // Manually trigger message processing
   if (typeof checkForNewMessages === 'function') {
     checkForNewMessages(document.body);
   }
   ```

### Step 4: Check Extension Permissions
1. Go to `chrome://extensions`
2. Find your AIV Systems extension
3. Click "Details"
4. Verify that all required permissions are granted:
   - Active Tab
   - Scripting
   - Storage
   - Host permissions for AI platforms

## Advanced Debugging

### Content Script Debugging
1. In Developer Tools on an AI chat page, go to the "Sources" tab
2. Find your content script
3. Set breakpoints in the `checkForNewMessages` and `processMessage` functions
4. Interact with the AI chat to trigger breakpoints

### Background Script Debugging
1. Go to `chrome://extensions`
2. Click "Inspect views" for the background page
3. Set breakpoints in the message listener
4. Check the Network tab for outgoing requests

## Troubleshooting Checklist

### Basic Checks
- [ ] Extension is installed and enabled
- [ ] Toggle is switched ON in the popup
- [ ] You're on a supported AI platform
- [ ] Content script is loaded (check Sources tab)
- [ ] No JavaScript errors in Console

### Advanced Checks
- [ ] Background script is running without errors
- [ ] Network requests are being made
- [ ] Firebase configuration is correct
- [ ] AIV System backend is accessible

## Common Error Messages

### "Extension context invalidated"
- Refresh the AI chat page after enabling the extension

### "Cannot access contents of url"
- Check that host permissions are correctly set in manifest.json

### "No tab with id"
- The tab may have been closed; reopen the AI chat page

## Testing with Sample Data

You can manually test the validation by sending sample data:

```javascript
// In the Console tab of an AI chat page
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: {
    role: 'assistant',
    content: 'This is a test response from the AI',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    platform: 'chatgpt'
  }
}, function(response) {
  console.log('Validation response:', response);
});
```

## Support

If you're still experiencing issues:

1. Take screenshots of:
   - The extension popup
   - The Console tab with errors
   - The Network tab showing requests
   - The Elements tab showing message structure

2. Check the extension's background page for errors

3. Contact support with:
   - Screenshots
   - Steps to reproduce
   - Browser version
   - Extension version