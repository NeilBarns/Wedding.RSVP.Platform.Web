import { Plus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../components/feedback/EmptyState'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { InlineLoading } from '../../components/feedback/InlineLoading'
import { ActionButton } from '../../components/ui/ActionButton'
import { ConfirmationDialog } from '../../features/adminInvitations/components/ConfirmationDialog'
import { InvitationAccessReveal } from '../../features/adminInvitations/components/InvitationAccessReveal'
import { InvitationFilters } from '../../features/adminInvitations/components/InvitationFilters'
import { InvitationForm } from '../../features/adminInvitations/components/InvitationForm'
import { InvitationTable } from '../../features/adminInvitations/components/InvitationTable'
import { listInvitations } from '../../features/adminInvitations/api'
import type { CreationAccessResponse, InvitationListResponse, InvitationSort, InvitationStatus, SortDirection } from '../../features/adminInvitations/types'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

const statuses = new Set<InvitationStatus>(['draft', 'ready', 'submitted', 'locked', 'archived'])
const sorts = new Set<InvitationSort>(['displayName', 'status', 'createdAt', 'updatedAt', 'submittedAt'])

export default function AdminInvitationsPage() {
  const { refreshAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')
  const [result, setResult] = useState<InvitationListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [created, setCreated] = useState<CreationAccessResponse | null>(null)
  const [confirmUncopied, setConfirmUncopied] = useState(false)

  const params = useMemo(() => {
    const statusValue = searchParams.get('status') as InvitationStatus | null
    const sortValue = searchParams.get('sortBy') as InvitationSort | null
    const directionValue = searchParams.get('sortDirection')
    const perPageValue = Number(searchParams.get('perPage'))
    return {
      search: searchParams.get('search')?.trim() || undefined,
      status: statusValue && statuses.has(statusValue) ? statusValue : undefined,
      page: Math.max(1, Number(searchParams.get('page')) || 1),
      perPage: ([10, 20, 50].includes(perPageValue) ? perPageValue : 20) as 10 | 20 | 50,
      sortBy: sortValue && sorts.has(sortValue) ? sortValue : 'createdAt' as InvitationSort,
      sortDirection: directionValue === 'asc' ? 'asc' as SortDirection : 'desc' as SortDirection,
    }
  }, [searchParams])

  const updateQuery = useCallback((updates: Record<string, string | undefined>) => {
    setLoading(true)
    setError(false)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalized = searchInput.trim()
      if (normalized !== (searchParams.get('search') ?? '')) updateQuery({ search: normalized || undefined, page: undefined })
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput, searchParams, updateQuery])

  useEffect(() => {
    const controller = new AbortController()
    listInvitations(params, { signal: controller.signal })
      .then(setResult)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        if (requestError instanceof ApiError && requestError.status === 401) {
          void refreshAuth(false).catch(() => undefined)
        } else setError(true)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [params, refreshAuth, reloadKey])

  if (loading && !result) return <FullPageLoading label="Loading invitations…" />
  if (error && !result) return <ErrorState title="Invitations are unavailable" message="We couldn’t load the invitation list." onRetry={() => setReloadKey((value) => value + 1)} />

  const closeReveal = (copied: boolean) => {
    if (!created) return
    if (!copied) return setConfirmUncopied(true)
    navigate(`/admin/invitations/${created.invitation.id}`)
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="font-[var(--font-display)] text-3xl">Invitations</h1><p className="mt-2 text-[var(--color-muted)]">Manage households, named guests, invitation access, and RSVP status.</p></div>
        <ActionButton onClick={() => setCreateOpen(true)}><Plus className="size-4" aria-hidden="true" />Create invitation</ActionButton>
      </div>
      <div className="mt-7"><InvitationFilters search={searchInput} status={params.status ?? ''} sortBy={params.sortBy} sortDirection={params.sortDirection} perPage={params.perPage} onSearchChange={setSearchInput} onStatusChange={(value) => updateQuery({ status: value || undefined, page: undefined })} onSortChange={(value) => updateQuery({ sortBy: value, page: undefined })} onDirectionChange={(value) => updateQuery({ sortDirection: value, page: undefined })} onPerPageChange={(value) => updateQuery({ perPage: String(value), page: undefined })} /></div>
      <div className="mt-4 min-h-6" aria-live="polite">{loading ? <InlineLoading label="Updating invitations…" /> : error ? <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-error)]"><RefreshCw className="size-4" aria-hidden="true" />Refresh failed. Try again.</button> : null}</div>
      <div className="mt-3">
        {result?.data.length ? <InvitationTable invitations={result.data} listSearch={`?${searchParams.toString()}`} /> : <EmptyState title="No invitations found" message={params.search || params.status ? 'Try clearing the current search or status filter.' : 'Create the first household invitation and add its named guests.'} action={!params.search && !params.status ? <ActionButton onClick={() => setCreateOpen(true)}><Plus className="size-4" aria-hidden="true" />Create invitation</ActionButton> : undefined} />}
      </div>
      {result && result.meta.last_page > 1 ? <nav aria-label="Invitation pages" className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[var(--color-muted)]">Showing {result.meta.from ?? 0}–{result.meta.to ?? 0} of {result.meta.total}</p><div className="flex items-center gap-3"><button type="button" disabled={params.page <= 1} onClick={() => updateQuery({ page: String(params.page - 1) })} className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 disabled:opacity-40">Previous</button><span className="text-sm">Page {result.meta.current_page} of {result.meta.last_page}</span><button type="button" disabled={params.page >= result.meta.last_page} onClick={() => updateQuery({ page: String(params.page + 1) })} className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 disabled:opacity-40">Next</button></div></nav> : result ? <p className="mt-5 text-sm text-[var(--color-muted)]">{result.meta.total} total invitation{result.meta.total === 1 ? '' : 's'}</p> : null}

      {createOpen ? <InvitationForm onClose={() => setCreateOpen(false)} onSessionExpired={() => void refreshAuth(false).catch(() => undefined)} onCreated={(value) => { setCreateOpen(false); setCreated(value) }} /> : null}
      {created ? <InvitationAccessReveal access={created.access} onRequestClose={closeReveal} /> : null}
      {confirmUncopied ? <ConfirmationDialog title="Close without copying?" message="The current invitation link cannot be recovered after this window closes. You would need to generate a new link." confirmLabel="Close without copying" destructive onCancel={() => setConfirmUncopied(false)} onConfirm={() => { if (created) navigate(`/admin/invitations/${created.invitation.id}`) }} /> : null}
    </section>
  )
}
