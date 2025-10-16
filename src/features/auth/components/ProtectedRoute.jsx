import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { AuthLoadingScreen } from './AuthLoadingScreen'

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, loading, isInitialized } = useAuth()
  const location = useLocation()

  // Debug logging
  console.log('ProtectedRoute:', {
    requireAuth,
    loading,
    isInitialized,
    user: user ? user.email : 'No user',
    currentPath: location.pathname
  })

  // Show loading screen while auth is initializing
  if (!isInitialized || loading) {
    console.log('ProtectedRoute: Loading... (initializing or loading)')
    return <AuthLoadingScreen />
  }

  // If auth is required and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    console.log('ProtectedRoute: Redirecting to login - no user')
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
    console.log('ProtectedRoute: Redirecting to dashboard - user already logged in')
    return <Navigate to="/dashboard" replace />
  }

  // User is authenticated and can access the route
  console.log('ProtectedRoute: Allowing access')
  return <>{children}</>
}

export const PublicRoute = ({ children }) => {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool,
  redirectTo: PropTypes.string
}

ProtectedRoute.defaultProps = {
  requireAuth: true,
  redirectTo: '/login'
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
}
