import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { ArrowDownRight } from 'lucide-react'

export default memo(function HomeNavigation() {
  const navItems = useMemo(() => [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/about', label: 'ABOUT' },
    { to: '/capabilities', label: 'CAPABILITIES' },
    { to: '/insights', label: 'INSIGHTS' },
    { to: '/contact', label: 'CONTACT', icon: ArrowDownRight }
  ], [])

  return (
    <nav 
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-black"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label={item.label}
        >
          {item.icon ? (
            <Button asChild variant="ghost" className="flex items-center gap-1 text-black hover:text-amber-600 hover:bg-amber-50 text-xs sm:text-sm">
              <span>
                <item.icon className="h-3 w-3" aria-hidden="true" />
                {item.label}
              </span>
            </Button>
          ) : (
            item.label
          )}
        </Link>
      ))}
    </nav>
  )
})
