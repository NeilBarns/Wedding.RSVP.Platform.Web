import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  message: string
  action?: ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
      <Inbox
        className="mx-auto mb-3 size-7 text-[var(--color-muted)]"
        aria-hidden="true"
      />
      <h2 className="font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted)]">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  )
}
