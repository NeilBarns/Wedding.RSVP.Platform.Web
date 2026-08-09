export type PublicWeddingTheme = {
  key: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  backgroundColor: string | null
  headingFont: string | null
  bodyFont: string | null
}

export type PublicWeddingDetails = {
  partnerOneName: string
  partnerTwoName: string
  weddingDate: string
  rsvpDeadline: string | null
  dressCode: string | null
  status: 'draft' | 'published' | 'archived'
  theme: PublicWeddingTheme
}

export type WeddingHeroContent = {
  eyebrow: string | null
  headline: string | null
  subheadline: string | null
  mediaUrl: string | null
  mediaAltText: string | null
}

export type WeddingStoryEntry = {
  id: number
  title: string | null
  body: string
  imageUrl: string | null
  imageAltText: string | null
  eventDate: string | null
  sortOrder: number
}

export type WeddingEventType = 'ceremony' | 'reception' | 'other'

export type WeddingEvent = {
  id: number
  title: string
  eventType: WeddingEventType
  eventDate: string
  startTime: string | null
  endTime: string | null
  venueName: string | null
  addressLine: string | null
  mapUrl: string | null
  description: string | null
  dressCodeOverride: string | null
  sortOrder: number
}

export type WeddingFaqEntry = {
  id: number
  question: string
  answer: string
  sortOrder: number
}

export type WeddingGalleryEntry = {
  id: number
  imageUrl: string
  altText: string | null
  caption: string | null
  sortOrder: number
}

export type PublicWeddingContent = {
  hero: WeddingHeroContent | null
  story: WeddingStoryEntry[]
  events: WeddingEvent[]
  faq: WeddingFaqEntry[]
  gallery: WeddingGalleryEntry[]
}

export type PublicWedding = PublicWeddingDetails & {
  id: number
  content?: PublicWeddingContent | null
}

export type PublicWeddingResponse = { data: PublicWedding }
