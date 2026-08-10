import type { UseFormRegister } from 'react-hook-form'
import type { RsvpQuestion } from '../../rsvpConfiguration/types'
import type { RsvpFormValues } from '../rsvpSchema'
import type { InvitationGuest } from '../types'

type Props = { guest: InvitationGuest; index: number; questions: RsvpQuestion[]; register: UseFormRegister<RsvpFormValues>; dietaryError?: string; accessibilityError?: string }

export function GuestDetailsFields({ guest, index, questions, register, dietaryError, accessibilityError }: Props) {
  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"><h3 className="font-[var(--font-display)] text-xl">{guest.fullName}</h3><p className="mt-1 text-sm text-[var(--color-muted)]">Details to help everyone feel comfortable and cared for.</p><div className="mt-5 grid gap-5">{questions.filter((question) => question.enabled).map((question) => {
    const dietary = question.key === 'dietaryRequirements'
    const field = dietary ? 'dietaryRequirements' : 'accessibilityRequirements'
    const id = `guest-${guest.id}-${field}`
    const error = dietary ? dietaryError : accessibilityError
    const helperId = question.helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    return <div key={question.key}><label className="font-medium" htmlFor={id}>{question.label}{question.required ? <span aria-hidden="true"> *</span> : null}</label><textarea id={id} rows={3} maxLength={2000} required={question.required} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" aria-invalid={Boolean(error)} aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined} {...register(`guests.${index}.${field}`)} />{question.helperText ? <p id={helperId} className="mt-1 text-sm text-[var(--color-muted)]">{question.helperText}</p> : null}{error ? <p id={errorId} className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error}</p> : null}</div>
  })}</div></section>
}
