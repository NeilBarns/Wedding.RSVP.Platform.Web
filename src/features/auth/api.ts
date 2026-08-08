import { api } from '../../lib/api'
import type { AuthenticatedUser } from './types'

type AuthResponse = {
  data: AuthenticatedUser
}

export async function getCurrentUser(options?: { signal?: AbortSignal }) {
  const response = await api.get<AuthResponse>('/api/auth/me', options)
  return response.data
}
