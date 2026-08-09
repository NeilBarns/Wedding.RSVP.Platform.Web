import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InvitationStatusBadge } from '../../adminInvitations/components/InvitationStatusBadge'
import type { InvitationListItem } from '../../adminInvitations/types'
import { formatDateTime } from '../utils'

export function RecentInvitations({ invitations }: { invitations: InvitationListItem[] }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]" aria-labelledby="recent-heading">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Clock3 className="size-5" aria-hidden="true" /><h2 id="recent-heading" className="font-[var(--font-display)] text-2xl">Recent invitations</h2></div><Link to="/admin/invitations" className="text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline">View all invitations</Link></div>
      {invitations.length === 0 ? <p className="mt-5 text-sm text-[var(--color-muted)]">No recent invitation activity.</p> : <ul className="mt-5 divide-y divide-[var(--color-border)]">{invitations.slice(0, 5).map((invitation) => <li key={invitation.id} className="py-4 first:pt-0 last:pb-0"><Link to={`/admin/invitations/${invitation.id}`} className="block rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{invitation.displayName}</span><InvitationStatusBadge status={invitation.status} /></div><p className="mt-2 text-sm text-[var(--color-muted)]">{invitation.guestCount} guest{invitation.guestCount === 1 ? '' : 's'} · {invitation.attendingCount + invitation.declinedCount} responded · {invitation.pendingCount} pending</p><p className="mt-1 text-xs text-[var(--color-muted)]">Updated {formatDateTime(invitation.updatedAt)}</p></Link></li>)}</ul>}
    </section>
  )
}
