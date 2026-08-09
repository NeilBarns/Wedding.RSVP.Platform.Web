import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { PublicWedding } from '../../publicWedding/types'
import { weddingTemplateMetadata } from '../../weddingTemplates/metadata'
import { weddingTemplateRegistry } from '../../weddingTemplates/registry'
import type { WeddingTemplateKey } from '../../weddingTemplates/types'
import type { AdminWeddingSettings } from '../types'
import { weddingPayload, type WeddingSettingsFormValues } from '../validation'

type Props = {
  templateKey: WeddingTemplateKey
  wedding: AdminWeddingSettings
  values: WeddingSettingsFormValues
  onClose: () => void
}

export function TemplatePreviewDialog({ templateKey, wedding, values, onClose }: Props) {
  const titleId = useId()
  const closeButton = useRef<HTMLButtonElement>(null)
  const template = weddingTemplateRegistry[templateKey]
  const LandingPage = template.LandingPage
  const payload = weddingPayload({ ...values, templateKey })
  const previewWedding: PublicWedding = { id: wedding.id, ...payload, content: null }

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = priorOverflow
      previous?.focus()
    }
  }, [onClose])

  return createPortal(<div className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--color-background)]" role="dialog" aria-modal="true" aria-labelledby={titleId}><div className="sticky top-0 z-[80] flex min-h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 shadow-sm sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">Template preview</p><h2 id={titleId} className="font-[var(--font-display)] text-xl">{weddingTemplateMetadata[templateKey].name}</h2></div><button ref={closeButton} type="button" onClick={onClose} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 font-medium"><X className="size-4" aria-hidden="true" />Close preview</button></div><div aria-label={`${weddingTemplateMetadata[templateKey].name} landing page preview`} onClickCapture={(event) => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }}><LandingPage wedding={previewWedding} /></div></div>, document.body)
}
