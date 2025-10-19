# AIV Systems Chrome Extension - Updated Version

## Overview
This Chrome extension captures AI chat interactions and validates responses using the AIV System in real-time. It works with popular AI chat platforms including ChatGPT, Gemini, Claude, and more.

## Recent Fixes
This version includes important fixes for:
1. **Dynamic Import Error** - Fixed "import() is disallowed on ServiceWorkerGlobalScope" errors
2. **Duplicate Validations** - Prevented the same content from being validated multiple times
3. **Debug Window Removal** - Removed unwanted debug panels from appearing on pages
4. **Auto-refresh Removal** - Removed automatic refresh that was causing results to change unexpectedly
5. **Debug Tools Removal** - Removed unnecessary debug tools and simplified the interface
6. **Manual Validation Trigger** - Added functionality to manually trigger validation
7. **Content Script Injection Fix** - Fixed issues with content script injection
8. **Error Handling Improvements** - Enhanced error handling throughout the extension
9. **Conversation Pair Display** - Now shows question-response pairs in the popup

## Installation

### Prerequisites
- Google Chrome browser
- AIV System backend running (for validation functionality)

### Installation Steps
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension should now appear in your toolbar

## Usage

### Enabling Validation
1. Click the AIV Systems extension icon in your toolbar
2. Toggle the "Enable Validation" switch to ON
3. The status should change to "Validation is ON"

### Using with AI Chat Platforms
1. Navigate to any supported AI chat platform:
   - ChatGPT (chat.openai.com or chatgpt.com)
   - Google Gemini (gemini.google.com)
   - Groq (groq.com)
   - Claude (claude.ai)
   - Microsoft Copilot (copilot.microsoft.com)
2. Start a conversation with the AI
3. The extension will automatically capture interactions

### Viewing Conversations
1. Click the extension icon to open the popup
2. The popup will display recent question-response pairs from your conversation
3. Each pair shows:
   - The question you asked (Q:)
   - The response from the AI (A:)

### Validating Responses
1. Click the "Validate Latest Response" button to trigger validation of the most recent AI response
2. The validation result will be displayed in the popup

### Manual Validation
To manually trigger validation of the latest AI response:
1. Click the "Validate Latest Response" button in the popup
2. The extension will find the most recent assistant message and send it for validation
3. Results will appear in the popup after validation is complete

## Configuration

### AIV System API Endpoint
The extension connects to the AIV System backend for validation. By default, it uses:
`http://127.0.0.1:5004/ai-reasoning-validation-system/us-central1/validateAIResponse`

To change this for production deployment:
1. Edit `background.js`
2. Modify the `apiEndpoint` variable
3. Update to your deployed Firebase Function URL

## Troubleshooting

### Common Issues

#### "Validation failed" or "API not accessible"
- Ensure the AIV System backend is running
- Check that the API endpoint URL is correct
- Verify network connectivity

#### Extension not capturing messages
- Make sure the extension is enabled (toggle is ON)
- Check that you're on a supported AI platform
- Try refreshing the AI chat page

#### Duplicate validations
This issue has been fixed in the updated version. If you still experience duplicates:
- Clear validation results using the "Clear" button
- Restart the browser

### Debugging
1. Open the extension popup
2. Check the browser console for error messages:
   - Right-click on the page
   - Select "Inspect"
   - Go to the "Console" tab

## Supported Platforms
- ChatGPT (OpenAI)
- Google Gemini
- Groq
- Claude (Anthropic)
- Microsoft Copilot

## Development

### File Structure
- `manifest.json` - Extension configuration
- `background.js` - Background service worker (validation logic)
- `content.js` - Content script (message capture and conversation pairing)
- `popup.html/js` - Popup UI (displays conversation pairs)
- `debug-helper.js` - Debug utilities (simplified)
- `firebase-config.js` - Firebase configuration

### Making Changes
1. Edit the relevant files
2. Reload the extension in Chrome (`chrome://extensions` → Reload button)
3. Test the changes

## Recent Changes
For a detailed list of recent changes, see:
- `CHANGES.md` - Detailed change log
- `SUMMARY.md` - Fix summary

## Support
For issues or questions, please check:
1. The console logs in Chrome DevTools
2. The documentation files in this folder
3. Ensure you're using the latest version of the extension