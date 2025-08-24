import { Outlet } from 'react-router-dom'
import Footer from '@/shared/components/Footer'
import HeaderAuth from '@/shared/components/HeaderAuth'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import AuthProvider from '@/features/auth/AuthProvider'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-dvh">
          <HeaderAuth />
          <Outlet />
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
