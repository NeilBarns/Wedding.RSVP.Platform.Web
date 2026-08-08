import { Check, Clock3, X } from 'lucide-react'
import type { AttendanceStatus } from '../types'

const labels: Record<AttendanceStatus, string> = {
  attending: 'Attending',
  declined: 'Unable to attend',
  pending: 'Awaiting response',
}

type AttendanceStatusBadgeProps = {
  status: AttendanceStatus
}

export function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  const Icon = status === 'attending' ? Check : status === 'declined' ? X : Clock3

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 text-sm text-[var(--color-muted)]">
      <Icon className="size-4" aria-hidden="true" />
      {labels[status]}
    </span>
  )
}
