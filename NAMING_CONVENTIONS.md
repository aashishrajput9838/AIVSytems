# Naming Conventions Guide

## Component Naming

### File Names
- **Use PascalCase** for all component files
- **Use descriptive, specific names** that clearly indicate the component's purpose
- **Include the component type** in the name when appropriate

**Examples:**
```
✅ Good:
- DashboardHeader.jsx
- AuthLoadingScreen.jsx
- ProtectedRoute.jsx
- ErrorBoundary.jsx

❌ Avoid:
- Header.jsx (too generic)
- Loading.jsx (unclear context)
- Route.jsx (unclear purpose)
```

### Component Names
- **Use PascalCase** for component names
- **Be descriptive and specific** about the component's purpose
- **Include context** when the component is feature-specific

**Examples:**
```jsx
✅ Good:
export default function DashboardHeader() { ... }
export default function AuthLoadingScreen() { ... }
export default function ProtectedRoute() { ... }

❌ Avoid:
export default function Header() { ... }
export default function Loading() { ... }
export default function Route() { ... }
```

## File Organization

### Feature-based Structure
```
src/features/[feature-name]/
├── components/
│   ├── [FeatureName]Component.jsx
│   └── index.js
├── hooks/
├── utils/
└── [FeatureName].jsx (main feature component)
```

### Shared Components
```
src/shared/components/
├── ui/ (reusable UI components)
├── [ComponentName].jsx
└── index.js
```

## Import/Export Naming

### Named Exports
- **Use PascalCase** for component names
- **Use camelCase** for utility functions and hooks

**Examples:**
```jsx
// Component exports
export { DashboardHeader } from './DashboardHeader';
export { AuthLoadingScreen } from './AuthLoadingScreen';

// Utility exports
export { useDashboard } from './hooks/useDashboard';
export { validateInput } from './utils/validation';
```

### Default Exports
- **Use PascalCase** for component names
- **Match the file name** exactly

**Examples:**
```jsx
// Component default export
export default function DashboardHeader() { ... }

// Hook default export
export default function useDashboard() { ... }
```

## CSS Module Naming

### Class Names
- **Use kebab-case** for CSS class names
- **Use descriptive names** that indicate purpose
- **Include component context** when appropriate

**Examples:**
```css
✅ Good:
.dashboard-header
.auth-loading-screen
.protected-route-container
.error-boundary-fallback

❌ Avoid:
.header
.loading
.container
.fallback
```

## Hook Naming

### Custom Hooks
- **Start with "use"** followed by a descriptive name
- **Use camelCase**
- **Be specific about the hook's purpose**

**Examples:**
```jsx
✅ Good:
- useDashboard()
- useAuth()
- useValidation()
- useHomePerformance()

❌ Avoid:
- useData()
- useState()
- useEffect()
```

## Utility Function Naming

### Function Names
- **Use camelCase**
- **Use descriptive verbs** that indicate the action
- **Be specific about the function's purpose**

**Examples:**
```jsx
✅ Good:
- validateInput()
- formatDate()
- calculateTotal()
- handleSubmit()

❌ Avoid:
- validate()
- format()
- calculate()
- handle()
```

## Constants Naming

### Constant Names
- **Use UPPER_SNAKE_CASE** for true constants
- **Use camelCase** for configuration objects
- **Be descriptive and specific**

**Examples:**
```jsx
✅ Good:
- API_ENDPOINTS
- VALIDATION_RULES
- DEFAULT_CONFIG
- MAX_RETRY_ATTEMPTS

❌ Avoid:
- ENDPOINTS
- RULES
- CONFIG
- MAX_RETRIES
```

## Type/Interface Naming

### Type Names
- **Use PascalCase**
- **Start with capital letter**
- **Be descriptive about the data structure**

**Examples:**
```typescript
✅ Good:
- UserProfile
- DashboardData
- AuthState
- ValidationResult

❌ Avoid:
- User
- Data
- State
- Result
```

## Best Practices

1. **Be Consistent**: Once you choose a naming pattern, stick to it throughout the project
2. **Be Descriptive**: Names should clearly indicate purpose and context
3. **Avoid Abbreviations**: Use full words instead of abbreviations
4. **Consider Context**: Include feature context when appropriate
5. **Follow React Conventions**: Use PascalCase for components, camelCase for everything else
6. **Document Exceptions**: If you need to break a convention, document why

## Examples of Good Naming

```jsx
// Component files
DashboardHeader.jsx
AuthLoadingScreen.jsx
ProtectedRoute.jsx
ErrorBoundary.jsx
SearchBar.jsx

// Component names
export default function DashboardHeader() { ... }
export default function AuthLoadingScreen() { ... }
export default function ProtectedRoute() { ... }

// CSS classes
.dashboard-header
.auth-loading-screen
.protected-route
.error-boundary

// Hooks
useDashboard()
useAuth()
useValidation()

// Utilities
validateInput()
formatDate()
handleSubmit()
```

## Review Checklist

Before committing code, ensure:
- [ ] All component files use PascalCase
- [ ] All component names use PascalCase
- [ ] All CSS classes use kebab-case
- [ ] All hooks start with "use" and use camelCase
- [ ] All utility functions use camelCase
- [ ] All constants use UPPER_SNAKE_CASE
- [ ] Names are descriptive and specific
- [ ] Context is included when appropriate
