import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Link } from 'react-router-dom'
import { ArrowDownRight, Brain, Shield, Activity } from 'lucide-react'
import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { useHomePerformance } from './hooks/useHomePerformance'
import { focusElement, handleCardNavigation, announceToScreenReader } from './utils/accessibility'
import { CardSkeleton, ContentSkeleton, Skeleton } from '@/shared/components/ui'

// Skip link component for accessibility
const SkipLink = memo(() => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded"
  >
    Skip to main content
  </a>
))

// Optimized navigation component
const Navigation = memo(() => {
  const navItems = useMemo(() => [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/about', label: 'ABOUT' },
    { to: '/capabilities', label: 'CAPABILITIES' },
    { to: '/insights', label: 'INSIGHTS' },
    { to: '/contact', label: 'CONTACT', icon: ArrowDownRight }
  ], [])

  return (
    <nav 
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-black"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label={item.label}
        >
          {item.icon ? (
            <Button asChild variant="ghost" className="flex items-center gap-1 text-black hover:text-amber-600 hover:bg-amber-50 text-xs sm:text-sm">
              <span>
                <item.icon className="h-3 w-3" aria-hidden="true" />
                {item.label}
              </span>
            </Button>
          ) : (
            item.label
          )}
        </Link>
      ))}
    </nav>
  )
})

// Optimized feature card component with enhanced accessibility
const FeatureCard = memo(({ icon: Icon, title, description, index, onCardFocus }) => {
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

// Optimized central graphic component
const CentralGraphic = memo(() => (
  <div 
    className="relative mx-auto w-64 h-64 mb-8"
    role="img"
    aria-label="AI Validation System Logo"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-black rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.8),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-8xl font-bold opacity-90" aria-hidden="true">AI</div>
      </div>
    </div>
    <div 
      className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-gray-100 rounded-lg"
      aria-hidden="true"
    ></div>
  </div>
))

export default function Home() {
  const { componentRef } = useHomePerformance()
  const [focusedCardIndex, setFocusedCardIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize feature data to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      icon: Brain,
      title: 'AI Monitoring',
      description: 'Real-time validation and monitoring of AI responses with advanced NLP algorithms.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Multi-source fact checking and comprehensive audit trails for complete transparency.'
    },
    {
      icon: Activity,
      title: 'Live Dashboard',
      description: 'Interactive dashboard with real-time validation scores and detailed analytics.'
    }
  ], [])

  // Memoize the CTA button handler
  const handleCTAClick = useCallback(() => {
    // Analytics tracking could be added here
    console.log('Dashboard CTA clicked')
    announceToScreenReader('Navigating to dashboard')
  }, [])

  // Handle card focus for keyboard navigation
  const handleCardFocus = useCallback((index) => {
    setFocusedCardIndex(index)
  }, [])

  // Keyboard navigation for feature cards
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.target.closest('[role="article"]')) {
        const cards = document.querySelectorAll('[role="article"]')
        const newIndex = handleCardNavigation(event, Array.from(cards), focusedCardIndex)
        if (newIndex !== focusedCardIndex) {
          setFocusedCardIndex(newIndex)
          focusElement(cards[newIndex])
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [focusedCardIndex])

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={componentRef} className="relative min-h-dvh w-full overflow-hidden">
      <SkipLink />
      
      {/* Dynamic Background - optimized with will-change */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      {/* Main White Content Area */}
      <div className="relative z-10 mx-auto mt-4 sm:mt-8 mb-4 sm:mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        {/* Header/Navigation */}
        <header 
          className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-100 space-y-4 sm:space-y-0"
          role="banner"
        >
          <div className="text-sm font-medium text-black">
            <span className="sr-only">AIV Systems</span>
            aivsystems
          </div>
          <Navigation />
        </header>

        {/* Main Content */}
        <main 
          id="main-content"
          className="p-4 sm:p-6 lg:p-8"
          role="main"
        >
                  {/* Main Headline */}
        <section className="text-center mb-8 sm:mb-12">
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              <Skeleton className="h-16 w-64 sm:h-24 sm:w-96 mx-auto" />
              <div className="flex justify-center">
                <Skeleton className="h-20 w-20 sm:h-32 sm:w-32 rounded-full" />
              </div>
              <Skeleton className="h-16 w-56 sm:h-24 sm:w-80 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 lg:mb-8 tracking-tight px-4">
                AIV SYSTEMS
              </h1>
              
              <CentralGraphic />
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight px-4">
                VALIDATION
              </h2>
            </>
          )}
        </section>

          {/* Supporting Text */}
          <section 
            className="flex flex-col sm:flex-row justify-between items-center sm:items-end text-sm text-black space-y-4 sm:space-y-0 px-4"
            aria-label="System description"
          >
            <div className="max-w-xs text-center sm:text-left">
              <p className="font-medium">
                A <span className="font-bold">CREATIVE AI VALIDATION</span> SYSTEM
              </p>
            </div>
            <div className="max-w-xs text-center sm:text-right">
              <p className="font-medium">
                SETTING <span className="font-bold">AI TRUST IN MOTION</span>
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Action Cards */}
      <section 
        className="relative z-20 mx-auto w-[95%] max-w-6xl"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 px-4 sm:px-0">
          {isLoading ? (
            <>
              <CardSkeleton showActions={false} />
              <CardSkeleton showActions={false} />
              <CardSkeleton showActions={false} />
            </>
          ) : (
            features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                onCardFocus={handleCardFocus}
              />
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 px-4">
          <Button 
            asChild 
            className="bg-black text-white hover:bg-amber-600 hover:text-black transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full sm:w-auto"
            onClick={handleCTAClick}
          >
            <Link to="/dashboard" aria-label="Navigate to dashboard">
              Explore Dashboard
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
