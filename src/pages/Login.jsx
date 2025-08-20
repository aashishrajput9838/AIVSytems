import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { auth, googleProvider } from '@/lib/firebase'
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
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-700 to-gray-100">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />
      
      <main className="mx-auto w-full max-w-md px-4 py-16">
        {/* Back to Home */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <Card className="group relative overflow-hidden rounded-2xl border bg-gray-800/60 backdrop-blur shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-2xl" />
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-cyan-500/10 text-cyan-500 mb-4">
                <Shield className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to access your AI validation dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="grid gap-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800/60 backdrop-blur border-cyan-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800/60 backdrop-blur border-cyan-500/30"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-cyan-500/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/60 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              Continue with Google
            </Button>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground text-center">
              <p>Don't have an account? Contact your administrator to get access.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


