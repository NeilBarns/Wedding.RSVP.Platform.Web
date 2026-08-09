import { Check, Copy, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { ActionButton } from '../../../components/ui/ActionButton'
import type { InvitationAccess } from '../types'
import { ModalShell } from './ModalShell'

type InvitationAccessRevealProps = {
  access: InvitationAccess
  title?: string
  onRequestClose: (copied: boolean) => void
}

export function InvitationAccessReveal({ access, title = 'Invitation created', onRequestClose }: InvitationAccessRevealProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  async function copyLink() {
    setCopyError(null)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(access.invitationUrl)
      setCopied(true)
    } catch {
      setCopyError('Copying is unavailable. Select the link and copy it manually before closing.')
    }
  }

  return (
    <ModalShell title={title} onClose={() => onRequestClose(copied)} size="lg">
      <div className="flex gap-3 rounded-[var(--radius-md)] bg-[var(--color-background)] p-4">
        <KeyRound className="mt-0.5 size-6 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-muted)]">Copy this invitation link now. For security, the current link cannot be recovered later. If it is lost, you can generate a new link, which will invalidate the previous one.</p>
      </div>
      <label htmlFor="one-time-invitation-url" className="mt-6 block font-medium">Invitation URL</label>
      <input id="one-time-invitation-url" readOnly value={access.invitationUrl} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm" />
      {copyError ? <p className="mt-2 text-sm text-[var(--color-error)]" role="alert">{copyError}</p> : null}
      {copied ? <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-success)]" role="status"><Check className="size-4" aria-hidden="true" />Invitation link copied.</p> : null}
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <ActionButton className="!bg-transparent !text-[var(--color-primary)] ring-1 ring-[var(--color-border)]" onClick={() => onRequestClose(copied)}>Done</ActionButton>
        <ActionButton onClick={() => void copyLink()}><Copy className="size-4" aria-hidden="true" />{copied ? 'Copy again' : 'Copy link'}</ActionButton>
      </div>
    </ModalShell>
  )
}
