import type { InvitationListItem, PaginationMeta } from '../adminInvitations/types'
import type { AdminWeddingSettings } from '../adminWedding/types'

export type DashboardInvitationResponse = {
  data: InvitationListItem[]
  meta: PaginationMeta
}

export type DashboardOverview = {
  wedding: AdminWeddingSettings | null
  invitations: DashboardInvitationResponse | null
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
