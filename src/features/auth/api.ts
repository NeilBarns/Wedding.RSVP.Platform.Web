import { api, fetchCsrfCookie } from '../../lib/api'
import type { AuthenticatedUser } from './types'

type AuthResponse = {
  data: AuthenticatedUser
}

export async function getCurrentUser(options?: { signal?: AbortSignal }) {
  const response = await api.get<AuthResponse>('/api/auth/me', options)
  return response.data
}

export type LoginCredentials = {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials) {
  await fetchCsrfCookie()
  await api.post<AuthResponse>('/api/auth/login', credentials)
}

export function logoutSession() {
  return api.post<{ message: string }>('/api/auth/logout')
}
