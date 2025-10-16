import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { auth, googleProvider } from '@/services/firebase/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Shield, ArrowLeft } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailLogin(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await signInWithEmailAndPassword(auth, email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      setError('')
      await signInWithPopup(auth, googleProvider)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Google login failed')
    } finally {
      setLoading(false)
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

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="grid gap-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border border-gray-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white border border-gray-200"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white hover:bg-amber-600 hover:text-black"
              >
                {loading ? 'Signing in…' : 'Sign in'}
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
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-amber-50"
            >
              Continue with Google
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


