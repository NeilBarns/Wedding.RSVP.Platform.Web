import { Heart } from 'lucide-react'

export function StorySection() {
  return <section id="story" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-3xl text-center"><Heart className="mx-auto size-6 text-[var(--color-accent)]" strokeWidth={1.5} aria-hidden="true" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">Our story</p><h2 className="mt-3 font-[var(--font-display)] text-4xl sm:text-5xl">A story worth celebrating</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">A little more about our story will be shared here soon.</p></div></section>
}
