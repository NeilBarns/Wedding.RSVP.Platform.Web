import { Shirt } from 'lucide-react'
import type { PublicWedding } from '../types'

export function DressCodeSection({ dressCode }: { dressCode: PublicWedding['dressCode'] }) {
  return <section id="dress-code" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr]"><div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),color-mix(in_srgb,var(--color-secondary)_12%,var(--color-background)))]" aria-hidden="true"><Shirt className="size-16 text-[var(--color-accent)]" strokeWidth={1} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">What to wear</p><h2 className="mt-3 font-[var(--font-display)] text-4xl sm:text-5xl">Dress code</h2><p className="mt-6 font-[var(--font-display)] text-3xl text-[var(--color-primary)]">{dressCode ?? 'Details to follow'}</p><p className="mt-4 leading-7 text-[var(--color-muted)]">Additional attire guidance and visual inspiration will be shared here when available.</p></div></div></section>
}
