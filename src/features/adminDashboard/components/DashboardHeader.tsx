import { Link } from 'react-router-dom'
import type { WeddingStatus } from '../../adminWedding/types'
import { weddingStatusContent } from '../../adminWedding/utils'

export function DashboardHeader({ status }: { status?: WeddingStatus }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-[var(--color-muted)]">A quick overview of your invitations and RSVP progress.</p>
      </div>
      {status ? <Link to="/admin/wedding" className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium hover:bg-[var(--color-background)]">{weddingStatusContent[status].label}</Link> : null}
    </header>
  )
}
