# AIV Systems Chrome Extension

This Chrome extension captures AI chat interactions and validates responses using the AIV System.

## Features

- Captures user and assistant messages from popular AI chat platforms
- Validates responses in real-time using the AIV System
- Displays validation results in the extension popup with detailed feedback
- Supports multiple AI platforms (ChatGPT, Gemini, Groq, Claude, Copilot)
- **Duplicate Prevention**: Automatically prevents duplicate conversation pairs from being captured and displayed

## Installation

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension folder
4. The AIV Systems extension should now appear in your toolbar

## Prerequisites

Before using the extension, you need to have the AIV System backend running. This project uses Firebase Functions for the backend.

See [API_SETUP.md](API_SETUP.md) for detailed instructions on setting up and running the backend.

## Usage

1. Make sure the AIV System backend is running (either locally with Firebase Emulator or deployed to Firebase)
2. Click the AIV Systems icon in your Chrome toolbar
3. Toggle the "Enable Validation" switch to ON
4. Navigate to any supported AI chat platform
5. Interact with the AI chatbot
6. View validation results in the extension popup

## Supported Platforms

- ChatGPT (chat.openai.com, chatgpt.com)
- Google Gemini (gemini.google.com)
- Groq (groq.com)
- Anthropic Claude (claude.ai)
- Microsoft Copilot (copilot.microsoft.com)

## How It Works

1. When enabled, the extension monitors DOM changes on supported AI chat platforms
2. It detects new messages using platform-specific selectors
3. Captured messages are sent to the background script for validation
4. The background script sends the data to your AIV System Firebase Function
5. Validation results are displayed in the extension popup with detailed feedback

## Duplicate Prevention

The extension implements multiple levels of duplicate prevention:

1. **Content-based deduplication**: Prevents capturing identical questions or responses
2. **Time-based throttling**: Limits processing frequency to prevent rapid duplicate processing
3. **Pair-based deduplication**: Ensures unique question-response pairs in the display
4. **Cache cleanup**: Automatically removes old entries to prevent memory issues

This ensures that when you ask the same question multiple times, only one instance appears in the conversation history.

## Validation Display

The extension now shows detailed validation information for each conversation pair:

1. **Status Indicators**: Clear visual cues for PASSED/FAILED/Pending validations
2. **Confidence Scores**: Percentage values indicating validation confidence
3. **Issues**: List of problems found in failed validations
4. **Suggestions**: Recommendations for improving responses
5. **Color Coding**: 
   - Green: Valid responses
   - Red: Invalid responses
   - Yellow: Pending validations

## Improved Matching Logic

The extension now uses improved matching logic to connect conversation pairs with validation results, handling common issues like:
- Whitespace differences (leading/trailing spaces)
- Newline character variations
- Multiple consecutive spaces
- Minor formatting differences

This resolves the issue where validation was completing successfully but showing as "Pending" in the popup.

## Configuration

The extension is configured to use the Firebase Emulator by default:
- `http://localhost:5004/ai-reasoning-validation-system/us-central1/validateAIResponse`

To use the deployed version:

1. Deploy your Firebase Functions
2. Open `validation-service.js`
3. Modify the `apiEndpoint` value to use your deployed function URL
4. Reload the extension in Chrome

## Troubleshooting Validation Issues

If you see "Validation: Pending" instead of actual validation results:

1. **Ensure Firebase Emulator is Running**:
   - Open a terminal in your Firebase project directory
   - Run: `firebase emulators:start`
   - Wait for "All emulators ready" message

2. **Check Browser Console**:
   - Press F12 on the AI chat page
   - Look for errors in the Console tab

3. **Verify Extension is Properly Loaded**:
   - Go to `chrome://extensions`
   - Reload the AIV Systems extension
   - Refresh the AI chat page

4. **Run Debug Tools**:
   - Open `debug-validation.html` in your browser
   - Click "Run Debug" to check extension status

See [TROUBLESHOOTING-VALIDATION.md](TROUBLESHOOTING-VALIDATION.md) for detailed troubleshooting steps.

## Debugging

The extension includes several debugging tools:

- Test Message Detection: Checks for message elements on the current page
- Send Test Messages: Sends sample user/assistant messages
- Visual Debug Panel: Appears on AI chat pages when enabled
- Debug Validation Page: Comprehensive extension status checker

## Troubleshooting

If the extension is not capturing messages:

1. Ensure you're on a supported platform
2. Check that validation is enabled
3. Try refreshing the page
4. Use the "Test Message Detection" button to verify message detection
5. Check the browser console for errors (Ctrl+Shift+J)

If validation results are not showing or showing errors:

1. Make sure the Firebase Emulator is running or functions are deployed
2. Check the Firebase logs for any errors
3. See [API_SETUP.md](API_SETUP.md) for detailed troubleshooting steps

## Development

To modify the extension:

1. Edit the relevant files
2. Reload the extension in Chrome (`chrome://extensions` → Reload button)
3. Test the changes

Key files:
- `manifest.json`: Extension configuration
- `popup.html/js`: Extension popup UI
- `content.js`: Content script that runs on AI chat pages
- `background.js`: Background script that handles validation
- `validation-service.js`: Service that communicates with AIV System Firebase Functions