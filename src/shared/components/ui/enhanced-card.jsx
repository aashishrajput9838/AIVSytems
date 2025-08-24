import React from 'react'
import { cn } from '@/shared/utils/cn'

const cardVariants = {
  default: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
  elevated: "bg-white border-0 shadow-lg hover:shadow-xl",
  glass: "glass border-white/20",
  glassDark: "glass-dark border-white/10",
  gradient: "bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg",
  neon: "bg-black/20 border border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]",
  animated: "bg-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
}

const EnhancedCard = React.forwardRef(({
  className,
  variant = "default",
  children,
  hover = true,
  animated = false,
  ...props
}, ref) => {
  const baseClasses = cn(
    "rounded-xl transition-all duration-300 overflow-hidden",
    hover && "hover-lift",
    animated && "animate-fade-in",
    cardVariants[variant],
    className
  )

  return (
    <div
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  )
})

const EnhancedCardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
})

const EnhancedCardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  )
})

const EnhancedCardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
})

const EnhancedCardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
})

const EnhancedCardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
})

EnhancedCard.displayName = "EnhancedCard"
EnhancedCardHeader.displayName = "EnhancedCardHeader"
EnhancedCardTitle.displayName = "EnhancedCardTitle"
EnhancedCardDescription.displayName = "EnhancedCardDescription"
EnhancedCardContent.displayName = "EnhancedCardContent"
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
  cardVariants
}
