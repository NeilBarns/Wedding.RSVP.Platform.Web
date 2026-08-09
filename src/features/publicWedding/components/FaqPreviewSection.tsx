import { ChevronDown, CircleHelp } from 'lucide-react'
import { useState } from 'react'
import type { WeddingFaqEntry } from '../types'

export function FaqPreviewSection({ entries }: { entries: WeddingFaqEntry[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const toggle = (id: number) => setOpen((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  return <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-3xl"><div className="text-center"><CircleHelp className="mx-auto size-6 text-[var(--color-accent)]" aria-hidden="true" /><h2 className="mt-5 font-[var(--font-display)] text-4xl">Frequently asked questions</h2></div><div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">{entries.map((entry) => { const expanded = open.has(entry.id); const panelId = `faq-answer-${entry.id}`; return <article key={entry.id}><h3><button type="button" className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left font-semibold" aria-expanded={expanded} aria-controls={panelId} onClick={() => toggle(entry.id)}><span>{entry.question}</span><ChevronDown className={`size-5 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" /></button></h3><div id={panelId} hidden={!expanded} className="pb-5 pr-9"><p className="whitespace-pre-line leading-7 text-[var(--color-muted)]">{entry.answer}</p></div></article> })}</div></div></section>
}
