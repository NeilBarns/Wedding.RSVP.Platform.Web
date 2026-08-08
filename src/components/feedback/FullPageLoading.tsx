import { LoaderCircle } from 'lucide-react'

type FullPageLoadingProps = {
  label?: string
}

export function FullPageLoading({
  label = 'Loading…',
}: FullPageLoadingProps) {
  return (
    <div
      className="flex min-h-[55vh] items-center justify-center px-6 text-[var(--color-muted)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
        <p>{label}</p>
      </div>
    </div>
  )
}
