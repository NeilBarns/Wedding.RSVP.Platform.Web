import { CircleAlert, RefreshCw } from 'lucide-react'
import { ActionButton } from '../ui/ActionButton'

type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center shadow-[var(--shadow-soft)]"
      role="alert"
    >
      <CircleAlert
        className="mx-auto mb-4 size-8 text-[var(--color-error)]"
        aria-hidden="true"
      />
      <h1 className="font-[var(--font-display)] text-2xl">{title}</h1>
      <p className="mt-2 text-[var(--color-muted)]">{message}</p>
      {onRetry ? (
        <ActionButton className="mt-6" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </ActionButton>
      ) : null}
    </section>
  )
}
