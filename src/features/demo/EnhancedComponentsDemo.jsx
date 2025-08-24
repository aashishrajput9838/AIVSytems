import React, { useState } from 'react'
import { 
  EnhancedButton, 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent, 
  EnhancedCardFooter,
  EnhancedInput,
  EnhancedSpinner,
  EnhancedDots,
  EnhancedBars,
  EnhancedRings,
  EnhancedWave,
  EnhancedSkeleton,
  EnhancedProgress,
  EnhancedCircularProgress,
  AnimatedBackground,
  EnhancedNotification,
  EnhancedNotificationContainer
} from '@/shared/components/ui'
import { 
  Mail, 
  Lock, 
  Search, 
  Heart, 
  Star, 
  Zap, 
  Settings,
  User,
  Bell,
  Download
} from 'lucide-react'

const EnhancedComponentsDemo = () => {
  const [notifications, setNotifications] = useState([])
  const [progressValue, setProgressValue] = useState(0)
  const [circularProgressValue, setCircularProgressValue] = useState(0)

  const addNotification = (variant, title, message) => {
    const id = Date.now()
    const newNotification = {
      id,
      variant,
      title,
      message,
      show: true
    }
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const simulateProgress = () => {
    setProgressValue(0)
    setCircularProgressValue(0)
    
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
      
      setCircularProgressValue(prev => {
        if (prev >= 100) {
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <AnimatedBackground variant="gradient" className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">
            Enhanced UI Components Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience modern animations, smooth transitions, and beautiful visual effects
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Enhanced Buttons</EnhancedCardTitle>
              <EnhancedCardDescription>
                Modern buttons with hover effects, loading states, and smooth animations
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <EnhancedButton variant="default" icon={<Heart />}>
                  Default
                </EnhancedButton>
                <EnhancedButton variant="outline" icon={<Star />}>
                  Outline
                </EnhancedButton>
                <EnhancedButton variant="ghost" icon={<Zap />}>
                  Ghost
                </EnhancedButton>
                <EnhancedButton variant="glass" icon={<Settings />}>
                  Glass
                </EnhancedButton>
                <EnhancedButton variant="gradient" icon={<Download />}>
                  Gradient
                </EnhancedButton>
                <EnhancedButton variant="neon" icon={<Bell />}>
                  Neon
                </EnhancedButton>
                <EnhancedButton loading>
                  Loading
                </EnhancedButton>
                <EnhancedButton variant="destructive" icon={<User />}>
                  Destructive
                </EnhancedButton>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Cards Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Enhanced Cards</EnhancedCardTitle>
              <EnhancedCardDescription>
                Beautiful cards with different variants and hover effects
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedCard variant="default" hover>
                  <EnhancedCardContent className="p-6">
                    <h3 className="font-semibold mb-2">Default Card</h3>
                    <p className="text-gray-600">Clean and simple design with subtle shadows</p>
                  </EnhancedCardContent>
                </EnhancedCard>
                
                <EnhancedCard variant="glass" hover>
                  <EnhancedCardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-white">Glass Card</h3>
                    <p className="text-white/80">Modern glassmorphism effect with backdrop blur</p>
                  </EnhancedCardContent>
                </EnhancedCard>
                
                <EnhancedCard variant="neon" hover>
                  <EnhancedCardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-amber-400">Neon Card</h3>
                    <p className="text-amber-300/80">Glowing neon effect with animated borders</p>
                  </EnhancedCardContent>
                </EnhancedCard>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Inputs Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Enhanced Inputs</EnhancedCardTitle>
              <EnhancedCardDescription>
                Interactive inputs with floating labels and validation states
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedInput
                  label="Email Address"
                  placeholder="Enter your email"
                  icon={<Mail className="h-4 w-4" />}
                  floatingLabel
                />
                
                <EnhancedInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                  floatingLabel
                />
                
                <EnhancedInput
                  label="Search"
                  placeholder="Search for anything..."
                  icon={<Search className="h-4 w-4" />}
                  iconPosition="right"
                  floatingLabel
                />
                
                <EnhancedInput
                  label="Username"
                  placeholder="Enter username"
                  error="Username is required"
                  floatingLabel
                />
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Loading Components Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Loading Components</EnhancedCardTitle>
              <EnhancedCardDescription>
                Various loading indicators with smooth animations
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <EnhancedSpinner size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Spinner</p>
                </div>
                
                <div className="text-center">
                  <EnhancedDots size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Dots</p>
                </div>
                
                <div className="text-center">
                  <EnhancedBars size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Bars</p>
                </div>
                
                <div className="text-center">
                  <EnhancedRings size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Rings</p>
                </div>
                
                <div className="text-center">
                  <EnhancedWave size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Wave</p>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Progress Components Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '1000ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Progress Components</EnhancedCardTitle>
              <EnhancedCardDescription>
                Linear and circular progress indicators with animations
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-8">
                <div>
                  <h4 className="font-medium mb-4">Linear Progress</h4>
                  <div className="space-y-4">
                    <EnhancedProgress value={progressValue} max={100} showLabel />
                    <EnhancedProgress value={75} max={100} variant="success" striped />
                    <EnhancedProgress value={50} max={100} variant="warning" size="lg" />
                    <EnhancedProgress value={25} max={100} variant="error" size="xl" />
                  </div>
                  <EnhancedButton 
                    onClick={simulateProgress} 
                    className="mt-4"
                    variant="outline"
                  >
                    Simulate Progress
                  </EnhancedButton>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Circular Progress</h4>
                  <div className="flex space-x-8">
                    <EnhancedCircularProgress 
                      value={circularProgressValue} 
                      max={100} 
                      size="default"
                      showLabel
                    />
                    <EnhancedCircularProgress 
                      value={65} 
                      max={100} 
                      variant="success"
                      size="lg"
                    />
                    <EnhancedCircularProgress 
                      value={85} 
                      max={100} 
                      variant="gradient"
                      size="xl"
                    />
                  </div>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Skeleton Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '1200ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Skeleton Components</EnhancedCardTitle>
              <EnhancedCardDescription>
                Loading placeholders with smooth pulse animations
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                <EnhancedSkeleton variant="title" />
                <EnhancedSkeleton variant="text" />
                <EnhancedSkeleton variant="text" className="w-3/4" />
                <EnhancedSkeleton variant="text" className="w-1/2" />
                
                <div className="flex space-x-4 mt-6">
                  <EnhancedSkeleton variant="avatar" />
                  <div className="flex-1 space-y-2">
                    <EnhancedSkeleton variant="text" />
                    <EnhancedSkeleton variant="text" className="w-2/3" />
                  </div>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Notification Demo */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '1400ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Notification System</EnhancedCardTitle>
              <EnhancedCardDescription>
                Interactive notifications with auto-dismiss and progress bars
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <EnhancedButton 
                  onClick={() => addNotification('success', 'Success!', 'Operation completed successfully')}
                  variant="success"
                >
                  Success
                </EnhancedButton>
                
                <EnhancedButton 
                  onClick={() => addNotification('error', 'Error!', 'Something went wrong')}
                  variant="destructive"
                >
                  Error
                </EnhancedButton>
                
                <EnhancedButton 
                  onClick={() => addNotification('warning', 'Warning!', 'Please check your input')}
                  variant="outline"
                >
                  Warning
                </EnhancedButton>
                
                <EnhancedButton 
                  onClick={() => addNotification('info', 'Info', 'Here is some information')}
                  variant="ghost"
                >
                  Info
                </EnhancedButton>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Animated Background Demo */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '1600ms' }}>
          <EnhancedCard variant="elevated" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="gradient-text">Animated Backgrounds</EnhancedCardTitle>
              <EnhancedCardDescription>
                Different background variants with dynamic animations
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedBackground variant="particles" className="h-32 rounded-lg">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-medium">Particles</span>
                  </div>
                </AnimatedBackground>
                
                <AnimatedBackground variant="gradient" className="h-32 rounded-lg">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-800 font-medium">Gradient</span>
                  </div>
                </AnimatedBackground>
                
                <AnimatedBackground variant="mesh" className="h-32 rounded-lg">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-medium">Mesh</span>
                  </div>
                </AnimatedBackground>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>
      </div>

      {/* Notification Container */}
      <EnhancedNotificationContainer position="top-right">
        {notifications.map((notification) => (
          <EnhancedNotification
            key={notification.id}
            variant={notification.variant}
            title={notification.title}
            message={notification.message}
            show={notification.show}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </EnhancedNotificationContainer>
    </AnimatedBackground>
  )
}

export default EnhancedComponentsDemo
