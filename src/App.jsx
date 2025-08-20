import { Outlet, Link } from 'react-router-dom'
import Home from './Home'
import Dashboard from './Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import HowItWorks from './pages/HowItWorks'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-dvh">
        <header className="mx-auto w-full max-w-6xl px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold">AIV</Link>
            <HeaderNav />
          </nav>
        </header>
        <Outlet />
      </div>
    </AuthProvider>
  )
}

function HeaderNav() {
  const { user, signOut } = useAuth()
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
      <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
      <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it works</Link>
      <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
      <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{user.email}</span>
          <Button size="sm" variant="outline" onClick={signOut}>Logout</Button>
        </div>
      ) : (
        <Link to="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
      )}
    </div>
  )
}

export default App


