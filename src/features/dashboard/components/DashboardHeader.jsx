import { useAuth } from '@/features/auth/AuthProvider'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header 
      className="mb-8"
      role="banner"
      aria-labelledby="dashboard-title"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 
            id="dashboard-title"
            className="text-4xl font-extrabold tracking-tight text-black mb-2"
          >
            AI Response Validation Dashboard
          </h1>
          <p 
            className="text-gray-600"
            aria-label={`Welcome back, ${user?.email || 'User'}`}
          >
            Welcome back, {user?.email || 'User'} • Monitor and validate AI responses in real-time
          </p>
        </div>
        <div 
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700"
          role="status"
          aria-label="System status: Live monitoring active"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Live Monitoring
        </div>
      </div>
    </header>
  )
}
