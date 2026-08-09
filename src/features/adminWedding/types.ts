export type WeddingStatus = 'draft' | 'published' | 'archived'

export type WeddingThemeSettings = {
  key: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  backgroundColor: string | null
  headingFont: string | null
  bodyFont: string | null
}

export type AdminWeddingSettings = {
  id: number
  partnerOneName: string
  partnerTwoName: string
  weddingDate: string
  rsvpDeadline: string | null
  dressCode: string | null
  status: WeddingStatus
  templateKey: string | null
  theme: WeddingThemeSettings
}

// Template selection is intentionally not editable until the admin picker exists.
// Omitting templateKey preserves the current value through the API's legacy-PUT behavior.
export type WeddingUpdateRequest = Omit<AdminWeddingSettings, 'id' | 'templateKey'>
