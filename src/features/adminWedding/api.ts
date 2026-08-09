import { api } from '../../lib/api'
import type { AdminWeddingSettings, WeddingUpdateRequest } from './types'

type WeddingResponse = { data: AdminWeddingSettings }

export async function getAdminWedding(options?: { signal?: AbortSignal }) {
  return (await api.get<WeddingResponse>('/api/admin/wedding', options)).data
}

export async function updateAdminWedding(payload: WeddingUpdateRequest) {
  return (await api.put<WeddingResponse>('/api/admin/wedding', payload)).data
}
