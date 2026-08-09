import { Eye, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { InvitationListItem } from '../types'
import { formatAdminDate } from '../utils'
import { InvitationStatusBadge } from './InvitationStatusBadge'

export function InvitationTable({ invitations, listSearch }: { invitations: InvitationListItem[]; listSearch: string }) {
  const detailState = { listSearch }
  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[var(--color-background)] text-[var(--color-muted)]"><tr><th className="px-4 py-3 font-medium">Household</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Guests</th><th className="px-4 py-3 font-medium">Responses</th><th className="px-4 py-3 font-medium">Opened</th><th className="px-4 py-3 font-medium">Submitted</th><th className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {invitations.map((item) => <tr key={item.id} className="hover:bg-[var(--color-background)]"><td className="px-4 py-4"><Link to={`/admin/invitations/${item.id}`} state={detailState} className="font-medium text-[var(--color-primary)] hover:underline">{item.displayName}</Link>{item.contactPersonName ? <p className="mt-1 text-xs text-[var(--color-muted)]">{item.contactPersonName}</p> : null}</td><td className="px-4 py-4"><InvitationStatusBadge status={item.status} /></td><td className="px-4 py-4">{item.guestCount}</td><td className="px-4 py-4"><span className="text-[var(--color-success)]">{item.attendingCount} attending</span><br /><span className="text-[var(--color-muted)]">{item.declinedCount} declined · {item.pendingCount} pending</span></td><td className="px-4 py-4">{item.firstOpenedAt ? formatAdminDate(item.firstOpenedAt) : 'Not yet'}</td><td className="px-4 py-4">{item.submittedAt ? formatAdminDate(item.submittedAt) : 'Not yet'}</td><td className="px-4 py-4"><Link to={`/admin/invitations/${item.id}`} state={detailState} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 font-medium text-[var(--color-primary)]"><Eye className="size-4" aria-hidden="true" />View</Link></td></tr>)}
          </tbody>
        </table>
      </div>
      <div className="space-y-4 lg:hidden">
        {invitations.map((item) => <article key={item.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-[var(--font-display)] text-xl">{item.displayName}</h2>{item.contactPersonName ? <p className="text-sm text-[var(--color-muted)]">{item.contactPersonName}</p> : null}</div><InvitationStatusBadge status={item.status} /></div><div className="mt-4 flex items-center gap-2 text-sm"><Users className="size-4 text-[var(--color-muted)]" aria-hidden="true" /><span>{item.guestCount} guests · {item.attendingCount} attending · {item.pendingCount} pending</span></div><p className="mt-2 text-sm text-[var(--color-muted)]">Opened: {item.firstOpenedAt ? formatAdminDate(item.firstOpenedAt) : 'Not yet'} · Submitted: {item.submittedAt ? formatAdminDate(item.submittedAt) : 'Not yet'}</p><Link to={`/admin/invitations/${item.id}`} state={detailState} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-medium text-[var(--color-primary)]"><Eye className="size-4" aria-hidden="true" />View invitation</Link></article>)}
      </div>
    </>
  )
}
