import type { FieldErrors, UseFormClearErrors, UseFormRegister } from 'react-hook-form'
import type { RsvpQuestion } from '../../rsvpConfiguration/types'
import type { RsvpFormValues } from '../rsvpSchema'

type Props = { questions: RsvpQuestion[]; register: UseFormRegister<RsvpFormValues>; clearErrors: UseFormClearErrors<RsvpFormValues>; errors: FieldErrors<RsvpFormValues> }
const fields = { responsePhone: { name: 'contactNumber', type: 'tel', autoComplete: 'tel', maxLength: 30 }, responseEmail: { name: 'email', type: 'email', autoComplete: 'email', maxLength: 254 }, messageToCouple: { name: 'message', type: 'textarea', autoComplete: undefined, maxLength: 5000 } } as const

export function HouseholdDetailsForm({ questions, register, clearErrors, errors }: Props) {
  const enabled = questions.filter((question) => question.enabled && question.key !== 'attendance' && question.key in fields)
  return <section><h2 className="font-[var(--font-display)] text-3xl">Household details</h2><p className="mt-2 text-[var(--color-muted)]">Share the enabled details below for your household response.</p>{enabled.length ? <div className="mt-6 grid gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">{enabled.map((question) => {
    const definition = fields[question.key as keyof typeof fields]
    const name = definition.name
    const id = `rsvp-${name}`
    const error = errors[name]
    const helperId = question.helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    const registration = register(name, { onChange: () => clearErrors(name) })
    return <div key={question.key}><label className="font-medium" htmlFor={id}>{question.label}{question.required ? <span aria-hidden="true"> *</span> : null}</label>{definition.type === 'textarea' ? <textarea id={id} rows={5} maxLength={definition.maxLength} required={question.required} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" aria-invalid={Boolean(error)} aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined} {...registration} /> : <input id={id} type={definition.type} autoComplete={definition.autoComplete} maxLength={definition.maxLength} required={question.required} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" aria-invalid={Boolean(error)} aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined} {...registration} />}{question.helperText ? <p id={helperId} className="mt-1 text-sm text-[var(--color-muted)]">{question.helperText}</p> : null}{error ? <p id={errorId} className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div>
  })}</div> : <p className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">No household details are requested.</p>}</section>
}
