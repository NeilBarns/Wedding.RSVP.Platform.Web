import { BookOpen, CalendarDays, CircleHelp, Images } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { CollectionManager } from '../../features/adminWeddingContent/components/CollectionManager'
import { ContentTabs } from '../../features/adminWeddingContent/components/ContentTabs'
import { EventEditor } from '../../features/adminWeddingContent/components/EventEditor'
import { FaqEditor } from '../../features/adminWeddingContent/components/FaqEditor'
import { GalleryEditor } from '../../features/adminWeddingContent/components/GalleryEditor'
import { HeroEditor } from '../../features/adminWeddingContent/components/HeroEditor'
import { StoryEditor } from '../../features/adminWeddingContent/components/StoryEditor'
import { weddingContentApi } from '../../features/adminWeddingContent/api'
import type { ContentSection, WeddingEventType } from '../../features/adminWeddingContent/types'

const sections: ContentSection[] = ['hero', 'story', 'events', 'faq', 'gallery']
const eventLabels: Record<WeddingEventType, string> = { ceremony: 'Ceremony', reception: 'Reception', other: 'Other' }
const preview = (value: string, length = 150) => value.length > length ? `${value.slice(0, length)}...` : value

export default function AdminWeddingContentPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('section')
  const active: ContentSection = sections.includes(requested as ContentSection) ? requested as ContentSection : 'hero'
  const change = (section: ContentSection) => setParams(section === 'hero' ? {} : { section }, { replace: true })

  return <section className="mx-auto max-w-6xl"><header className="mb-7"><p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]"><BookOpen className="size-4" aria-hidden="true" />Editorial CMS</p><h1 className="mt-2 font-[var(--font-display)] text-3xl sm:text-4xl">Wedding content</h1><p className="mt-2 max-w-2xl text-[var(--color-muted)]">Manage the structured content that will shape the public wedding website.</p></header><ContentTabs active={active} onChange={change}/><div id="content-tabpanel" role="tabpanel" aria-labelledby={`content-tab-${active}`} className="pt-7">
    {active==='hero'?<HeroEditor/>:null}
    {active==='story'?<CollectionManager title="Our story" description="Ordered plain-text entries for the couple's story." empty="No story entries yet." addLabel="Add story entry" load={weddingContentApi.listStory} create={weddingContentApi.createStory} update={weddingContentApi.updateStory} remove={weddingContentApi.deleteStory} Editor={StoryEditor} render={(item)=><><h3 className="font-semibold">{item.title??'Untitled story entry'}</h3>{item.eventDate?<p className="mt-1 text-sm text-[var(--color-muted)]">{item.eventDate}</p>:null}<p className="mt-2 text-sm text-[var(--color-muted)]">{preview(item.body)}</p></>}/>:null}
    {active==='events'?<CollectionManager title="Wedding events" description="Ceremony, reception, and additional event details." empty="No wedding events yet." addLabel="Add event" load={weddingContentApi.listEvents} create={weddingContentApi.createEvent} update={weddingContentApi.updateEvent} remove={weddingContentApi.deleteEvent} Editor={EventEditor} render={(item)=><><h3 className="font-semibold">{item.title}</h3><p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-muted)]"><CalendarDays className="size-4" aria-hidden="true"/>{eventLabels[item.eventType]} · {item.eventDate}{item.startTime?` at ${item.startTime}`:''}</p><p className="mt-2 text-sm text-[var(--color-muted)]">{item.venueName??'Venue not specified'}</p></>}/>:null}
    {active==='faq'?<CollectionManager title="Frequently asked questions" description="Plain-text answers for common guest questions." empty="No FAQs yet." addLabel="Add FAQ" load={weddingContentApi.listFaq} create={weddingContentApi.createFaq} update={weddingContentApi.updateFaq} remove={weddingContentApi.deleteFaq} Editor={FaqEditor} render={(item)=><><h3 className="flex items-center gap-2 font-semibold"><CircleHelp className="size-4" aria-hidden="true"/>{item.question}</h3><p className="mt-2 text-sm text-[var(--color-muted)]">{preview(item.answer)}</p></>}/>:null}
    {active==='gallery'?<CollectionManager title="Gallery" description="URL-based image metadata for the public gallery." empty="No gallery images yet." addLabel="Add gallery image" load={weddingContentApi.listGallery} create={weddingContentApi.createGallery} update={weddingContentApi.updateGallery} remove={weddingContentApi.deleteGallery} Editor={GalleryEditor} render={(item)=><div className="flex gap-4"><div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-background)]"><img src={item.imageUrl} alt={item.altText??''} className="size-full object-cover" onError={(event)=>{event.currentTarget.hidden=true}}/><Images className="absolute size-5 text-[var(--color-muted)]" aria-hidden="true"/></div><div><h3 className="font-semibold">{item.caption??'Untitled gallery image'}</h3><p className="mt-1 text-sm text-[var(--color-muted)]">{item.altText?'Alt text provided':'Alt text not provided'}</p></div></div>}/>:null}
  </div></section>
}
