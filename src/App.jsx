import { Outlet } from 'react-router-dom'
import Footer from '@/components/Footer'
import HeaderAuth from '@/components/HeaderAuth'
import { AuthProvider } from './AuthProvider'

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


