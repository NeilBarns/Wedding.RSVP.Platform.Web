export type InvitationStatus =
  | 'draft'
  | 'ready'
  | 'submitted'
  | 'locked'
  | 'archived'

export type GuestType =
  | 'adult'
  | 'child'
  | 'infant'
  | 'entourage'
  | 'principal_sponsor'
  | 'other'

export type GuestAttendanceStatus = 'pending' | 'attending' | 'declined'

export type AdminGuest = {
  id: number
  fullName: string
  guestType: GuestType
  attendanceStatus: GuestAttendanceStatus
  dietaryRequirements: string | null
  accessibilityRequirements: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type InvitationListItem = {
  id: number
  displayName: string
  contactPersonName: string | null
  contactNumber: string | null
  email: string | null
  status: InvitationStatus
  guestCount: number
  attendingCount: number
  declinedCount: number
  pendingCount: number
  firstOpenedAt: string | null
  lastOpenedAt: string | null
  submittedAt: string | null
  lockedAt: string | null
  createdAt: string
  updatedAt: string
}

export type InvitationDetail = InvitationListItem & {
  internalNotes: string | null
  invitationUrl: null
  guests: AdminGuest[]
}

export type PaginationMeta = {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export type InvitationListResponse = {
  data: InvitationListItem[]
  meta: PaginationMeta
}

export type InvitationSort =
  | 'displayName'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'submittedAt'

export type SortDirection = 'asc' | 'desc'

export type InvitationListParams = {
  search?: string
  status?: InvitationStatus
  page: number
  perPage: 10 | 20 | 50
  sortBy: InvitationSort
  sortDirection: SortDirection
}

export type InvitationProfileRequest = {
  displayName: string
  contactPersonName: string | null
  contactNumber: string | null
  email: string | null
  internalNotes: string | null
}

export type GuestRequest = {
  fullName: string
  guestType: GuestType
  sortOrder: number
  dietaryRequirements: string | null
  accessibilityRequirements: string | null
}

export type CreateInvitationRequest = InvitationProfileRequest & {
  guests: GuestRequest[]
}

export type InvitationAccess = {
  token: string
  invitationUrl: string
}

export type CreationAccessResponse = {
  invitation: InvitationDetail
  access: InvitationAccess
}

export type RegeneratedTokenAccessResponse = {
  invitationId: number
  access: InvitationAccess
}
