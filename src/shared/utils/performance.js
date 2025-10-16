/**
 * Simple performance monitoring utilities
 */

// Performance measurement for components
export const measureRenderTime = (componentName, callback) => {
  if (process.env.NODE_ENV !== 'development') {
    return callback()
  }

  const startTime = performance.now()
  const result = callback()
  const endTime = performance.now()
  const duration = endTime - startTime

  // Only log if render time is significant (>5ms)
  if (duration > 5) {
    console.log(`${componentName} render time: ${duration.toFixed(2)}ms`)
  }

  return result
}

// Safe preload utility
export const safePreload = (url) => {
  try {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
    return true
  } catch (error) {
    console.debug(`Preload failed for ${url}:`, error.message)
    return false
  }
}

// Intersection Observer utility
export const createLazyLoadObserver = (callback) => {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  )
}

// Performance budget checker
export const checkPerformanceBudget = (metric, value, budget) => {
  if (value > budget) {
    console.warn(`Performance budget exceeded: ${metric} = ${value}ms (budget: ${budget}ms)`)
    return false
  }
  return true
}
