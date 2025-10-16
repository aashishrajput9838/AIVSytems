import { useEffect, useRef } from 'react'
import { safePreload, createLazyLoadObserver } from '@/shared/utils/performance'

/**
 * Optimized performance monitoring hook for the Home component
 */
export const useHomePerformance = () => {
  const componentRef = useRef(null)
  const observerRef = useRef(null)
  const hasLoggedRef = useRef(false)

  // Performance monitoring - only run once per mount with reduced overhead
  useEffect(() => {
    if (hasLoggedRef.current) return

    const startTime = performance.now()
    
    // Use requestIdleCallback for non-critical performance logging
    const logPerformance = () => {
      if (!hasLoggedRef.current) {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        // Only log if render time is significant (>100ms) in development
        if (process.env.NODE_ENV === 'development' && duration > 100) {
          console.warn(`Home component render time: ${duration.toFixed(2)}ms - Consider optimization`)
        }
        hasLoggedRef.current = true
      }
    }

    // Use requestIdleCallback if available, otherwise setTimeout with longer delay
    if (window.requestIdleCallback) {
      requestIdleCallback(logPerformance, { timeout: 2000 })
    } else {
      setTimeout(logPerformance, 200)
    }
  }, [])

  // Lazy loading for feature cards - optimized to run only once
  useEffect(() => {
    if (observerRef.current) return

    const observer = createLazyLoadObserver((target) => {
      // Add will-change for smooth animations when element comes into view
      target.style.willChange = 'transform, opacity'
      
      // Remove will-change after animation completes
      setTimeout(() => {
        if (target.style.willChange) {
          target.style.willChange = 'auto'
        }
      }, 300)
    })

    if (observer) {
      observerRef.current = observer
      
      // Observe feature cards with a small delay to ensure DOM is ready
      const observeCards = () => {
        const featureCards = document.querySelectorAll('[role="article"]')
        featureCards.forEach(card => observer.observe(card))
      }

      // Use requestIdleCallback for better performance
      if (window.requestIdleCallback) {
        requestIdleCallback(observeCards, { timeout: 1000 })
      } else {
        setTimeout(observeCards, 100)
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  // Preload dashboard route - optimized to run only once
  useEffect(() => {
    let hasPreloaded = false

    const preloadDashboard = () => {
      if (hasPreloaded) return
      hasPreloaded = true
      safePreload('/dashboard')
    }

    // Preload on user interaction with debouncing
    let interactionTimeout = null
    const handleUserInteraction = () => {
      if (interactionTimeout) {
        clearTimeout(interactionTimeout)
      }
      interactionTimeout = setTimeout(preloadDashboard, 1000)
    }

    document.addEventListener('mousemove', handleUserInteraction, { passive: true })
    document.addEventListener('touchstart', handleUserInteraction, { passive: true })

    // Fallback preload after 10 seconds instead of 5
    const timeoutId = setTimeout(preloadDashboard, 10000)

    return () => {
      document.removeEventListener('mousemove', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      if (interactionTimeout) {
        clearTimeout(interactionTimeout)
      }
      clearTimeout(timeoutId)
    }
  }, [])

  return { componentRef }
}
