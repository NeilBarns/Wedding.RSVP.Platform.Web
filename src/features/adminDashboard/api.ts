import { api } from '../../lib/api'
import { getAdminWedding } from '../adminWedding/api'
import type { DashboardInvitationResponse } from './types'

export { getAdminWedding as getDashboardWedding }

export function getDashboardInvitations(options?: { signal?: AbortSignal }) {
  const query = new URLSearchParams({
    page: '1',
    perPage: '100',
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  })

  return api.get<DashboardInvitationResponse>(
    `/api/admin/invitations?${query.toString()}`,
    options,
  )
}
