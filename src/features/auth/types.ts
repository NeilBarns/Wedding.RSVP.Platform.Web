export type AuthenticatedUser = {
  id: number
  name: string
  email: string
  role: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthState = {
  status: AuthStatus
  user: AuthenticatedUser | null
  refresh: () => Promise<void>
}
