import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { Shield } from 'lucide-react'

interface AuthLoadingScreenProps {
  message?: string
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ 
  message = 'Checking authentication...' 
}) => {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Dynamic Background (same as Home) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-dvh">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
            <Shield className="size-8 text-white" />
          </div>
          
          {/* Loading Spinner */}
          <LoadingSpinner 
            size="lg" 
            variant="white" 
            text={message}
            className="text-white"
          />
          
          {/* Subtitle */}
          <p className="text-white/80 text-sm max-w-xs">
            Please wait while we verify your authentication status
          </p>
        </div>
      </div>
    </div>
  )
}

export const AuthSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
      <div className="h-11 bg-gray-200 rounded-lg"></div>
    </div>
  )
}
