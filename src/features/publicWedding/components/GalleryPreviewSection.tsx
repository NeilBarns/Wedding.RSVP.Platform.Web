import type { WeddingGalleryEntry } from '../types'
import { ContentImage } from './ContentImage'

export function GalleryPreviewSection({ entries }: { entries: WeddingGalleryEntry[] }) {
  return <section id="gallery" className="scroll-mt-24 bg-[var(--color-surface)] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-6xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">Moments together</p><h2 className="mt-3 font-[var(--font-display)] text-4xl sm:text-5xl">Gallery</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{entries.map((entry, index) => <figure key={entry.id} className={`overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] ${index === 0 && entries.length > 2 ? 'sm:col-span-2' : ''}`}><ContentImage src={entry.imageUrl} alt={entry.altText} className={`w-full object-cover ${index === 0 && entries.length > 2 ? 'aspect-[2/1]' : 'aspect-[4/3]'}`} />{entry.caption ? <figcaption className="px-4 py-3 text-left text-sm text-[var(--color-muted)]">{entry.caption}</figcaption> : null}</figure>)}</div></div></section>
}
