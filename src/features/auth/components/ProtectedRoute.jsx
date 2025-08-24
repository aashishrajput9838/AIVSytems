import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { AuthLoadingScreen } from './AuthLoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading screen while checking authentication
  if (loading) {
    return <AuthLoadingScreen />
  }

  // If auth is required and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    )
  }

  // If auth is not required and user is authenticated, redirect to dashboard
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />
  }

  // User is authenticated and can access the route
  return <>{children}</>
}

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
}
