export const rsvpQuestionKeys = ['attendance', 'dietaryRequirements', 'accessibilityNeeds', 'mealChoice', 'responsePhone', 'responseEmail', 'messageToCouple'] as const
export const configurableRsvpQuestionKeys = ['dietaryRequirements', 'accessibilityNeeds', 'mealChoice', 'responsePhone', 'responseEmail', 'messageToCouple'] as const

export type RsvpQuestionKey = (typeof rsvpQuestionKeys)[number]
export type ConfigurableRsvpQuestionKey = (typeof configurableRsvpQuestionKeys)[number]
export type RsvpQuestionScope = 'guest' | 'household'
export type RsvpQuestionType = 'text' | 'textarea' | 'singleChoice'
export type PublicRsvpOption = { label: string; value: string; sortOrder: number }
export type AdminRsvpOption = PublicRsvpOption & { id: number | null; enabled: boolean }

export type RsvpQuestion = {
  key: RsvpQuestionKey
  scope: RsvpQuestionScope
  enabled: boolean
  required: boolean
  label: string
  helperText: string | null
  sortOrder: number
  system: boolean
  type: RsvpQuestionType
  options?: PublicRsvpOption[] | AdminRsvpOption[]
}

export type RsvpConfiguration = {
  guestQuestions: RsvpQuestion[]
  householdQuestions: RsvpQuestion[]
}

export type RsvpQuestionUpdate = Pick<RsvpQuestion, 'key' | 'enabled' | 'required' | 'label' | 'helperText' | 'sortOrder'> & {
  key: ConfigurableRsvpQuestionKey
  options?: AdminRsvpOption[]
}

export type RsvpConfigurationUpdate = { questions: RsvpQuestionUpdate[] }
