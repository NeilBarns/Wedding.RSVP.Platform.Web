import { Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatWeddingDate } from '../../../../../lib/utils/formatDate'
import type { PublicWeddingDetails } from '../../../../publicWedding/types'
import { publicThemeStyle } from '../../../../publicWedding/utils'

type Props = {
  wedding: PublicWeddingDetails
  children: ReactNode
  visibleSections?: { story: boolean; gallery: boolean; faq: boolean }
}

export function ModernMinimalShell({ wedding, children, visibleSections }: Props) {
  const [open, setOpen] = useState(false)
  const links = [
    ['Details', 'details'],
    ...(visibleSections?.story ? [['Story', 'story']] : []),
    ...(visibleSections?.gallery ? [['Gallery', 'gallery']] : []),
    ...(visibleSections?.faq ? [['FAQ', 'faq']] : []),
    ['RSVP', 'rsvp'],
  ]

  return (
    <div data-wedding-template="modern-minimal-v1" style={publicThemeStyle(wedding.theme)} className="min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text)]">
      <a href="#main-content" className="fixed left-4 top-3 z-50 -translate-y-24 border border-[var(--color-text)] bg-[var(--color-background)] px-4 py-3 text-sm font-bold uppercase tracking-wider focus:translate-y-0">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-background)_96%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-primary)]" aria-label={`${wedding.partnerOneName} and ${wedding.partnerTwoName} wedding home`}>{wedding.partnerOneName}<span className="mx-2 font-normal text-[var(--color-accent)]">/</span>{wedding.partnerTwoName}</Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Wedding site navigation">{links.map(([label, id]) => <a key={id} href={`/#${id}`} className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)] hover:text-[var(--color-primary)]">{label}</a>)}</nav>
          <button type="button" className="inline-flex size-11 items-center justify-center border border-[var(--color-border)] lg:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}</button>
        </div>
        {open ? <nav className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-5 py-4 lg:hidden" aria-label="Mobile wedding site navigation"><div className="mx-auto grid max-w-7xl">{links.map(([label, id]) => <a key={id} href={`/#${id}`} onClick={() => setOpen(false)} className="flex min-h-11 items-center border-b border-[var(--color-border)] text-sm font-bold uppercase tracking-wider last:border-0">{label}</a>)}</div></nav> : null}
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t border-[var(--color-border)] px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm sm:flex-row"><p className="font-bold uppercase tracking-[0.16em]">{wedding.partnerOneName} / {wedding.partnerTwoName}</p><p className="text-[var(--color-muted)]">{formatWeddingDate(wedding.weddingDate)}</p></div></footer>
    </div>
  )
}
