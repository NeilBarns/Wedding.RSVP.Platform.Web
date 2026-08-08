import type { RsvpFormValues } from '../rsvpSchema'
import type { InvitationGuest } from '../types'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'

type RsvpReviewProps = {
  values: RsvpFormValues
  invitedGuests: InvitationGuest[]
}

function OptionalValue({ value }: { value: string }) {
  return value.trim() ? <span>{value.trim()}</span> : <span className="text-[var(--color-muted)]">Not provided</span>
}

export function RsvpReview({ values, invitedGuests }: RsvpReviewProps) {
  return (
    <section>
      <h2 className="font-[var(--font-display)] text-3xl">Review your RSVP</h2>
      <p className="mt-2 text-[var(--color-muted)]">
        Please make sure every household member’s response is correct before confirming.
      </p>
      <div className="mt-6 space-y-4">
        {values.guests.map((guest, index) => {
          const invitedGuest = invitedGuests[index]
          return (
            <section key={guest.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-[var(--font-display)] text-xl">{invitedGuest?.fullName}</h3>
                <AttendanceStatusBadge status={guest.attendanceStatus} />
              </div>
              {guest.attendanceStatus === 'attending' ? (
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="font-medium">Dietary requirements</dt><dd className="mt-1 text-[var(--color-muted)]"><OptionalValue value={guest.dietaryRequirements} /></dd></div>
                  <div><dt className="font-medium">Accessibility requirements</dt><dd className="mt-1 text-[var(--color-muted)]"><OptionalValue value={guest.accessibilityRequirements} /></dd></div>
                </dl>
              ) : null}
            </section>
          )
        })}
      </div>
      <section className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="font-[var(--font-display)] text-xl">Household details</h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-medium">Contact number</dt><dd className="mt-1 text-[var(--color-muted)]"><OptionalValue value={values.contactNumber} /></dd></div>
          <div><dt className="font-medium">Email</dt><dd className="mt-1 break-words text-[var(--color-muted)]"><OptionalValue value={values.email} /></dd></div>
          <div className="sm:col-span-2"><dt className="font-medium">Message</dt><dd className="mt-1 whitespace-pre-wrap text-[var(--color-muted)]"><OptionalValue value={values.message} /></dd></div>
        </dl>
      </section>
    </section>
  )
}
