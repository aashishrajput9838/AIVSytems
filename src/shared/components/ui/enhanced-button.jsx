import React from 'react'
import { cn } from '@/shared/utils/cn'

const buttonVariants = {
  default: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl",
  destructive: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
  outline: "border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  ghost: "hover:bg-amber-50 text-amber-600 hover:text-amber-700",
  link: "text-amber-600 underline-offset-4 hover:underline",
  glass: "glass text-white border-white/20 hover:bg-white/20",
  gradient: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",
  neon: "bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]"
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  xl: "h-12 px-10 text-lg",
  icon: "h-10 w-10"
}

const EnhancedButton = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  children,
  icon,
  iconPosition = "left",
  onClick,
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "transform hover:scale-105 active:scale-95",
    "hover-lift",
    buttonVariants[variant],
    buttonSizes[size],
    className
  )

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      // Add ripple effect
      const button = e.currentTarget
      const ripple = document.createElement('span')
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `
      
      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
      
      onClick(e)
    }
  }

  // If asChild is true, clone the child element with our props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      className: cn(baseClasses, children.props.className),
      disabled: disabled || loading,
      onClick: handleClick,
      ...props
    })
  }

  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      
      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2 h-4 w-4">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !loading && (
        <span className="ml-2 h-4 w-4">{icon}</span>
      )}
    </button>
  )
})

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, buttonVariants, buttonSizes }
