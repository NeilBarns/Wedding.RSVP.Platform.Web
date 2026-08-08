import { CalendarDays, CheckCircle2, Clock3, Shirt } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { NotFoundState } from '../../components/feedback/NotFoundState'
import { usePublicInvitation } from '../../features/invitation/usePublicInvitation'
import type { AttendanceStatus } from '../../features/invitation/types'
import { formatWeddingDate } from '../../lib/utils/formatDate'

const attendanceLabels: Record<AttendanceStatus, string> = {
  pending: 'Awaiting response',
  attending: 'Attending',
  declined: 'Not attending',
}

export default function InvitationPage() {
  const { token = '' } = useParams()
  const { status, data, retry } = usePublicInvitation(token)

  if (status === 'loading') {
    return <FullPageLoading label="Opening your invitation…" />
  }

  if (status === 'not-found') {
    return (
      <NotFoundState
        title="Invitation not found"
        message="This invitation is unavailable. Please check the link you received or contact the couple."
      />
    )
  }

  if (status === 'error' || !data) {
    return (
      <ErrorState
        title="We couldn’t open this invitation"
        message="Please check your connection and try again."
        onRetry={() => void retry()}
      />
    )
  }

  const { invitation, wedding } = data

  return (
    <article className="mx-auto max-w-3xl">
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
          An invitation for
        </p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[var(--color-primary)] sm:text-5xl">
          {invitation.displayName}
        </h1>
        <p className="mt-5 font-[var(--font-display)] text-2xl">
          {wedding.partnerOneName} &amp; {wedding.partnerTwoName}
        </p>
      </header>

      <section
        className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2"
        aria-label="Wedding details"
      >
        <div className="bg-[var(--color-surface)] p-6">
          <CalendarDays
            className="mb-3 size-5 text-[var(--color-accent)]"
            aria-hidden="true"
          />
          <h2 className="text-sm font-medium text-[var(--color-muted)]">Wedding date</h2>
          <p className="mt-1 text-lg">{formatWeddingDate(wedding.weddingDate)}</p>
        </div>
        <div className="bg-[var(--color-surface)] p-6">
          <Shirt
            className="mb-3 size-5 text-[var(--color-accent)]"
            aria-hidden="true"
          />
          <h2 className="text-sm font-medium text-[var(--color-muted)]">Dress code</h2>
          <p className="mt-1 text-lg">{wedding.dressCode || 'Details to follow'}</p>
        </div>
      </section>

      <section className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-display)] text-2xl">Your household</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              RSVP editing will be added in the next stage.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm">
            {invitation.canRespond ? (
              <CheckCircle2 className="size-4 text-[var(--color-success)]" aria-hidden="true" />
            ) : (
              <Clock3 className="size-4 text-[var(--color-muted)]" aria-hidden="true" />
            )}
            {invitation.canRespond ? 'Responses can be edited' : 'Responses are closed'}
          </span>
        </div>
        <ul className="mt-6 divide-y divide-[var(--color-border)]">
          {invitation.guests.map((guest) => (
            <li
              key={guest.id}
              className="flex flex-wrap items-center justify-between gap-2 py-4 first:pt-0 last:pb-0"
            >
              <span className="font-medium">{guest.fullName}</span>
              <span className="text-sm text-[var(--color-muted)]">
                {attendanceLabels[guest.attendanceStatus]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
