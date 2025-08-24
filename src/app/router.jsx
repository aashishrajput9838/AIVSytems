/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import Home from '@/features/home/Home'
import Dashboard from '@/features/dashboard/Dashboard'
import HowItWorks from '@/features/pages/HowItWorks'
import Capabilities from '@/features/pages/Capabilities'
import Insights from '@/features/analytics/Insights'
import About from '@/features/pages/About'
import Contact from '@/features/pages/Contact'
import Login from '@/features/auth/Login'
import useAuth from '@/features/auth/AuthProvider'

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
        { path: 'capabilities', element: <Capabilities /> },
        { path: 'insights', element: <Insights /> },
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
