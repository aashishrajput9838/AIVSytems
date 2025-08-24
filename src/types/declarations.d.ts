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
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
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
