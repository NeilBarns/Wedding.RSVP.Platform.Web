import { api } from '../../lib/api'
import type {
  AdminGuest,
  CreationAccessResponse,
  CreateInvitationRequest,
  GuestRequest,
  InvitationDetail,
  InvitationListParams,
  InvitationListResponse,
  InvitationProfileRequest,
  RegeneratedTokenAccessResponse,
} from './types'

type DataResponse<T> = { data: T }

export function listInvitations(
  params: InvitationListParams,
  options?: { signal?: AbortSignal },
) {
  const query = new URLSearchParams({
    page: String(params.page),
    perPage: String(params.perPage),
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  })
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  return api.get<InvitationListResponse>(
    `/api/admin/invitations?${query.toString()}`,
    options,
  )
}

export async function createInvitation(payload: CreateInvitationRequest) {
  return (await api.post<DataResponse<CreationAccessResponse>>('/api/admin/invitations', payload)).data
}

export async function getInvitation(id: number, options?: { signal?: AbortSignal }) {
  return (await api.get<DataResponse<InvitationDetail>>(`/api/admin/invitations/${id}`, options)).data
}

export async function updateInvitation(id: number, payload: InvitationProfileRequest) {
  return (await api.put<DataResponse<InvitationDetail>>(`/api/admin/invitations/${id}`, payload)).data
}

export function deleteInvitation(id: number) {
  return api.delete<void>(`/api/admin/invitations/${id}`)
}

export async function addGuest(invitationId: number, payload: GuestRequest) {
  return (await api.post<DataResponse<AdminGuest>>(`/api/admin/invitations/${invitationId}/guests`, payload)).data
}

export async function updateGuest(invitationId: number, guestId: number, payload: GuestRequest) {
  return (await api.put<DataResponse<AdminGuest>>(`/api/admin/invitations/${invitationId}/guests/${guestId}`, payload)).data
}

export function deleteGuest(invitationId: number, guestId: number) {
  return api.delete<void>(`/api/admin/invitations/${invitationId}/guests/${guestId}`)
}

export async function runInvitationAction(
  id: number,
  action: 'mark-ready' | 'lock' | 'reopen' | 'archive',
) {
  return (await api.post<DataResponse<InvitationDetail>>(`/api/admin/invitations/${id}/${action}`)).data
}

export async function regenerateInvitationToken(id: number) {
  return (await api.post<DataResponse<RegeneratedTokenAccessResponse>>(`/api/admin/invitations/${id}/regenerate-token`)).data
}
