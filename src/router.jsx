import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import Home from './Home'
import Dashboard from './Dashboard'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import { useAuth } from './AuthProvider'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6 text-sm text-muted-foreground">Checking session…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'how-it-works', element: <HowItWorks /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: 'login', element: <Login /> },
        { path: 'dashboard', element: (
          <Protected>
            <Dashboard />
          </Protected>
        ) },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
)


