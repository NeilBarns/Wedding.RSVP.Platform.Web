import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

type ModalShellProps = {
  title: string
  children: ReactNode
  onClose: () => void
  size?: 'md' | 'lg' | 'xl'
}

export function ModalShell({ title, children, onClose, size = 'lg' }: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const width = size === 'xl' ? 'max-w-4xl' : size === 'md' ? 'max-w-lg' : 'max-w-2xl'

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[var(--radius-lg)] bg-[var(--color-surface)] p-5 shadow-2xl sm:rounded-[var(--radius-lg)] sm:p-7 ${width}`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="admin-modal-title" className="font-[var(--font-display)] text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-background)]">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
