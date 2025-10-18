# AIV Chat Validator - Simple Chrome Extension

This is a simplified Chrome extension that automatically captures ChatGPT (and other AI platform) conversations and validates them with the AIV System.

## Why This Approach?

This simpler extension uses the method you suggested which:
1. Automatically runs when you visit ChatGPT or other AI platforms
2. Captures conversations without complex DOM parsing
3. Sends data directly to the AIV validation system
4. Requires no manual intervention

## Installation

1. **Create the extension folder**:
   - Create a folder named `aiv-chat-validator` on your computer

2. **Add the files**:
   - Copy all files from this directory to the folder:
     - `manifest.json`
     - `content.js`
     - `popup.html`
     - `popup.js`

3. **Load the extension in Chrome**:
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `aiv-chat-validator` folder

## How It Works

1. **Automatic Capture**: 
   - The extension automatically detects conversations on supported AI platforms
   - It looks for elements with `data-message-author-role` attributes
   - Captures both user questions and AI responses

2. **Conversation Pairing**:
   - Groups messages into question-response pairs
   - Maintains conversation context

3. **Automatic Validation**:
   - Sends each AI response to the AIV validation system
   - Stores validation results locally

4. **Results Display**:
   - Click the extension icon to view captured conversations
   - See validation results for each response

## Supported Platforms

- ChatGPT (https://chat.openai.com)
- Google Gemini (https://gemini.google.com)
- Groq (https://groq.com)
- Claude (https://claude.ai)
- Microsoft Copilot (https://copilot.microsoft.com)

## How to Use

1. **Install the extension** (see Installation above)
2. **Open any supported AI platform** (e.g., https://chat.openai.com)
3. **Start chatting** - the extension works automatically
4. **View results** - click the extension icon to see captured conversations and validation results

## Technical Details

- **Capture Interval**: Checks for new messages every 5 seconds
- **Storage**: Keeps the last 10 validation results
- **Validation**: Sends data to local Firebase emulator endpoint
- **No UI Interference**: Works completely in the background

## Troubleshooting

### Not Seeing Results?
1. Make sure the extension is enabled in `chrome://extensions/`
2. Check that you're on a supported AI platform
3. Open Developer Tools (F12) and check the Console tab for logs
4. Look for messages with `[AIV Simple]` prefix

### Validation Not Working?
1. Ensure your Firebase emulator is running
2. Check that the endpoint `http://127.0.0.1:5004/...` is accessible
3. Check the console for network errors

### Still Having Issues?
1. Try refreshing the AI platform page
2. Reload the extension in `chrome://extensions/`
3. Check that all files are in the extension folder

## Benefits of This Approach

1. **Simplicity**: Much simpler than the previous complex DOM parsing
2. **Reliability**: Uses standard attributes that AI platforms provide
3. **Automatic**: No manual activation needed
4. **Cross-Platform**: Works with multiple AI platforms
5. **Low Maintenance**: Less code means fewer bugs

## Logs and Debugging

The extension logs all activities to the browser console:
- `[AIV Simple] New chats detected:` - When new messages are found
- `[AIV Simple] Conversation pairs:` - When messages are grouped into pairs
- `[AIV Simple] Validating response:` - When a response is sent for validation
- `[AIV Simple] Validation result:` - When validation results are received

To view logs:
1. Open the AI platform page
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Look for messages with `[AIV Simple]` prefix