import { CalendarDays, Settings2, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AdminWeddingSettings } from '../../adminWedding/types'
import { weddingStatusContent } from '../../adminWedding/utils'
import { deadlineLabel, formatCalendarDate, weddingCountdownLabel } from '../utils'

export function WeddingSummaryCard({ wedding }: { wedding: AdminWeddingSettings }) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">Current wedding</p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl">{wedding.partnerOneName} &amp; {wedding.partnerTwoName}</h2>
        </div>
        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm font-medium">{weddingStatusContent[wedding.status].label}</span>
      </div>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="flex gap-3"><CalendarDays className="mt-0.5 size-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" /><div><dt className="text-sm text-[var(--color-muted)]">Wedding date</dt><dd className="font-medium">{formatCalendarDate(wedding.weddingDate)}</dd><dd className="mt-1 text-xs text-[var(--color-muted)]">{weddingCountdownLabel(wedding.weddingDate)}</dd></div></div>
        <div className="flex gap-3"><CalendarDays className="mt-0.5 size-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" /><div><dt className="text-sm text-[var(--color-muted)]">RSVP deadline</dt><dd className="font-medium">{wedding.rsvpDeadline ? formatCalendarDate(wedding.rsvpDeadline) : 'No RSVP deadline set'}</dd>{wedding.rsvpDeadline ? <dd className="mt-1 text-xs text-[var(--color-muted)]">{deadlineLabel(wedding.rsvpDeadline)}</dd> : null}</div></div>
        <div className="flex gap-3 sm:col-span-2"><Shirt className="mt-0.5 size-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" /><div><dt className="text-sm text-[var(--color-muted)]">Dress code</dt><dd className="font-medium">{wedding.dressCode ?? 'Not specified'}</dd></div></div>
      </dl>
      <Link to="/admin/wedding" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-medium hover:bg-[var(--color-background)]"><Settings2 className="size-4" aria-hidden="true" />Manage wedding settings</Link>
    </article>
  )
}
