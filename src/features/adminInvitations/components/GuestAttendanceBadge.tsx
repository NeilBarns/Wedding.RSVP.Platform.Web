import { Check, Clock3, X } from 'lucide-react'
import type { GuestAttendanceStatus } from '../types'

const labels: Record<GuestAttendanceStatus, string> = { pending: 'Awaiting response', attending: 'Attending', declined: 'Unable to attend' }

export function GuestAttendanceBadge({ status }: { status: GuestAttendanceStatus }) {
  const Icon = status === 'attending' ? Check : status === 'declined' ? X : Clock3
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)]"><Icon className="size-3.5" aria-hidden="true" />{labels[status]}</span>
}
