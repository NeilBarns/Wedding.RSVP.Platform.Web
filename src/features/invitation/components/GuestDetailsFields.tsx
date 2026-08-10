import type { UseFormRegister } from 'react-hook-form'
import type { RsvpQuestion } from '../../rsvpConfiguration/types'
import type { RsvpFormValues } from '../rsvpSchema'
import type { InvitationGuest } from '../types'

type Props = { guest: InvitationGuest; index: number; questions: RsvpQuestion[]; register: UseFormRegister<RsvpFormValues>; dietaryError?: string; accessibilityError?: string; mealError?: string }

export function GuestDetailsFields({ guest, index, questions, register, dietaryError, accessibilityError, mealError }: Props) {
  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"><h3 className="font-[var(--font-display)] text-xl">{guest.fullName}</h3><p className="mt-1 text-sm text-[var(--color-muted)]">Details to help everyone feel comfortable and cared for.</p><div className="mt-5 grid gap-5">{questions.filter((question) => question.enabled).map((question) => {
    if (question.key === 'mealChoice') {
      const options = question.options ?? []
      const stale = Boolean(guest.mealChoice && !options.some((option) => option.value === guest.mealChoice))
      const errorId = mealError ? `guest-${guest.id}-meal-error` : undefined
      return <fieldset key={question.key} aria-describedby={errorId}><legend className="font-medium">{question.label}{question.required ? <span aria-hidden="true"> *</span> : null}</legend>{question.helperText ? <p className="mt-1 text-sm text-[var(--color-muted)]">{question.helperText}</p> : null}{stale ? <p className="mt-2 text-sm text-[var(--color-error)]">Your previous meal selection is no longer available. Please choose another option.</p> : null}<div className="mt-3 grid gap-3 sm:grid-cols-2">{options.map((option) => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 has-[:checked]:border-[var(--color-primary)] has-[:checked]:ring-2 has-[:checked]:ring-[var(--color-primary)]"><input type="radio" value={option.value} className="size-5 accent-[var(--color-primary)]" {...register(`guests.${index}.mealChoice`)} /><span>{option.label}</span></label>)}</div>{mealError ? <p id={errorId} className="mt-2 text-sm text-[var(--color-error)]" role="alert">{mealError}</p> : null}</fieldset>
    }
    const dietary = question.key === 'dietaryRequirements'
    const field = dietary ? 'dietaryRequirements' : 'accessibilityRequirements'
    const id = `guest-${guest.id}-${field}`
    const error = dietary ? dietaryError : accessibilityError
    const helperId = question.helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    return <div key={question.key}><label className="font-medium" htmlFor={id}>{question.label}{question.required ? <span aria-hidden="true"> *</span> : null}</label><textarea id={id} rows={3} maxLength={2000} required={question.required} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" aria-invalid={Boolean(error)} aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined} {...register(`guests.${index}.${field}`)} />{question.helperText ? <p id={helperId} className="mt-1 text-sm text-[var(--color-muted)]">{question.helperText}</p> : null}{error ? <p id={errorId} className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error}</p> : null}</div>
  })}</div></section>
}
