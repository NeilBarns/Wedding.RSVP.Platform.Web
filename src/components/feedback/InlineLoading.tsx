import { LoaderCircle } from 'lucide-react'

type InlineLoadingProps = {
  label?: string
}

export function InlineLoading({ label = 'Loading…' }: InlineLoadingProps) {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
