import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import { ActionButton } from '../../../components/ui/ActionButton'
import type { PublicInvitation } from '../types'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'

type RsvpConfirmationProps = {
  invitation: PublicInvitation
  readOnly?: boolean
  notice?: string
  onEdit?: () => void
}

function formatSubmittedAt(timestamp: string | null) {
  if (!timestamp) return null
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export function RsvpConfirmation({
  invitation,
  readOnly = false,
  notice,
  onEdit,
}: RsvpConfirmationProps) {
  const reduceMotion = useReducedMotion()
  const submittedAt = formatSubmittedAt(invitation.submittedAt)

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      className="mx-auto max-w-3xl"
    >
      <header className="text-center">
        {readOnly ? (
          <LockKeyhole className="mx-auto mb-5 size-10 text-[var(--color-muted)]" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mx-auto mb-5 size-11 text-[var(--color-success)]" aria-hidden="true" />
        )}
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-primary)]">
          {invitation.hasSubmitted ? 'Your RSVP has been received' : 'RSVP responses are closed'}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
          {notice ?? (invitation.hasSubmitted
            ? 'Thank you for responding on behalf of your household. Neil and Hazel have your current response.'
            : 'This invitation is no longer accepting RSVP responses.')}
        </p>
        {submittedAt ? <p className="mt-3 text-sm text-[var(--color-muted)]">Received {submittedAt}</p> : null}
      </header>

      <section className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <h2 className="font-[var(--font-display)] text-2xl">Household response</h2>
        <ul className="mt-4 divide-y divide-[var(--color-border)]">
          {invitation.guests.map((guest) => (
            <li key={guest.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium">{guest.fullName}</span>
                <AttendanceStatusBadge status={guest.attendanceStatus} />
              </div>
              {guest.attendanceStatus === 'attending' && (guest.dietaryRequirements || guest.accessibilityRequirements) ? (
                <div className="mt-3 space-y-1 text-sm text-[var(--color-muted)]">
                  {guest.dietaryRequirements ? <p><span className="font-medium text-[var(--color-text)]">Dietary:</span> {guest.dietaryRequirements}</p> : null}
                  {guest.accessibilityRequirements ? <p><span className="font-medium text-[var(--color-text)]">Accessibility:</span> {guest.accessibilityRequirements}</p> : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {(invitation.responseContactNumber || invitation.responseEmail || invitation.messageToCouple) ? (
        <section className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <h2 className="font-[var(--font-display)] text-2xl">Household details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {invitation.responseContactNumber ? <div><dt className="font-medium">Contact number</dt><dd className="text-[var(--color-muted)]">{invitation.responseContactNumber}</dd></div> : null}
            {invitation.responseEmail ? <div><dt className="font-medium">Email</dt><dd className="break-words text-[var(--color-muted)]">{invitation.responseEmail}</dd></div> : null}
            {invitation.messageToCouple ? <div><dt className="font-medium">Message</dt><dd className="whitespace-pre-wrap text-[var(--color-muted)]">{invitation.messageToCouple}</dd></div> : null}
          </dl>
        </section>
      ) : null}

      {invitation.canRespond && onEdit ? (
        <div className="mt-7 text-center">
          <ActionButton onClick={onEdit}>Edit RSVP</ActionButton>
        </div>
      ) : null}
    </motion.section>
  )
}
