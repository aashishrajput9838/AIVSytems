import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'

export default function HeaderAuth() {
  const { user, signOut } = useAuth()
  return (
    <div className="fixed right-4 top-3 z-50 flex items-center gap-2">
      {user ? (
        <>
          <span className="hidden sm:inline text-xs text-black/80 bg-white/80 px-2 py-1 rounded border border-black/10">
            {user.email}
          </span>
          <Button size="sm" variant="default" className="bg-black text-white hover:bg-amber-600 hover:text-black" onClick={signOut}>
            Logout
          </Button>
        </>
      ) : (
        <Button asChild size="sm" variant="outline" className="border-black/20 bg-white/80 hover:bg-amber-50">
          <Link to="/login">Login</Link>
        </Button>
      )}
    </div>
  )
}
