import { Check, X } from 'lucide-react'
import { Controller, type Control, type FieldError } from 'react-hook-form'
import type { RsvpFormValues } from '../rsvpSchema'
import type { InvitationGuest } from '../types'

type GuestAttendanceCardProps = {
  guest: InvitationGuest
  index: number
  control: Control<RsvpFormValues>
  error?: FieldError
  onDecline: () => void
}

function guestTypeLabel(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function GuestAttendanceCard({
  guest,
  index,
  control,
  error,
  onDecline,
}: GuestAttendanceCardProps) {
  return (
    <fieldset className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <legend className="px-1 font-[var(--font-display)] text-xl">{guest.fullName}</legend>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        {guestTypeLabel(guest.guestType)}
      </p>
      <Controller
        control={control}
        name={`guests.${index}.attendanceStatus`}
        render={({ field }) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-4 transition ${
                field.value === 'attending'
                  ? 'border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_8%,white)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-secondary)]'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={field.name}
                checked={field.value === 'attending'}
                onBlur={field.onBlur}
                onChange={() => field.onChange('attending')}
              />
              <Check className="size-5 shrink-0" aria-hidden="true" />
              <span className="font-medium">Joyfully accepts</span>
            </label>
            <label
              className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-4 transition ${
                field.value === 'declined'
                  ? 'border-[var(--color-primary)] bg-[var(--color-background)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-secondary)]'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={field.name}
                checked={field.value === 'declined'}
                onBlur={field.onBlur}
                onChange={() => {
                  field.onChange('declined')
                  onDecline()
                }}
              />
              <X className="size-5 shrink-0" aria-hidden="true" />
              <span className="font-medium">Regretfully declines</span>
            </label>
          </div>
        )}
      />
      {error ? (
        <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
          {error.message}
        </p>
      ) : null}
    </fieldset>
  )
}
