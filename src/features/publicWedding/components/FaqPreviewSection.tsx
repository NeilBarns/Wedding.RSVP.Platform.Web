import { CircleHelp } from 'lucide-react'

export function FaqPreviewSection() {
  return <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-soft)] sm:p-12"><CircleHelp className="mx-auto size-6 text-[var(--color-accent)]" aria-hidden="true" /><h2 className="mt-5 font-[var(--font-display)] text-4xl">Frequently asked questions</h2><p className="mt-5 leading-7 text-[var(--color-muted)]">Frequently asked questions will appear here as details are finalized.</p></div></section>
}
