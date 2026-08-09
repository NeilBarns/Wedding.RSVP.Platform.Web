import { Archive, CircleCheck, FileEdit } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { WeddingStatus } from '../../adminWedding/types'

const content = {
  draft: { Icon: FileEdit, title: 'Public RSVP unavailable', message: 'Public invitation links are currently unavailable because the wedding is in Draft.' },
  published: { Icon: CircleCheck, title: 'Public RSVP available', message: 'Public invitation links are enabled for eligible Ready, Submitted, and Locked invitations.' },
  archived: { Icon: Archive, title: 'Public RSVP unavailable', message: 'Public invitation access is unavailable because the wedding is Archived.' },
} satisfies Record<WeddingStatus, { Icon: typeof FileEdit; title: string; message: string }>

export function PublicAccessNotice({ status }: { status: WeddingStatus }) {
  const { Icon, title, message } = content[status]
  return (
    <aside className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5" aria-label="Public RSVP availability">
      <div className="flex gap-3"><Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-[var(--color-muted)]">{message}</p>{status === 'draft' ? <Link to="/admin/wedding" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline">Review wedding settings</Link> : null}</div></div>
    </aside>
  )
}
