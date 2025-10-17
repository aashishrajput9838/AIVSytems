# AIV System

AIV (AI Validation) System is a comprehensive solution for validating AI responses in real-time. This repository contains multiple components including Chrome extensions, backend services, and documentation.

## Components

### 1. Chrome Extension (Full Version)
- Real-time capture of AI chat interactions
- Integration with AIV System backend for validation
- Supports multiple AI platforms (ChatGPT, Gemini, Groq, Claude, Copilot)

### 2. Chrome Extension (Local Validator) - NEW
- Validates AI responses locally without external API calls
- No API keys required
- Built-in validation rules
- Complete privacy - no data leaves your browser

### 3. Backend Services
- Firebase functions for validation
- API endpoints for AI response validation
- Dashboard for monitoring and analysis

## Getting Started

### For Local Validation (No External Dependencies)
1. Install the AIV Local Validator Chrome extension
2. Visit any supported AI platform
3. Start chatting - validation happens automatically
4. Click the extension icon to view results

### For Full Validation (With Backend Services)
1. Set up Firebase project
2. Deploy backend functions
3. Install Chrome extension
4. Configure API keys in .env file

## Documentation

- [LOCAL_EXTENSION_INSTALLATION.md](LOCAL_EXTENSION_INSTALLATION.md) - Installation guide for local validator
- [CHROME_EXTENSION_INSTALLATION.md](CHROME_EXTENSION_INSTALLATION.md) - Installation guide for full extension
- [DEPLOYMENT_FREE.md](DEPLOYMENT_FREE.md) - Free deployment options
- [GETTING_STARTED.md](GETTING_STARTED.md) - Getting started guide

## Features

### Local Validator
- No external API calls
- Built-in validation rules
- Works offline
- Complete privacy

### Full Extension
- Advanced validation algorithms
- Historical data tracking
- Dashboard visualization
- Cross-platform support

## Supported Platforms

- ChatGPT (https://chat.openai.com)
- Google Gemini (https://gemini.google.com)
- Groq (https://groq.com)
- Claude (https://claude.ai)
- Microsoft Copilot (https://copilot.microsoft.com)

## Privacy

The AIV System is designed with privacy in mind:
- Local Validator: No data leaves your browser
- Full Extension: Only chat content is sent for validation
- All data is processed securely

## License

This project is licensed under the MIT License - see the LICENSE file for details.