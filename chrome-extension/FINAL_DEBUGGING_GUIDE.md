# AIV Systems Chrome Extension - Final Debugging Guide

## Overview
This guide provides step-by-step instructions to debug why your AIV Systems Chrome Extension isn't capturing and validating AI responses as expected.

## Quick Fix Checklist

Before diving into detailed debugging, try these quick fixes:

1. [ ] **Refresh the AI chat page** - Press F5 or Ctrl+R
2. [ ] **Toggle the extension OFF and ON** - Click the extension icon and toggle twice
3. [ ] **Check the toggle is ON** - Ensure the switch shows as enabled
4. [ ] **Verify you're on a supported platform** - chat.openai.com, chatgpt.com, etc.

## Detailed Debugging Process

### Step 1: Verify Extension Installation

1. Go to `chrome://extensions`
2. Confirm AIV Systems Validator is enabled
3. Check for any error messages or warnings
4. Note the extension ID (you'll need this for debugging)

### Step 2: Test Extension Functionality

1. Click the AIV Systems extension icon
2. Ensure the toggle is switched ON
3. Check that the status shows "Validation is ON"
4. Try clicking the debug buttons:
   - "Test Message Detection"
   - "Send Test User Message"
   - "Send Test Assistant Message"

### Step 3: Check Content Script on AI Platform

1. Navigate to chat.openai.com
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Go to the Console tab
4. Look for these messages:
   ```
   [AIV-DEBUG ...] [Content] AIV Validation enabled
   [AIV-DEBUG ...] [Content] Capturing existing content
   ```

### Step 4: Monitor Message Detection

In the Console tab on chat.openai.com, run this command:
```javascript
// Enable continuous monitoring
AIVDebug.monitorDOM(document.body, 'ChatGPT');
```

Then interact with ChatGPT and watch for log messages about new elements being added.

### Step 5: Test Message Detection Manually

In the Console tab, run:
```javascript
// Test message detection
AIVDebug.testMessages();
```

This will search for common message patterns and report what it finds.

### Step 6: Check Background Script

1. Go to `chrome://extensions`
2. Find AIV Systems extension
3. Click "Inspect views" next to the background page
4. In the background console, look for:
   - Messages being received from content script
   - Any error messages
   - Firebase connection attempts

### Step 7: Verify Message Flow

In the Console tab of chat.openai.com, run:
```javascript
// Send a test message directly
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: {
    role: 'assistant',
    content: 'Test response from AI for debugging',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    platform: 'chatgpt'
  }
}, function(response) {
  console.log('Extension response:', response);
});
```

## Common Issues and Solutions

### Issue 1: Content Script Not Injecting

**Symptoms:**
- No debug messages in Console
- Debug buttons don't work
- Extension appears enabled but does nothing

**Solutions:**
1. Check that you're on a supported URL (chat.openai.com, chatgpt.com)
2. Refresh the page after enabling the extension
3. Check manifest.json host_permissions match the current URL
4. Verify the extension is properly loaded (no errors in chrome://extensions)

### Issue 2: Message Detection Not Working

**Symptoms:**
- Extension is enabled but doesn't capture messages
- "Test Message Detection" finds 0 messages
- No validation occurs when chatting with AI

**Solutions:**
1. Run `AIVDebug.testMessages()` to see what selectors are working
2. Check if ChatGPT's HTML structure has changed
3. Look for messages in the Elements tab with:
   - `data-message-author-role` attributes
   - `.agent-turn` or `.user-turn` classes
   - `.text-token-text-primary` classes

### Issue 3: Background Communication Failing

**Symptoms:**
- Content script detects messages but they don't reach background
- Background console shows no activity
- Validation doesn't occur

**Solutions:**
1. Check for errors in chrome.runtime.lastError
2. Verify the extension has proper permissions
3. Ensure the background script is running (check "Inspect views")

## Advanced Debugging Techniques

### Monitor DOM Changes in Real-Time

1. On chat.openai.com, open Console
2. Run:
   ```javascript
   // Start monitoring all DOM changes
   const observer = AIVDebug.monitorDOM(document.body, 'FullPage');
   
   // To stop monitoring later:
   // observer.disconnect();
   ```

### Inspect Specific Elements

1. In the Elements tab, select a message element
2. In Console, run:
   ```javascript
   // Inspect the selected element
   AIVDebug.dumpElement($0, 'Selected Element');
   ```

### Force Message Processing

1. In Console, run:
   ```javascript
   // Force processing of all messages on page
   checkForNewMessages(document.body);
   ```

## Testing with Real Interactions

### Simulate User Interaction

1. Enable the extension
2. On chat.openai.com, ask a simple question like "What is 2+2?"
3. In Console, immediately run:
   ```javascript
   // Check for new messages after a short delay
   setTimeout(() => {
     AIVDebug.testMessages();
   }, 1000);
   ```

### Verify Message Content

1. After asking a question, run:
   ```javascript
   // Look for specific text in messages
   const allText = document.body.textContent;
   if (allText.includes('2+2')) {
     console.log('Found question text in page');
   }
   ```

## Troubleshooting Checklist

### Basic Checks
- [ ] Extension is installed and enabled
- [ ] Toggle is switched ON
- [ ] You're on a supported AI platform
- [ ] Page has been refreshed since enabling extension

### Intermediate Checks
- [ ] Content script is loaded (check Sources tab)
- [ ] No JavaScript errors in Console
- [ ] Debug messages appear when interacting with extension
- [ ] Test buttons in popup work correctly

### Advanced Checks
- [ ] Background script is running without errors
- [ ] Network requests are being made
- [ ] Firebase configuration is correct
- [ ] AIV System backend is accessible

## If Still Not Working

### Complete Reset Procedure

1. Disable the extension in `chrome://extensions`
2. Close all Chrome windows completely
3. Reopen Chrome
4. Re-enable the extension
5. Navigate to chat.openai.com
6. Refresh the page
7. Enable validation in the popup
8. Test with a simple question

### Check for Updates

1. Ensure Chrome is updated to the latest version
2. Check if there are updates to the extension files
3. Verify your AIV System backend is running on http://localhost:5178

### Contact Support

If you've tried all steps and the extension still isn't working, collect this information:

1. Screenshots of:
   - Extension popup
   - Console errors on chat.openai.com
   - Console output from background script
   - Network tab showing requests

2. Information to include:
   - Chrome version
   - Operating system
   - Exact URL you're testing on
   - Steps to reproduce
   - Expected vs actual behavior

## Prevention Tips

### Regular Maintenance
- [ ] Periodically restart Chrome
- [ ] Keep Chrome updated
- [ ] Check that your AIV System backend is running
- [ ] Monitor for extension updates

### Best Practices
- [ ] Toggle extension OFF when not validating
- [ ] Refresh AI chat pages after enabling extension
- [ ] Keep Developer Tools open when troubleshooting
- [ ] Check console for errors regularly

## Quick Reference

### Essential Debug Commands
```javascript
// Test message detection
AIVDebug.testMessages();

// Send test message
AIVDebug.sendTest('assistant', 'Test content');

// Monitor DOM changes
AIVDebug.monitorDOM(document.body, 'Monitor');

// Dump element information
AIVDebug.dumpElement(document.querySelector('[data-message-author-role]'), 'Message');
```

### Check Extension State
```javascript
// Check if validation is enabled
chrome.storage.local.get(['aivValidationEnabled'], console.log);

// Check if content script functions exist
typeof checkForNewMessages === 'function';
```

This guide should help you identify and resolve the issue with your AIV Systems Chrome Extension. The enhanced debugging tools and detailed steps should provide visibility into what's happening at each stage of the message capture and validation process.