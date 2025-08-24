import { Outlet } from 'react-router-dom'
import Footer from '@/shared/components/Footer'
import HeaderAuth from '@/shared/components/HeaderAuth'
import { AuthProvider } from '@/features/auth/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-dvh">
        <HeaderAuth />
        <Outlet />
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
