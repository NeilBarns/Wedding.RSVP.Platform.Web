import { ArrowLeft, Clock3, KeyRound, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { NotFoundState } from '../../components/feedback/NotFoundState'
import { ConfirmationDialog } from '../../features/adminInvitations/components/ConfirmationDialog'
import { GuestListEditor } from '../../features/adminInvitations/components/GuestListEditor'
import { InvitationAccessReveal } from '../../features/adminInvitations/components/InvitationAccessReveal'
import { InvitationActions } from '../../features/adminInvitations/components/InvitationActions'
import { InvitationProfileForm } from '../../features/adminInvitations/components/InvitationProfileForm'
import { InvitationStatusBadge } from '../../features/adminInvitations/components/InvitationStatusBadge'
import { getInvitation } from '../../features/adminInvitations/api'
import type { InvitationAccess, InvitationDetail } from '../../features/adminInvitations/types'
import { formatAdminDate } from '../../features/adminInvitations/utils'
import { useAuth } from '../../features/auth/useAuth'
import { ApiError } from '../../lib/api'

type DetailLocationState = { listSearch?: unknown }

export default function AdminInvitationDetailPage() {
  const { invitationId = '' } = useParams()
  const id = Number(invitationId)
  const { refreshAuth } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [invitation, setInvitation] = useState<InvitationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)
  const [access, setAccess] = useState<InvitationAccess | null>(null)
  const [confirmUncopied, setConfirmUncopied] = useState(false)

  const load = useCallback(async (showLoading = true) => {
    if (!Number.isInteger(id) || id < 1) { setNotFound(true); setLoading(false); return }
    if (showLoading) setLoading(true)
    setError(false)
    try { setInvitation(await getInvitation(id)); setNotFound(false) }
    catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) void refreshAuth(false).catch(() => undefined)
      else if (requestError instanceof ApiError && requestError.status === 404) setNotFound(true)
      else setError(true)
    } finally { setLoading(false) }
  }, [id, refreshAuth])

  useEffect(() => {
    const controller = new AbortController()
    if (!Number.isInteger(id) || id < 1) {
      Promise.resolve().then(() => { setNotFound(true); setLoading(false) })
      return () => controller.abort()
    }
    getInvitation(id, { signal: controller.signal })
      .then((value) => { if (!controller.signal.aborted) { setInvitation(value); setNotFound(false) } })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        if (requestError instanceof ApiError && requestError.status === 401) void refreshAuth(false).catch(() => undefined)
        else if (requestError instanceof ApiError && requestError.status === 404) setNotFound(true)
        else setError(true)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id, refreshAuth])

  if (loading && !invitation) return <FullPageLoading label="Loading invitation…" />
  if (notFound) return <NotFoundState title="Invitation not found" message="This invitation does not exist or is outside the current wedding." showHomeLink={false} />
  if (error && !invitation) return <ErrorState title="Invitation unavailable" message="We couldn’t load this invitation." onRetry={() => void load()} />
  if (!invitation) return null

  const state = location.state && typeof location.state === 'object' ? location.state as DetailLocationState : null
  const listSearch = typeof state?.listSearch === 'string' && state.listSearch.startsWith('?') ? state.listSearch : ''
  const sessionExpired = () => void refreshAuth(false).catch(() => undefined)
  const closeAccess = (copied: boolean) => { if (!copied) setConfirmUncopied(true); else setAccess(null) }

  return <section>
    <Link to={`/admin/invitations${listSearch}`} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-primary)]"><ArrowLeft className="size-4" aria-hidden="true" />Back to Invitations</Link>
    <header className="mt-3 flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-3"><h1 className="font-[var(--font-display)] text-3xl sm:text-4xl">{invitation.displayName}</h1><InvitationStatusBadge status={invitation.status} /></div><p className="mt-2 text-[var(--color-muted)]">{invitation.guestCount} named guests · {invitation.attendingCount} attending · {invitation.declinedCount} declined · {invitation.pendingCount} pending</p></div>{loading ? <span className="text-sm text-[var(--color-muted)]" role="status">Refreshing…</span> : null}</header>
    {error ? <button type="button" onClick={() => void load(false)} className="mt-4 min-h-11 text-sm text-[var(--color-error)]">Refresh failed. Try again.</button> : null}

    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6"><InvitationProfileForm key={invitation.updatedAt} invitation={invitation} onUpdated={setInvitation} onSessionExpired={sessionExpired} /><GuestListEditor invitation={invitation} onRefresh={() => load(false)} onSessionExpired={sessionExpired} /></div>
      <aside className="space-y-6">
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><h2 className="flex items-center gap-2 font-[var(--font-display)] text-xl"><Users className="size-5" aria-hidden="true" />Response summary</h2><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><Summary label="Guests" value={invitation.guestCount} /><Summary label="Attending" value={invitation.attendingCount} /><Summary label="Declined" value={invitation.declinedCount} /><Summary label="Pending" value={invitation.pendingCount} /></dl></section>
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><h2 className="flex items-center gap-2 font-[var(--font-display)] text-xl"><Clock3 className="size-5" aria-hidden="true" />Activity</h2><dl className="mt-4 space-y-3 text-sm"><DateRow label="First opened" value={invitation.firstOpenedAt} /><DateRow label="Last opened" value={invitation.lastOpenedAt} /><DateRow label="Submitted" value={invitation.submittedAt} /><DateRow label="Locked" value={invitation.lockedAt} /><DateRow label="Created" value={invitation.createdAt} /><DateRow label="Updated" value={invitation.updatedAt} /></dl></section>
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><h2 className="flex items-center gap-2 font-[var(--font-display)] text-xl"><KeyRound className="size-5" aria-hidden="true" />Invitation access</h2><p className="mt-3 text-sm text-[var(--color-muted)]">The current invitation link is not recoverable for security reasons.</p>{invitation.status !== 'archived' ? <button type="button" onClick={() => { /* action is available below */ document.getElementById('invitation-actions')?.scrollIntoView({ behavior: 'smooth' }) }} className="mt-3 min-h-11 text-sm font-medium text-[var(--color-primary)]">Generate a new invitation link below</button> : null}</section>
        <div id="invitation-actions"><InvitationActions invitation={invitation} onUpdated={setInvitation} onDeleted={() => navigate(`/admin/invitations${listSearch}`, { replace: true })} onAccess={setAccess} onSessionExpired={sessionExpired} /></div>
      </aside>
    </div>
    {access ? <InvitationAccessReveal title="New invitation link generated" access={access} onRequestClose={closeAccess} /> : null}
    {confirmUncopied ? <ConfirmationDialog title="Close without copying?" message="This new link cannot be recovered later. Closing now means another new link must be generated." confirmLabel="Close without copying" destructive onCancel={() => setConfirmUncopied(false)} onConfirm={() => { setConfirmUncopied(false); setAccess(null) }} /> : null}
  </section>
}

function Summary({ label, value }: { label: string; value: number }) { return <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3"><dt className="text-[var(--color-muted)]">{label}</dt><dd className="mt-1 text-xl font-semibold">{value}</dd></div> }
function DateRow({ label, value }: { label: string; value: string | null }) { return <div><dt className="font-medium">{label}</dt><dd className="text-[var(--color-muted)]">{formatAdminDate(value, true)}</dd></div> }
