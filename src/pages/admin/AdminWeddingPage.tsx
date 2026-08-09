import { Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { WeddingSettingsForm } from '../../features/adminWedding/components/WeddingSettingsForm'
import { getAdminWedding } from '../../features/adminWedding/api'
import type { AdminWeddingSettings } from '../../features/adminWedding/types'
import { weddingStatusContent } from '../../features/adminWedding/utils'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

export default function AdminWeddingPage() {
  const { refreshAuth } = useAuth()
  const [wedding, setWedding] = useState<AdminWeddingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getAdminWedding({ signal: controller.signal })
      .then((value) => { if (!controller.signal.aborted) { setWedding(value); setNotFound(false); setError(false) } })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        if (requestError instanceof ApiError && requestError.status === 401) void refreshAuth(false).catch(() => undefined)
        else if (requestError instanceof ApiError && requestError.status === 404) setNotFound(true)
        else setError(true)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [refreshAuth, reloadKey])

  if (loading) return <FullPageLoading label="Loading wedding settings…" />
  if (notFound) return <ErrorState title="Wedding settings are not available" message="No current wedding is configured. Creation is not available from this page." />
  if (error || !wedding) return <ErrorState title="Wedding settings are unavailable" message="We couldn’t load the current wedding settings." onRetry={() => { setLoading(true); setError(false); setReloadKey((value) => value + 1) }} />

  return <section className="mx-auto max-w-5xl"><header className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]"><Settings2 className="size-4" aria-hidden="true" />Current wedding</p><h1 className="mt-2 font-[var(--font-display)] text-3xl sm:text-4xl">Wedding settings</h1><p className="mt-2 max-w-2xl text-[var(--color-muted)]">Manage core details, RSVP timing, publication state, and theme configuration.</p></div><span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium">{weddingStatusContent[wedding.status].label}</span></header><WeddingSettingsForm wedding={wedding} onSaved={setWedding} onSessionExpired={() => void refreshAuth(false).catch(() => undefined)} onNotFound={() => setNotFound(true)} /></section>
}
