// Common React types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Navigation types
export interface NavigationItem {
  to: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

// Feature card types
export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  index: number
  onCardFocus?: (index: number) => void
}

// Dashboard types
export interface LogEntry {
  id: string
  timestamp: Date
  message: string
  level: 'info' | 'warning' | 'error' | 'success'
  category?: string
  metadata?: Record<string, any>
}

export interface DashboardState {
  logs: LogEntry[]
  isLoading: boolean
  error: string | null
  filters: {
    level: string[]
    category: string[]
    dateRange: {
      start: Date | null
      end: Date | null
    }
  }
}

// API types
export interface ApiResponse<T = any> {
  data: T
  status: number
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, any>
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    custom?: (value: any) => string | null
  }
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
}

// Theme types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    warning: string
    success: string
    info: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
}

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'viewer'
  avatar?: string
  preferences?: {
    theme: string
    language: string
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
}

// Authentication types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type EventHandler<T = Event> = (event: T) => void

// Component prop types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: EventHandler
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: EventHandler
  onFocus?: EventHandler
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Performance types
export interface PerformanceMetrics {
  renderTime: number
  bundleSize: number
  accessibilityScore: number
  lighthouseScore: number
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-hidden'?: boolean
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  role?: string
  tabIndex?: number
}
