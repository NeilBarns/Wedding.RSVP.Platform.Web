export const rsvpQuestionKeys = ['attendance', 'dietaryRequirements', 'accessibilityNeeds', 'responsePhone', 'responseEmail', 'messageToCouple'] as const
export const configurableRsvpQuestionKeys = ['dietaryRequirements', 'accessibilityNeeds', 'responsePhone', 'responseEmail', 'messageToCouple'] as const

export type RsvpQuestionKey = (typeof rsvpQuestionKeys)[number]
export type ConfigurableRsvpQuestionKey = (typeof configurableRsvpQuestionKeys)[number]
export type RsvpQuestionScope = 'guest' | 'household'

export type RsvpQuestion = {
  key: RsvpQuestionKey
  scope: RsvpQuestionScope
  enabled: boolean
  required: boolean
  label: string
  helperText: string | null
  sortOrder: number
  system: boolean
}

export type RsvpConfiguration = {
  guestQuestions: RsvpQuestion[]
  householdQuestions: RsvpQuestion[]
}

export type RsvpQuestionUpdate = Pick<RsvpQuestion, 'key' | 'enabled' | 'required' | 'label' | 'helperText' | 'sortOrder'> & {
  key: ConfigurableRsvpQuestionKey
}

export type RsvpConfigurationUpdate = { questions: RsvpQuestionUpdate[] }
