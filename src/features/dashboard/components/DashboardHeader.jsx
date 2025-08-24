import { useAuth } from '@/features/auth/AuthProvider'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">
            AI Response Validation Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email || 'User'} • Monitor and validate AI responses in real-time
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          Live Monitoring
        </div>
      </div>
    </section>
  )
}
