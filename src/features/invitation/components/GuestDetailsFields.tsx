import type { UseFormRegister } from 'react-hook-form'
import type { RsvpFormValues } from '../rsvpSchema'
import type { InvitationGuest } from '../types'

type GuestDetailsFieldsProps = {
  guest: InvitationGuest
  index: number
  register: UseFormRegister<RsvpFormValues>
  dietaryError?: string
  accessibilityError?: string
}

export function GuestDetailsFields({
  guest,
  index,
  register,
  dietaryError,
  accessibilityError,
}: GuestDetailsFieldsProps) {
  const dietaryId = `guest-${guest.id}-dietary`
  const accessibilityId = `guest-${guest.id}-accessibility`

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <h3 className="font-[var(--font-display)] text-xl">{guest.fullName}</h3>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Optional details to help everyone feel comfortable and cared for.
      </p>
      <div className="mt-5 grid gap-5">
        <div>
          <label className="font-medium" htmlFor={dietaryId}>Dietary requirements</label>
          <textarea
            id={dietaryId}
            rows={3}
            maxLength={2000}
            className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
            placeholder="Allergies or dietary needs"
            aria-invalid={Boolean(dietaryError)}
            {...register(`guests.${index}.dietaryRequirements`)}
          />
          {dietaryError ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{dietaryError}</p> : null}
        </div>
        <div>
          <label className="font-medium" htmlFor={accessibilityId}>Accessibility requirements</label>
          <textarea
            id={accessibilityId}
            rows={3}
            maxLength={2000}
            className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
            placeholder="Anything we can prepare for you"
            aria-invalid={Boolean(accessibilityError)}
            {...register(`guests.${index}.accessibilityRequirements`)}
          />
          {accessibilityError ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{accessibilityError}</p> : null}
        </div>
      </div>
    </section>
  )
}
