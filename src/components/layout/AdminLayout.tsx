import {
  CalendarDays,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import type { AuthenticatedUser } from '../../features/auth/types'

const navigation = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/wedding', label: 'Wedding Settings', icon: CalendarDays },
  { to: '/admin/content', label: 'Wedding Content', icon: BookOpen },
  { to: '/admin/invitations', label: 'Invitations', icon: Mail },
]

function roleLabel(role: AuthenticatedUser['role']) {
  return role === 'owner' ? 'Owner' : 'Administrator'
}

function Navigation() {
  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
            }`
          }
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

type UserPanelProps = {
  user: AuthenticatedUser
  loggingOut: boolean
  onLogout: () => void
}

function UserPanel({ user, loggingOut, onLogout }: UserPanelProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <UserRound className="size-5 shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
        <div className="min-w-0 text-sm">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-[var(--color-muted)]">{roleLabel(user.role)}</p>
          <p className="truncate text-xs text-[var(--color-muted)]">{user.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="size-4" aria-hidden="true" />
        {loggingOut ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  if (!user) return null

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError(null)
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch {
      setLogoutError("We couldn't sign you out right now. Please try again.")
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:flex lg:flex-col">
        <p className="mb-8 font-[var(--font-display)] text-xl text-[var(--color-primary)]">Neil &amp; Hazel CMS</p>
        <Navigation />
        <div className="mt-auto border-t border-[var(--color-border)] pt-5">
          <UserPanel user={user} loggingOut={loggingOut} onLogout={() => void handleLogout()} />
          {logoutError ? <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">{logoutError}</p> : null}
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-[var(--font-display)] text-lg text-[var(--color-primary)]">Wedding CMS</p>
              <p className="text-xs text-[var(--color-muted)]">{user.name} · {roleLabel(user.role)}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium disabled:opacity-60"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
          {logoutError ? <p className="mt-2 text-sm text-[var(--color-error)]" role="alert">{logoutError}</p> : null}
          <div className="mt-3 overflow-x-auto"><Navigation /></div>
        </header>
        <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10"><Outlet /></main>
      </div>
    </div>
  )
}
