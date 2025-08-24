import { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent } from '@/shared/components/ui/card'
import { announceToScreenReader } from '../utils/accessibility'

export default memo(function HomeFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  index, 
  onCardFocus 
}) {
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Announce the feature to screen readers
      announceToScreenReader(`Feature: ${title}. ${description}`)
    }
  }, [title, description])

  const handleFocus = useCallback(() => {
    onCardFocus?.(index)
  }, [index, onCardFocus])

  return (
    <Card 
      className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2"
      tabIndex={0}
      role="article"
      aria-labelledby={`feature-title-${index}`}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div 
            className="p-1.5 sm:p-2 bg-amber-100 rounded-lg flex-shrink-0"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
          </div>
          <h3 
            id={`feature-title-${index}`}
            className="font-semibold text-black text-sm sm:text-base"
          >
            {title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
})

HomeFeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onCardFocus: PropTypes.func
}
