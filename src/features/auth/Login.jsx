import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Shield, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { AuthInput } from './components/AuthInput'
import { AuthError, AuthSuccess } from './components/AuthError'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'
  const { signInWithEmail, signInWithGoogle, authError, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Clear errors when component mounts or when auth error changes
  useEffect(() => {
    if (authError) {
      setLocalError(authError)
    }
  }, [authError])

  const clearErrors = () => {
    setLocalError('')
    clearError()
  }

  async function handleEmailLogin(e) {
    e.preventDefault()
    if (!email || !password) {
      setLocalError('Please fill in all fields')
      return
    }

    try {
      setEmailLoading(true)
      setLocalError('')
      setSuccess(false)
      
      await signInWithEmail(email, password)
      setSuccess(true)
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate(redirectTo, { replace: true })
      }, 1000)
    } catch (err) {
      setLocalError(err?.message || 'Login failed')
    } finally {
      setEmailLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true)
      setLocalError('')
      setSuccess(false)
      
      await signInWithGoogle()
      setSuccess(true)
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate(redirectTo, { replace: true })
      }, 1000)
    } catch (err) {
      setLocalError(err?.message || 'Google login failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Dynamic Background (same as Home) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>
      
      <main className="relative z-10 mx-auto w-[95%] max-w-md mt-8 mb-8">
        {/* Back to Home */}
        <div className="mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-black hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Shield className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-black">Welcome Back</h1>
              <p className="text-gray-600">
                Sign in to access your AI validation dashboard
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <AuthSuccess 
                message="Login successful! Redirecting..." 
                className="mb-4"
              />
            )}

            {/* Error Message */}
            {localError && (
              <AuthError 
                error={localError}
                onDismiss={clearErrors}
                className="mb-4"
              />
            )}

            {/* Login Form */}
            <form className="grid gap-4" onSubmit={handleEmailLogin}>
              <AuthInput
                type="email"
                label="Email"
                icon={Mail}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={emailLoading || googleLoading}
                error={localError && !email ? 'Email is required' : ''}
              />
              
              <AuthInput
                type="password"
                label="Password"
                icon={Lock}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showPasswordToggle
                disabled={emailLoading || googleLoading}
                error={localError && !password ? 'Password is required' : ''}
              />
              
              <Button 
                type="submit" 
                disabled={emailLoading || googleLoading}
                className="bg-black text-white hover:bg-amber-600 hover:text-black h-11"
              >
                {emailLoading ? (
                  <LoadingSpinner size="sm" variant="white" text="Signing in..." />
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={emailLoading || googleLoading}
              className="border-gray-300 text-gray-700 hover:bg-amber-50 h-11"
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" variant="default" text="Connecting..." />
              ) : (
                'Continue with Google'
              )}
            </Button>

            {/* Help Text */}
            <div className="text-sm text-gray-600 text-center">
              <p>Don't have an account? Contact your administrator to get access.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
