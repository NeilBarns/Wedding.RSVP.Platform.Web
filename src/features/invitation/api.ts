import { api } from '../../lib/api'
import type { PublicInvitationData } from './types'

type InvitationResponse = {
  data: PublicInvitationData
}

export async function getPublicInvitation(
  token: string,
  options?: { signal?: AbortSignal },
) {
  const response = await api.get<InvitationResponse>(
    `/api/invitations/${encodeURIComponent(token)}`,
    options,
  )
  return response.data
}
