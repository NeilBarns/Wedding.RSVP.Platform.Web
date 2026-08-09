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

export type PublicWedding = PublicWeddingDetails & { id: number }

export type PublicWeddingResponse = { data: PublicWedding }
