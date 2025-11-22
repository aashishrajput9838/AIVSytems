# AIV Systems - AI Validation Platform

AIV (AI Validation) System is a comprehensive solution for validating AI responses in real-time across multiple platforms. This repository contains a Chrome extension, web dashboard, Firebase backend services, and extensive documentation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build Chrome extension
npm run build:extension

# Build everything
npm run build:all
```

## 🧩 Core Components

### Chrome Extension
Three versions of Chrome extensions provide different levels of validation:

1. **Full Version** - Real-time validation with backend integration
2. **Local Validator** - Privacy-focused validation running entirely in-browser
3. **Simple Version** - Basic functionality for minimal validation needs

**Key Features:**
- Real-time capture of AI chat interactions across multiple platforms
- Advanced validation algorithms for response accuracy
- Integration with AIV System backend for comprehensive validation
- Supports ChatGPT, Gemini, Groq, Claude, and Copilot
- Privacy-focused design with local processing options

### Web Dashboard
React-based dashboard for monitoring and analyzing AI response validation:

**Key Features:**
- Real-time monitoring of AI responses
- Comprehensive dashboard with analytics
- Data visualization using Recharts
- CSV export functionality
- Search and filtering capabilities
- Authentication with Firebase

### Backend Services
Firebase Functions providing validation API endpoints:

**Key Features:**
- Serverless architecture with Firebase Functions
- Scalable data storage with Firestore
- RESTful API for validation requests
- Cross-origin resource sharing support
- Secure data processing and storage

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account for backend services
- API keys for AI services (OpenAI, Google Gemini, etc.)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aivsystems
   ```

2. **Install dependencies**
   ```bash
   # Main project
   npm install
   
   # Chrome extension
   cd chrome-extension
   npm install
   cd ..
   
   # Firebase functions
   cd functions
   npm install
   cd ..
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # Start web dashboard
   npm run dev
   
   # Build Chrome extension
   npm run build:extension
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# AI Service Keys
VITE_GEMINI_API_KEY=
VITE_OPENAI_API_KEY=
VITE_OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
VITE_OPENAI_MODEL=gemini-2.5-flash-preview-05-20

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

### Chrome Extension Runtime Environment

Chrome extensions may not have direct access to `import.meta.env` at runtime. Use one of the following methods:

1. **Build-time injection (preferred)**: Replace values during build process
2. **Runtime injection**: Use `window.__ENV__` via `chrome-extension/src/lib/runtime-env-inject.js`

## 📁 Project Structure

```
AIV System/
├── chrome-extension/             # Chrome extension source code
│   ├── src/                      # Extension source files
│   │   ├── components/           # UI components
│   │   ├── content/              # Content scripts
│   │   ├── core/                 # Core files (manifest.json)
│   │   ├── lib/                  # Libraries and utilities
│   │   └── background/           # Background scripts
│   ├── dist/                     # Built extension files
│   └── docs/                     # Extension documentation
├── src/                          # Main web application
│   ├── app/                      # Core application files
│   ├── features/                 # Feature modules
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API services
│   ├── shared/                   # Shared components
│   └── pages/                    # Page components
├── functions/                    # Firebase Functions backend
├── docs/                         # Project documentation
├── scripts/                      # Utility scripts
└── public/                       # Static assets
```

## 🎯 Key Features

### Advanced Validation Algorithms
1. **Error Keyword Detection** - Identifies responses containing error-related keywords
2. **Response Length Validation** - Ensures responses meet minimum length requirements
3. **Sensitive Information Detection** - Identifies potentially sensitive data in user queries
4. **Professional Claims Validation** - Verifies professional claims about individuals
5. **Personal Relationship Validation** - Handles personal relationship verification questions
6. **Factual Accuracy Validation** - Performs web search-based fact checking

### Cross-Platform Support
- ✅ ChatGPT (https://chat.openai.com)
- ✅ Google Gemini (https://gemini.google.com)
- ✅ Groq (https://groq.com)
- ✅ Claude (https://claude.ai)
- ✅ Microsoft Copilot (https://copilot.microsoft.com)

### Privacy Options
- **Full Extension** - With cloud validation
- **Local Validator** - No external calls, works offline
- **Simple Extension** - Basic functionality

## 🔧 Development Workflow

### Available Scripts

```bash
# Web Application
npm run dev              # Start development server
npm run build            # Build for production
npm run build:web        # Build web application
npm run preview          # Preview production build

# Chrome Extension
npm run build:extension  # Build Chrome extension
npm run build:all        # Build all components

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

### Building Chrome Extension

```bash
# Navigate to extension directory
cd chrome-extension

# Build the extension
npm run build

# Watch for changes
npm run watch

# Package for distribution
npm run package
```

## 🏗️ Technology Stack

### Frontend
- **React 19** with Vite build system
- **React Router DOM** for client-side routing
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend
- **Firebase Functions** for serverless backend
- **Firestore** for data storage
- **Firebase Authentication** for user management

### Chrome Extensions
- **Manifest V3** compliance
- **JavaScript** for all extension logic
- **HTML/CSS** for popup UI

### AI Integration
- **Google Gemini API** integration
- **Groq API** integration
- **OpenAI API** integration
- Advanced NLP algorithms for text validation

## 📊 Architecture Overview

### Data Flow
1. **Capture**: Chrome extension content script monitors DOM for AI chat interactions
2. **Process**: Background script receives captured interactions and sends to validation service
3. **Validate**: Validation service performs multi-source fact checking using external APIs
4. **Store**: Results are sent to Firebase Functions backend for storage in Firestore
5. **Display**: Web dashboard retrieves and displays validation results

### Component Architecture
- **Chrome Extension**: Captures and validates AI responses in real-time
- **Web Dashboard**: Provides visualization and management interface
- **Backend Services**: Handles validation logic and data storage
- **Validation Algorithms**: Implements sophisticated validation techniques

## 🔒 Security Considerations

- Protected routes requiring authentication
- Firestore security rules for data access
- Input validation and sanitization
- Secure API communication
- Audit trails for all validation actions

## 📚 Documentation

- [CHROME_EXTENSION_INSTALLATION.md](CHROME_EXTENSION_INSTALLATION.md) - Installation guide for Chrome extension
- [DEPLOYMENT_FREE.md](DEPLOYMENT_FREE.md) - Free deployment options
- [GETTING_STARTED.md](GETTING_STARTED.md) - Getting started guide
- [docs/project/PROJECT_SUMMARY.md](docs/project/PROJECT_SUMMARY.md) - Comprehensive project overview
- [docs/architecture/CODEBASE_STRUCTURE_INDEX.md](docs/architecture/CODEBASE_STRUCTURE_INDEX.md) - Detailed codebase structure

## 🚀 Deployment

### Web Application
Deploy to any static hosting service (Vercel, Netlify, Firebase Hosting)

### Chrome Extension
Package and upload to Chrome Web Store

### Backend Services
Deploy Firebase Functions to Google Cloud

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on the GitHub repository or contact the development team.
