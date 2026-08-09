import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ApiError } from '../../../lib/api'
import { deleteGuest } from '../api'
import type { AdminGuest, InvitationDetail } from '../types'
import { guestTypeLabels } from '../utils'
import { ConfirmationDialog } from './ConfirmationDialog'
import { GuestAttendanceBadge } from './GuestAttendanceBadge'
import { GuestEditor } from './GuestEditor'

type Props = { invitation: InvitationDetail; onRefresh: () => Promise<void>; onSessionExpired: () => void }

export function GuestListEditor({ invitation, onRefresh, onSessionExpired }: Props) {
  const [editing, setEditing] = useState<AdminGuest | 'new' | null>(null)
  const [deleting, setDeleting] = useState<AdminGuest | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const archived = invitation.status === 'archived'

  async function confirmDelete() {
    if (!deleting) return
    setBusy(true); setError(null)
    try { await deleteGuest(invitation.id, deleting.id); setDeleting(null); await onRefresh() }
    catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) onSessionExpired()
      else setError(requestError instanceof ApiError && requestError.status === 409 ? requestError.message : requestError instanceof ApiError && requestError.status === 429 ? 'Too many requests. Please wait a moment and try again.' : 'The guest could not be deleted. Please try again.')
    } finally { setBusy(false) }
  }

  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-[var(--font-display)] text-2xl">Named guests</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Guests remain explicitly managed by an administrator.</p></div>{!archived ? <ActionButton onClick={() => setEditing('new')}><Plus className="size-4" aria-hidden="true" />Add guest</ActionButton> : null}</div><div className="mt-6 space-y-3">{invitation.guests.map((guest) => <article key={guest.id} className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-medium">{guest.fullName}</h3><p className="mt-1 text-sm text-[var(--color-muted)]">{guestTypeLabels[guest.guestType]} · Order {guest.sortOrder}</p></div><GuestAttendanceBadge status={guest.attendanceStatus} /></div>{guest.dietaryRequirements || guest.accessibilityRequirements ? <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{guest.dietaryRequirements ? <div><dt className="font-medium">Dietary</dt><dd className="text-[var(--color-muted)]">{guest.dietaryRequirements}</dd></div> : null}{guest.accessibilityRequirements ? <div><dt className="font-medium">Accessibility</dt><dd className="text-[var(--color-muted)]">{guest.accessibilityRequirements}</dd></div> : null}</dl> : null}{!archived ? <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setEditing(guest)} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"><Pencil className="size-4" aria-hidden="true" />Edit</button><button type="button" onClick={() => { setDeleting(guest); setError(null) }} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--color-error)]"><Trash2 className="size-4" aria-hidden="true" />Delete</button></div> : null}</article>)}</div>
    {editing ? <GuestEditor invitationId={invitation.id} guest={editing === 'new' ? undefined : editing} suggestedOrder={invitation.guests.length} onClose={() => setEditing(null)} onSessionExpired={onSessionExpired} onSaved={() => { setEditing(null); void onRefresh() }} /> : null}
    {deleting ? <ConfirmationDialog title={`Delete ${deleting.fullName}?`} message="This permanently removes the named guest from this household. Guests with recorded attendance and the final remaining guest cannot be deleted." confirmLabel="Delete guest" destructive busy={busy} error={error} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
  </section>
}
