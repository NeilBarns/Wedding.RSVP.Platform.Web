import type { LucideIcon } from 'lucide-react'

type MetricCardProps = {
  label: string
  value: number
  icon: LucideIcon
  helper?: string
}

export function MetricCard({ label, value, icon: Icon, helper }: MetricCardProps) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums" aria-label={`${label}: ${value}`}>{value}</p>
        </div>
        <span className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-2.5"><Icon className="size-5" aria-hidden="true" /></span>
      </div>
      {helper ? <p className="mt-3 text-xs text-[var(--color-muted)]">{helper}</p> : null}
    </article>
  )
}
