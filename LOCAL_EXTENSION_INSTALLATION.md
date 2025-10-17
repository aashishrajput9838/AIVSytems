# AIV Local Validator Extension Installation Guide

This guide will help you install and use the AIV Local Validator Chrome extension, which validates AI responses locally without any external API calls.

## Prerequisites

- Google Chrome browser
- The `AIV-Local-Validator.zip` file (included in this package)

## Installation Steps

### Method 1: Using the Unpacked Extension (Recommended)

1. **Extract the Extension Files**
   - Extract the `chrome-extension-local` folder from the package
   - Place it in a location where you won't accidentally move or delete it

2. **Enable Developer Mode in Chrome**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Toggle "Developer mode" to ON (top right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `chrome-extension-local` folder
   - The extension should now appear in your extensions list

### Method 2: Using the Packaged ZIP File

1. **Extract the ZIP File**
   - Extract `AIV-Local-Validator.zip` to a folder of your choice

2. **Follow Method 1 Steps**
   - Continue with steps 2-3 from Method 1 above

## Verification

After installation:

1. Look for the extension icon in your Chrome toolbar
2. The icon should be visible when you visit supported AI platforms:
   - ChatGPT (https://chat.openai.com)
   - Google Gemini (https://gemini.google.com)
   - Groq (https://groq.com)
   - Claude (https://claude.ai)
   - Microsoft Copilot (https://copilot.microsoft.com)

## Usage

1. **Visit an AI Platform**
   - Navigate to any supported AI chat platform

2. **Start Chatting**
   - Ask questions and get responses from the AI
   - The extension automatically detects and validates responses

3. **View Results**
   - Click the extension icon in the Chrome toolbar
   - The popup will show your conversation pairs with validation results

## Features

- **No External API Calls**: All validation happens locally in your browser
- **Automatic Detection**: Works without manual intervention
- **Real-time Validation**: Validates responses as they appear
- **Privacy Focused**: No data is sent to external servers

## Troubleshooting

### Extension Not Working?

1. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Ensure the extension is enabled (toggle is ON)

2. **Verify Permissions**
   - The extension needs access to the AI websites
   - Check that it has the necessary permissions

3. **Refresh the Page**
   - Reload the AI chat page after installing the extension

### Not Seeing Results?

1. **Check Supported Platforms**
   - Ensure you're on a supported AI platform
   - The extension works with specific URL patterns

2. **Ask Questions**
   - The extension only validates actual conversations
   - Make sure you're asking questions and getting responses

3. **View Console Logs**
   - Press F12 to open Developer Tools
   - Go to the Console tab
   - Look for messages with `[AIV Local]` prefix

### Still Having Issues?

1. **Reinstall the Extension**
   - Remove the extension from Chrome
   - Restart Chrome
   - Reinstall following the steps above

2. **Check for Updates**
   - Ensure you're using the latest version of the extension

## Technical Details

- **Validation Interval**: Checks for new messages every 3 seconds
- **Storage Limit**: Keeps the last 10 conversation pairs
- **Validation Rules**: 
  - Length checks
  - Generic response detection
  - Hallucination detection
  - Sentence structure validation

## Privacy Notice

The AIV Local Validator:
- Does not collect or transmit any personal data
- Performs all validation locally in your browser
- Does not store conversations permanently
- Only accesses chat content on supported AI platforms

## Support

For issues or questions about the extension, please refer to the documentation or contact support.