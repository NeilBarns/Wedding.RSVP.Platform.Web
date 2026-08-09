import { Image } from 'lucide-react'

export function GalleryPreviewSection() {
  return <section id="gallery" className="scroll-mt-24 bg-[var(--color-surface)] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-5xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">Moments together</p><h2 className="mt-3 font-[var(--font-display)] text-4xl sm:text-5xl">Gallery</h2><div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Gallery coming soon">{[0, 1, 2].map((item) => <div key={item} className={`flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] ${item === 0 ? 'col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-[3/4]' : 'aspect-[3/4]'}`}><Image className="size-7 text-[var(--color-border)]" aria-hidden="true" /></div>)}</div><p className="mt-6 text-[var(--color-muted)]">Photographs will be shared here soon.</p></div></section>
}
