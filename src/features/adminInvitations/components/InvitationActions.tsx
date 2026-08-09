import { Archive, KeyRound, LockKeyhole, RotateCcw, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ApiError } from '../../../lib/api'
import { deleteInvitation, regenerateInvitationToken, runInvitationAction } from '../api'
import type { InvitationAccess, InvitationDetail } from '../types'
import { ConfirmationDialog } from './ConfirmationDialog'

type ActionKind = 'mark-ready' | 'lock' | 'reopen' | 'archive' | 'regenerate' | 'delete'
type Props = { invitation: InvitationDetail; onUpdated: (value: InvitationDetail) => void; onDeleted: () => void; onAccess: (access: InvitationAccess) => void; onSessionExpired: () => void }

const confirmations: Record<ActionKind, { title: string; message: string; confirmLabel: string; destructive?: boolean }> = {
  'mark-ready': { title: 'Mark invitation ready?', message: 'Ready invitations can be opened by guests.', confirmLabel: 'Mark ready' },
  lock: { title: 'Lock RSVP responses?', message: 'Guests can still view this invitation, but they will not be able to change their responses.', confirmLabel: 'Lock RSVP' },
  reopen: { title: 'Reopen RSVP responses?', message: 'Guests will be able to submit or edit responses again while the wedding deadline permits.', confirmLabel: 'Reopen RSVP' },
  archive: { title: 'Archive invitation?', message: 'The invitation becomes unavailable publicly and cannot be unarchived from this CMS.', confirmLabel: 'Archive invitation', destructive: true },
  regenerate: { title: 'Generate a new invitation link?', message: 'Generating a new link will immediately invalidate the previous invitation link.', confirmLabel: 'Generate new link', destructive: true },
  delete: { title: 'Permanently delete invitation?', message: 'This permanently removes the household and all its named guests. This action cannot be undone.', confirmLabel: 'Delete permanently', destructive: true },
}

export function InvitationActions({ invitation, onUpdated, onDeleted, onAccess, onSessionExpired }: Props) {
  const [action, setAction] = useState<ActionKind | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const buttons: { kind: ActionKind; label: string; icon: typeof Send }[] = []
  if (invitation.status === 'draft') buttons.push({ kind: 'mark-ready', label: 'Mark ready', icon: Send })
  if (invitation.status === 'ready' || invitation.status === 'submitted') buttons.push({ kind: 'lock', label: 'Lock RSVP', icon: LockKeyhole })
  if (invitation.status === 'locked') buttons.push({ kind: 'reopen', label: 'Reopen RSVP', icon: RotateCcw })
  if (invitation.status !== 'archived') buttons.push({ kind: 'regenerate', label: 'Generate new link', icon: KeyRound }, { kind: 'archive', label: 'Archive invitation', icon: Archive })
  if (invitation.status === 'draft' || invitation.status === 'ready') buttons.push({ kind: 'delete', label: 'Delete permanently', icon: Trash2 })

  async function confirm() {
    if (!action) return
    setBusy(true); setError(null)
    try {
      if (action === 'delete') { await deleteInvitation(invitation.id); onDeleted() }
      else if (action === 'regenerate') onAccess((await regenerateInvitationToken(invitation.id)).access)
      else onUpdated(await runInvitationAction(invitation.id, action))
      setAction(null)
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) onSessionExpired()
      else setError(requestError instanceof ApiError && requestError.status === 409 ? requestError.message : requestError instanceof ApiError && requestError.status === 429 ? 'Too many requests. Please wait a moment and try again.' : 'The action could not be completed. Please try again.')
    } finally { setBusy(false) }
  }

  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"><h2 className="font-[var(--font-display)] text-2xl">Invitation actions</h2>{buttons.length ? <div className="mt-5 flex flex-wrap gap-3">{buttons.map(({ kind, label, icon: Icon }) => <button key={kind} type="button" onClick={() => { setAction(kind); setError(null) }} className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-medium ${kind === 'archive' || kind === 'delete' ? 'text-[var(--color-error)]' : ''}`}><Icon className="size-4" aria-hidden="true" />{label}</button>)}</div> : <p className="mt-3 text-[var(--color-muted)]">Archived invitations have no further lifecycle actions.</p>}{action ? <ConfirmationDialog {...confirmations[action]} busy={busy} error={error} onCancel={() => setAction(null)} onConfirm={() => void confirm()} /> : null}</section>
}
