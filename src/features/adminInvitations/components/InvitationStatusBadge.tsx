import { Archive, CheckCircle2, FileEdit, LockKeyhole, Send } from 'lucide-react'
import type { InvitationStatus } from '../types'
import { invitationStatusLabels } from '../utils'

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const Icon = status === 'draft' ? FileEdit : status === 'ready' ? CheckCircle2 : status === 'submitted' ? Send : status === 'locked' ? LockKeyhole : Archive
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1 text-xs font-medium"><Icon className="size-3.5" aria-hidden="true" />{invitationStatusLabels[status]}</span>
}
