import { ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { getAdminRsvpConfiguration, type AdminRsvpConfiguration } from '../../features/adminRsvpConfiguration/api'
import { RsvpConfigurationForm } from '../../features/adminRsvpConfiguration/components/RsvpConfigurationForm'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

export default function AdminRsvpConfigurationPage() {
  const { refreshAuth } = useAuth()
  const [configuration, setConfiguration] = useState<AdminRsvpConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getAdminRsvpConfiguration({ signal: controller.signal })
      .then((value) => { if (!controller.signal.aborted) { setConfiguration(value); setError(false) } })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        if (requestError instanceof ApiError && requestError.status === 401) void refreshAuth(false).catch(() => undefined)
        else setError(true)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [refreshAuth, reloadKey])

  if (loading) return <FullPageLoading label="Loading RSVP configuration…" />
  if (error || !configuration) return <ErrorState title="RSVP configuration is unavailable" message="We couldn’t load the current RSVP question settings." onRetry={() => { setLoading(true); setError(false); setReloadKey((value) => value + 1) }} />

  return <section className="mx-auto max-w-5xl"><header className="mb-7"><p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]"><ListChecks className="size-4" aria-hidden="true" />Guest response settings</p><h1 className="mt-2 font-[var(--font-display)] text-3xl sm:text-4xl">RSVP configuration</h1><p className="mt-2 max-w-2xl text-[var(--color-muted)]">RSVP configuration controls which questions guests see and which answers are required.</p></header><RsvpConfigurationForm configuration={configuration} onSaved={setConfiguration} onSessionExpired={() => void refreshAuth(false).catch(() => undefined)} /></section>
}
