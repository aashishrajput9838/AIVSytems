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