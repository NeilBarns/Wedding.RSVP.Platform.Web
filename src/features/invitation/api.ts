import { api } from '../../lib/api'
import type {
  PublicInvitationData,
  RsvpConfirmationData,
  RsvpPayload,
} from './types'

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

type RsvpResponse = {
  data: RsvpConfirmationData
}

export async function submitPublicRsvp(token: string, payload: RsvpPayload) {
  const response = await api.put<RsvpResponse>(
    `/api/invitations/${encodeURIComponent(token)}/rsvp`,
    payload,
  )
  return response.data
}
