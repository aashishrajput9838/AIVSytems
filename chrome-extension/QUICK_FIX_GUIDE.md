# AIV Systems Chrome Extension - Quick Fix Guide

## Overview
This guide explains how to fix the issues that were preventing your AIV Systems Chrome Extension from working properly.

## Issues That Were Fixed

1. **Duplicate Script Loading**: Scripts were being injected multiple times, causing "Identifier already declared" errors
2. **ES6 Module Syntax Error**: The `export` statement in `debug-utils.js` was causing syntax errors
3. **Missing AIVDebug Object**: The `AIVDebug` object was not properly defined
4. **Script Injection Order**: Scripts were being injected in the wrong order

## How to Apply the Fixes

### Step 1: Update Your Extension Files

Replace your existing files with the updated versions:

1. `debug-utils.js` - Fixed ES6 module syntax and duplicate loading issues
2. `firebase-config.js` - Added duplicate declaration protection
3. `content.js` - Added duplicate loading protection and proper error handling
4. `manifest.json` - Fixed script injection order
5. `background.js` - Prevented duplicate script injection

### Step 2: Reload the Extension

1. Go to `chrome://extensions`
2. Find your AIV Systems extension
3. Click the refresh icon to reload the extension
4. Make sure the extension is enabled

### Step 3: Test the Fix

1. Navigate to chat.openai.com or chatgpt.com
2. Click the AIV Systems extension icon
3. Toggle validation ON
4. Ask a simple question like "What is 2+2?"
5. Check the browser console (F12) for log messages

## What to Look For

### Success Indicators
- No more "Identifier already declared" errors in the console
- No more "Unexpected token 'export'" errors
- Messages like "AIV Systems Content Script loaded" in the console
- Messages like "Processing message: assistant - ..." when you get AI responses

### Debugging Tips

1. **Check the Console**: Press F12 and look at the Console tab for error messages
2. **Use Debug Buttons**: Click the debug buttons in the extension popup:
   - "Test Message Detection"
   - "Send Test User Message"
   - "Send Test Assistant Message"
3. **Verify Toggle State**: Make sure the toggle switch in the popup is ON

## Common Issues and Solutions

### If You Still See Errors

1. **Clear Chrome Cache**:
   - Press Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"

2. **Restart Chrome**:
   - Close all Chrome windows
   - Reopen Chrome
   - Navigate to your AI chat platform

3. **Reinstall Extension**:
   - Remove the extension from `chrome://extensions`
   - Load it again with "Load unpacked"

### If Messages Still Aren't Captured

1. **Check URL**: Make sure you're on chat.openai.com or chatgpt.com
2. **Refresh Page**: Press F5 after enabling the extension
3. **Test Selectors**: Run this in the Console:
   ```javascript
   // Check if message elements exist
   const messages = document.querySelectorAll('[data-message-author-role]');
   console.log('Messages found:', messages.length);
   ```

## Testing the Fix

### Quick Test Procedure

1. Open chat.openai.com
2. Press F12 to open Developer Tools
3. Click the Console tab
4. Enable the AIV Systems extension
5. Ask a simple question
6. Watch for these messages in the console:
   ```
   AIV Systems Content Script loaded
   AIV Validation enabled
   Processing message: user - ...
   Processing message: assistant - ...
   ```

### Using the Test Page

Open the `test-fix.html` file in your browser to run automated tests:

1. Open `test-fix.html` in Chrome
2. Click the "Test Scripts" button
3. Click "Test Message Detection"
4. Click "Send Test User Message" and "Send Test Assistant Message"

## Prevention Tips

### Avoiding Duplicate Loading

The fixes include protection against duplicate script loading:
- Content scripts check if they're already loaded
- Firebase config checks if it's already defined
- Debug utilities are only initialized once

### Best Practices

1. **Always Refresh**: Refresh AI chat pages after enabling the extension
2. **Check Console**: Regularly check the console for errors
3. **Toggle Off/On**: If things aren't working, try toggling the extension off and on
4. **Update Files**: Keep all extension files up to date

## Support

If you're still experiencing issues after applying these fixes:

1. Take screenshots of:
   - Console errors
   - Extension popup
   - Network tab activity

2. Include:
   - Chrome version
   - Operating system
   - Exact steps to reproduce
   - Expected vs actual behavior

The fixes implemented should resolve the script loading issues and allow your AIV Systems extension to properly capture and validate AI chat responses.