import { CalendarHeart, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EventDetailsSection } from '../../features/publicWedding/components/EventDetailsSection'
import { DressCodeSection } from '../../features/publicWedding/components/DressCodeSection'
import { FaqPreviewSection } from '../../features/publicWedding/components/FaqPreviewSection'
import { GalleryPreviewSection } from '../../features/publicWedding/components/GalleryPreviewSection'
import { PublicWeddingShell } from '../../features/publicWedding/components/PublicWeddingShell'
import { RsvpCallToAction } from '../../features/publicWedding/components/RsvpCallToAction'
import { StorySection } from '../../features/publicWedding/components/StorySection'
import { WeddingHero } from '../../features/publicWedding/components/WeddingHero'
import { getPublicWedding } from '../../features/publicWedding/api'
import type { PublicWedding } from '../../features/publicWedding/types'

type PageState = 'loading' | 'ready' | 'unavailable'

function WeddingPageSkeleton() {
  return <main className="min-h-screen bg-[var(--color-background)] px-5 py-20" role="status"><div className="mx-auto max-w-5xl"><div className="mx-auto h-4 w-40 animate-pulse rounded bg-[var(--color-border)]" /><div className="mx-auto mt-8 h-24 max-w-2xl animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface)]" /><div className="mx-auto mt-10 h-12 w-36 animate-pulse rounded-full bg-[var(--color-border)]" /></div><span className="sr-only">Preparing the wedding website...</span></main>
}

export default function PublicHomePage() {
  const [state, setState] = useState<PageState>('loading')
  const [wedding, setWedding] = useState<PublicWedding | null>(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getPublicWedding({ signal: controller.signal }).then((value) => {
      if (controller.signal.aborted) return
      if (value.status !== 'published') { setState('unavailable'); return }
      setWedding(value)
      setState('ready')
    }).catch(() => { if (!controller.signal.aborted) setState('unavailable') })
    return () => controller.abort()
  }, [reload])

  if (state === 'loading') return <WeddingPageSkeleton />
  if (state === 'unavailable' || !wedding) return <main className="flex min-h-screen items-center px-5 py-16"><section className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-soft)]" role="alert"><CalendarHeart className="mx-auto size-8 text-[var(--color-accent)]" aria-hidden="true" /><h1 className="mt-5 font-[var(--font-display)] text-3xl">Wedding website unavailable</h1><p className="mt-3 text-[var(--color-muted)]">This wedding website isn't available right now. Please try again in a moment.</p><button type="button" onClick={() => { setState('loading'); setReload((value) => value + 1) }} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 font-semibold text-white"><RefreshCw className="size-4" aria-hidden="true" />Try again</button></section></main>

  const content = {
    hero: wedding.content?.hero ?? null,
    story: wedding.content?.story ?? [],
    events: wedding.content?.events ?? [],
    faq: wedding.content?.faq ?? [],
    gallery: wedding.content?.gallery ?? [],
  }
  const visibleSections = { story: content.story.length > 0, gallery: content.gallery.length > 0, faq: content.faq.length > 0 }
  return <PublicWeddingShell wedding={wedding} visibleSections={visibleSections}><WeddingHero wedding={wedding} content={content.hero} />{visibleSections.story ? <StorySection entries={content.story} /> : null}<EventDetailsSection wedding={wedding} events={content.events} /><DressCodeSection dressCode={wedding.dressCode} />{visibleSections.gallery ? <GalleryPreviewSection entries={content.gallery} /> : null}{visibleSections.faq ? <FaqPreviewSection entries={content.faq} /> : null}<RsvpCallToAction /></PublicWeddingShell>
}
