import { CalendarDays, Shirt } from 'lucide-react'
import { formatWeddingDate } from '../../../lib/utils/formatDate'
import type { PublicInvitation, WeddingSummary } from '../types'

type InvitationOverviewProps = {
  invitation: PublicInvitation
  wedding: WeddingSummary
}

export function InvitationOverview({ invitation, wedding }: InvitationOverviewProps) {
  return (
    <header className="mb-10 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">An invitation for</p>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[var(--color-primary)] sm:text-5xl">{invitation.displayName}</h1>
      <p className="mt-4 font-[var(--font-display)] text-2xl">{wedding.partnerOneName} &amp; {wedding.partnerTwoName}</p>
      <div className="mx-auto mt-7 grid max-w-2xl gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] text-left sm:grid-cols-2">
        <div className="bg-[var(--color-surface)] p-5">
          <CalendarDays className="mb-2 size-5 text-[var(--color-accent)]" aria-hidden="true" />
          <p className="text-sm text-[var(--color-muted)]">Wedding date</p>
          <p className="mt-1 font-medium">{formatWeddingDate(wedding.weddingDate)}</p>
        </div>
        <div className="bg-[var(--color-surface)] p-5">
          <Shirt className="mb-2 size-5 text-[var(--color-accent)]" aria-hidden="true" />
          <p className="text-sm text-[var(--color-muted)]">Dress code</p>
          <p className="mt-1 font-medium">{wedding.dressCode || 'Details to follow'}</p>
        </div>
      </div>
    </header>
  )
}
