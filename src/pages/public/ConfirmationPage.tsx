import { CheckCircle2 } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <CheckCircle2
        className="mx-auto mb-5 size-10 text-[var(--color-success)]"
        aria-hidden="true"
      />
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-primary)]">
        RSVP confirmation
      </h1>
      <p className="mt-4 text-[var(--color-muted)]">
        Submitted response details and next steps will appear here once the RSVP
        experience is implemented.
      </p>
    </section>
  )
}
