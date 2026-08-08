import { CalendarDays, LayoutDashboard, Mail, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { InlineLoading } from '../feedback/InlineLoading'
import { useAuth } from '../../features/auth/useAuth'

const navigation = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/wedding', label: 'Wedding', icon: CalendarDays },
  { to: '/admin/invitations', label: 'Invitations', icon: Mail },
]

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

export function AdminLayout() {
  const { status, user } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--color-background)] lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:flex lg:flex-col">
        <p className="mb-8 font-[var(--font-display)] text-xl text-[var(--color-primary)]">
          Neil &amp; Hazel CMS
        </p>
        <Navigation />
        <div className="mt-auto border-t border-[var(--color-border)] pt-5">
          <div className="flex items-center gap-3">
            <UserRound
              className="size-5 text-[var(--color-muted)]"
              aria-hidden="true"
            />
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium">{user?.name ?? 'Admin user'}</p>
              <p className="truncate text-[var(--color-muted)]">
                {user?.email ?? 'Session not connected'}
              </p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <p className="font-[var(--font-display)] text-lg text-[var(--color-primary)]">
              Wedding CMS
            </p>
            <span className="text-xs text-[var(--color-muted)]">
              {user?.name ?? 'Admin'}
            </span>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Navigation />
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
          {status === 'loading' ? (
            <InlineLoading label="Checking admin session…" />
          ) : status === 'unauthenticated' ? (
            <section
              className="max-w-2xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]"
              aria-labelledby="session-required-heading"
            >
              <h1
                id="session-required-heading"
                className="font-[var(--font-display)] text-3xl"
              >
                Admin session required
              </h1>
              <p className="mt-3 text-[var(--color-muted)]">
                Authentication state is connected to Laravel Sanctum. The login
                experience will be implemented in a later patch.
              </p>
              <NavLink
                to="/admin/login"
                className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white"
              >
                View login placeholder
              </NavLink>
            </section>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
