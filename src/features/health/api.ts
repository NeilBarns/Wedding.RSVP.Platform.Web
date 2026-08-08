import { api } from '../../lib/api'
import type { HealthResponse } from './types'

export function getHealth(options?: { signal?: AbortSignal }) {
  return api.get<HealthResponse>('/api/health', options)
}
