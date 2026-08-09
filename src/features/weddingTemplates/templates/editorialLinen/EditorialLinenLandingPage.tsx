import { DressCodeSection } from '../../../publicWedding/components/DressCodeSection'
import { EventDetailsSection } from '../../../publicWedding/components/EventDetailsSection'
import { FaqPreviewSection } from '../../../publicWedding/components/FaqPreviewSection'
import { GalleryPreviewSection } from '../../../publicWedding/components/GalleryPreviewSection'
import { RsvpCallToAction } from '../../../publicWedding/components/RsvpCallToAction'
import { StorySection } from '../../../publicWedding/components/StorySection'
import { WeddingHero } from '../../../publicWedding/components/WeddingHero'
import type { PublicWedding } from '../../../publicWedding/types'
import { EditorialLinenShell } from './components/EditorialLinenShell'

export function EditorialLinenLandingPage({ wedding }: { wedding: PublicWedding }) {
  const content = {
    hero: wedding.content?.hero ?? null,
    story: wedding.content?.story ?? [],
    events: wedding.content?.events ?? [],
    faq: wedding.content?.faq ?? [],
    gallery: wedding.content?.gallery ?? [],
  }
  const visibleSections = {
    story: content.story.length > 0,
    gallery: content.gallery.length > 0,
    faq: content.faq.length > 0,
  }

  return (
    <EditorialLinenShell wedding={wedding} visibleSections={visibleSections}>
      <WeddingHero wedding={wedding} content={content.hero} />
      {visibleSections.story ? <StorySection entries={content.story} /> : null}
      <EventDetailsSection wedding={wedding} events={content.events} />
      <DressCodeSection dressCode={wedding.dressCode} />
      {visibleSections.gallery ? <GalleryPreviewSection entries={content.gallery} /> : null}
      {visibleSections.faq ? <FaqPreviewSection entries={content.faq} /> : null}
      <RsvpCallToAction />
    </EditorialLinenShell>
  )
}
