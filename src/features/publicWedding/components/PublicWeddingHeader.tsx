import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { PublicWedding } from '../types'

const links = [['Home', 'top'], ['Our Story', 'story'], ['Details', 'details'], ['Dress Code', 'dress-code'], ['Gallery', 'gallery'], ['FAQ', 'faq'], ['RSVP', 'rsvp']] as const

export function PublicWeddingHeader({ wedding, visibleSections }: { wedding: Pick<PublicWedding, 'partnerOneName' | 'partnerTwoName'>; visibleSections?: { story: boolean; gallery: boolean; faq: boolean } }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const home = location.pathname === '/'
  const anchor = (id: string) => home || id === 'rsvp' ? `#${id}` : `/#${id}`

  const displayedLinks = links.filter(([, id]) => id !== 'story' && id !== 'gallery' && id !== 'faq' || visibleSections?.[id] !== false)
  return <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_92%,transparent)] backdrop-blur-md"><div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 sm:px-8"><Link to="/" className="rounded-[var(--radius-sm)] font-[var(--font-display)] text-xl tracking-wide text-[var(--color-primary)]" aria-label={`${wedding.partnerOneName} and ${wedding.partnerTwoName} wedding home`}>{wedding.partnerOneName} <span aria-hidden="true">&amp;</span> {wedding.partnerTwoName}</Link><nav className="hidden items-center gap-1 lg:flex" aria-label="Wedding site navigation">{displayedLinks.map(([label, id]) => <a key={id} href={anchor(id)} className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]">{label}</a>)}</nav><button type="button" className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] lg:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}</button></div>{open ? <nav className="border-t border-[var(--color-border)] px-5 py-3 lg:hidden" aria-label="Mobile wedding site navigation"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-1">{displayedLinks.map(([label, id]) => <a key={id} href={anchor(id)} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm font-medium hover:bg-[var(--color-surface)]">{label}</a>)}</div></nav> : null}</header>
}
