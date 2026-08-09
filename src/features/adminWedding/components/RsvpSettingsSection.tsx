import { CalendarClock } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { WeddingSettingsFormValues } from '../validation'

export function RsvpSettingsSection({ form }: { form: UseFormReturn<WeddingSettingsFormValues> }) {
  const error = form.formState.errors.rsvpDeadline
  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"><h2 className="flex items-center gap-2 font-[var(--font-display)] text-2xl"><CalendarClock className="size-5" aria-hidden="true" />RSVP settings</h2><div className="mt-5 max-w-md"><label className="font-medium" htmlFor="wedding-rsvp-deadline">RSVP deadline</label><input id="wedding-rsvp-deadline" type="date" aria-describedby="rsvp-deadline-help" aria-invalid={Boolean(error)} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4" {...form.register('rsvpDeadline')} />{error ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}<p id="rsvp-deadline-help" className="mt-2 text-sm text-[var(--color-muted)]">Guests can respond through the end of this date unless their invitation is locked earlier.</p></div></section>
}
