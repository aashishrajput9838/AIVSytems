import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Link, useNavigate, useLocation } from 'react-router-dom'

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
    <div className="mx-auto w-full max-w-md p-6">
      <Card className="rounded-2xl border bg-background/60 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Login</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <form className="grid gap-3" onSubmit={handleEmailLogin}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">or</div>
          <Button variant="outline" onClick={handleGoogleLogin} disabled={loading}>Continue with Google</Button>
          <div className="text-sm text-muted-foreground">
            Tip: Create users in Firebase Auth (Email/Password) or enable Google provider.
          </div>
          <div className="text-sm">
            <Link className="text-indigo-600 hover:underline" to="/">Back to Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


