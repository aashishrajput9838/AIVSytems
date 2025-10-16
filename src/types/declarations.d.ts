// TypeScript declarations for JavaScript modules during migration

// UI Components
declare module '@/shared/components/ui/button' {
  import { ComponentProps } from 'react'
  
  interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
  }
  
  export const Button: React.FC<ButtonProps>
  export const buttonVariants: (props: any) => string
}

declare module '@/shared/components/ui/card' {
  import { ComponentProps } from 'react'
  
  interface CardProps extends ComponentProps<'div'> {
    variant?: 'default' | 'outlined' | 'elevated'
  }
  
  interface CardContentProps extends ComponentProps<'div'> {
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }
  
  export const Card: React.FC<CardProps>
  export const CardContent: React.FC<CardContentProps>
}

// Home component hooks and utilities
declare module '@/features/home/hooks/useHomePerformance' {
  export const useHomePerformance: () => {
    componentRef: React.RefObject<HTMLDivElement>
  }
}

declare module '@/features/home/utils/accessibility' {
  export const focusElement: (element: HTMLElement | null, scrollIntoView?: boolean) => void
  
  export const handleCardNavigation: (
    event: KeyboardEvent,
    cards: HTMLElement[],
    currentIndex: number
  ) => number
  
  export const createFocusTrap: (
    container: HTMLElement,
    focusableElements: HTMLElement[]
  ) => (() => void) | undefined
  
  export const announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  
  export const validateColorContrast: (foregroundColor: string, backgroundColor: string) => boolean
}

// React Router
declare module 'react-router-dom' {
  export interface LinkProps {
    to: string
    children?: React.ReactNode
    className?: string
    'aria-label'?: string
  }
  
  export const Link: React.FC<LinkProps>
}

// Lucide React icons
declare module 'lucide-react' {
  export interface IconProps {
    className?: string
    size?: number | string
    strokeWidth?: number
    'aria-hidden'?: boolean
  }
  
  export const ArrowDownRight: React.FC<IconProps>
  export const Brain: React.FC<IconProps>
  export const Shield: React.FC<IconProps>
  export const Activity: React.FC<IconProps>
  export const Loader2: React.FC<IconProps>
  export const AlertCircle: React.FC<IconProps>
  export const X: React.FC<IconProps>
  export const RefreshCw: React.FC<IconProps>
  export const Eye: React.FC<IconProps>
  export const EyeOff: React.FC<IconProps>
  export const Mail: React.FC<IconProps>
  export const Lock: React.FC<IconProps>
  export const ArrowLeft: React.FC<IconProps>
  export const CheckCircle: React.FC<IconProps>
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

// Auth Components
declare module '@/features/auth/components/LoadingSpinner' {
  interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'primary' | 'white'
    className?: string
    text?: string
  }
  export const LoadingSpinner: React.FC<LoadingSpinnerProps>
  export const LoadingOverlay: React.FC<{ children: React.ReactNode; loading: boolean }>
}

declare module '@/features/auth/components/AuthError' {
  interface AuthErrorProps {
    error: string
    severity?: 'error' | 'warning' | 'info'
    onRetry?: () => void
    onDismiss?: () => void
    className?: string
  }
  export const AuthError: React.FC<AuthErrorProps>
  export const AuthSuccess: React.FC<{ message: string; className?: string }>
}

declare module '@/features/auth/components/AuthInput' {
  interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    icon?: React.ComponentType<{ className?: string }>
    error?: string
    loading?: boolean
    showPasswordToggle?: boolean
    helperText?: string
  }
  export const AuthInput: React.ForwardRefExoticComponent<AuthInputProps & React.RefAttributes<HTMLInputElement>>
}

declare module '@/features/auth/components/AuthLoadingScreen' {
  interface AuthLoadingScreenProps {
    message?: string
  }
  export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps>
  export const AuthSkeleton: React.FC
}

declare module '@/features/auth/components/ProtectedRoute' {
  interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
    redirectTo?: string
  }
  export const ProtectedRoute: React.FC<ProtectedRouteProps>
  export const PublicRoute: React.FC<{ children: React.ReactNode }>
}

declare module '@/features/auth/components' {
  export * from '@/features/auth/components/LoadingSpinner'
  export * from '@/features/auth/components/AuthError'
  export * from '@/features/auth/components/AuthInput'
  export * from '@/features/auth/components/AuthLoadingScreen'
  export * from '@/features/auth/components/ProtectedRoute'
}

// Allow JavaScript files to be imported
declare module '*.js' {
  const content: any
  export default content
}

declare module '*.jsx' {
  const content: any
  export default content
}
