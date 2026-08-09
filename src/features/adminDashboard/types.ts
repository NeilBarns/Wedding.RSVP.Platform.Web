import type { InvitationListItem, PaginationMeta } from '../adminInvitations/types'
import type { WeddingStatus } from '../adminWedding/types'

export type DashboardInvitationResponse = {
  data: InvitationListItem[]
  meta: PaginationMeta
}

export type InvitationAggregateCounts = {
  total: number
  draft: number
  ready: number
  submitted: number
  locked: number
  archived: number
}

export type GuestAggregateCounts = {
  total: number
  attending: number
  declined: number
  pending: number
}

export type HouseholdAggregateCounts = {
  submitted: number
}

export type DashboardSummary = {
  weddingId: number
  weddingStatus: WeddingStatus
  invitations: InvitationAggregateCounts
  guests: GuestAggregateCounts
  households: HouseholdAggregateCounts
}

export type DashboardSummaryResponse = {
  data: DashboardSummary
}

export type GuestMetrics = {
  guests: number
  attending: number
  declined: number
  pending: number
  responded: number
  submittedHouseholds: number
  percentage: number | null
}

export type AttentionItem = {
  invitation: InvitationListItem
  reason: string
  priority: number
}
