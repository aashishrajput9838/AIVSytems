# Organized Project Structure

## Overview
This document describes the organized structure of the AIV System project after restructuring for better maintainability and clarity.

## Directory Structure
```
.
├── public/                      # Static assets
├── src/                        # Source code
│   ├── app/                    # Core application files
│   ├── assets/                 # Images, fonts, and other assets
│   ├── features/               # Feature-based modules
│   │   ├── analytics/          # Analytics feature
│   │   ├── auth/               # Authentication feature
│   │   ├── dashboard/          # Dashboard feature
│   │   ├── demo/               # Demo components
│   │   ├── home/               # Home feature
│   │   ├── pages/              # Static pages
│   │   └── validation/         # Validation algorithms
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── services/               # API services and integrations
│   │   ├── ai/                 # AI model integrations
│   │   ├── api/                # API service layer
│   │   └── firebase/           # Firebase integration
│   ├── shared/                 # Shared components and utilities
│   │   ├── components/         # Shared UI components
│   │   ├── constants/          # Application constants
│   │   └── utils/              # Utility functions
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
│   ├── diagrams/               # Diagram files
│   ├── guides/                 # Development guides
│   ├── project/                # Project documentation
│   ├── research/               # Research documents
│   └── summaries/              # Implementation summaries
├── scripts/                    # Build and utility scripts
│   ├── test/                   # Test scripts
│   └── install-devtools.md     # Installation guide
├── configs/                    # Configuration files
├── tests/                      # Test files (to be created)
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
└── node_modules/               # Dependencies (not tracked)
```

## Key Improvements

1. **Documentation Organization**:
   - Moved all documentation files to the `docs/` directory
   - Categorized documents into subdirectories:
     - `docs/diagrams/` - Diagram files
     - `docs/guides/` - Development guides
     - `docs/project/` - Project-level documentation
     - `docs/research/` - Research-related documents
     - `docs/summaries/` - Implementation summaries

2. **Script Organization**:
   - Moved test scripts to `scripts/test/`
   - Kept installation guide in the main `scripts/` directory

3. **Configuration Files**:
   - Configuration files like `tailwind.config.js`, `vite.config.js`, etc. remain in the root for tool compatibility

4. **Future Improvements**:
   - Consider creating a `configs/` directory for configuration files
   - Create a `tests/` directory structure for better test organization

## Benefits of This Structure

1. **Improved Maintainability**: Related files are grouped together
2. **Easier Navigation**: Clear directory naming makes it easy to find files
3. **Scalability**: Structure supports growth of the application
4. **Separation of Concerns**: Different types of files are clearly separated
5. **Documentation Accessibility**: All documentation is centralized and categorized

## Next Steps

1. Consider moving configuration files to a dedicated `configs/` directory
2. Create the `tests/` directory structure for better test organization
3. Review and potentially reorganize some of the deeply nested component structures