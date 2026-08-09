import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { status, refreshAuth } = useAuth()
  const location = useLocation()

  if (status === 'initializing') {
    return <FullPageLoading label="Checking your admin session…" />
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen bg-[var(--color-background)] px-5 py-20">
        <ErrorState
          title="We couldn’t verify your session"
          message="Please check your connection and try again."
          onRetry={() => void refreshAuth().catch(() => undefined)}
        />
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}
