import { api } from '../../lib/api'
import { getAdminWedding } from '../adminWedding/api'
import type { DashboardInvitationResponse, DashboardSummaryResponse } from './types'

export { getAdminWedding as getDashboardWedding }

export async function getDashboardSummary(options?: { signal?: AbortSignal }) {
  return (await api.get<DashboardSummaryResponse>('/api/admin/dashboard/summary', options)).data
}

export function getDashboardInvitations(options?: { signal?: AbortSignal }) {
  const query = new URLSearchParams({
    page: '1',
    perPage: '20',
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  })

  return api.get<DashboardInvitationResponse>(
    `/api/admin/invitations?${query.toString()}`,
    options,
  )
}
