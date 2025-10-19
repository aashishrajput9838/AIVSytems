# AIV System

AIV (AI Validation) System is a comprehensive solution for validating AI responses in real-time. This repository contains a Chrome extension, backend services, and documentation.

## Components

### Chrome Extension
- Real-time capture of AI chat interactions
- Integration with AIV System backend for validation
- Supports multiple AI platforms (ChatGPT, Gemini, Groq, Claude, Copilot)
- **Improved structure with better organization and build process**

## Getting Started

### For Validation (With Backend Services)
1. Set up Firebase project
2. Deploy backend functions
3. Install Chrome extension
4. Configure API keys in .env file

### Environment variables

Create a `.env` file in the project root (copy `.env.example`) and fill in the values. Do NOT commit your `.env` file.

Required variables (examples in `.env.example`):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_GEMINI_API_KEY / VITE_OPENAI_API_KEY
- VITE_EMAILJS_SERVICE_ID
- VITE_EMAILJS_TEMPLATE_ID
- VITE_EMAILJS_PUBLIC_KEY

For local development using Vite, `.env` values will be available via `import.meta.env.VITE_*`.

### Chrome Extension: injecting runtime env

Chrome extensions may not have direct access to `import.meta.env` at runtime. Use one of the following methods to provide runtime env values to the extension:

1) Build-time injection (preferred): during your build step, replace values in a small script that sets `window.__ENV__`.

Example inline snippet to include in an extension page or background script (replace placeholders at build time):

```html
<script>
	window.__ENV__ = window.__ENV__ || {};
	window.__ENV__.VITE_FIREBASE_API_KEY = "REPLACE_WITH_YOUR_API_KEY";
	window.__ENV__.VITE_FIREBASE_PROJECT_ID = "REPLACE_WITH_YOUR_PROJECT_ID";
	// ... other keys
</script>
```

2) Use the provided helper `chrome-extension/src/lib/runtime-env-inject.js` as part of your build pipeline to set `window.__ENV__` from environment variables available at build time.

After injection, the extension code uses `window.__ENV__` as a fallback to read runtime config.

### Security reminders
- Do not commit `.env` or other secret files. `.gitignore` already contains `.env*`.
- Rotate any keys that were previously exposed in source control.
- Restrict API keys in Google Cloud Console to allowed origins and APIs.


## Documentation

- [CHROME_EXTENSION_INSTALLATION.md](CHROME_EXTENSION_INSTALLATION.md) - Installation guide for Chrome extension
- [DEPLOYMENT_FREE.md](DEPLOYMENT_FREE.md) - Free deployment options
- [GETTING_STARTED.md](GETTING_STARTED.md) - Getting started guide
- [docs/project/PROJECT_SUMMARY.md](docs/project/PROJECT_SUMMARY.md) - Comprehensive project overview
- [docs/architecture/CODEBASE_STRUCTURE_INDEX.md](docs/architecture/CODEBASE_STRUCTURE_INDEX.md) - Detailed codebase structure
- [docs/project/FINAL_IMPROVEMENTS_REPORT.md](docs/project/FINAL_IMPROVEMENTS_REPORT.md) - Summary of recent improvements

## Directory Structure

The project follows an organized directory structure for better maintainability:

```
AIV System/
├── chrome-extension/             # Chrome extension source code
├── dist/                         # Built web application files
├── docs/                         # Project documentation
├── functions/                    # Firebase Functions backend
├── packages/                     # Distribution packages
├── public/                       # Static assets for web app
├── scripts/                      # Utility scripts
├── src/                          # Main web application source code
└── ...                           # Configuration files
```

For detailed information about the directory structure, see [docs/project/DIRECTORY_STRUCTURE.md](docs/project/DIRECTORY_STRUCTURE.md).

## Features

### Chrome Extension
- Advanced validation algorithms
- Historical data tracking
- Dashboard visualization
- Cross-platform support
- **Enhanced build process and packaging**

## Supported Platforms

- ChatGPT (https://chat.openai.com)
- Google Gemini (https://gemini.google.com)
- Groq (https://groq.com)
- Claude (https://claude.ai)
- Microsoft Copilot (https://copilot.microsoft.com)

## Recent Improvements

### Codebase Structure
- Improved directory organization for better maintainability
- Separation of source code and distribution files
- Component-based architecture for Chrome extension
- Centralized shared libraries and utilities

### Directory Organization
- Created organized documentation structure
- Moved distribution files to packages directory
- Organized scripts into appropriate categories
- Improved overall project organization

### Build Process
- Automated build scripts for Chrome extension and web application
- Packaging script for Chrome extension distribution
- Comprehensive build verification

### Documentation
- Enhanced documentation structure
- Comprehensive codebase indexing
- Detailed improvement reports
- Better installation and usage guides

## Privacy

The AIV System processes data securely:
- Only chat content is sent for validation
- All data is processed securely

## License

This project is licensed under the MIT License - see the LICENSE file for details.