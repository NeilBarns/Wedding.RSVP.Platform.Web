import { CircleCheck, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InvitationStatusBadge } from '../../adminInvitations/components/InvitationStatusBadge'
import type { AttentionItem } from '../types'

export function AttentionCard({ items }: { items: AttentionItem[] }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]" aria-labelledby="attention-heading">
      <div className="flex items-center gap-3"><TriangleAlert className="size-5" aria-hidden="true" /><h2 id="attention-heading" className="font-[var(--font-display)] text-2xl">Recent items needing attention</h2></div>
      {items.length === 0 ? <div className="mt-5 flex gap-3 text-sm text-[var(--color-muted)]"><CircleCheck className="size-5 shrink-0" aria-hidden="true" /><p>No recent invitation items need attention.</p></div> : <ul className="mt-5 divide-y divide-[var(--color-border)]">{items.map(({ invitation, reason }) => <li key={invitation.id} className="py-4 first:pt-0 last:pb-0"><Link to={`/admin/invitations/${invitation.id}`} className="block rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{invitation.displayName}</span><InvitationStatusBadge status={invitation.status} /></div><p className="mt-2 text-sm text-[var(--color-muted)]">{reason}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{invitation.attendingCount} attending, {invitation.declinedCount} declined, {invitation.pendingCount} pending</p></Link></li>)}</ul>}
    </section>
  )
}
