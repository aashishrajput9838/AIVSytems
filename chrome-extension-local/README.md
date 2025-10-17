# AIV Local Validator

This is a simplified Chrome extension that validates AI responses locally without calling any external APIs.

## Features

1. **No External Dependencies**: Validates responses using built-in rules
2. **Automatic Operation**: Works immediately when you visit AI platforms
3. **Local Storage**: Stores results locally in Chrome storage
4. **Cross-Platform**: Works with ChatGPT, Gemini, Groq, Claude, and Copilot
5. **Proper Pairing**: Correctly links questions with their responses
6. **Immediate Validation**: Validates responses as soon as they appear
7. **7 Complete Validators**: Implements all 7 validators from AIV System

## Installation

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `chrome-extension-local` folder

Alternatively, you can use the packaged version:
1. Download the `AIV-Local-Validator-Updated.zip` file
2. Extract it to a folder
3. Follow steps 1-5 above, selecting the extracted folder

## How It Works

1. **Automatic Detection**: Every 3 seconds, detects new messages on AI platforms
2. **Pairing**: Groups user questions with AI responses using unique identifiers
3. **Local Validation**: Applies all 7 built-in validation rules to each response
4. **Storage**: Saves conversation pairs with validation results locally in Chrome storage
5. **Display**: Shows results when you click the extension icon

## Built-in Validation Rules (All 7 Validators)

1. **Error Keywords Check**: Flags responses containing error-related keywords
2. **Response Length Check**: Ensures responses meet minimum length requirements
3. **Sensitive Keywords Check**: Detects sensitive information in questions
4. **Professional Claims Check**: Identifies professional claims in responses
5. **Personal Relationship Check**: Flags personal relationship validation questions
6. **Personal Characteristic Check**: Identifies personal characteristic validation questions
7. **Factual Accuracy Check**: Basic factual accuracy validation

## Supported Platforms

- ChatGPT (https://chat.openai.com)
- Google Gemini (https://gemini.google.com)
- Groq (https://groq.com)
- Claude (https://claude.ai)
- Microsoft Copilot (https://copilot.microsoft.com)

## Usage

1. Install the extension
2. Visit any supported AI platform
3. Start chatting - validation happens automatically
4. Click the extension icon to view results

## Technical Details

- **Capture Interval**: 3 seconds
- **Storage Limit**: Last 10 conversation pairs
- **No External Calls**: 100% local processing
- **No API Keys Required**: Works completely standalone
- **Deduplication**: Prevents validating the same question-response pair multiple times
- **Improved Content Extraction**: Avoids capturing UI elements

## Logs and Debugging

Check the browser console for detailed logs:
- `[AIV Local] New chats detected:`
- `[AIV Local] Paired question with response:`
- `[AIV Local] Validating response locally:`
- `[AIV Local] Conversation pair with validation stored locally:`

To view logs:
1. Open the AI platform page
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Look for messages with `[AIV Local]` prefix

## Troubleshooting

If you're not seeing results:
1. Make sure the extension is enabled
2. Check that you're on a supported AI platform
3. Verify in the console that messages are being detected
4. Ensure you're asking questions and getting responses

The extension only captures and validates content from supported AI platforms. It does not collect or transmit any personal data.