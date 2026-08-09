import { api } from '../../lib/api'
import type { PublicWeddingResponse } from './types'

export async function getPublicWedding(options?: { signal?: AbortSignal }) {
  return (await api.get<PublicWeddingResponse>('/api/wedding', options)).data
}
