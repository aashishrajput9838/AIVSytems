# AIV Systems Chrome Extension Troubleshooting Checklist

## Immediate Steps to Try

### 1. Refresh and Restart
- [ ] Refresh the AI chat page (F5 or Ctrl+R)
- [ ] Toggle the extension OFF and then ON again
- [ ] Close and reopen Chrome
- [ ] Restart your computer

### 2. Check Extension Status
- [ ] Go to `chrome://extensions`
- [ ] Verify AIV Systems extension is enabled
- [ ] Check for any error messages or warnings

### 3. Verify Toggle State
- [ ] Click the AIV Systems extension icon
- [ ] Confirm the toggle switch is ON
- [ ] Check that status shows "Validation is ON"

## Detailed Troubleshooting

### Step 1: Check Content Script Injection
1. Navigate to chat.openai.com
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for these messages:
   - "AIV Validation enabled"
   - "Injecting content script for supported platform"
5. If not seeing these messages:
   - Check that you're on a supported URL
   - Refresh the page

### Step 2: Test Message Detection
1. In the Console tab on chat.openai.com, run:
   ```javascript
   // Check if we can find message elements
   const messages = document.querySelectorAll('[data-message-author-role]');
   console.log('Messages found:', messages.length);
   
   // Check specific message content
   messages.forEach((msg, index) => {
     console.log(`Message ${index}:`, {
       role: msg.getAttribute('data-message-author-role'),
       content: msg.textContent.trim().substring(0, 50) + '...'
     });
   });
   ```

### Step 3: Manual Message Processing Test
1. In the Console tab, run:
   ```javascript
   // Manually trigger message processing
   if (typeof checkForNewMessages === 'function') {
     console.log('Testing message detection...');
     checkForNewMessages(document.body);
   } else {
     console.log('Content script functions not available');
   }
   ```

### Step 4: Check Background Script
1. Go to `chrome://extensions`
2. Find AIV Systems extension
3. Click "Inspect views" next to the background page
4. In the background console, look for:
   - Messages being received
   - Any error messages
   - Firebase connection status

### Step 5: Test Direct Message Sending
1. In the Console tab of any page, run:
   ```javascript
   // Test sending a message directly to the extension
   chrome.runtime.sendMessage({
     action: 'captureInteraction',
     data: {
       role: 'assistant',
       content: 'Test response from AI',
       timestamp: new Date().toISOString(),
       url: window.location.href,
       platform: 'chatgpt'
     }
   }, function(response) {
     console.log('Extension response:', response);
   });
   ```

## Common Issues and Solutions

### Issue: Extension Shows as Enabled but Not Working
**Solution:**
1. Disable and re-enable the extension
2. Remove and reinstall the extension
3. Check for Chrome updates

### Issue: No Messages Captured on ChatGPT
**Solution:**
1. Verify you're on https://chat.openai.com or https://chatgpt.com
2. Check that ChatGPT page structure hasn't changed
3. Look for messages in the Elements tab with:
   - `data-message-author-role="user"`
   - `data-message-author-role="assistant"`

### Issue: Background Script Errors
**Solution:**
1. Check the background script console for specific error messages
2. Verify network connectivity
3. Check Firebase configuration

### Issue: Permission Errors
**Solution:**
1. Go to `chrome://extensions`
2. Click "Details" for AIV Systems extension
3. Ensure all permissions are granted
4. Check manifest.json for correct host permissions

## Advanced Debugging

### Enable Verbose Logging
1. Open extension popup
2. Keep Developer Tools console open on the AI chat page
3. Watch for log messages when interacting with AI

### Check Extension Storage
1. In Developer Tools, go to Application tab
2. Expand "Storage" → "Local Storage"
3. Look for extension storage
4. Verify `aivValidationEnabled` is `true`

### Network Debugging
1. In Developer Tools, go to Network tab
2. Look for requests to:
   - Firebase services
   - Your AIV System backend
3. Check for failed requests (red entries)

## If Nothing Works

### Complete Reset
1. Remove the extension completely
2. Close Chrome entirely
3. Reopen Chrome
4. Reinstall the extension
5. Test again

### Check for Updates
1. Ensure Chrome is updated to the latest version
2. Check if there are updates to the extension
3. Verify your AIV System backend is running

### Contact Support
If you've tried all steps and the extension still isn't working:
1. Take screenshots of:
   - Extension popup
   - Console errors
   - Network requests
   - Element structure of AI messages
2. Include:
   - Chrome version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior

## Prevention Tips

### Regular Maintenance
- [ ] Periodically restart Chrome
- [ ] Keep Chrome updated
- [ ] Check that your AIV System backend is running
- [ ] Monitor for extension updates

### Best Practices
- [ ] Toggle extension OFF when not in use
- [ ] Refresh AI chat pages after enabling extension
- [ ] Check console for errors regularly
- [ ] Keep Developer Tools open when troubleshooting

## Quick Reference Commands

### In Browser Console
```javascript
// Check if extension is listening
chrome.runtime.sendMessage({action: 'ping'});

// Send test message
chrome.runtime.sendMessage({
  action: 'captureInteraction',
  data: {role: 'test', content: 'Test message'}
});

// Check storage
chrome.storage.local.get(['aivValidationEnabled'], console.log);
```

### In Background Script Console
```javascript
// Check for registered message listeners
chrome.runtime.onMessage.hasListeners();

// View current tabs
chrome.tabs.query({}, console.log);
```