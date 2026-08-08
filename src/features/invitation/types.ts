export type AttendanceStatus = 'pending' | 'attending' | 'declined'

export type InvitationGuest = {
  id: number
  fullName: string
  guestType: string
  attendanceStatus: AttendanceStatus
  dietaryRequirements: string | null
  accessibilityRequirements: string | null
  sortOrder: number
}

export type WeddingTheme = {
  key: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  headingFont: string
  bodyFont: string
}

export type WeddingSummary = {
  partnerOneName: string
  partnerTwoName: string
  weddingDate: string
  rsvpDeadline: string | null
  dressCode: string | null
  status: string
  theme: WeddingTheme
}

export type PublicInvitation = {
  id: number
  displayName: string
  status: string
  canRespond: boolean
  hasSubmitted: boolean
  isLocked: boolean
  firstOpenedAt: string | null
  lastOpenedAt: string | null
  submittedAt: string | null
  responseContactNumber: string | null
  responseEmail: string | null
  messageToCouple: string | null
  guests: InvitationGuest[]
}

export type PublicInvitationData = {
  invitation: PublicInvitation
  wedding: WeddingSummary
}

export type RsvpDecision = Exclude<AttendanceStatus, 'pending'>

export type RsvpGuestPayload = {
  id: number
  attendanceStatus: RsvpDecision
  dietaryRequirements: string | null
  accessibilityRequirements: string | null
}

export type RsvpPayload = {
  guests: RsvpGuestPayload[]
  contactNumber: string | null
  email: string | null
  message: string | null
}

export type RsvpConfirmationData = {
  invitation: PublicInvitation
  revisionNumber: number
}
