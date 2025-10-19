# AIV Systems - Codebase Structure Index

## Project Overview
A comprehensive AI Response Validation System with Chrome Extension and Web Dashboard for monitoring, validating, and ensuring the accuracy of AI model responses.

## Technology Stack
- **Frontend**: React 19 with Vite, Tailwind CSS
- **Backend**: Firebase Functions, Firestore
- **Chrome Extension**: Manifest V3, JavaScript
- **AI Integration**: OpenAI, Groq, Gemini APIs
- **UI Components**: Radix UI, Lucide Icons, Recharts

## Directory Structure

```
AIV System/
├── chrome-extension/                 # Chrome Extension (Full Version)
│   ├── src/
│   │   ├── background/               # Background scripts
│   │   ├── content/                  # Content scripts for AI platform integration
│   │   ├── core/                     # Core extension files (manifest, package.json)
│   │   ├── debug/                    # Debugging tools and utilities
│   │   ├── popup/                    # Popup UI components
│   │   ├── services/                 # Services (validation, Firebase config)
│   │   ├── tests/                    # Extension test files
│   │   └── utils/                    # Utility functions
│   └── docs/                         # Extension documentation
│
├── chrome-extension-local/           # Chrome Extension (Local Validator)
│   ├── content.js                    # Content script with local validation
│   ├── manifest.json                 # Extension manifest
│   ├── popup.html                    # Popup UI
│   └── popup.js                      # Popup script
│
├── chrome-extension-simple/          # Chrome Extension (Simple Version)
│   ├── content.js                    # Simplified content script
│   ├── manifest.json                 # Extension manifest
│   ├── popup.html                    # Popup UI
│   └── popup.js                      # Popup script
│
├── functions/                        # Firebase Functions (Backend)
│   ├── index.js                      # Main functions entry point
│   ├── package.json                  # Function dependencies
│   └── DEPLOYMENT.md                 # Deployment instructions
│
├── src/                              # Main Web Application
│   ├── app/                          # App root and routing
│   ├── features/                     # Feature modules
│   │   ├── analytics/                # Analytics and insights
│   │   ├── auth/                     # Authentication system
│   │   ├── dashboard/                # Main dashboard
│   │   ├── demo/                     # Component demos
│   │   ├── home/                     # Home page
│   │   ├── pages/                    # Static pages
│   │   └── validation/               # Validation algorithms
│   ├── hooks/                        # Custom React hooks
│   ├── pages/                        # Page components
│   ├── services/                     # API services
│   ├── shared/                       # Shared components and utilities
│   ├── styles/                       # Global styles
│   └── types/                        # TypeScript types
│
├── docs/                             # Project documentation
│   ├── diagrams/                     # System diagrams
│   ├── guides/                       # User guides
│   ├── project/                      # Project documentation
│   ├── research/                     # Research materials
│   └── summaries/                    # Project summaries
│
├── scripts/                          # Utility scripts
│   └── test/                         # Test scripts
│
└── public/                           # Static assets
```

## Key Components

### 1. Chrome Extension (Full Version)
- **Purpose**: Real-time validation of AI chatbot responses
- **Platforms Supported**: ChatGPT, Gemini, Groq, Claude, Copilot
- **Architecture**: 
  - Content scripts capture interactions
  - Background service handles validation
  - Popup UI displays results

### 2. Chrome Extension (Local Validator)
- **Purpose**: Privacy-focused validation running entirely in-browser
- **Features**: 
  - No external API calls
  - Built-in validation rules
  - Works offline

### 3. Web Application
- **Dashboard**: Main validation interface
- **Analytics**: Data visualization and insights
- **Authentication**: Firebase Auth integration
- **Validation Algorithms**: Multi-validator approach with scoring

### 4. Backend Services
- **Firebase Functions**: Validation API endpoints
- **Firestore**: Data storage and retrieval
- **Validation Service**: Core validation logic

## File Index

### Chrome Extension Files
- `chrome-extension/src/background/background.js` - Background script for message handling
- `chrome-extension/src/content/content.js` - Content script for AI platform integration
- `chrome-extension/src/core/manifest.json` - Extension manifest
- `chrome-extension/src/popup/popup.html` - Popup UI
- `chrome-extension/src/popup/popup.js` - Popup functionality
- `chrome-extension/src/services/validation-service.js` - Validation service
- `chrome-extension/src/services/firebase-config.js` - Firebase configuration

### Web Application Files
- `src/app/App.jsx` - Root application component
- `src/app/router.jsx` - Application routing
- `src/features/dashboard/Dashboard.jsx` - Main dashboard interface
- `src/features/auth/AuthProvider.jsx` - Authentication context
- `src/features/validation/algorithms.js` - Validation algorithms
- `src/services/firebase/firebase.js` - Firebase service
- `src/services/ai/models.js` - AI model integration

### Backend Files
- `functions/index.js` - Firebase Functions implementation
- `functions/package.json` - Backend dependencies

### Documentation
- `docs/CODEBASE_INDEX.txt` - Original codebase index
- `docs/project/` - Project documentation
- `docs/guides/` - User guides
- `docs/research/` - Research materials

## Development Setup

### Environment Variables
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
VITE_GROQ_API_KEY=
VITE_GEMINI_API_KEY=
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features

1. **AI Response Validation**
   - Multi-validator approach with weighted scoring
   - Entity recognition for different content types
   - Factual accuracy checking via web search

2. **Cross-Platform Support**
   - Works with ChatGPT, Gemini, Groq, Claude, Copilot
   - Consistent validation across platforms

3. **Privacy Options**
   - Full extension with cloud validation
   - Local validator with no external calls
   - Simple extension for basic functionality

4. **Analytics & Insights**
   - Real-time monitoring of AI responses
   - Data visualization with Recharts
   - Export capabilities for analysis

5. **User Experience**
   - Modern UI with Tailwind CSS
   - Responsive design
   - Intuitive dashboard controls

## Architecture Patterns

### Chrome Extension Architecture
```
[AI Platforms] → [Content Scripts] → [Background Service] → [Validation API] → [Popup UI]
                            ↓
                    [Local Storage]
```

### Web Application Architecture
```
[Frontend] ↔ [Firebase Auth] ↔ [Firestore] ↔ [Firebase Functions]
```

## Data Flow

1. **Content Capture**: Content scripts monitor AI platforms for new responses
2. **Validation Request**: Background service sends responses to validation API
3. **Processing**: Firebase Functions apply validation algorithms
4. **Storage**: Results stored in Firestore
5. **Display**: Popup and dashboard show validation results
6. **Analytics**: Data processed for insights and visualization

## Security Considerations

- Protected routes requiring authentication
- Firestore security rules for data access
- Input validation and sanitization
- Secure API communication
- Audit trails for all validation actions

## Performance Optimization

- Lazy loading for route components
- Efficient state management
- Debounced search functionality
- Pagination for large datasets
- Caching for validation results

## Testing Strategy

- Unit tests for validation algorithms
- Integration tests with Firebase
- UI component testing
- Chrome extension functionality tests
- Performance benchmarking

## Deployment

- Vite build optimization for web app
- Firebase hosting configuration
- Chrome Web Store packaging for extensions
- Environment variable management
- Monitoring and error tracking setup