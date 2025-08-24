import useAuth from '@/features/auth/AuthProvider'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header 
      className="section-md"
      role="banner"
      aria-labelledby="dashboard-title"
    >
      <div className="layout-row-lg items-center justify-between">
        <div className="layout-stack-sm">
          <h1 
            id="dashboard-title"
            className="text-display-3 text-black"
          >
            AI Response Validation Dashboard
          </h1>
          <p 
            className="text-body text-gray-600"
            aria-label={`Welcome back, ${user?.email || 'User'}`}
          >
            Welcome back, {user?.email || 'User'} • Monitor and validate AI responses in real-time
          </p>
        </div>
        <div 
          className="layout-row-sm items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-caption text-amber-700"
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
