/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from '@/features/home/Home'
import Dashboard from '@/features/dashboard/Dashboard'
import HowItWorks from '@/features/pages/HowItWorks'
import Capabilities from '@/features/pages/Capabilities'
import Insights from '@/features/analytics/Insights'
import About from '@/features/pages/About'
import Contact from '@/features/pages/Contact'
import Login from '@/features/auth/Login'
import EnhancedComponentsDemo from '@/features/demo/EnhancedComponentsDemo'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
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
      { 
        path: 'login', 
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ) 
      },
      { path: 'demo', element: <EnhancedComponentsDemo /> },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
    ],
  },
])
