/**
 * Accessibility utilities for the Home component
 */

/**
 * Manages focus for keyboard navigation
 * @param {HTMLElement} element - The element to focus
 * @param {boolean} scrollIntoView - Whether to scroll the element into view
 */
export const focusElement = (element, scrollIntoView = true) => {
  if (element && typeof element.focus === 'function') {
    element.focus()
    if (scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

/**
 * Handles keyboard navigation for feature cards
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement[]} cards - Array of card elements
 * @param {number} currentIndex - Current focused card index
 * @returns {number} New focused card index
 */
export const handleCardNavigation = (event, cards, currentIndex) => {
  const cardCount = cards.length
  
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      return (currentIndex + 1) % cardCount
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      return currentIndex === 0 ? cardCount - 1 : currentIndex - 1
    case 'Home':
      event.preventDefault()
      return 0
    case 'End':
      event.preventDefault()
      return cardCount - 1
    default:
      return currentIndex
  }
}

/**
 * Creates a focus trap for modal-like components
 * @param {HTMLElement} container - The container element
 * @param {HTMLElement[]} focusableElements - Array of focusable elements
 */
export const createFocusTrap = (container, focusableElements) => {
  if (!container || !focusableElements.length) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Announces changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - The priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove the announcement after it's been read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Validates color contrast for accessibility
 * @param {string} foregroundColor - The foreground color (hex)
 * @param {string} backgroundColor - The background color (hex)
 * @returns {boolean} Whether the contrast ratio meets WCAG AA standards
 */
export const validateColorContrast = (foregroundColor, backgroundColor) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Calculate relative luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const fg = hexToRgb(foregroundColor)
  const bg = hexToRgb(backgroundColor)

  if (!fg || !bg) return false

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b)
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b)

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                (Math.min(fgLuminance, bgLuminance) + 0.05)

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  return ratio >= 4.5
}
