import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { RsvpFormValues } from '../rsvpSchema'

type HouseholdDetailsFormProps = {
  register: UseFormRegister<RsvpFormValues>
  errors: FieldErrors<RsvpFormValues>
}

export function HouseholdDetailsForm({
  register,
  errors,
}: HouseholdDetailsFormProps) {
  return (
    <section>
      <h2 className="font-[var(--font-display)] text-3xl">Household details</h2>
      <p className="mt-2 text-[var(--color-muted)]">
        These details are optional and help Neil and Hazel stay in touch about your response.
      </p>
      <div className="mt-6 grid gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
        <div>
          <label className="font-medium" htmlFor="rsvp-contact-number">Contact number</label>
          <input
            id="rsvp-contact-number"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
            aria-invalid={Boolean(errors.contactNumber)}
            {...register('contactNumber')}
          />
          {errors.contactNumber ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{errors.contactNumber.message}</p> : null}
        </div>
        <div>
          <label className="font-medium" htmlFor="rsvp-email">Email</label>
          <input
            id="rsvp-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="font-medium" htmlFor="rsvp-message">Message to Neil &amp; Hazel</label>
          <textarea
            id="rsvp-message"
            rows={5}
            maxLength={5000}
            className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3"
            placeholder="Share a note with the happy couple"
            aria-invalid={Boolean(errors.message)}
            {...register('message')}
          />
          {errors.message ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{errors.message.message}</p> : null}
        </div>
      </div>
    </section>
  )
}
