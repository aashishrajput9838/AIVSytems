import { useEffect, useRef } from 'react'

/**
 * Custom hook for performance monitoring and optimization of the Home component
 */
export const useHomePerformance = () => {
  const componentRef = useRef(null)
  const renderTimeRef = useRef(null)

  useEffect(() => {
    // Performance monitoring
    const startTime = performance.now()
    renderTimeRef.current = startTime

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add will-change for smooth animations when element comes into view
            entry.target.style.willChange = 'transform, opacity'
            
            // Remove will-change after animation completes
            setTimeout(() => {
              if (entry.target.style.willChange) {
                entry.target.style.willChange = 'auto'
              }
            }, 300)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    // Observe feature cards for performance optimization
    const featureCards = document.querySelectorAll('[role="article"]')
    featureCards.forEach(card => observer.observe(card))

    // Cleanup
    return () => {
      observer.disconnect()
      const endTime = performance.now()
      const renderDuration = endTime - renderTimeRef.current
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Home component render time: ${renderDuration.toFixed(2)}ms`)
      }
    }
  }, [])

  // Preload critical resources
  useEffect(() => {
    // Preload dashboard route for faster navigation
    const preloadDashboard = () => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = '/dashboard'
      document.head.appendChild(link)
    }

    // Preload on user interaction or after a delay
    const handleUserInteraction = () => {
      preloadDashboard()
      document.removeEventListener('mousemove', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('mousemove', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    // Fallback preload after 3 seconds
    const timeoutId = setTimeout(preloadDashboard, 3000)

    return () => {
      document.removeEventListener('mousemove', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      clearTimeout(timeoutId)
    }
  }, [])

  return { componentRef }
}
