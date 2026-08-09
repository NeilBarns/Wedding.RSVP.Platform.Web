import { Users } from 'lucide-react'
import type { GuestMetrics } from '../types'

export function RsvpProgressCard({ metrics }: { metrics: GuestMetrics | null }) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3"><Users className="size-5" aria-hidden="true" /><h2 className="font-[var(--font-display)] text-2xl">RSVP progress</h2></div>
      {!metrics ? <p className="mt-5 text-sm text-[var(--color-muted)]">Guest progress is unavailable because the invitation list exceeds the complete overview page.</p> : metrics.guests === 0 ? <p className="mt-5 text-sm text-[var(--color-muted)]">No guests have been added yet. RSVP progress will appear here once invitations include guests.</p> : <><p className="mt-6 text-4xl font-semibold tabular-nums">{metrics.percentage}% <span className="text-base font-normal text-[var(--color-muted)]">responded</span></p><div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--color-border)]" role="progressbar" aria-label="Guest RSVP response progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={metrics.percentage ?? 0}><div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${metrics.percentage}%` }} /></div><p className="mt-3 text-sm text-[var(--color-muted)]">{metrics.responded} of {metrics.guests} guests have responded. {metrics.pending} awaiting response.</p></>}
    </article>
  )
}
