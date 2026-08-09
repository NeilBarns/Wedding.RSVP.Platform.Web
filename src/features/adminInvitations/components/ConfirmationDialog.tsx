import { AlertTriangle } from 'lucide-react'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ModalShell } from './ModalShell'

type ConfirmationDialogProps = {
  title: string
  message: string
  confirmLabel: string
  destructive?: boolean
  busy?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({ title, message, confirmLabel, destructive = false, busy = false, error, onConfirm, onCancel }: ConfirmationDialogProps) {
  return (
    <ModalShell title={title} onClose={onCancel} size="md">
      <div className="flex gap-3">
        <AlertTriangle className={`mt-0.5 size-6 shrink-0 ${destructive ? 'text-[var(--color-error)]' : 'text-[var(--color-accent)]'}`} aria-hidden="true" />
        <p className="text-[var(--color-muted)]">{message}</p>
      </div>
      {error ? <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 text-sm text-[var(--color-error)]" role="alert">{error}</p> : null}
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <ActionButton className="!bg-transparent !text-[var(--color-primary)] ring-1 ring-[var(--color-border)]" onClick={onCancel} disabled={busy}>Cancel</ActionButton>
        <ActionButton className={destructive ? '!bg-[var(--color-error)]' : ''} onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</ActionButton>
      </div>
    </ModalShell>
  )
}
