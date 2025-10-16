# TypeScript Migration Guide

## Overview
This guide provides a comprehensive approach to migrating your React application from JavaScript to TypeScript. The migration is designed to be gradual and non-breaking, allowing you to migrate components one at a time.

## 🚀 Quick Start

### 1. TypeScript Configuration
The project now includes:
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.node.json` - Node.js build tools configuration
- `src/types/` - Centralized type definitions
- `src/types/env.d.ts` - Environment variable types

### 2. Installed Dependencies
```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

## 📁 Project Structure

```
src/
├── types/
│   ├── index.ts          # Main type definitions
│   └── env.d.ts          # Environment and global types
├── features/
│   └── home/
│       ├── Home.jsx      # Original JavaScript component
│       └── Home.tsx      # TypeScript version (example)
└── ...
```

## 🔄 Migration Strategy

### Phase 1: Setup and Configuration ✅
- [x] Install TypeScript dependencies
- [x] Configure TypeScript compiler
- [x] Set up path aliases
- [x] Create type definitions
- [x] Update Vite configuration

### Phase 2: Gradual Migration
- [ ] Migrate utility functions first
- [ ] Migrate shared components
- [ ] Migrate feature components
- [ ] Migrate pages and routes
- [ ] Add strict type checking

### Phase 3: Optimization
- [ ] Enable strict mode
- [ ] Add comprehensive type coverage
- [ ] Optimize bundle size
- [ ] Add type documentation

## 📝 Migration Steps

### Step 1: Rename Files
```bash
# Rename .jsx files to .tsx
mv src/components/Button.jsx src/components/Button.tsx
mv src/features/dashboard/Dashboard.jsx src/features/dashboard/Dashboard.tsx
```

### Step 2: Add Type Annotations
```typescript
// Before (JavaScript)
const Button = ({ children, onClick, variant = 'default' }) => {
  return <button onClick={onClick}>{children}</button>
}

// After (TypeScript)
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'default' 
}) => {
  return <button onClick={onClick}>{children}</button>
}
```

### Step 3: Import Types
```typescript
// Import types from centralized location
import { ButtonProps, ApiResponse, User } from '@/types'

// Use imported types
const MyComponent: React.FC<ButtonProps> = (props) => {
  // Component implementation
}
```

## 🛠️ TypeScript Features

### 1. Strict Type Checking
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 2. Path Aliases
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

### 3. Utility Types
```typescript
// Make all properties optional
type PartialUser = Partial<User>

// Make specific properties required
type RequiredUser = RequiredFields<User, 'id' | 'email'>

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Pick specific properties
type UserBasic = Pick<User, 'id' | 'name' | 'email'>
```

## 📋 Common Patterns

### 1. Component Props
```typescript
interface ComponentProps {
  // Required props
  title: string
  children: React.ReactNode
  
  // Optional props
  className?: string
  onClick?: () => void
  
  // Union types
  variant?: 'primary' | 'secondary' | 'danger'
  
  // Function props
  onSuccess?: (data: ApiResponse) => void
  onError?: (error: Error) => void
}

const Component: React.FC<ComponentProps> = ({
  title,
  children,
  className,
  onClick,
  variant = 'primary',
  onSuccess,
  onError
}) => {
  // Component implementation
}
```

### 2. Hook Types
```typescript
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const useApi = <T>(url: string): UseApiState<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  })
  
  // Hook implementation
  return state
}
```

### 3. Event Handlers
```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  // Handler implementation
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value
  // Handler implementation
}

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  // Handler implementation
}
```

## 🔧 Development Tools

### 1. VS Code Extensions
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- Error Lens

### 2. ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
}
```

### 3. Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 Testing with TypeScript

### 1. Jest Configuration
```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### 2. Test Examples
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders with correct props', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} variant="primary">
        Click me
      </Button>
    )
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## 🚨 Common Issues and Solutions

### 1. Module Resolution
```typescript
// Issue: Cannot find module
// Solution: Add to tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

### 2. JSX in TypeScript
```typescript
// Issue: JSX not recognized
// Solution: Use .tsx extension and configure jsx
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### 3. Third-party Library Types
```bash
# Install types for libraries
npm install --save-dev @types/lodash @types/react-router-dom
```

## 📊 Migration Checklist

### Configuration ✅
- [x] TypeScript installed
- [x] tsconfig.json configured
- [x] Path aliases set up
- [x] Vite configuration updated

### Type Definitions ✅
- [x] Central types file created
- [x] Environment types defined
- [x] Component prop types defined
- [x] API response types defined

### Components (In Progress)
- [x] Home component (TypeScript example)
- [ ] Dashboard component
- [ ] Auth components
- [ ] Shared UI components
- [ ] Utility functions

### Testing
- [ ] Jest configuration
- [ ] Test type definitions
- [ ] Component tests
- [ ] Integration tests

## 🎯 Best Practices

### 1. Type Safety
- Use strict mode
- Avoid `any` type
- Use union types for variants
- Define interfaces for complex objects

### 2. Performance
- Use `React.memo` with typed props
- Memoize expensive calculations
- Use proper dependency arrays

### 3. Maintainability
- Keep types close to usage
- Use descriptive type names
- Document complex types
- Use utility types

### 4. Error Handling
```typescript
interface ApiError {
  message: string
  status: number
  code?: string
}

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    }
  }
  return {
    message: 'Unknown error occurred',
    status: 500
  }
}
```

## 🔄 Next Steps

1. **Start with utilities**: Migrate utility functions first
2. **Component by component**: Migrate one component at a time
3. **Add tests**: Write TypeScript tests for migrated components
4. **Enable strict mode**: Gradually enable stricter type checking
5. **Document types**: Add JSDoc comments to complex types

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Vite TypeScript](https://vitejs.dev/guide/features.html#typescript)

---

**Last Updated**: December 2024
**TypeScript Version**: 5.x
**React Version**: 18.x
